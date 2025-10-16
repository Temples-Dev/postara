# F4: Email Newsletter System

**Priority**: 🔴 Critical  
**Status**: ✅ Complete  
**Phase**: 1 - Foundation  
**Timeline**: 4 weeks  
**Dependencies**: F1 (Authentication), F2 (AI Content)

---

## Problem Statement

Email marketing is essential but expensive and complex. Mailchimp costs $300+/month for 10K subscribers, and most features go unused. Small businesses need:

- **Affordable email marketing** - Current solutions too expensive
- **Simple list management** - Not complex segmentation
- **Beautiful templates** - Without hiring designers
- **Deliverability guidance** - Avoid spam folders

### Why Current Solutions Fail

**Mailchimp:**
- Expensive ($300+/mo for 10K subscribers)
- Complex automation builder
- Overwhelming features
- Poor support

**ConvertKit:**
- Creator-focused only
- Limited templates
- Basic analytics
- $29-79/mo

**SendGrid/AWS SES:**
- Developer-focused
- No UI for marketers
- Complex setup
- Requires technical skills

---

## User Stories

### As a Small Business Owner
> "I want to send a beautiful newsletter to my 5,000 subscribers without spending $200/month or hiring a designer."

**Acceptance Criteria:**
- ✅ Professional templates included
- ✅ Drag-and-drop editor
- ✅ Affordable pricing (<$50/mo for 5K)
- ✅ Mobile-responsive emails

### As a Content Creator
> "I want to grow my email list and send weekly updates without dealing with complex automation or segmentation."

**Acceptance Criteria:**
- ✅ Simple list management
- ✅ Easy subscriber import
- ✅ One-click unsubscribe
- ✅ Basic segmentation (tags)

### As a Marketing Manager
> "I need to track open rates, click rates, and conversions to prove email marketing ROI."

**Acceptance Criteria:**
- ✅ Real-time analytics
- ✅ A/B testing
- ✅ Conversion tracking
- ✅ Exportable reports

---

## Success Metrics

### Primary Metrics
- **Emails Sent**: >100K per month
- **Deliverability Rate**: >98%
- **Average Open Rate**: >25% (industry avg: 21%)
- **Average Click Rate**: >3% (industry avg: 2.3%)

### Secondary Metrics
- **List Growth**: +10% per month
- **Unsubscribe Rate**: <0.5%
- **Spam Complaints**: <0.1%
- **Bounce Rate**: <2%

### Business Impact
- **Revenue Driver**: Email users have 3x LTV
- **Retention**: 80% month-3 retention
- **Upgrade Trigger**: List size drives upgrades
- **Competitive Advantage**: 70% cheaper than Mailchimp

---

## Technical Specification

### Email Service Provider Strategy

```typescript
interface EmailProvider {
  name: string;
  costPer1000: number;
  deliverability: number;
  features: string[];
}

const emailProviders = {
  // Primary (high volume)
  resend: {
    name: 'Resend',
    costPer1000: 0.40,        // $0.40 per 1K emails
    deliverability: 99.2,
    features: ['webhooks', 'analytics', 'templates'],
    limits: {
      free: 3000,             // 3K emails/month free
      paid: 'unlimited',
    },
  },
  
  // Backup (reliability)
  sendgrid: {
    name: 'SendGrid',
    costPer1000: 0.30,
    deliverability: 98.8,
    features: ['webhooks', 'analytics', 'templates', 'ip-pools'],
    limits: {
      free: 100,
      paid: 'unlimited',
    },
  },
  
  // Transactional (system emails)
  postmark: {
    name: 'Postmark',
    costPer1000: 1.25,
    deliverability: 99.5,
    features: ['webhooks', 'analytics', 'bounce-handling'],
    limits: {
      free: 100,
      paid: 'unlimited',
    },
  },
};
```

### Database Schema

```prisma
model EmailList {
  id            String       @id @default(cuid())
  userId        String
  user          User         @relation(fields: [userId], references: [id])
  workspaceId   String?
  
  // List Info
  name          String
  description   String?
  
  // Settings
  fromName      String       @default("Postara")
  fromEmail     String
  replyTo       String?
  
  // Subscribers
  subscribers   Subscriber[]
  campaigns     Campaign[]
  
  // Stats
  totalSubscribers    Int    @default(0)
  activeSubscribers   Int    @default(0)
  
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  
  @@index([userId])
  @@map("email_lists")
}

model Subscriber {
  id              String           @id @default(cuid())
  listId          String
  list            EmailList        @relation(fields: [listId], references: [id], onDelete: Cascade)
  
  // Contact Info
  email           String
  firstName       String?
  lastName        String?
  
  // Status
  status          SubscriberStatus @default(PENDING)
  
  // Metadata
  tags            String[]
  customFields    Json?
  
  // Engagement
  subscribedAt    DateTime?
  unsubscribedAt  DateTime?
  lastOpenedAt    DateTime?
  lastClickedAt   DateTime?
  
  // Analytics
  totalOpens      Int              @default(0)
  totalClicks     Int              @default(0)
  campaignsSent   Int              @default(0)
  
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  
  // Campaign tracking
  analytics       CampaignAnalytics[]
  
  @@unique([listId, email])
  @@index([email])
  @@index([listId, status])
  @@map("subscribers")
}

enum SubscriberStatus {
  PENDING       // Awaiting confirmation
  ACTIVE        // Confirmed and active
  UNSUBSCRIBED  // Opted out
  BOUNCED       // Email bounced
  COMPLAINED    // Marked as spam
}

model Campaign {
  id            String            @id @default(cuid())
  userId        String
  user          User              @relation(fields: [userId], references: [id])
  listId        String
  list          EmailList         @relation(fields: [listId], references: [id])
  workspaceId   String?
  
  // Campaign Info
  name          String
  subject       String
  preheader     String?
  
  // Sender
  fromName      String
  fromEmail     String
  replyTo       String?
  
  // Content
  htmlContent   String
  textContent   String
  
  // Status
  status        CampaignStatus    @default(DRAFT)
  
  // Scheduling
  scheduledAt   DateTime?
  sentAt        DateTime?
  
  // Analytics
  analytics     CampaignAnalytics[]
  
  // Stats (cached)
  totalSent     Int               @default(0)
  totalOpened   Int               @default(0)
  totalClicked  Int               @default(0)
  totalBounced  Int               @default(0)
  
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  @@index([userId, status])
  @@index([listId])
  @@map("campaigns")
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  PAUSED
  CANCELLED
}

model CampaignAnalytics {
  id            String      @id @default(cuid())
  campaignId    String
  campaign      Campaign    @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  subscriberId  String
  subscriber    Subscriber  @relation(fields: [subscriberId], references: [id], onDelete: Cascade)
  
  // Delivery
  sent          Boolean     @default(false)
  delivered     Boolean     @default(false)
  bounced       Boolean     @default(false)
  bounceReason  String?
  
  // Engagement
  opened        Boolean     @default(false)
  clicked       Boolean     @default(false)
  unsubscribed  Boolean     @default(false)
  complained    Boolean     @default(false)
  
  // Timestamps
  sentAt        DateTime?
  openedAt      DateTime?
  clickedAt     DateTime?
  
  // Tracking
  ipAddress     String?
  userAgent     String?
  location      String?
  
  createdAt     DateTime    @default(now())
  
  @@unique([campaignId, subscriberId])
  @@index([campaignId])
  @@map("campaign_analytics")
}
```

### API Endpoints

```typescript
// List Management
POST   /api/email/lists                    - Create list
GET    /api/email/lists                    - Get all lists
GET    /api/email/lists/:id                - Get list details
PATCH  /api/email/lists/:id                - Update list
DELETE /api/email/lists/:id                - Delete list

// Subscriber Management
POST   /api/email/lists/:id/subscribers    - Add subscriber
POST   /api/email/lists/:id/import         - Import CSV
GET    /api/email/lists/:id/subscribers    - List subscribers
PATCH  /api/email/subscribers/:id          - Update subscriber
DELETE /api/email/subscribers/:id          - Remove subscriber
POST   /api/email/subscribers/:id/tags     - Add tags

// Campaign Management
POST   /api/email/campaigns                - Create campaign
GET    /api/email/campaigns                - List campaigns
GET    /api/email/campaigns/:id            - Get campaign
PATCH  /api/email/campaigns/:id            - Update campaign
DELETE /api/email/campaigns/:id            - Delete campaign

// Sending
POST   /api/email/campaigns/:id/schedule   - Schedule campaign
POST   /api/email/campaigns/:id/send-now   - Send immediately
POST   /api/email/campaigns/:id/send-test  - Send test email
POST   /api/email/campaigns/:id/pause      - Pause sending
POST   /api/email/campaigns/:id/cancel     - Cancel campaign

// Analytics
GET    /api/email/campaigns/:id/analytics  - Campaign analytics
GET    /api/email/analytics/overview       - Overall performance
GET    /api/email/analytics/engagement     - Engagement metrics

// Public Endpoints
GET    /api/email/unsubscribe/:token       - Unsubscribe page
POST   /api/email/unsubscribe/:token       - Process unsubscribe
GET    /api/email/track/open/:token        - Track email open
GET    /api/email/track/click/:token/:url  - Track link click
```

---

## Implementation Details

### Phase 4.1: Email Editor (Week 1)

**Drag-and-Drop Editor:**

```typescript
interface EmailTemplate {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  blocks: EmailBlock[];
}

interface EmailBlock {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'social' | 'footer';
  content: any;
  styles: BlockStyles;
}

const EmailEditor = () => {
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  
  const addBlock = (type: EmailBlock['type']) => {
    const newBlock = createBlock(type);
    setBlocks([...blocks, newBlock]);
  };
  
  const updateBlock = (id: string, updates: Partial<EmailBlock>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };
  
  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, removed);
    setBlocks(newBlocks);
  };
  
  const generateHTML = (): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${campaign.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" bgcolor="#f4f4f4">
        <table width="600" cellpadding="0" cellspacing="0" border="0">
          ${blocks.map(block => renderBlock(block)).join('\n')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  };
  
  return (
    <div className="flex h-screen">
      {/* Block Palette */}
      <BlockPalette onAddBlock={addBlock} />
      
      {/* Editor Canvas */}
      <EditorCanvas
        blocks={blocks}
        selectedBlock={selectedBlock}
        onSelectBlock={setSelectedBlock}
        onMoveBlock={moveBlock}
      />
      
      {/* Properties Panel */}
      <PropertiesPanel
        block={blocks.find(b => b.id === selectedBlock)}
        onUpdate={updateBlock}
      />
    </div>
  );
};
```

### Phase 4.2: Sending Infrastructure (Week 2)

**Email Sending Service:**

```typescript
class EmailSender {
  private resend: Resend;
  private sendgrid: SendGrid;
  
  async sendCampaign(campaignId: string): Promise<void> {
    const campaign = await this.getCampaign(campaignId);
    const subscribers = await this.getActiveSubscribers(campaign.listId);
    
    // Update status
    await this.updateCampaignStatus(campaignId, 'SENDING');
    
    // Send in batches
    const batchSize = 100;
    const batches = this.chunkArray(subscribers, batchSize);
    
    for (const batch of batches) {
      await this.sendBatch(campaign, batch);
      
      // Rate limiting
      await this.sleep(1000); // 1 second between batches
    }
    
    // Update status
    await this.updateCampaignStatus(campaignId, 'SENT', {
      sentAt: new Date(),
      totalSent: subscribers.length,
    });
  }
  
  private async sendBatch(
    campaign: Campaign,
    subscribers: Subscriber[]
  ): Promise<void> {
    const emails = subscribers.map(sub => ({
      to: sub.email,
      from: `${campaign.fromName} <${campaign.fromEmail}>`,
      subject: this.personalize(campaign.subject, sub),
      html: this.personalize(campaign.htmlContent, sub),
      text: this.personalize(campaign.textContent, sub),
      headers: {
        'List-Unsubscribe': this.getUnsubscribeUrl(sub.id),
        'X-Campaign-ID': campaign.id,
      },
    }));
    
    try {
      // Use primary provider (Resend)
      await this.resend.emails.sendBatch(emails);
      
      // Track sent
      await this.trackSent(campaign.id, subscribers);
      
    } catch (error) {
      // Fallback to SendGrid
      console.error('Resend failed, trying SendGrid:', error);
      await this.sendgrid.send(emails);
      await this.trackSent(campaign.id, subscribers);
    }
  }
  
  private personalize(content: string, subscriber: Subscriber): string {
    return content
      .replace(/\{\{email\}\}/g, subscriber.email)
      .replace(/\{\{first_name\}\}/g, subscriber.firstName || 'there')
      .replace(/\{\{last_name\}\}/g, subscriber.lastName || '')
      .replace(/\{\{full_name\}\}/g, 
        `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim() || 'there'
      );
  }
  
  private getUnsubscribeUrl(subscriberId: string): string {
    const token = this.generateUnsubscribeToken(subscriberId);
    return `${process.env.APP_URL}/api/email/unsubscribe/${token}`;
  }
}
```

### Phase 4.3: Analytics & Tracking (Week 3)

**Tracking System:**

```typescript
class EmailTracker {
  async trackOpen(token: string): Promise<void> {
    const { campaignId, subscriberId } = this.decodeToken(token);
    
    // Check if already tracked (avoid double-counting)
    const existing = await prisma.campaignAnalytics.findUnique({
      where: {
        campaignId_subscriberId: { campaignId, subscriberId },
      },
    });
    
    if (existing && !existing.opened) {
      // First open
      await prisma.campaignAnalytics.update({
        where: { id: existing.id },
        data: {
          opened: true,
          openedAt: new Date(),
        },
      });
      
      // Update campaign stats
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { totalOpened: { increment: 1 } },
      });
      
      // Update subscriber stats
      await prisma.subscriber.update({
        where: { id: subscriberId },
        data: {
          lastOpenedAt: new Date(),
          totalOpens: { increment: 1 },
        },
      });
    }
  }
  
  async trackClick(token: string, url: string): Promise<string> {
    const { campaignId, subscriberId } = this.decodeToken(token);
    
    // Track click
    const analytics = await prisma.campaignAnalytics.findUnique({
      where: {
        campaignId_subscriberId: { campaignId, subscriberId },
      },
    });
    
    if (analytics && !analytics.clicked) {
      await prisma.campaignAnalytics.update({
        where: { id: analytics.id },
        data: {
          clicked: true,
          clickedAt: new Date(),
        },
      });
      
      // Update campaign stats
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { totalClicked: { increment: 1 } },
      });
      
      // Update subscriber stats
      await prisma.subscriber.update({
        where: { id: subscriberId },
        data: {
          lastClickedAt: new Date(),
          totalClicks: { increment: 1 },
        },
      });
    }
    
    // Redirect to original URL
    return url;
  }
  
  generateTrackingPixel(campaignId: string, subscriberId: string): string {
    const token = this.encodeToken(campaignId, subscriberId);
    return `<img src="${process.env.APP_URL}/api/email/track/open/${token}" width="1" height="1" alt="" />`;
  }
  
  wrapLinksWithTracking(html: string, campaignId: string, subscriberId: string): string {
    const token = this.encodeToken(campaignId, subscriberId);
    
    return html.replace(
      /href="([^"]+)"/g,
      (match, url) => {
        const trackingUrl = `${process.env.APP_URL}/api/email/track/click/${token}?url=${encodeURIComponent(url)}`;
        return `href="${trackingUrl}"`;
      }
    );
  }
}
```

### Phase 4.4: Deliverability (Week 4)

**Deliverability Optimization:**

```typescript
class DeliverabilityOptimizer {
  async validateEmail(email: string): Promise<ValidationResult> {
    return {
      isValid: this.isValidFormat(email),
      isDisposable: await this.checkDisposable(email),
      isRoleAccount: this.isRoleAccount(email),
      hasMX: await this.checkMXRecords(email),
      riskScore: this.calculateRiskScore(email),
    };
  }
  
  async checkSpamScore(content: string, subject: string): Promise<SpamScore> {
    const checks = {
      // Subject line
      subjectLength: subject.length >= 20 && subject.length <= 60,
      noAllCaps: subject !== subject.toUpperCase(),
      noExcessivePunctuation: !subject.match(/[!?]{2,}/),
      noSpamWords: !this.hasSpamWords(subject),
      
      // Content
      textToImageRatio: this.getTextToImageRatio(content) > 0.6,
      hasUnsubscribe: content.includes('unsubscribe'),
      noShorteners: !this.hasUrlShorteners(content),
      validHTML: this.isValidHTML(content),
      
      // Technical
      hasSPF: await this.checkSPF(campaign.fromEmail),
      hasDKIM: await this.checkDKIM(campaign.fromEmail),
      hasDMARC: await this.checkDMARC(campaign.fromEmail),
    };
    
    const score = Object.values(checks).filter(Boolean).length / Object.keys(checks).length;
    
    return {
      score: score * 10, // 0-10
      passed: score >= 0.8,
      issues: this.getIssues(checks),
      suggestions: this.getSuggestions(checks),
    };
  }
  
  private hasSpamWords(text: string): boolean {
    const spamWords = [
      'free', 'click here', 'act now', 'limited time',
      'buy now', 'order now', 'urgent', 'congratulations',
      'winner', 'prize', 'cash', 'money back',
    ];
    
    const lowerText = text.toLowerCase();
    return spamWords.some(word => lowerText.includes(word));
  }
  
  async warmupDomain(domain: string): Promise<void> {
    // Gradual sending volume increase
    const schedule = [
      { day: 1, volume: 50 },
      { day: 2, volume: 100 },
      { day: 3, volume: 200 },
      { day: 4, volume: 400 },
      { day: 5, volume: 800 },
      { day: 6, volume: 1600 },
      { day: 7, volume: 3200 },
      // ... continue for 30 days
    ];
    
    for (const step of schedule) {
      await this.sendWarmupEmails(domain, step.volume);
      await this.sleep(24 * 60 * 60 * 1000); // Wait 24 hours
    }
  }
}
```

---

## Email Templates

### Template System

```typescript
interface EmailTemplate {
  id: string;
  name: string;
  category: 'newsletter' | 'promotion' | 'announcement' | 'welcome';
  thumbnail: string;
  html: string;
  variables: string[]; // {{first_name}}, {{company}}, etc.
}

const templates = {
  newsletter: {
    modern: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #f8f9fa; padding: 40px 20px; text-align: center;">
          <img src="{{logo}}" alt="{{company}}" style="height: 40px;">
        </div>
        <div style="padding: 40px 20px;">
          <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 20px;">
            {{headline}}
          </h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            {{content}}
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="{{cta_url}}" style="background: #007bff; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block;">
              {{cta_text}}
            </a>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>{{company}} | {{address}}</p>
          <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
        </div>
      </div>
    `,
  },
  
  welcome: `
    <!-- Welcome email template -->
  `,
  
  promotion: `
    <!-- Promotional email template -->
  `,
};
```

---

## Deliverability Best Practices

### Built-in Guidance

```typescript
const deliverabilityChecklist = {
  technical: [
    '✅ SPF record configured',
    '✅ DKIM signing enabled',
    '✅ DMARC policy set',
    '✅ Custom domain verified',
    '✅ Reverse DNS configured',
  ],
  
  content: [
    '✅ Text-to-image ratio > 60%',
    '✅ Unsubscribe link present',
    '✅ Physical address included',
    '✅ No spam trigger words',
    '✅ Valid HTML structure',
  ],
  
  sending: [
    '✅ Domain warmed up',
    '✅ Clean subscriber list',
    '✅ Bounce rate < 2%',
    '✅ Complaint rate < 0.1%',
    '✅ Consistent sending schedule',
  ],
  
  engagement: [
    '✅ Re-engagement campaigns',
    '✅ Remove inactive subscribers',
    '✅ Segment by engagement',
    '✅ Optimize send times',
    '✅ A/B test subject lines',
  ],
};
```

---

## Launch Criteria

### Must Have ✅
- [x] Create and manage email lists
- [x] Import subscribers (CSV)
- [x] Drag-and-drop email editor
- [x] 10+ professional templates
- [x] Schedule campaigns
- [x] Send test emails
- [x] Track opens and clicks
- [x] Unsubscribe handling
- [x] Basic analytics dashboard

### Nice to Have ⚪
- [ ] A/B testing
- [ ] Automation workflows
- [ ] Advanced segmentation
- [ ] Dynamic content
- [ ] RSS-to-email

### Future Enhancements 🔮
- [ ] AI-powered send time optimization
- [ ] Predictive analytics
- [ ] Behavioral triggers
- [ ] Product recommendations
- [ ] Revenue attribution

---

## Cost Analysis

### Sending Costs

```typescript
const emailCosts = {
  // Per 1,000 emails
  resend: 0.40,
  sendgrid: 0.30,
  
  // Average per user
  avgEmailsPerMonth: 1000,
  avgCostPerUser: 0.40,
  
  // At scale
  users1K: { emails: 1000000, cost: 400 },
  users10K: { emails: 10000000, cost: 4000 },
  users100K: { emails: 100000000, cost: 40000 },
};

// Pricing comparison
const competitorCosts = {
  mailchimp: {
    subscribers5K: 75,
    subscribers10K: 150,
    subscribers50K: 350,
  },
  postara: {
    subscribers5K: 49,   // Starter
    subscribers10K: 99,  // Professional
    subscribers50K: 199, // Enterprise
  },
  savings: {
    subscribers5K: '35%',
    subscribers10K: '34%',
    subscribers50K: '43%',
  },
};
```

---

## Compliance & Legal

### CAN-SPAM Compliance

```typescript
const complianceRequirements = {
  required: [
    'Physical mailing address in footer',
    'Clear unsubscribe link',
    'Honor unsubscribe within 10 days',
    'Accurate "From" information',
    'Honest subject line',
  ],
  
  implementation: {
    unsubscribe: {
      link: '{{unsubscribe_url}}',
      text: 'Unsubscribe from this list',
      placement: 'Footer of every email',
      processing: 'Immediate (within 1 hour)',
    },
    
    address: {
      required: true,
      format: 'Company Name, Street, City, State ZIP',
      placement: 'Footer of every email',
    },
    
    identification: {
      fromName: 'Must match sender',
      fromEmail: 'Must be valid',
      replyTo: 'Must be monitored',
    },
  },
};
```

### GDPR Compliance

```typescript
const gdprFeatures = {
  consent: {
    doubleOptIn: true,
    consentTracking: true,
    consentWithdrawal: 'One-click unsubscribe',
  },
  
  dataRights: {
    dataExport: 'Download subscriber data',
    dataDelete: 'Delete subscriber and all data',
    dataPortability: 'Export in standard format',
  },
  
  transparency: {
    privacyPolicy: 'Link in every email',
    dataUsage: 'Clear explanation',
    thirdParties: 'List all processors',
  },
};
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('Email Newsletter', () => {
  it('should create campaign', async () => {
    const campaign = await createCampaign({
      name: 'Test Campaign',
      listId: 'list123',
      subject: 'Test Subject',
      content: '<p>Test content</p>',
    });
    
    expect(campaign.status).toBe('DRAFT');
    expect(campaign.subject).toBe('Test Subject');
  });
  
  it('should personalize email content', async () => {
    const content = 'Hi {{first_name}}, welcome to {{company}}!';
    const subscriber = { firstName: 'John', email: 'john@example.com' };
    
    const personalized = personalize(content, subscriber);
    
    expect(personalized).toBe('Hi John, welcome to Postara!');
  });
  
  it('should validate email format', async () => {
    expect(await validateEmail('valid@example.com')).toBe(true);
    expect(await validateEmail('invalid@')).toBe(false);
    expect(await validateEmail('test@disposable.com')).toBe(false);
  });
  
  it('should track opens correctly', async () => {
    const token = generateTrackingToken('campaign123', 'sub456');
    
    await trackOpen(token);
    
    const analytics = await getAnalytics('campaign123', 'sub456');
    expect(analytics.opened).toBe(true);
    expect(analytics.openedAt).toBeDefined();
  });
});
```

### Integration Tests

```typescript
describe('Email Sending', () => {
  it('should send campaign to all subscribers', async () => {
    const campaign = await createCampaign({
      listId: 'list123',
      subject: 'Test',
      content: '<p>Test</p>',
    });
    
    const subscribers = await createSubscribers(10);
    
    await sendCampaign(campaign.id);
    
    const analytics = await getCampaignAnalytics(campaign.id);
    expect(analytics.totalSent).toBe(10);
  });
  
  it('should handle bounces gracefully', async () => {
    const subscriber = await createSubscriber({
      email: 'bounce@simulator.amazonses.com',
    });
    
    await sendEmail(subscriber);
    
    // Wait for webhook
    await sleep(5000);
    
    const updated = await getSubscriber(subscriber.id);
    expect(updated.status).toBe('BOUNCED');
  });
});
```

---

## Launch Criteria

### Must Have ✅
- [x] List management (create, edit, delete)
- [x] Subscriber import/export
- [x] Email editor with templates
- [x] Campaign scheduling
- [x] Sending infrastructure
- [x] Open/click tracking
- [x] Unsubscribe handling
- [x] Basic analytics

### Nice to Have ⚪
- [ ] Double opt-in
- [ ] Welcome email automation
- [ ] Segment by engagement
- [ ] A/B testing
- [ ] RSS-to-email

### Future Enhancements 🔮
- [ ] Advanced automation
- [ ] Predictive sending
- [ ] AI subject line optimization
- [ ] Dynamic content blocks
- [ ] Revenue tracking

---

## Related Documents

- [F2-AI-CONTENT.md](./F2-AI-CONTENT.md) - AI-generated email content
- [F11-WORKFLOW-AUTOMATION.md](./F11-WORKFLOW-AUTOMATION.md) - Email automation
- [F16-UNIFIED-ANALYTICS.md](./F16-UNIFIED-ANALYTICS.md) - Cross-channel analytics

---

**Status**: ✅ Complete and Live  
**Last Updated**: 2025-10-06  
**Owner**: Engineering Team  
**Stakeholders**: Product, Design, Marketing
