// Mock data types for development

export interface MockUser {
  id: string
  email: string
  name: string
  created_at: string
}

export interface MockNewsletter {
  id: string
  user_id: string
  title: string
  subject: string
  content: string
  status: 'draft' | 'scheduled' | 'sent'
  scheduled_at: string | null
  created_at: string
  updated_at: string
}

export interface MockSubscriber {
  id: string
  email: string
  name: string
  subscribed_at: string
  status: 'active' | 'unsubscribed'
}

export interface MockSocialPost {
  id: string
  user_id: string
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
  content: string
  media_url: string | null
  scheduled_at: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  created_at: string
}

export interface MockAIGeneration {
  id: string
  user_id: string
  type: 'email' | 'social' | 'blog'
  prompt: string
  content: string
  created_at: string
}
