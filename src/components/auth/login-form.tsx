"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { signIn } from "@/lib/actions"
import Image from "next/image"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 text-lg rounded-lg h-12"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In to Postara"
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state, router])

  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1">
            <Image src="/images/postara-logo.png" alt="Postara Logo" width={36} height={36} className="h-9 w-9" />
            <span className="font-serif font-bold text-2xl text-slate-900">Postara</span>
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-slate-900">Welcome back</CardTitle>
          <CardDescription className="text-slate-600 mt-2">
            Sign in to your marketing automation dashboard
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="h-12 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-12 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
          </div>

          <SubmitButton />

          <div className="text-center text-slate-600">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-amber-600 hover:text-amber-700 font-semibold">
              Start your free trial
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
