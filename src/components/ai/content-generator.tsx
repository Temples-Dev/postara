"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Textarea } from "@/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Badge } from "@/ui/badge"
import { Loader2, Copy, Sparkles, MessageSquare, Mail, FileText, Megaphone } from "lucide-react"
import { toast } from "sonner"

const contentTypes = [
  { value: "social", label: "Social Media Post", icon: MessageSquare },
  { value: "email", label: "Email Content", icon: Mail },
  { value: "blog", label: "Blog Content", icon: FileText },
  { value: "ad", label: "Ad Copy", icon: Megaphone },
]

const tones = ["Professional", "Casual", "Friendly", "Authoritative", "Playful", "Urgent", "Inspirational"]

const platforms = [
  { value: "twitter", label: "Twitter/X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
]

const aiProviders = [
  { value: "grok", label: "Grok (xAI)" },
  { value: "groq", label: "Groq" },
]

export function ContentGenerator() {
  const [prompt, setPrompt] = useState("")
  const [contentType, setContentType] = useState("social")
  const [tone, setTone] = useState("")
  const [platform, setPlatform] = useState("")
  const [aiProvider, setAiProvider] = useState("grok")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setGeneratedContent("")

    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          contentType,
          tone,
          platform: contentType === "social" ? platform : undefined,
          aiProvider,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to generate content")
      }

      // Handle streaming response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          fullResponse += chunk
          setGeneratedContent(fullResponse)
        }
      }
    } catch (error) {
      toast.error("Failed to generate content. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      toast.success("Content copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy content")
    }
  }

  const selectedContentType = contentTypes.find((type) => type.value === contentType)
  const IconComponent = selectedContentType?.icon || Sparkles

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            AI Content Generator
          </CardTitle>
          <CardDescription>Generate high-quality marketing content for any platform or purpose</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Type</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">AI Provider</label>
                <Select value={aiProvider} onValueChange={setAiProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aiProviders.map((provider) => (
                      <SelectItem key={provider.value} value={provider.value}>
                        {provider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t.toLowerCase()}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {contentType === "social" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content Brief</label>
              <Textarea
                placeholder="Describe what you want to create... (e.g., 'A social media post about our new AI marketing tool launch, highlighting key benefits and encouraging sign-ups')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <IconComponent className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-amber-600" />
                Generated Content
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedContentType?.label}</Badge>
                {tone && <Badge variant="outline">{tone}</Badge>}
                {platform && <Badge variant="outline">{platforms.find((p) => p.value === platform)?.label}</Badge>}
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="ml-2 bg-transparent">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 whitespace-pre-wrap">{generatedContent}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
