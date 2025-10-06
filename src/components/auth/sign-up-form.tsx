"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Check } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/actions"
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
          Creating account...
        </>
      ) : (
        "Start Free Trial"
      )}
    </Button>
  )
}

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, null)

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
          <CardTitle className="text-2xl font-bold text-slate-900">Start your free trial</CardTitle>
          <CardDescription className="text-slate-600 mt-2">
            Join thousands of marketers automating their success
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

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                {state.success}
              </div>
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

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">What's included:</h4>
            <ul className="space-y-1 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" />
                AI-powered content generation
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" />
                Email newsletter automation
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" />
                Social media scheduling
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" />
                14-day free trial
              </li>
            </ul>
          </div>

          <SubmitButton />

          <div className="text-center text-slate-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 font-semibold">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
