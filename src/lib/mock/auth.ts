// Mock authentication for development (client-side, Vite/React).
// Session is persisted in localStorage instead of Next.js cookies.
import type { MockUser } from './types'
import { mockUsers } from './data'

const MOCK_SESSION_KEY = 'mock-session'

export interface MockSession {
  user: MockUser
  expires: string
}

function readStoredSession(): MockSession | null {
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY)
    if (!raw) {
      return null
    }
    const session = JSON.parse(raw) as MockSession
    if (new Date(session.expires) < new Date()) {
      localStorage.removeItem(MOCK_SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

// Client-side auth helpers
export async function getMockSession(): Promise<MockSession | null> {
  return readStoredSession()
}

export async function getMockUser(): Promise<MockUser | null> {
  const session = readStoredSession()
  return session?.user || null
}

export async function setMockSession(user: MockUser): Promise<void> {
  const session: MockSession = {
    user,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  }

  localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session))
}

export async function clearMockSession(): Promise<void> {
  localStorage.removeItem(MOCK_SESSION_KEY)
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
