import { type NextRequest, NextResponse } from "next/server"
import { getMockUser } from "@/lib/mock/auth"
import { mockNewsletters, delay } from "@/lib/mock/data"
import type { MockNewsletter } from "@/lib/mock/types"

export async function POST(request: NextRequest) {
  try {
    const { id, title, subject, content, status, scheduled_at } = await request.json()

    if (!title || !subject || !content) {
      return NextResponse.json({ error: "Title, subject, and content are required" }, { status: 400 })
    }

    const user = await getMockUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Simulate database delay
    await delay(300)

    let newsletter: MockNewsletter

    if (id) {
      // Update existing newsletter
      const index = mockNewsletters.findIndex(n => n.id === id && n.user_id === user.id)
      
      if (index === -1) {
        return NextResponse.json({ error: "Newsletter not found" }, { status: 404 })
      }

      const existing = mockNewsletters[index]
      if (!existing) {
        return NextResponse.json({ error: "Newsletter not found" }, { status: 404 })
      }

      newsletter = {
        ...existing,
        title,
        subject,
        content,
        status: status || existing.status,
        scheduled_at: scheduled_at || existing.scheduled_at,
        updated_at: new Date().toISOString(),
      }

      mockNewsletters[index] = newsletter
    } else {
      // Create new newsletter
      newsletter = {
        id: `newsletter-${Date.now()}`,
        user_id: user.id,
        title,
        subject,
        content,
        status: status || "draft",
        scheduled_at: scheduled_at || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockNewsletters.push(newsletter)
    }

    // If sending now, we would integrate with an email service here
    if (status === "sent") {
      console.log("Newsletter would be sent:", newsletter)
    }

    return NextResponse.json({
      success: true,
      newsletter,
    })
  } catch (error) {
    console.error("Newsletter save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
