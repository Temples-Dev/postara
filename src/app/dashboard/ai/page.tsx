import { ContentGenerator } from "@/components/ai/content-generator"

export default function ContentPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Content Generator</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create engaging content for social media, emails, blogs, and ads using AI
        </p>
      </div>

      <ContentGenerator />
    </div>
  )
}
