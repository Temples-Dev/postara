import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Twitter, Linkedin, Facebook, Instagram, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"

interface ScheduledPost {
  id: string
  content: string
  platform: string
  status: "scheduled" | "published" | "failed" | "cancelled"
  scheduled_at: string
  published_at?: string
  error_message?: string
} 

const platformIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
}

export function ScheduledPostsList() {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/social/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== postId))
        toast.success("Scheduled post deleted successfully")
      } else {
        throw new Error("Failed to delete post")
      }
    } catch (error) {
      toast.error("Failed to delete the post. Please try again.")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default"
      case "published":
        return "secondary"
      case "failed":
        return "destructive"
      case "cancelled":
        return "outline"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Loading scheduled posts...</div>
        </CardContent>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Posts</CardTitle>
          <CardDescription>Your upcoming and past social media posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No scheduled posts yet</p>
            <p className="text-sm">Create your first post using the composer above</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Posts</CardTitle>
        <CardDescription>Your upcoming and past social media posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => {
            const Icon = platformIcons[post.platform as keyof typeof platformIcons] || Calendar

            return (
              <div key={post.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium capitalize">{post.platform}</span>
                    <Badge variant={getStatusColor(post.status)}>{post.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{post.content}</div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Scheduled: {formatDate(post.scheduled_at)}
                  </div>
                  {post.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Published: {formatDate(post.published_at)}
                    </div>
                  )}
                </div>

                {post.error_message && (
                  <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    Error: {post.error_message}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
