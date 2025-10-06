"use server"

import { redirect } from "next/navigation"
import { mockSignIn, mockSignUp, mockSignOut } from "./mock/auth"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const result = await mockSignIn(email.toString(), password.toString())

    if ('error' in result) {
      return { error: result.error }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const result = await mockSignUp(email.toString(), password.toString())

    if ('error' in result) {
      return { error: result.error }
    }

    return { success: "Account created successfully! Redirecting to dashboard..." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  await mockSignOut()
  redirect("/auth/login")
}
