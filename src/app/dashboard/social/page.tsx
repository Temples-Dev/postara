import { PostComposer } from "@/components/social/post-composer"
import { ScheduledPostsList } from "@/components/social/scheduled-posts-list"

export default function SocialPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Social Media Scheduler</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create, schedule, and manage your social media posts across multiple platforms
        </p>
      </div>

      <div className="space-y-8">
        <PostComposer />
        <ScheduledPostsList />
      </div>
    </div>
  )
}
