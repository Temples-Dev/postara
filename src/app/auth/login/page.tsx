import { redirect } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import { getMockSession } from "@/lib/mock/auth"

export default async function LoginPage() {
  const session = await getMockSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
}
