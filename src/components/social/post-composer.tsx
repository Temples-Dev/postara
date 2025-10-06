"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Send, Save, Sparkles, Twitter, Linkedin, Facebook, Instagram } from "lucide-react"
import { toast } from "sonner"

const platforms = [
  { value: "twitter", label: "Twitter/X", icon: Twitter, maxChars: 280 },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin, maxChars: 3000 },
  { value: "facebook", label: "Facebook", icon: Facebook, maxChars: 63206 },
  { value: "instagram", label: "Instagram", icon: Instagram, maxChars: 2200 },
]

interface PostComposerProps {
  onPostScheduled?: () => void
}

export function PostComposer({ onPostScheduled }: PostComposerProps) {
  const [content, setContent] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const generateContent = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content to optimize for social media.")
      return
    }

    setIsGeneratingContent(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Optimize this content for social media: ${content}`,
          contentType: "social",
          platform: selectedPlatforms[0] || "twitter",
          tone: "engaging",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let optimizedContent = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          optimizedContent += chunk
        }
      }

      setContent(optimizedContent)
      toast.success("Content optimized for social media!")
    } catch (error) {
      toast.error("Failed to optimize content. Please try again.")
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const handleSchedule = async () => {
    if (!content.trim() || selectedPlatforms.length === 0 || !scheduledDate || !scheduledTime) {
      toast.error("Please fill in all required fields.")
      return
    }

    setIsLoading(true)

    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString()

      const response = await fetch("/api/social/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          platforms: selectedPlatforms,
          scheduledAt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule post")
      }

      toast.success(`Post scheduled for ${selectedPlatforms.length} platform(s)!`)

      // Reset form
      setContent("")
      setSelectedPlatforms([])
      setScheduledDate("")
      setScheduledTime("")

      if (onPostScheduled) {
        onPostScheduled()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Scheduling failed. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const getCharacterCount = (platform: string) => {
    const platformData = platforms.find((p) => p.value === platform)
    return platformData ? platformData.maxChars : 280
  }

  const getCharacterStatus = (platform: string) => {
    const maxChars = getCharacterCount(platform)
    const remaining = maxChars - content.length
    const isOverLimit = remaining < 0

    return {
      remaining,
      isOverLimit,
      percentage: (content.length / maxChars) * 100,
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-amber-600" />
          Social Media Composer
        </CardTitle>
        <CardDescription>Create and schedule posts across multiple social media platforms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Platforms</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => {
              const Icon = platform.icon
              const isSelected = selectedPlatforms.includes(platform.value)
              const status = isSelected ? getCharacterStatus(platform.value) : null

              return (
                <div key={platform.value} className="flex flex-col items-center gap-1">
                  <Button
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePlatformToggle(platform.value)}
                    className={isSelected ? "bg-amber-600 hover:bg-amber-700" : ""}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {platform.label}
                  </Button>
                  {isSelected && status && (
                    <Badge variant={status.isOverLimit ? "destructive" : "secondary"} className="text-xs">
                      {status.remaining} chars
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Content Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Post Content</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateContent}
              disabled={isGeneratingContent || !content.trim()}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGeneratingContent ? "Optimizing..." : "AI Optimize"}
            </Button>
          </div>
          <Textarea
            placeholder="What's on your mind? Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>

        {/* Scheduling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Date
            </label>
            <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Schedule Time
            </label>
            <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={isLoading || !content.trim() || selectedPlatforms.length === 0}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {isLoading ? "Scheduling..." : "Schedule Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
