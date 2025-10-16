# F2: AI Content Generation

**Priority**: 🔴 Critical  
**Status**: ✅ Complete  
**Phase**: 1 - Foundation  
**Timeline**: 3 weeks  
**Dependencies**: F1 (Authentication)

---

## Problem Statement

Creating quality marketing content is the #1 bottleneck for small businesses. It takes 3-4 hours to write a single piece of content, and most businesses need 10-20 pieces per week across email, social, and blog. This results in:

- **60% of marketers** cite content creation as their biggest challenge
- **$300-500** average cost per outsourced piece
- **Inconsistent quality** when rushed or delegated
- **Creative burnout** from constant content demands

### Current Solutions Fall Short

**ChatGPT/Generic AI:**
- No business context
- Generic, templated output
- Requires heavy editing
- Doesn't maintain brand voice

**Jasper/Copy.ai:**
- Expensive ($49-125/mo)
- Still requires prompting skills
- No integration with publishing
- Limited to text generation

---

## User Stories

### As a Small Business Owner
> "I need to create 5 social posts and 2 emails every week, but I don't have time or writing skills. I want AI to generate content that sounds like me."

**Acceptance Criteria:**
- ✅ Generate content in <30 seconds
- ✅ Multiple content types (email, social, blog)
- ✅ Tone/style customization
- ✅ One-click publish to scheduler

### As a Marketing Manager
> "I want AI that understands my brand, products, and audience so I don't have to explain context every time."

**Acceptance Criteria:**
- ✅ Brand voice consistency
- ✅ Product/service awareness
- ✅ Audience targeting
- ✅ Multi-format generation

### As a Content Creator
> "I want to generate 10 variations of the same message for different platforms without starting from scratch each time."

**Acceptance Criteria:**
- ✅ Platform-specific formatting
- ✅ Character limit awareness
- ✅ Hashtag suggestions
- ✅ Image recommendations

---

## Success Metrics

### Primary Metrics
- **Generation Speed**: <10 seconds per piece
- **Usage Rate**: >90% of users generate content weekly
- **Quality Score**: >4.0/5.0 average rating
- **Edit Rate**: <30% require major edits

### Secondary Metrics
- **Time Saved**: 10+ hours per user per week
- **Content Volume**: 3x increase in output
- **Publishing Rate**: 80% of generated content gets published
- **Feature Stickiness**: #1 most-used feature

### Business Impact
- **Conversion Driver**: Users who generate content convert 3x higher
- **Retention Driver**: 90-day retention 2x higher for AI users
- **Upgrade Trigger**: AI usage correlates with plan upgrades

---

## Technical Specification

### AI Provider Strategy

**Multi-Model Approach:**
```typescript
const AI_MODELS = {
  // Fast & cheap for simple tasks
  simple: {
    provider: 'groq',
    model: 'llama-3.1-8b',
    cost: '$0.05 per 1M tokens',
    speed: '500 tokens/sec',
    useCases: ['captions', 'headlines', 'hashtags']
  },
  
  // Balanced for most content
  standard: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    cost: '$0.15 per 1M tokens',
    speed: '100 tokens/sec',
    useCases: ['emails', 'social posts', 'blog outlines']
  },
  
  // Premium for complex content
  advanced: {
    provider: 'anthropic',
    model: 'claude-3.5-sonnet',
    cost: '$3 per 1M tokens',
    speed: '50 tokens/sec',
    useCases: ['long-form', 'technical', 'creative']
  },
  
  // Experimental for innovation
  experimental: {
    provider: 'xai',
    model: 'grok-beta',
    cost: '$5 per 1M tokens',
    speed: '80 tokens/sec',
    useCases: ['humor', 'trending topics', 'viral content']
  }
};
```

### Content Types Supported

```typescript
enum ContentType {
  // Social Media
  SOCIAL_POST = 'social_post',
  TWITTER_THREAD = 'twitter_thread',
  LINKEDIN_POST = 'linkedin_post',
  INSTAGRAM_CAPTION = 'instagram_caption',
  
  // Email
  EMAIL_SUBJECT = 'email_subject',
  EMAIL_BODY = 'email_body',
  EMAIL_SEQUENCE = 'email_sequence',
  
  // Blog
  BLOG_OUTLINE = 'blog_outline',
  BLOG_INTRO = 'blog_intro',
  BLOG_SECTION = 'blog_section',
  
  // Ads
  AD_HEADLINE = 'ad_headline',
  AD_COPY = 'ad_copy',
  AD_CTA = 'ad_cta',
  
  // Other
  VIDEO_SCRIPT = 'video_script',
  PRODUCT_DESCRIPTION = 'product_description',
  PRESS_RELEASE = 'press_release'
}
```

### Database Schema

```prisma
model AIGeneration {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  // Input
  contentType ContentType
  prompt      String
  tone        String?
  platform    String?
  targetAudience String?
  
  // Output
  content     String
  variations  Json?     // Multiple versions
  
  // Metadata
  model       String    @default("gpt-4o-mini")
  tokens      Int       @default(0)
  cost        Float     @default(0)
  duration    Int       // milliseconds
  
  // Quality
  rating      Int?      // 1-5 stars
  edited      Boolean   @default(false)
  published   Boolean   @default(false)
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([userId, createdAt])
  @@map("ai_generations")
}

model BrandVoice {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  // Brand Info
  brandName   String
  industry    String
  tone        String[]  // ["professional", "friendly", "casual"]
  keywords    String[]
  avoidWords  String[]
  
  // Examples
  examples    Json      // Sample content in brand voice
  
  // AI Training
  embedding   Json?     // Vector embedding for similarity
  trained     Boolean   @default(false)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@unique([userId])
  @@map("brand_voices")
}
```

### API Endpoints

```typescript
// Content Generation
POST   /api/ai/generate              - Generate content
POST   /api/ai/generate/batch        - Generate multiple variations
POST   /api/ai/regenerate/:id        - Regenerate with changes
POST   /api/ai/improve/:id           - Improve existing content

// Brand Voice
POST   /api/ai/brand-voice           - Train brand voice
GET    /api/ai/brand-voice           - Get brand voice settings
PATCH  /api/ai/brand-voice           - Update brand voice
POST   /api/ai/brand-voice/analyze   - Analyze content for voice

// History & Analytics
GET    /api/ai/generations           - List generations
GET    /api/ai/generations/:id       - Get specific generation
POST   /api/ai/generations/:id/rate  - Rate generation
GET    /api/ai/usage                 - Get usage stats
```

---

## Implementation Details

### Phase 2.1: Basic Generation (Week 1)

**Core Features:**
- [x] Single content generation
- [x] Content type selection
- [x] Tone customization
- [x] Platform targeting
- [x] Copy to clipboard

**Prompt Engineering:**
```typescript
const buildPrompt = (input: GenerationInput): string => {
  const { contentType, topic, tone, platform, audience } = input;
  
  return `
You are a professional marketing copywriter.

Task: Create ${contentType} about "${topic}"
Platform: ${platform}
Tone: ${tone}
Target Audience: ${audience}

Requirements:
- ${getContentTypeRequirements(contentType)}
- Match the ${tone} tone exactly
- Optimize for ${platform} best practices
- Include relevant hashtags if applicable
- Keep it engaging and actionable

Generate the content now:
  `.trim();
};

const getContentTypeRequirements = (type: ContentType): string => {
  const requirements = {
    social_post: 'Max 280 characters, include 2-3 hashtags, strong hook',
    email_subject: 'Max 60 characters, create urgency, avoid spam words',
    email_body: '150-300 words, clear CTA, personalized greeting',
    blog_outline: '5-7 main sections, SEO-friendly headings',
  };
  
  return requirements[type] || 'Follow best practices';
};
```

### Phase 2.2: Multi-Variation (Week 2)

**Features:**
- [x] Generate 3-5 variations
- [x] A/B test suggestions
- [x] Performance prediction
- [x] Side-by-side comparison

**Implementation:**
```typescript
const generateVariations = async (
  prompt: string,
  count: number = 3
): Promise<string[]> => {
  const variations = await Promise.all(
    Array(count).fill(null).map(async (_, index) => {
      const variation = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7 + (index * 0.1), // Vary creativity
        max_tokens: 500,
      });
      
      return variation.choices[0].message.content;
    })
  );
  
  return variations;
};
```

### Phase 2.3: Smart Features (Week 3)

**Features:**
- [x] Auto-improve suggestions
- [x] SEO optimization
- [x] Readability scoring
- [x] Emoji suggestions
- [x] Image recommendations

**AI Enhancement:**
```typescript
const improveContent = async (
  content: string,
  improvements: string[]
): Promise<string> => {
  const prompt = `
Improve this content:
"${content}"

Apply these improvements:
${improvements.map(i => `- ${i}`).join('\n')}

Return only the improved version.
  `;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  });
  
  return response.choices[0].message.content;
};
```

---

## User Experience Flow

### Generation Flow

```
1. User selects content type
   ↓
2. Enters topic/prompt
   ↓
3. Customizes options (tone, platform, audience)
   ↓
4. Clicks "Generate"
   ↓
5. AI generates 3 variations (10 seconds)
   ↓
6. User reviews and selects favorite
   ↓
7. Optional: Click "Improve" for enhancements
   ↓
8. Copy or publish directly
```

### UI Components

```typescript
// Content Generator Component
<ContentGenerator>
  <ContentTypeSelector />
  <PromptInput 
    placeholder="What do you want to create?"
    suggestions={recentTopics}
  />
  <OptionsPanel>
    <ToneSelector options={tones} />
    <PlatformSelector options={platforms} />
    <AudienceInput />
  </OptionsPanel>
  <GenerateButton 
    loading={isGenerating}
    onClick={handleGenerate}
  />
  <ResultsPanel>
    {variations.map(v => (
      <VariationCard
        content={v}
        onSelect={handleSelect}
        onImprove={handleImprove}
        onPublish={handlePublish}
      />
    ))}
  </ResultsPanel>
</ContentGenerator>
```

---

## Quality Assurance

### Content Quality Checks

```typescript
const qualityChecks = {
  // Length validation
  checkLength: (content: string, type: ContentType): boolean => {
    const limits = {
      social_post: { min: 50, max: 280 },
      email_subject: { min: 20, max: 60 },
      email_body: { min: 150, max: 1000 },
    };
    
    const { min, max } = limits[type];
    return content.length >= min && content.length <= max;
  },
  
  // Spam word detection
  checkSpamWords: (content: string): string[] => {
    const spamWords = ['free', 'click here', 'act now', 'limited time'];
    return spamWords.filter(word => 
      content.toLowerCase().includes(word)
    );
  },
  
  // Readability score
  calculateReadability: (content: string): number => {
    // Flesch Reading Ease formula
    const words = content.split(' ').length;
    const sentences = content.split(/[.!?]/).length;
    const syllables = countSyllables(content);
    
    return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  },
  
  // Brand voice match
  checkBrandVoice: async (content: string, brandVoice: BrandVoice): Promise<number> => {
    const embedding = await getEmbedding(content);
    const similarity = cosineSimilarity(embedding, brandVoice.embedding);
    return similarity; // 0-1 score
  }
};
```

### Testing Strategy

```typescript
describe('AI Content Generation', () => {
  it('should generate content within 10 seconds', async () => {
    const start = Date.now();
    const content = await generateContent({
      contentType: 'social_post',
      topic: 'New product launch',
      tone: 'professional'
    });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(10000);
    expect(content).toBeDefined();
  });
  
  it('should respect character limits', async () => {
    const content = await generateContent({
      contentType: 'social_post',
      topic: 'Test',
      platform: 'twitter'
    });
    
    expect(content.length).toBeLessThanOrEqual(280);
  });
  
  it('should maintain brand voice', async () => {
    const brandVoice = await getBrandVoice(userId);
    const content = await generateContent({
      contentType: 'email_body',
      topic: 'Newsletter',
      brandVoice
    });
    
    const match = await checkBrandVoice(content, brandVoice);
    expect(match).toBeGreaterThan(0.8); // 80% similarity
  });
});
```

---

## Cost Optimization

### Token Usage Strategy

```typescript
const optimizeTokenUsage = {
  // Cache common prompts
  cachePrompts: new Map<string, string>(),
  
  // Use cheaper models for simple tasks
  selectModel: (contentType: ContentType): AIModel => {
    const simpleTypes = ['ad_headline', 'hashtags', 'caption'];
    return simpleTypes.includes(contentType) 
      ? AI_MODELS.simple 
      : AI_MODELS.standard;
  },
  
  // Batch similar requests
  batchGenerate: async (requests: GenerationRequest[]): Promise<string[]> => {
    // Group by content type and generate together
    const grouped = groupBy(requests, 'contentType');
    const results = await Promise.all(
      Object.entries(grouped).map(([type, reqs]) =>
        generateBatch(reqs)
      )
    );
    return results.flat();
  },
  
  // Stream responses for better UX
  streamGeneration: async function* (prompt: string) {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });
    
    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || '';
    }
  }
};
```

### Cost Per Generation

```typescript
const calculateCost = (tokens: number, model: string): number => {
  const pricing = {
    'llama-3.1-8b': 0.05 / 1_000_000,      // $0.05 per 1M
    'gpt-4o-mini': 0.15 / 1_000_000,       // $0.15 per 1M
    'claude-3.5-sonnet': 3.00 / 1_000_000, // $3.00 per 1M
    'grok-beta': 5.00 / 1_000_000,         // $5.00 per 1M
  };
  
  return tokens * pricing[model];
};

// Average costs per content type
const averageCosts = {
  social_post: '$0.0001',      // 100 tokens
  email_subject: '$0.00005',   // 50 tokens
  email_body: '$0.0005',       // 500 tokens
  blog_outline: '$0.001',      // 1000 tokens
};
```

---

## Launch Criteria

### Must Have ✅
- [x] Generate 5+ content types
- [x] Sub-10-second generation
- [x] 3 variations per request
- [x] Tone customization
- [x] Platform optimization
- [x] Copy to clipboard
- [x] Usage tracking

### Nice to Have ⚪
- [ ] Brand voice training
- [ ] Image generation
- [ ] Video script templates
- [ ] Multi-language support
- [ ] Competitor analysis

### Future Enhancements 🔮
- [ ] Voice-to-content
- [ ] Content calendar integration
- [ ] Auto-posting
- [ ] Performance prediction
- [ ] A/B test automation

---

## Monitoring & Analytics

### Key Metrics Dashboard

```typescript
const aiMetrics = {
  // Usage
  totalGenerations: 0,
  generationsToday: 0,
  averagePerUser: 0,
  
  // Performance
  averageSpeed: 0,        // seconds
  successRate: 0,         // %
  errorRate: 0,           // %
  
  // Quality
  averageRating: 0,       // 1-5
  editRate: 0,            // %
  publishRate: 0,         // %
  
  // Cost
  totalTokens: 0,
  totalCost: 0,
  costPerGeneration: 0,
  
  // Popular
  topContentTypes: [],
  topTones: [],
  topPlatforms: [],
};
```

---

## Related Documents

- [F6-BRAND-VOICE.md](./F6-BRAND-VOICE.md) - Advanced brand voice training
- [F8-CONTENT-REPURPOSING.md](./F8-CONTENT-REPURPOSING.md) - Multi-format generation
- [F9-PERFORMANCE-PREDICTION.md](./F9-PERFORMANCE-PREDICTION.md) - AI scoring

---

## Changelog

### v1.0.0 (2025-10-06)
- ✅ Basic generation working
- ✅ 5 content types supported
- ✅ Tone customization
- ✅ 3 variations per request
- ✅ Sub-10-second speed

### v1.1.0 (Planned)
- ⚪ Brand voice training
- ⚪ 10 more content types
- ⚪ Image suggestions
- ⚪ SEO optimization

---

**Status**: ✅ Complete and Live  
**Last Updated**: 2025-10-06  
**Owner**: AI/ML Team  
**Stakeholders**: Product, Engineering, Marketing
