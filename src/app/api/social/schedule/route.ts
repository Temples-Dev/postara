import { type NextRequest, NextResponse } from "next/server"
import { getMockUser } from "@/lib/mock/auth"
import { mockSocialPosts, delay } from "@/lib/mock/data"
import type { MockSocialPost } from "@/lib/mock/types"

export async function POST(request: NextRequest) {
  try {
    const { content, platforms, scheduledAt } = await request.json()

    if (!content || !platforms || !Array.isArray(platforms) || platforms.length === 0 || !scheduledAt) {
      return NextResponse.json({ error: "Content, platforms, and scheduled time are required" }, { status: 400 })
    }

    const user = await getMockUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Simulate database delay
    await delay(300)

    // Create scheduled posts for each platform
    const scheduledPosts: MockSocialPost[] = platforms.map((platform) => ({
      id: `post-${Date.now()}-${platform}`,
      user_id: user.id,
      platform,
      content,
      media_url: null,
      scheduled_at: scheduledAt,
      status: "scheduled" as const,
      created_at: new Date().toISOString(),
    }))

    mockSocialPosts.push(...scheduledPosts)

    return NextResponse.json({
      success: true,
      posts: scheduledPosts,
    })
  } catch (error) {
    console.error("Schedule post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
