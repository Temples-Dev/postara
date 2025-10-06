import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { groq } from "@ai-sdk/groq"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, contentType, tone, platform, aiProvider = "grok" } = await request.json()

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 })
    }

    // Content type specific system prompts
    const systemPrompts = {
      social: `You are an expert social media content creator. Create engaging, platform-optimized posts that drive engagement. Include relevant hashtags and calls-to-action. Keep posts concise and impactful.`,
      email: `You are an expert email marketing specialist. Create compelling email content that drives opens, clicks, and conversions. Include subject line suggestions and clear calls-to-action.`,
      blog: `You are an expert content marketing writer. Create detailed blog post outlines, introductions, or full articles that provide value and establish thought leadership.`,
      ad: `You are an expert copywriter specializing in advertising. Create persuasive ad copy that converts, with compelling headlines and clear value propositions.`,
    }

    // Platform-specific instructions
    const platformInstructions = {
      twitter: "Optimize for Twitter: 280 characters max, use trending hashtags, encourage retweets",
      linkedin: "Optimize for LinkedIn: Professional tone, industry insights, encourage professional engagement",
      facebook: "Optimize for Facebook: Conversational tone, encourage comments and shares",
      instagram: "Optimize for Instagram: Visual-first approach, use relevant hashtags, encourage engagement",
    }

    let systemPrompt = systemPrompts[contentType as keyof typeof systemPrompts] || systemPrompts.social

    if (platform && platformInstructions[platform as keyof typeof platformInstructions]) {
      systemPrompt += ` ${platformInstructions[platform as keyof typeof platformInstructions]}`
    }

    if (tone) {
      systemPrompt += ` Use a ${tone} tone throughout the content.`
    }

    // Choose AI model based on provider
    const model = aiProvider === "groq" ? groq("llama-3.1-70b-versatile") : xai("grok-beta")

    const result = streamText({
      model,
      prompt,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating content:", error)
    return new Response("Failed to generate content", { status: 500 })
  }
}
