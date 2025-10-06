import { type NextRequest, NextResponse } from "next/server"
import { getMockUser } from "@/lib/mock/auth"
import { mockSocialPosts, delay } from "@/lib/mock/data"

export async function GET(request: NextRequest) {
  try {
    const user = await getMockUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Simulate database delay
    await delay(200)

    // Fetch user's scheduled posts
    const posts = mockSocialPosts
      .filter(post => post.user_id === user.id)
      .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())

    return NextResponse.json({
      success: true,
      posts,
    })
  } catch (error) {
    console.error("Fetch posts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
