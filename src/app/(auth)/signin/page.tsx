import { redirect } from "next/navigation"
import SignIn from "@/components/SignIn"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function LoginPage() {
  // Check if user is already logged in
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-12 sm:px-6 lg:px-8">
      <SignIn />
    </div>
  )
}
