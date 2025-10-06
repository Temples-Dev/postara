"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Save, Calendar } from "lucide-react"
import { toast } from "sonner"

interface Newsletter {
  id?: string
  title: string
  subject: string
  content: string
  status: "draft" | "scheduled" | "sent"
  scheduled_at?: string
}

interface NewsletterEditorProps {
  newsletter?: Newsletter
  onSave?: (newsletter: Newsletter) => void
}

export function NewsletterEditor({ newsletter, onSave }: NewsletterEditorProps) {
  const [title, setTitle] = useState(newsletter?.title || "")
  const [subject, setSubject] = useState(newsletter?.subject || "")
  const [content, setContent] = useState(newsletter?.content || "")
  const [status, setStatus] = useState<"draft" | "scheduled" | "sent">(newsletter?.status || "draft")
  const [scheduledAt, setScheduledAt] = useState(newsletter?.scheduled_at || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async (newStatus?: "draft" | "scheduled" | "sent") => {
    if (!title.trim() || !subject.trim() || !content.trim()) {
      toast.error("Please fill in all required fields.")
      return
    }

    setIsLoading(true)

    try {
      const newsletterData = {
        id: newsletter?.id,
        title: title.trim(),
        subject: subject.trim(),
        content: content.trim(),
        status: newStatus || status,
        scheduled_at: newStatus === "scheduled" ? scheduledAt : undefined,
      }

      const response = await fetch("/api/newsletter/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsletterData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save newsletter")
      }

      toast.success(newStatus === "sent" ? "Newsletter sent successfully!" : "Newsletter saved!")

      if (onSave) {
        onSave(data.newsletter)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save newsletter. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = () => handleSave("sent")
  const handleSchedule = () => handleSave("scheduled")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-600" />
                Newsletter Editor
              </CardTitle>
              <CardDescription>Create and manage your email newsletters</CardDescription>
            </div>
            <Badge variant={status === "sent" ? "default" : status === "scheduled" ? "secondary" : "outline"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Newsletter Title</label>
              <Input
                placeholder="Internal title for your newsletter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Subject</label>
              <Input
                placeholder="Subject line that subscribers will see"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              placeholder="Write your newsletter content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="resize-none"
            />
          </div>

          {status === "scheduled" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Scheduled Date & Time</label>
              <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={() => handleSave("draft")} disabled={isLoading} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>

            <Button onClick={handleSchedule} disabled={isLoading || !scheduledAt} variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>

            <Button
              onClick={handleSend}
              disabled={isLoading || status === "sent"}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
