# Better Auth + Prisma Setup Guide

This guide explains how to set up Better Auth with Prisma adapter to connect to your PostgreSQL backend.

## 📦 Installation

The following packages need to be installed:

```bash
# Install dependencies
pnpm add @prisma/client @better-auth/prisma-adapter

# Install dev dependencies (already done)
pnpm add -D prisma
```

## 🗄️ Database Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/postara?schema=public"

# Better Auth Configuration
BETTER_AUTH_SECRET="generate-a-random-32-character-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Generate Prisma Client

```bash
pnpm db:generate
```

This generates the Prisma Client based on your schema.

### 3. Push Schema to Database

If you're using the existing backend database:

```bash
# The schema is already in your backend, so just generate the client
pnpm db:generate
```

If you need to create the tables (first time setup):

```bash
pnpm db:push
```

## 🔧 Configuration Files

### Prisma Schema (`prisma/schema.prisma`)

The schema connects to your existing PostgreSQL database and uses the same tables as your backend:

- `users` - User accounts
- `sessions` - Active sessions
- `accounts` - OAuth provider accounts
- `verification_tokens` - Email verification tokens

### Better Auth (`src/lib/auth.ts`)

Configured with:
- ✅ Prisma adapter for PostgreSQL
- ✅ Email/password authentication
- ✅ Google OAuth (optional)
- ✅ 7-day session expiration
- ✅ Secure cookie configuration

### API Route (`src/app/api/auth/[...all]/route.ts`)

Handles all Better Auth endpoints:
- `POST /api/auth/sign-in/email` - Email sign-in
- `POST /api/auth/sign-up/email` - Email sign-up
- `GET /api/auth/sign-in/google` - Google OAuth
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session

## 🚀 Usage

### Client-Side Authentication

```tsx
import { signIn, signUp, signOut, useSession } from "@/lib/auth-client";

// Sign up with email
await signUp.email({
  email: "user@example.com",
  password: "securepassword",
  name: "John Doe"
});

// Sign in with email
await signIn.email({
  email: "user@example.com",
  password: "securepassword"
});

// Sign in with Google
await signIn.social({
  provider: "google",
  callbackURL: "/dashboard"
});

// Sign out
await signOut();

// Get current session
const { data: session } = useSession();
```

### Server-Side Authentication

```tsx
import { auth } from "@/lib/auth";

// In a Server Component or API route
const session = await auth.api.getSession({
  headers: headers()
});

if (!session) {
  redirect("/signin");
}

const user = session.user;
```

## 🔐 Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 2. Add Credentials to .env.local

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## 📝 Database Schema

The Better Auth tables use the same schema as your backend:

```sql
-- Users table (already exists in backend)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMP,
  name TEXT,
  image TEXT,
  password TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table (already exists in backend)
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL,
  ip_address TEXT,
  user_agent TEXT
);

-- Accounts table (already exists in backend)
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

-- Verification tokens table (already exists in backend)
CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  UNIQUE(identifier, token)
);
```

## 🧪 Testing

### Test Email Authentication

```bash
# Start the dev server
pnpm dev

# Navigate to http://localhost:3000/signup
# Create an account with email/password
# Sign in at http://localhost:3000/signin
```

### Test Google OAuth

1. Set up Google OAuth credentials (see above)
2. Add credentials to `.env.local`
3. Restart dev server
4. Click "Continue with Google" button
5. Complete OAuth flow

## 🔄 Migration from Mock Auth

The mock auth system has been replaced with Better Auth. Update your pages:

### Before (Mock Auth)
```tsx
import { getMockUser } from "@/lib/mock/auth";

const user = await getMockUser();
```

### After (Better Auth)
```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: headers()
});

const user = session?.user;
```

## 📚 Available Scripts

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database (without migrations)
pnpm db:push

# Create and run migrations
pnpm db:migrate

# Open Prisma Studio (database GUI)
pnpm db:studio
```

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"

Run: `pnpm db:generate`

### "Cannot find module '@better-auth/prisma-adapter'"

Run: `pnpm add @prisma/client @better-auth/prisma-adapter`

### Database Connection Error

1. Check your `DATABASE_URL` in `.env.local`
2. Ensure PostgreSQL is running
3. Verify database credentials
4. Test connection: `pnpm db:studio`

### Google OAuth Not Working

1. Verify redirect URI matches exactly
2. Check credentials are in `.env.local`
3. Restart dev server after adding credentials
4. Ensure Google+ API is enabled

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use strong secrets** - Generate with `openssl rand -base64 32`
3. **Enable email verification** in production
4. **Use HTTPS** in production
5. **Rotate secrets** regularly
6. **Set secure cookie options** in production

## 📖 Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

**Status**: ✅ Ready for development
**Next Steps**: 
1. Install missing packages: `pnpm add @prisma/client @better-auth/prisma-adapter`
2. Set up `.env.local` with your database credentials
3. Run `pnpm db:generate` to generate Prisma Client
4. Test authentication flows
