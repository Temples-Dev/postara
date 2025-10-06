import { type NextRequest, NextResponse } from "next/server"
import { mockSubscribers, delay } from "@/lib/mock/data"

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, source = "website" } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 })
    }

    // Simulate database delay
    await delay(300)

    // Check if subscriber already exists
    const existingSubscriber = mockSubscribers.find(
      sub => sub.email.toLowerCase() === email.toLowerCase()
    )

    if (existingSubscriber) {
      if (existingSubscriber.status === "active") {
        return NextResponse.json({ error: "Email is already subscribed" }, { status: 400 })
      } else {
        // Reactivate unsubscribed user
        existingSubscriber.status = "active"
        existingSubscriber.name = firstName || existingSubscriber.name
        existingSubscriber.subscribed_at = new Date().toISOString()

        return NextResponse.json({ success: true, reactivated: true })
      }
    }

    // Create new subscriber
    const newSubscriber = {
      id: `sub-${Date.now()}`,
      email: email.toLowerCase(),
      name: firstName || email.split('@')[0] || 'Subscriber',
      subscribed_at: new Date().toISOString(),
      status: "active" as const,
    }

    mockSubscribers.push(newSubscriber)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
