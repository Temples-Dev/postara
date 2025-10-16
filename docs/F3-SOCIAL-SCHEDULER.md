# F3: Social Media Scheduler

**Priority**: 🔴 Critical  
**Status**: ✅ Complete  
**Phase**: 1 - Foundation  
**Timeline**: 3 weeks  
**Dependencies**: F1 (Authentication), F2 (AI Content)

---

## Problem Statement

Small businesses struggle to maintain consistent social media presence. Posting manually is time-consuming, and remembering to post at optimal times is nearly impossible. This leads to:

- **Inconsistent posting** - 70% of businesses post irregularly
- **Missed opportunities** - Not posting when audience is active
- **Time waste** - 5-10 hours/week on manual posting
- **Poor engagement** - Random posting times = low reach

### Current Solutions Are Inadequate

**Buffer/Hootsuite:**
- Manual scheduling only
- No AI suggestions
- Complex interface
- Expensive ($60-120/mo)

**Later/Planoly:**
- Visual focus only (Instagram)
- Limited platforms
- No content generation
- Basic scheduling

---

## User Stories

### As a Small Business Owner
> "I want to schedule a week's worth of social posts in 10 minutes, so I can focus on running my business instead of constantly posting."

**Acceptance Criteria:**
- ✅ Bulk schedule multiple posts
- ✅ Visual calendar view
- ✅ Drag-and-drop rescheduling
- ✅ Queue management

### As a Content Creator
> "I want to post the same content to Twitter, LinkedIn, and Facebook, but optimized for each platform automatically."

**Acceptance Criteria:**
- ✅ Multi-platform posting
- ✅ Platform-specific optimization
- ✅ Character limit handling
- ✅ Format adaptation

### As a Marketing Manager
> "I need to see what's scheduled across all platforms in one view and make changes quickly."

**Acceptance Criteria:**
- ✅ Unified calendar view
- ✅ Filter by platform
- ✅ Quick edit/delete
- ✅ Status tracking

---

## Success Metrics

### Primary Metrics
- **Posts Scheduled**: >50 per user per month
- **Publishing Success Rate**: >98%
- **Time Saved**: 8+ hours per week
- **Consistency**: Users post 5x more regularly

### Secondary Metrics
- **Multi-platform Usage**: >60% post to 2+ platforms
- **Calendar View Usage**: >80% use calendar weekly
- **Rescheduling Rate**: <10% (good initial planning)
- **Failed Posts**: <2% (API issues)

### Business Impact
- **Retention**: Scheduler users have 2x retention
- **Engagement**: 40% increase in social engagement
- **Time to Value**: First post scheduled in <3 minutes
- **Feature Stickiness**: #2 most-used feature

---

## Technical Specification

### Supported Platforms

```typescript
enum SocialPlatform {
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  THREADS = 'threads',      // Future
  TIKTOK = 'tiktok',        // Future
  PINTEREST = 'pinterest',  // Future
  YOUTUBE = 'youtube',      // Future
}

interface PlatformLimits {
  maxLength: number;
  supportsImages: boolean;
  supportsVideo: boolean;
  supportsMultipleImages: boolean;
  hashtagLimit: number;
  mentionLimit: number;
}

const platformLimits: Record<SocialPlatform, PlatformLimits> = {
  twitter: {
    maxLength: 280,
    supportsImages: true,
    supportsVideo: true,
    supportsMultipleImages: true, // up to 4
    hashtagLimit: 2, // Best practice
    mentionLimit: 10,
  },
  linkedin: {
    maxLength: 3000,
    supportsImages: true,
    supportsVideo: true,
    supportsMultipleImages: true, // up to 9
    hashtagLimit: 5,
    mentionLimit: 50,
  },
  facebook: {
    maxLength: 63206,
    supportsImages: true,
    supportsVideo: true,
    supportsMultipleImages: true,
    hashtagLimit: 3,
    mentionLimit: 50,
  },
  instagram: {
    maxLength: 2200,
    supportsImages: true,
    supportsVideo: true,
    supportsMultipleImages: true, // up to 10
    hashtagLimit: 30,
    mentionLimit: 20,
  },
};
```

### Database Schema

```prisma
model SocialAccount {
  id            String         @id @default(cuid())
  userId        String
  user          User           @relation(fields: [userId], references: [id])
  workspaceId   String?
  
  // Platform Info
  platform      SocialPlatform
  accountId     String         // Platform-specific ID
  accountName   String         // Display name
  username      String?        // @handle
  avatar        String?
  
  // OAuth Tokens
  accessToken   String
  refreshToken  String?
  expiresAt     DateTime?
  
  // Status
  isActive      Boolean        @default(true)
  lastSync      DateTime?
  
  // Posts
  posts         SocialPost[]
  
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  
  @@unique([platform, accountId])
  @@index([userId, isActive])
  @@map("social_accounts")
}

model SocialPost {
  id              String         @id @default(cuid())
  userId          String
  user            User           @relation(fields: [userId], references: [id])
  accountId       String
  account         SocialAccount  @relation(fields: [accountId], references: [id])
  
  // Content
  content         String
  mediaUrls       String[]       // Images/videos
  hashtags        String[]
  mentions        String[]
  
  // Scheduling
  status          PostStatus     @default(DRAFT)
  scheduledAt     DateTime?
  publishedAt     DateTime?
  
  // Platform Response
  platformPostId  String?        // ID from platform after posting
  platformUrl     String?        // Link to post
  
  // Analytics
  likes           Int            @default(0)
  comments        Int            @default(0)
  shares          Int            @default(0)
  impressions     Int            @default(0)
  engagement      Float          @default(0)
  
  // Error Handling
  errorMessage    String?
  retryCount      Int            @default(0)
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  @@index([userId, status])
  @@index([accountId, scheduledAt])
  @@map("social_posts")
}

enum PostStatus {
  DRAFT
  SCHEDULED
  PUBLISHING
  PUBLISHED
  FAILED
  CANCELLED
}
```

### API Endpoints

```typescript
// Account Management
POST   /api/social/accounts/connect/:platform  - Connect social account
GET    /api/social/accounts                    - List connected accounts
DELETE /api/social/accounts/:id                - Disconnect account
POST   /api/social/accounts/:id/refresh        - Refresh token

// Post Management
POST   /api/social/posts                       - Create post
GET    /api/social/posts                       - List posts
GET    /api/social/posts/:id                   - Get post details
PATCH  /api/social/posts/:id                   - Update post
DELETE /api/social/posts/:id                   - Delete post

// Scheduling
POST   /api/social/posts/:id/schedule          - Schedule post
POST   /api/social/posts/:id/publish-now       - Publish immediately
POST   /api/social/posts/:id/cancel            - Cancel scheduled post
POST   /api/social/posts/bulk-schedule         - Schedule multiple posts

// Analytics
GET    /api/social/posts/:id/analytics         - Get post analytics
GET    /api/social/analytics/overview          - Overall performance
GET    /api/social/analytics/best-times        - Optimal posting times

// Calendar
GET    /api/social/calendar                    - Get calendar view
GET    /api/social/calendar/:date              - Posts for specific date
```

---

## Implementation Details

### Phase 3.1: Platform Integration (Week 1)

**OAuth Integration:**

```typescript
class SocialPlatformConnector {
  async connectPlatform(
    platform: SocialPlatform,
    userId: string
  ): Promise<string> {
    const config = this.getOAuthConfig(platform);
    
    // Generate OAuth URL
    const authUrl = new URL(config.authEndpoint);
    authUrl.searchParams.set('client_id', config.clientId);
    authUrl.searchParams.set('redirect_uri', config.redirectUri);
    authUrl.searchParams.set('scope', config.scopes.join(' '));
    authUrl.searchParams.set('state', this.generateState(userId));
    
    return authUrl.toString();
  }
  
  async handleCallback(
    platform: SocialPlatform,
    code: string,
    state: string
  ): Promise<SocialAccount> {
    // Exchange code for tokens
    const tokens = await this.exchangeCodeForTokens(platform, code);
    
    // Get user profile from platform
    const profile = await this.getPlatformProfile(platform, tokens.accessToken);
    
    // Save account
    return await prisma.socialAccount.create({
      data: {
        userId: this.getUserIdFromState(state),
        platform,
        accountId: profile.id,
        accountName: profile.name,
        username: profile.username,
        avatar: profile.avatar,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      },
    });
  }
  
  private getOAuthConfig(platform: SocialPlatform) {
    const configs = {
      twitter: {
        authEndpoint: 'https://twitter.com/i/oauth2/authorize',
        tokenEndpoint: 'https://api.twitter.com/2/oauth2/token',
        clientId: process.env.TWITTER_CLIENT_ID!,
        clientSecret: process.env.TWITTER_CLIENT_SECRET!,
        redirectUri: `${process.env.APP_URL}/api/social/callback/twitter`,
        scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
      },
      linkedin: {
        authEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
        tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
        clientId: process.env.LINKEDIN_CLIENT_ID!,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirectUri: `${process.env.APP_URL}/api/social/callback/linkedin`,
        scopes: ['w_member_social', 'r_liteprofile', 'r_emailaddress'],
      },
      // ... other platforms
    };
    
    return configs[platform];
  }
}
```

### Phase 3.2: Post Scheduling (Week 2)

**Scheduling Engine:**

```typescript
class PostScheduler {
  private queue: Queue;
  
  async schedulePost(post: SocialPost): Promise<void> {
    // Validate scheduled time
    if (post.scheduledAt < new Date()) {
      throw new Error('Cannot schedule in the past');
    }
    
    // Add to job queue
    await this.queue.add('publish-post', {
      postId: post.id,
      accountId: post.accountId,
      platform: post.account.platform,
    }, {
      delay: post.scheduledAt.getTime() - Date.now(),
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 60000, // 1 minute
      },
    });
    
    // Update post status
    await prisma.socialPost.update({
      where: { id: post.id },
      data: { status: 'SCHEDULED' },
    });
  }
  
  async publishPost(postId: string): Promise<void> {
    const post = await prisma.socialPost.findUnique({
      where: { id: postId },
      include: { account: true },
    });
    
    if (!post) throw new Error('Post not found');
    
    try {
      // Update status
      await prisma.socialPost.update({
        where: { id: postId },
        data: { status: 'PUBLISHING' },
      });
      
      // Publish to platform
      const result = await this.publishToPlatform(post);
      
      // Update with success
      await prisma.socialPost.update({
        where: { id: postId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          platformPostId: result.id,
          platformUrl: result.url,
        },
      });
      
      // Track analytics
      await this.trackPublish(post);
      
    } catch (error) {
      // Handle failure
      await this.handlePublishError(postId, error);
    }
  }
  
  private async publishToPlatform(post: SocialPost): Promise<PlatformResponse> {
    const publisher = this.getPlatformPublisher(post.account.platform);
    
    return await publisher.publish({
      accessToken: post.account.accessToken,
      content: post.content,
      mediaUrls: post.mediaUrls,
    });
  }
  
  private async handlePublishError(postId: string, error: Error): Promise<void> {
    const post = await prisma.socialPost.findUnique({
      where: { id: postId },
    });
    
    const retryCount = (post?.retryCount || 0) + 1;
    
    if (retryCount < 3) {
      // Retry after delay
      await this.queue.add('publish-post', { postId }, {
        delay: Math.pow(2, retryCount) * 60000, // Exponential backoff
      });
      
      await prisma.socialPost.update({
        where: { id: postId },
        data: {
          status: 'SCHEDULED',
          retryCount,
          errorMessage: error.message,
        },
      });
    } else {
      // Mark as failed
      await prisma.socialPost.update({
        where: { id: postId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });
      
      // Notify user
      await this.notifyUser(post.userId, {
        type: 'post_failed',
        postId,
        error: error.message,
      });
    }
  }
}
```

### Phase 3.3: Calendar View (Week 3)

**Calendar Component:**

```typescript
interface CalendarView {
  // View modes
  mode: 'day' | 'week' | 'month';
  
  // Filters
  platforms: SocialPlatform[];
  accounts: string[];
  status: PostStatus[];
  
  // Data
  posts: CalendarPost[];
  
  // Actions
  onPostClick: (post: CalendarPost) => void;
  onDateClick: (date: Date) => void;
  onPostDrag: (postId: string, newDate: Date) => void;
}

const CalendarPost = {
  id: string;
  content: string;
  platform: SocialPlatform;
  scheduledAt: Date;
  status: PostStatus;
  thumbnail?: string;
};

// Calendar data fetching
const getCalendarPosts = async (
  userId: string,
  startDate: Date,
  endDate: Date,
  filters?: CalendarFilters
): Promise<CalendarPost[]> => {
  return await prisma.socialPost.findMany({
    where: {
      userId,
      scheduledAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(filters?.platforms && {
        account: {
          platform: { in: filters.platforms },
        },
      }),
      ...(filters?.status && {
        status: { in: filters.status },
      }),
    },
    include: {
      account: {
        select: {
          platform: true,
          accountName: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  });
};
```

---

## Platform-Specific Implementation

### Twitter/X Integration

```typescript
class TwitterPublisher {
  private client: TwitterApi;
  
  async publish(post: PublishRequest): Promise<PlatformResponse> {
    const { content, mediaUrls } = post;
    
    // Upload media first
    const mediaIds = await this.uploadMedia(mediaUrls);
    
    // Create tweet
    const response = await this.client.v2.tweet({
      text: content,
      ...(mediaIds.length > 0 && { media: { media_ids: mediaIds } }),
    });
    
    return {
      id: response.data.id,
      url: `https://twitter.com/user/status/${response.data.id}`,
    };
  }
  
  private async uploadMedia(urls: string[]): Promise<string[]> {
    const mediaIds: string[] = [];
    
    for (const url of urls) {
      const buffer = await this.downloadMedia(url);
      const mediaId = await this.client.v1.uploadMedia(buffer, {
        mimeType: this.getMimeType(url),
      });
      mediaIds.push(mediaId);
    }
    
    return mediaIds;
  }
  
  async getAnalytics(tweetId: string): Promise<TweetAnalytics> {
    const tweet = await this.client.v2.singleTweet(tweetId, {
      'tweet.fields': ['public_metrics'],
    });
    
    return {
      likes: tweet.data.public_metrics.like_count,
      retweets: tweet.data.public_metrics.retweet_count,
      replies: tweet.data.public_metrics.reply_count,
      impressions: tweet.data.public_metrics.impression_count,
    };
  }
}
```

### LinkedIn Integration

```typescript
class LinkedInPublisher {
  async publish(post: PublishRequest): Promise<PlatformResponse> {
    const { content, mediaUrls, accountId, accessToken } = post;
    
    // Register media assets
    const assets = await this.registerAssets(mediaUrls, accountId, accessToken);
    
    // Create post
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: `urn:li:person:${accountId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: assets.length > 0 ? 'IMAGE' : 'NONE',
            media: assets,
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });
    
    const data = await response.json();
    
    return {
      id: data.id,
      url: `https://www.linkedin.com/feed/update/${data.id}`,
    };
  }
  
  private async registerAssets(
    urls: string[],
    accountId: string,
    accessToken: string
  ): Promise<any[]> {
    const assets = [];
    
    for (const url of urls) {
      // Register upload
      const registerResponse = await this.registerUpload(accountId, accessToken);
      
      // Upload image
      await this.uploadImage(url, registerResponse.uploadUrl);
      
      assets.push({
        status: 'READY',
        media: registerResponse.asset,
      });
    }
    
    return assets;
  }
}
```

---

## User Experience Flow

### Scheduling Flow

```
1. User creates/generates content
   ↓
2. Selects platforms to post to
   ↓
3. Content auto-optimized per platform
   - Twitter: 280 chars, 2 hashtags
   - LinkedIn: Professional tone, 5 hashtags
   - Facebook: Longer format, casual
   ↓
4. Choose scheduling option:
   a) Post now
   b) Schedule for specific time
   c) Add to queue (next available slot)
   ↓
5. Review in calendar
   ↓
6. Auto-publish at scheduled time
   ↓
7. Track performance in analytics
```

### UI Components

```typescript
<SocialScheduler>
  {/* Connected Accounts */}
  <AccountSelector
    accounts={connectedAccounts}
    selected={selectedAccounts}
    onToggle={handleAccountToggle}
  />
  
  {/* Post Composer */}
  <PostComposer>
    <ContentInput
      value={content}
      onChange={setContent}
      maxLength={getMaxLength(selectedPlatforms)}
    />
    <MediaUploader
      files={media}
      onUpload={handleMediaUpload}
      maxFiles={4}
    />
    <HashtagInput
      tags={hashtags}
      suggestions={suggestedHashtags}
      onAdd={addHashtag}
    />
  </PostComposer>
  
  {/* Platform Previews */}
  <PlatformPreviews>
    {selectedAccounts.map(account => (
      <PlatformPreview
        platform={account.platform}
        content={optimizeForPlatform(content, account.platform)}
        media={media}
      />
    ))}
  </PlatformPreviews>
  
  {/* Scheduling Options */}
  <SchedulingPanel>
    <Button onClick={publishNow}>Post Now</Button>
    <DateTimePicker
      value={scheduledTime}
      onChange={setScheduledTime}
      minDate={new Date()}
    />
    <Button onClick={addToQueue}>Add to Queue</Button>
  </SchedulingPanel>
  
  {/* Calendar View */}
  <CalendarView
    posts={scheduledPosts}
    onPostClick={handlePostClick}
    onPostDrag={handleReschedule}
  />
</SocialScheduler>
```

---

## Queue Management System

### Smart Queue

```typescript
class SmartQueue {
  async addToQueue(
    userId: string,
    posts: SocialPost[]
  ): Promise<Date[]> {
    // Get user's posting schedule preferences
    const schedule = await this.getUserSchedule(userId);
    
    // Get optimal posting times
    const optimalTimes = await this.getOptimalTimes(userId);
    
    // Find next available slots
    const slots = await this.findAvailableSlots(
      userId,
      posts.length,
      schedule,
      optimalTimes
    );
    
    // Assign posts to slots
    for (let i = 0; i < posts.length; i++) {
      await prisma.socialPost.update({
        where: { id: posts[i].id },
        data: { scheduledAt: slots[i] },
      });
    }
    
    return slots;
  }
  
  private async findAvailableSlots(
    userId: string,
    count: number,
    schedule: PostingSchedule,
    optimalTimes: OptimalTime[]
  ): Promise<Date[]> {
    const slots: Date[] = [];
    let currentDate = new Date();
    
    while (slots.length < count) {
      // Check if this day/time is in schedule
      if (this.isInSchedule(currentDate, schedule)) {
        // Check if slot is available
        const hasPost = await this.hasPostAtTime(userId, currentDate);
        
        if (!hasPost) {
          slots.push(new Date(currentDate));
        }
      }
      
      // Move to next time slot (30 min intervals)
      currentDate = new Date(currentDate.getTime() + 30 * 60 * 1000);
    }
    
    return slots;
  }
  
  private isInSchedule(date: Date, schedule: PostingSchedule): boolean {
    const day = date.getDay();
    const hour = date.getHours();
    
    return schedule.days.includes(day) && 
           hour >= schedule.startHour && 
           hour <= schedule.endHour;
  }
}

interface PostingSchedule {
  days: number[];      // 0-6 (Sunday-Saturday)
  startHour: number;   // 0-23
  endHour: number;     // 0-23
  postsPerDay: number;
  timezone: string;
}
```

---

## Error Handling & Reliability

### Retry Strategy

```typescript
class PublishingReliability {
  async publishWithRetry(post: SocialPost): Promise<void> {
    const maxRetries = 3;
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.publish(post);
        return; // Success!
        
      } catch (error) {
        lastError = error;
        
        // Check if error is retryable
        if (!this.isRetryable(error)) {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await this.sleep(delay);
        
        // Refresh token if expired
        if (this.isTokenError(error)) {
          await this.refreshToken(post.accountId);
        }
      }
    }
    
    throw lastError;
  }
  
  private isRetryable(error: Error): boolean {
    const retryableErrors = [
      'RATE_LIMIT',
      'TIMEOUT',
      'NETWORK_ERROR',
      'TOKEN_EXPIRED',
      'SERVER_ERROR',
    ];
    
    return retryableErrors.some(type => 
      error.message.includes(type)
    );
  }
  
  private async refreshToken(accountId: string): Promise<void> {
    const account = await prisma.socialAccount.findUnique({
      where: { id: accountId },
    });
    
    if (!account?.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const tokens = await this.exchangeRefreshToken(
      account.platform,
      account.refreshToken
    );
    
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      },
    });
  }
}
```

### Rate Limiting

```typescript
class RateLimiter {
  private limits = {
    twitter: {
      postsPerDay: 300,
      postsPerHour: 50,
      postsPerMinute: 5,
    },
    linkedin: {
      postsPerDay: 100,
      postsPerHour: 25,
    },
    facebook: {
      postsPerDay: 200,
      postsPerHour: 50,
    },
  };
  
  async checkRateLimit(
    accountId: string,
    platform: SocialPlatform
  ): Promise<boolean> {
    const limits = this.limits[platform];
    
    // Check posts in last 24 hours
    const postsToday = await this.getPostCount(accountId, 24 * 60);
    if (postsToday >= limits.postsPerDay) {
      throw new Error('Daily post limit reached');
    }
    
    // Check posts in last hour
    const postsThisHour = await this.getPostCount(accountId, 60);
    if (postsThisHour >= limits.postsPerHour) {
      throw new Error('Hourly post limit reached');
    }
    
    return true;
  }
  
  private async getPostCount(
    accountId: string,
    minutes: number
  ): Promise<number> {
    const since = new Date(Date.now() - minutes * 60 * 1000);
    
    return await prisma.socialPost.count({
      where: {
        accountId,
        publishedAt: { gte: since },
        status: 'PUBLISHED',
      },
    });
  }
}
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('Social Scheduler', () => {
  it('should schedule post for future time', async () => {
    const scheduledAt = new Date(Date.now() + 3600000); // 1 hour
    
    const post = await schedulePost({
      userId: 'user123',
      accountId: 'account456',
      content: 'Test post',
      scheduledAt,
    });
    
    expect(post.status).toBe('SCHEDULED');
    expect(post.scheduledAt).toEqual(scheduledAt);
  });
  
  it('should publish post at scheduled time', async () => {
    const post = await createScheduledPost({
      scheduledAt: new Date(Date.now() + 1000), // 1 second
    });
    
    // Wait for publish
    await sleep(2000);
    
    const updated = await getPost(post.id);
    expect(updated.status).toBe('PUBLISHED');
    expect(updated.platformPostId).toBeDefined();
  });
  
  it('should retry failed posts', async () => {
    const mockPublish = jest.fn()
      .mockRejectedValueOnce(new Error('RATE_LIMIT'))
      .mockResolvedValueOnce({ id: '123', url: 'https://...' });
    
    await publishWithRetry(post);
    
    expect(mockPublish).toHaveBeenCalledTimes(2);
  });
  
  it('should optimize content for platform', async () => {
    const content = 'This is a long post that needs to be optimized for Twitter which has a 280 character limit so we need to make it shorter';
    
    const optimized = optimizeForPlatform(content, 'twitter');
    
    expect(optimized.length).toBeLessThanOrEqual(280);
    expect(optimized).toContain('...');
  });
});
```

### Integration Tests

```typescript
describe('Platform Integration', () => {
  it('should connect Twitter account', async () => {
    const authUrl = await connectPlatform('twitter', 'user123');
    expect(authUrl).toContain('twitter.com/oauth');
    
    // Simulate OAuth callback
    const account = await handleCallback('twitter', 'auth_code', 'state');
    expect(account.platform).toBe('twitter');
    expect(account.accessToken).toBeDefined();
  });
  
  it('should publish to multiple platforms', async () => {
    const post = await createPost({
      content: 'Multi-platform test',
      accounts: ['twitter_account', 'linkedin_account'],
    });
    
    await publishToAllPlatforms(post);
    
    const results = await getPublishResults(post.id);
    expect(results.twitter.status).toBe('PUBLISHED');
    expect(results.linkedin.status).toBe('PUBLISHED');
  });
});
```

---

## Launch Criteria

### Must Have ✅
- [x] Connect 4 platforms (Twitter, LinkedIn, Facebook, Instagram)
- [x] Schedule posts with date/time picker
- [x] Calendar view (week/month)
- [x] Multi-platform posting
- [x] Platform-specific optimization
- [x] Drag-and-drop rescheduling
- [x] Post status tracking
- [x] Error handling & retries

### Nice to Have ⚪
- [ ] Queue management
- [ ] Bulk scheduling
- [ ] Post templates
- [ ] Optimal time suggestions
- [ ] First comment scheduling

### Future Enhancements 🔮
- [ ] TikTok integration
- [ ] YouTube integration
- [ ] Pinterest integration
- [ ] Threads integration
- [ ] Video scheduling
- [ ] Story scheduling

---

## Cost Analysis

### API Costs
```typescript
const platformCosts = {
  twitter: {
    apiTier: 'Basic ($100/mo)',
    postsPerMonth: 10000,
    costPerPost: '$0.01',
  },
  linkedin: {
    apiTier: 'Free',
    postsPerMonth: 'Unlimited',
    costPerPost: '$0',
  },
  facebook: {
    apiTier: 'Free',
    postsPerMonth: 'Unlimited',
    costPerPost: '$0',
  },
  instagram: {
    apiTier: 'Free (via Facebook)',
    postsPerMonth: 'Unlimited',
    costPerPost: '$0',
  },
};

// Average cost per user
const avgCostPerUser = {
  postsPerMonth: 30,
  twitterPosts: 10,
  otherPosts: 20,
  totalCost: '$0.10/user/month',
};
```

### Infrastructure Costs
- **Queue System**: BullMQ + Redis (~$20/mo)
- **Media Storage**: S3 (~$5/mo for 1K users)
- **Monitoring**: Sentry (~$10/mo)

**Total**: ~$35/mo + $0.10 per user

---

## Monitoring & Alerts

### Key Metrics to Track

```typescript
const schedulerMetrics = {
  // Publishing
  postsScheduled: 0,
  postsPublished: 0,
  postsFailed: 0,
  successRate: 0,
  
  // Performance
  avgPublishTime: 0,      // seconds
  queueDepth: 0,
  processingRate: 0,      // posts/minute
  
  // Errors
  tokenErrors: 0,
  rateLimitErrors: 0,
  networkErrors: 0,
  platformErrors: 0,
  
  // Usage
  activeAccounts: 0,
  postsPerUser: 0,
  popularPlatforms: [],
};

// Alerts
const alerts = {
  successRate: {
    threshold: 95,
    alert: 'Success rate below 95%',
  },
  queueDepth: {
    threshold: 1000,
    alert: 'Queue backing up',
  },
  tokenErrors: {
    threshold: 10,
    alert: 'Multiple token refresh failures',
  },
};
```

---

## Related Documents

- [F2-AI-CONTENT.md](./F2-AI-CONTENT.md) - Content generation
- [F7-SMART-SCHEDULING.md](./F7-SMART-SCHEDULING.md) - AI-powered optimal times
- [F16-UNIFIED-ANALYTICS.md](./F16-UNIFIED-ANALYTICS.md) - Performance tracking

---

**Status**: ✅ Complete and Live  
**Last Updated**: 2025-10-06  
**Owner**: Engineering Team  
**Stakeholders**: Product, Design, Marketing
