# F1: User Authentication & Onboarding

**Priority**: 🔴 Critical  
**Status**: ✅ Complete  
**Phase**: 1 - Foundation  
**Timeline**: 2 weeks  
**Dependencies**: None

---

## Problem Statement

New users need a frictionless way to sign up and start using Postara within 5 minutes. Traditional authentication flows are complex, require email verification, and create unnecessary friction that leads to 40-60% drop-off during signup.

### Current Pain Points
- Complex signup forms with 10+ fields
- Email verification delays (users forget to check)
- Password requirements frustrate users
- No clear path after signup
- Overwhelming dashboard for first-time users

---

## User Stories

### As a Small Business Owner
> "I want to sign up with my Google account and immediately start creating content, so I don't waste time on setup."

**Acceptance Criteria:**
- ✅ One-click Google OAuth signup
- ✅ Auto-create workspace from Google profile
- ✅ Skip email verification
- ✅ Redirect to guided onboarding

### As a Marketing Manager
> "I want to understand what Postara can do for me within the first 2 minutes, so I know if it's worth my time."

**Acceptance Criteria:**
- ✅ Interactive product tour
- ✅ Pre-filled example content
- ✅ Quick wins (generate first content in <1 min)
- ✅ Clear next steps

### As a Developer
> "I want secure authentication that follows best practices, so I don't have to worry about security vulnerabilities."

**Acceptance Criteria:**
- ✅ Industry-standard OAuth 2.0
- ✅ Secure session management
- ✅ CSRF protection
- ✅ Rate limiting

---

## Success Metrics

### Primary Metrics
- **Signup Completion Rate**: >85% (Industry avg: 60%)
- **Time to First Campaign**: <5 minutes (Target: 3 minutes)
- **Day 1 Activation**: >70% create first content
- **Week 1 Retention**: >60% return within 7 days

### Secondary Metrics
- OAuth vs Email signup ratio: Target 80/20
- Onboarding completion rate: >75%
- Support tickets related to auth: <5%
- Session duration on first visit: >10 minutes

---

## Technical Specification

### Tech Stack
```
Authentication: Better Auth (better-auth)
Database: PostgreSQL
Session Storage: Database-backed sessions
OAuth Providers: Google, GitHub (future)
Frontend: Next.js App Router + React
```

### Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
  
  @@map("users")
}

model Session {
  id        String   @id @default(cuid())
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}

model Account {
  id                    String    @id @default(cuid())
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@map("accounts")
}
```

### API Endpoints

```typescript
// Authentication
POST   /api/auth/sign-up/email      - Email/password signup
POST   /api/auth/sign-in/email      - Email/password signin
GET    /api/auth/sign-in/google     - Google OAuth redirect
GET    /api/auth/callback/google    - Google OAuth callback
POST   /api/auth/sign-out           - Sign out
GET    /api/auth/session            - Get current session

// User Management
GET    /api/user/profile            - Get user profile
PATCH  /api/user/profile            - Update user profile
DELETE /api/user/account            - Delete account
```

### Security Features

1. **Session Management**
   - 7-day session expiration
   - Secure HTTP-only cookies
   - CSRF token validation
   - Session rotation on sensitive actions

2. **Password Security** (for email auth)
   - Bcrypt hashing (cost factor: 12)
   - Minimum 8 characters
   - Password strength indicator
   - Breach detection (HaveIBeenPwned API)

3. **Rate Limiting**
   - 5 failed login attempts → 15-minute lockout
   - 10 signup attempts per IP per hour
   - API rate limiting: 100 requests/minute

4. **OAuth Security**
   - State parameter validation
   - PKCE for mobile apps
   - Token encryption at rest
   - Automatic token refresh

---

## Implementation Details

### Phase 1.1: Core Authentication (Week 1)

**Tasks:**
- [x] Set up Better Auth with Prisma adapter
- [x] Configure Google OAuth
- [x] Create signup/signin pages
- [x] Implement session management
- [x] Add protected routes middleware

**Code Example:**
```typescript
// lib/auth.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Quick signup
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update daily
  },
});
```

### Phase 1.2: Onboarding Flow (Week 2)

**Tasks:**
- [x] Create onboarding wizard
- [x] Add progress indicators
- [x] Implement skip options
- [x] Track onboarding completion
- [x] A/B test different flows

**Onboarding Steps:**
1. **Welcome** - Brief intro (15 seconds)
2. **Business Info** - Name, industry, goals (30 seconds)
3. **Connect Accounts** - Social media, email (1 minute)
4. **Generate First Content** - AI demo (2 minutes)
5. **Schedule First Post** - Quick win (1 minute)

**Total Time**: ~5 minutes

---

## User Experience Flow

### Happy Path: Google OAuth Signup

```
1. User clicks "Sign up with Google"
   ↓
2. Google OAuth consent screen
   ↓
3. Redirect to Postara with auth code
   ↓
4. Create user account + session
   ↓
5. Redirect to onboarding wizard
   ↓
6. Complete 5-step onboarding
   ↓
7. Land on dashboard with first campaign created
```

### Alternative Path: Email Signup

```
1. User enters email + password
   ↓
2. Validate password strength
   ↓
3. Create account (no email verification)
   ↓
4. Auto-login and create session
   ↓
5. Same onboarding flow as OAuth
```

---

## Testing Strategy

### Unit Tests
```typescript
describe('Authentication', () => {
  it('should create user with Google OAuth', async () => {
    const user = await signUpWithGoogle(mockGoogleProfile);
    expect(user.email).toBe('test@example.com');
    expect(user.emailVerified).toBe(true);
  });
  
  it('should hash passwords securely', async () => {
    const hash = await hashPassword('password123');
    expect(hash).not.toBe('password123');
    expect(await verifyPassword('password123', hash)).toBe(true);
  });
  
  it('should rate limit failed login attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await signIn('test@example.com', 'wrong-password');
    }
    
    const result = await signIn('test@example.com', 'correct-password');
    expect(result.error).toBe('Too many attempts. Try again in 15 minutes.');
  });
});
```

### Integration Tests
- OAuth flow end-to-end
- Session persistence across requests
- Protected route access control
- Sign out and session cleanup

### E2E Tests (Playwright)
- Complete signup flow
- Onboarding wizard completion
- First campaign creation
- Sign out and sign back in

---

## Launch Criteria

### Must Have ✅
- [x] Google OAuth working
- [x] Email/password auth working
- [x] Session management secure
- [x] Onboarding wizard complete
- [x] Protected routes enforced
- [x] Error handling graceful

### Nice to Have ⚪
- [ ] GitHub OAuth
- [ ] Magic link signin
- [ ] Two-factor authentication
- [ ] Social profile import
- [ ] Team invitations

### Future Enhancements 🔮
- [ ] SSO for enterprise
- [ ] SAML integration
- [ ] Biometric authentication
- [ ] Passwordless authentication
- [ ] Account recovery flow

---

## Monitoring & Analytics

### Key Events to Track
```typescript
// Analytics events
analytics.track('user_signed_up', {
  method: 'google' | 'email',
  source: 'landing_page' | 'referral',
  timestamp: Date.now(),
});

analytics.track('onboarding_started', {
  userId: user.id,
  timestamp: Date.now(),
});

analytics.track('onboarding_completed', {
  userId: user.id,
  duration: completionTime,
  stepsCompleted: 5,
  timestamp: Date.now(),
});

analytics.track('first_campaign_created', {
  userId: user.id,
  timeFromSignup: timeDiff,
  campaignType: 'social' | 'email',
  timestamp: Date.now(),
});
```

### Dashboards to Create
1. **Signup Funnel**
   - Landing page visits
   - Signup button clicks
   - OAuth consent
   - Account creation
   - Onboarding completion

2. **Activation Metrics**
   - Time to first campaign
   - Onboarding completion rate
   - Day 1/7/30 retention
   - Feature adoption

3. **Security Monitoring**
   - Failed login attempts
   - Suspicious activity
   - Session anomalies
   - Rate limit triggers

---

## Known Issues & Limitations

### Current Limitations
1. **No Email Verification** - Trade-off for speed, may cause spam accounts
2. **Single OAuth Provider** - Only Google for now
3. **No Team Invitations** - Single-user accounts only
4. **Basic Profile** - Limited user customization

### Mitigation Strategies
1. Implement spam detection algorithms
2. Add more OAuth providers in F27
3. Build team features in F27
4. Enhance profile in future updates

---

## Cost Analysis

### Infrastructure Costs
- **Database**: $0 (included in main DB)
- **OAuth**: $0 (Google OAuth is free)
- **Sessions**: ~$0.01 per 1,000 sessions
- **Monitoring**: ~$10/month (Sentry)

**Total Monthly Cost**: ~$10 + $0.01 per 1K users

### Development Costs
- **Engineering**: 2 weeks × 1 engineer = $10K
- **Design**: 3 days × 1 designer = $2K
- **QA**: 2 days × 1 QA = $1K

**Total Development Cost**: $13K

### ROI Calculation
- Improved conversion: 60% → 85% = +42% signups
- Reduced support: 20% → 5% = -75% auth tickets
- Faster activation: 15 min → 5 min = 3x faster

**Estimated Value**: $50K+ in first year

---

## Related Documents

- [F2-AI-CONTENT.md](./F2-AI-CONTENT.md) - Next feature after auth
- [F27-TEAM-COLLABORATION.md](./F27-TEAM-COLLABORATION.md) - Team invitations
- [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) - System design

---

## Changelog

### v1.0.0 (2025-10-06)
- ✅ Initial implementation complete
- ✅ Google OAuth integrated
- ✅ Onboarding wizard live
- ✅ Session management working
- ✅ Protected routes enforced

### Next Version (v1.1.0)
- ⚪ Add GitHub OAuth
- ⚪ Implement magic links
- ⚪ Add 2FA support
- ⚪ Improve onboarding flow

---

**Status**: ✅ Complete and Live  
**Last Updated**: 2025-10-06  
**Owner**: Engineering Team  
**Stakeholders**: Product, Design, Marketing
