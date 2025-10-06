// Mock data for development
import type { MockUser, MockNewsletter, MockSubscriber, MockSocialPost, MockAIGeneration } from './types'

// Mock users
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'demo@postara.dev',
    name: 'Demo User',
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-2',
    email: 'admin@postara.dev',
    name: 'Admin User',
    created_at: new Date().toISOString(),
  },
]

// Mock newsletters
export const mockNewsletters: MockNewsletter[] = [
  {
    id: 'newsletter-1',
    user_id: 'user-1',
    title: 'Welcome Newsletter',
    subject: 'Welcome to Postara!',
    content: '<h1>Welcome!</h1><p>Thank you for joining our community.</p>',
    status: 'draft',
    scheduled_at: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'newsletter-2',
    user_id: 'user-1',
    title: 'Product Launch',
    subject: '🚀 Exciting Product Launch!',
    content: '<h1>Big News!</h1><p>We are launching our new product next week.</p>',
    status: 'scheduled',
    scheduled_at: new Date(Date.now() + 604800000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'newsletter-3',
    user_id: 'user-1',
    title: 'Monthly Update',
    subject: 'Your Monthly Digest',
    content: '<h1>Monthly Update</h1><p>Here is what happened this month...</p>',
    status: 'sent',
    scheduled_at: null,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
  },
]

// Mock subscribers
export const mockSubscribers: MockSubscriber[] = [
  {
    id: 'sub-1',
    email: 'subscriber1@example.com',
    name: 'John Doe',
    subscribed_at: new Date(Date.now() - 2592000000).toISOString(),
    status: 'active',
  },
  {
    id: 'sub-2',
    email: 'subscriber2@example.com',
    name: 'Jane Smith',
    subscribed_at: new Date(Date.now() - 1296000000).toISOString(),
    status: 'active',
  },
  {
    id: 'sub-3',
    email: 'subscriber3@example.com',
    name: 'Bob Johnson',
    subscribed_at: new Date(Date.now() - 604800000).toISOString(),
    status: 'active',
  },
]

// Mock social posts
export const mockSocialPosts: MockSocialPost[] = [
  {
    id: 'post-1',
    user_id: 'user-1',
    platform: 'twitter',
    content: '🚀 Excited to announce our new feature! Check it out at postara.dev',
    media_url: null,
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    status: 'scheduled',
    created_at: new Date().toISOString(),
  },
  {
    id: 'post-2',
    user_id: 'user-1',
    platform: 'linkedin',
    content: 'Thrilled to share our latest blog post on marketing automation...',
    media_url: null,
    scheduled_at: new Date(Date.now() + 172800000).toISOString(),
    status: 'scheduled',
    created_at: new Date().toISOString(),
  },
  {
    id: 'post-3',
    user_id: 'user-1',
    platform: 'facebook',
    content: 'Join us for our webinar on effective email marketing strategies!',
    media_url: null,
    scheduled_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'published',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

// Mock AI generations
export const mockAIGenerations: MockAIGeneration[] = [
  {
    id: 'ai-1',
    user_id: 'user-1',
    type: 'email',
    prompt: 'Write a welcome email for new subscribers',
    content: 'Welcome to our community! We are excited to have you on board...',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ai-2',
    user_id: 'user-1',
    type: 'social',
    prompt: 'Create a Twitter post about our new feature',
    content: '🎉 Introducing our latest feature! Now you can schedule posts across all platforms with just one click.',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

// Helper function to get current mock user
export function getCurrentMockUser(): MockUser {
  return mockUsers[0]
}

// Helper to simulate async operations
export function delay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
