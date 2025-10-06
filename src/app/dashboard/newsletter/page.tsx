import { NewsletterEditor } from "@/components/newsletter/newsletter-editor"
import { SubscriptionForm } from "@/components/newsletter/subscription-form"

export default function NewsletterPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Newsletter</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Create and send newsletters to your subscribers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NewsletterEditor />
        </div>

        <div className="space-y-6">
          <SubscriptionForm
            title="Test Subscription"
            description="Use this form to test the subscription process"
            source="dashboard"
          />

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Subscribers:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span>Active Campaigns:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span>Open Rate:</span>
                <span className="font-medium">0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
