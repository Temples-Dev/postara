// Mock authentication for development
import { cookies } from 'next/headers'
import type { MockUser } from './types'
import { mockUsers } from './data'

const MOCK_SESSION_COOKIE = 'mock-session'

export interface MockSession {
  user: MockUser
  expires: string
}

// Server-side auth helpers
export async function getMockSession(): Promise<MockSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(MOCK_SESSION_COOKIE)
  
  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value) as MockSession
    
    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      return null
    }
    
    return session
  } catch {
    return null
  }
}

export async function getMockUser(): Promise<MockUser | null> {
  const session = await getMockSession()
  return session?.user || null
}

export async function setMockSession(user: MockUser): Promise<void> {
  const cookieStore = await cookies()
  const session: MockSession = {
    user,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  }
  
  cookieStore.set(MOCK_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function clearMockSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(MOCK_SESSION_COOKIE)
}

// Mock sign in
export async function mockSignIn(email: string, password: string): Promise<{ user: MockUser } | { error: string }> {
  // Simple mock validation
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Find user by email or use default
  const user = mockUsers.find(u => u.email === email)
  const authenticatedUser = user || mockUsers[0]
  
  if (!authenticatedUser) {
    return { error: 'No users available' }
  }
  
  await setMockSession(authenticatedUser)
  
  return { user: authenticatedUser }
}

// Mock sign up
export async function mockSignUp(email: string, password: string): Promise<{ user: MockUser } | { error: string }> {
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Create new mock user
  const newUser: MockUser = {
    id: `user-${Date.now()}`,
    email,
    name: email.split('@')[0] || 'User',
    created_at: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  await setMockSession(newUser)
  
  return { user: newUser }
}

// Mock sign out
export async function mockSignOut(): Promise<void> {
  await clearMockSession()
}
