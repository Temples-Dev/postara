import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Calendar, Sparkles } from "lucide-react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { SignOutButton } from "@/components/SignOutButton"

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/signin")
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-1">
                <Image src="/images/postara-logo.png" alt="Postara Logo" width={32} height={32} className="h-8 w-8" />
                <span className="font-serif font-bold text-xl text-slate-900">Postara</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.image && (
                  <Image 
                    src={user.image} 
                    alt={user.name || "User"} 
                    width={32} 
                    height={32} 
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-slate-600">
                  Welcome, {user.name || user.email}
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Marketing Dashboard</h1>
          <p className="text-slate-600">Automate your marketing with AI-powered tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Content Generator</CardTitle>
                  <CardDescription>Create engaging content with AI</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/ai">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Generate Content</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Email Newsletters</CardTitle>
                  <CardDescription>Send beautiful email campaigns</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/newsletter">
                <Button className="w-full bg-green-600 hover:bg-green-700">Create Newsletter</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Social Scheduler</CardTitle>
                  <CardDescription>Schedule posts across platforms</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/social">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Schedule Posts</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
