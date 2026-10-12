# Migration Guide: Mock Auth → Better Auth

This guide helps you transition from the mock authentication system to Better Auth with Prisma.

## 📋 Quick Start Checklist

- [ ] Install dependencies: `pnpm add @prisma/client @better-auth/prisma-adapter`
- [ ] Create `.env.local` with database credentials
- [ ] Run `pnpm db:generate` to generate Prisma Client
- [ ] Update server components to use Better Auth
- [ ] Test authentication flows
- [ ] Remove mock auth files (optional)

## 🔄 API Changes

### Client-Side (Already Updated ✅)

Your sign-in and sign-up components are already using Better Auth:

```tsx
// src/app/(auth)/signin/sign-in.tsx
import { signIn } from "@/lib/auth-client";

// Email sign-in
await signIn.email({ email, password });

// Google OAuth
await signIn.social({ provider: "google", callbackURL: "/dashboard" });
```

### Server-Side (Needs Update)

Update your server components and API routes:

#### Dashboard Page

**Before:**
```tsx
// src/app/dashboard/page.tsx
import { getMockUser } from "@/lib/mock/auth";

const user = await getMockUser();
```

**After:**
```tsx
// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers()
});

if (!session) {
  redirect("/signin");
}

const user = session.user;
```

#### Auth Pages (signin/signup)

**Before:**
```tsx
import { getMockSession } from "@/lib/mock/auth";

const session = await getMockSession();
```

**After:**
```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers()
});
```

#### Server Actions

**Before:**
```tsx
// src/lib/actions.ts
import { mockSignIn, mockSignOut } from "./mock/auth";

export async function signIn(formData: FormData) {
  const result = await mockSignIn(email, password);
  // ...
}
```

**After:**
```tsx
// Server actions are no longer needed!
// Better Auth handles authentication via API routes
// Client components use the auth-client directly
```

## 🗂️ File Updates Needed

### 1. Update Dashboard Page

```tsx
// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Mail, Calendar, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/signin");
  }

  const user = session.user;

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
              <span className="text-sm text-slate-600">Welcome, {user.email}</span>
              <form action="/api/auth/sign-out" method="POST">
                <Button type="submit" variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>
      {/* Rest of dashboard content */}
    </div>
  );
}
```

### 2. Update Sign-In Page

```tsx
// src/app/(auth)/signin/page.tsx
import { redirect } from "next/navigation";
import SignIn from "./sign-in";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-12 sm:px-6 lg:px-8">
      <SignIn />
    </div>
  );
}
```

### 3. Update Sign-Up Page

```tsx
// src/app/(auth)/signup/page.tsx
import { redirect } from "next/navigation";
import SignUp from "./sign-up";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-12 sm:px-6 lg:px-8">
      <SignUp />
    </div>
  );
}
```

### 4. Update API Routes

Better Auth handles authentication, but you still need to protect your API routes:

```tsx
// src/app/api/newsletter/save/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get session from request
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const user = session.user;
    
    // Your API logic here...
    
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## 🗑️ Files to Remove (Optional)

Once you've migrated and tested everything, you can remove:

```bash
# Mock authentication files
src/lib/mock/
├── auth.ts
├── data.ts
└── types.ts

# Old server actions (if not used elsewhere)
# src/lib/actions.ts (review first - may have other actions)
```

**⚠️ Warning:** Don't remove these files until you've:
1. Fully migrated all pages
2. Tested authentication flows
3. Updated all API routes
4. Verified everything works in development

## 🧪 Testing Checklist

### Email Authentication
- [ ] Sign up with new email/password
- [ ] Sign in with existing credentials
- [ ] Sign out
- [ ] Access protected pages (should redirect to signin)
- [ ] Session persists across page refreshes

### Google OAuth
- [ ] Click "Continue with Google"
- [ ] Complete OAuth flow
- [ ] Redirects to dashboard
- [ ] User data saved in database
- [ ] Sign out works

### API Routes
- [ ] Protected routes require authentication
- [ ] User data accessible in API routes
- [ ] Unauthorized requests return 401

### Edge Cases
- [ ] Expired session redirects to signin
- [ ] Already signed-in users redirect from auth pages
- [ ] Multiple tabs maintain same session
- [ ] Sign out clears session in all tabs

## 🔍 Debugging

### Check Session

```tsx
// In any server component
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers()
});

console.log("Session:", session);
console.log("User:", session?.user);
```

### Check Database

```bash
# Open Prisma Studio
pnpm db:studio

# Check tables:
# - users (should have your test users)
# - sessions (should have active sessions)
# - accounts (should have OAuth accounts)
```

### Check Cookies

In browser DevTools:
1. Application → Cookies
2. Look for `postara.session_token`
3. Should be set after sign-in
4. Should be cleared after sign-out

## 📊 Comparison

| Feature | Mock Auth | Better Auth |
|---------|-----------|-------------|
| **Persistence** | In-memory (resets on restart) | PostgreSQL database |
| **OAuth** | Not supported | Google, GitHub, etc. |
| **Security** | Basic (for dev only) | Production-ready |
| **Sessions** | Cookie-based | Database-backed sessions |
| **Email Verification** | Not supported | Supported |
| **Password Reset** | Not supported | Supported |
| **Multi-device** | No | Yes |

## 🚀 Next Steps

1. **Install dependencies**
   ```bash
   pnpm add @prisma/client @better-auth/prisma-adapter
   ```

2. **Set up environment**
   - Copy `.env.example` to `.env.local`
   - Add your database URL
   - Generate a secret key

3. **Generate Prisma Client**
   ```bash
   pnpm db:generate
   ```

4. **Update server components**
   - Follow the examples above
   - Test each page after updating

5. **Test thoroughly**
   - Use the testing checklist
   - Try all authentication flows

6. **Remove mock auth** (optional)
   - Only after everything works
   - Keep for reference if needed

---

**Need Help?** Check `BETTER_AUTH_SETUP.md` for detailed setup instructions.
