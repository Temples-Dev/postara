# F6: Brand Voice Training

**Priority**: 🟡 High  
**Status**: ⚪ Planned  
**Phase**: 2 - Intelligence  
**Timeline**: 3 weeks  
**Dependencies**: F2 (AI Content Generation)

---

## Problem Statement

Generic AI content sounds robotic and doesn't match a brand's unique personality. Every business has a distinct voice - whether professional, casual, witty, or authoritative - but current AI tools can't capture this nuance. This results in:

- **Content that feels "off-brand"** - Requires heavy editing
- **Inconsistent messaging** - Different tone across channels
- **Loss of brand identity** - Sounds like everyone else
- **Customer confusion** - Doesn't match previous communications

### The Gap in Current Solutions

**ChatGPT/Generic AI:**
- No memory of your brand
- Requires detailed prompts every time
- Can't maintain consistency
- Forgets context between sessions

**Jasper Brand Voice:**
- Limited to text examples
- No learning over time
- Basic tone matching only
- Expensive ($125/mo for this feature)

---

## User Stories

### As a Brand Manager
> "I want AI to write content that sounds exactly like our brand guidelines, so I don't have to edit every piece."

**Acceptance Criteria:**
- ✅ Upload brand guidelines and examples
- ✅ AI learns and maintains voice
- ✅ 90%+ brand voice match score
- ✅ Consistent across all content types

### As a Solopreneur
> "I want AI to sound like me - my personality, my humor, my way of speaking - not some generic corporate robot."

**Acceptance Criteria:**
- ✅ Analyze my past content (emails, posts, blogs)
- ✅ Extract my unique writing patterns
- ✅ Generate content that sounds authentically me
- ✅ Improve accuracy over time

### As a Marketing Agency
> "I manage 20 clients, each with a different brand voice. I need AI to switch between them seamlessly."

**Acceptance Criteria:**
- ✅ Multiple brand voice profiles
- ✅ Quick switching between clients
- ✅ No cross-contamination
- ✅ Client-specific vocabulary and style

---

## Success Metrics

### Primary Metrics
- **Brand Voice Match Score**: >90% similarity
- **Edit Rate**: <15% (down from 30%)
- **User Satisfaction**: >4.5/5.0 rating
- **Adoption Rate**: >70% of users train voice

### Secondary Metrics
- **Training Completion**: >80% complete setup
- **Time to Train**: <10 minutes
- **Content Consistency**: 95% same-voice detection
- **Retention Impact**: +25% for voice users

### Business Impact
- **Conversion**: Voice users convert 2x higher
- **Upgrade Trigger**: #1 reason for Pro plan
- **Competitive Moat**: Unique differentiator
- **Word of Mouth**: Most-shared feature

---

## Technical Specification

### Architecture Overview

```typescript
interface BrandVoiceSystem {
  // Training Pipeline
  analyzer: ContentAnalyzer;      // Extract patterns
  embedder: VectorEmbedder;       // Create embeddings
  trainer: ModelTrainer;          // Fine-tune model
  validator: QualityValidator;    // Verify accuracy
  
  // Generation Pipeline
  retriever: ExampleRetriever;    // Find similar examples
  generator: ContentGenerator;    // Generate with voice
  scorer: SimilarityScorer;       // Measure match
  improver: VoiceImprover;        // Refine output
}
```

### Database Schema

```prisma
model BrandVoice {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  
  // Basic Info
  name          String   // "Postara Brand Voice"
  description   String?
  isActive      Boolean  @default(true)
  
  // Voice Characteristics
  tone          String[] // ["professional", "friendly", "witty"]
  formality     Int      // 1-10 scale
  humor         Int      // 1-10 scale
  emotion       Int      // 1-10 scale
  complexity    Int      // 1-10 scale (reading level)
  
  // Vocabulary
  preferredWords    String[]
  avoidWords        String[]
  brandTerms        String[] // Company-specific jargon
  
  // Style Patterns
  sentenceLength    Json     // { avg: 15, range: [10, 25] }
  paragraphLength   Json     // { avg: 3, range: [2, 5] }
  punctuationStyle  Json     // Exclamation, emoji usage, etc.
  
  // Training Data
  examples          TrainingExample[]
  totalExamples     Int      @default(0)
  
  // AI Model
  embedding         Json?    // Vector representation
  fineTunedModelId  String?  // Custom model ID
  trained           Boolean  @default(false)
  accuracy          Float?   // 0-1 score
  
  // Metadata
  lastTrainedAt     DateTime?
  trainingDuration  Int?     // seconds
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([userId, name])
  @@index([userId, isActive])
  @@map("brand_voices")
}

model TrainingExample {
  id              String     @id @default(cuid())
  brandVoiceId    String
  brandVoice      BrandVoice @relation(fields: [brandVoiceId], references: [id], onDelete: Cascade)
  
  // Content
  content         String
  contentType     String     // email, social, blog, etc.
  platform        String?    // twitter, linkedin, etc.
  
  // Analysis
  embedding       Json?      // Vector representation
  characteristics Json       // Extracted features
  
  // Quality
  isApproved      Boolean    @default(true)
  quality         Int?       // 1-5 rating
  
  createdAt       DateTime   @default(now())
  
  @@index([brandVoiceId])
  @@map("training_examples")
}

model VoiceGeneration {
  id              String   @id @default(cuid())
  userId          String
  brandVoiceId    String?
  
  // Generation
  prompt          String
  content         String
  
  // Voice Matching
  voiceScore      Float    // 0-1 similarity
  characteristics Json     // Detected features
  
  // Feedback
  userRating      Int?     // 1-5 stars
  wasEdited       Boolean  @default(false)
  editDistance    Int?     // Levenshtein distance
  
  createdAt       DateTime @default(now())
  
  @@index([userId, brandVoiceId])
  @@map("voice_generations")
}
```

### API Endpoints

```typescript
// Brand Voice Management
POST   /api/brand-voice                    - Create new voice
GET    /api/brand-voice                    - List all voices
GET    /api/brand-voice/:id                - Get specific voice
PATCH  /api/brand-voice/:id                - Update voice
DELETE /api/brand-voice/:id                - Delete voice
POST   /api/brand-voice/:id/activate       - Set as active

// Training
POST   /api/brand-voice/:id/train          - Start training
POST   /api/brand-voice/:id/examples       - Add training examples
POST   /api/brand-voice/:id/analyze-url    - Analyze website/blog
POST   /api/brand-voice/:id/analyze-file   - Upload content files
GET    /api/brand-voice/:id/progress       - Training progress

// Analysis
POST   /api/brand-voice/analyze            - Analyze content for voice
POST   /api/brand-voice/compare            - Compare two pieces
GET    /api/brand-voice/:id/insights       - Voice characteristics

// Generation
POST   /api/ai/generate-with-voice         - Generate with voice
POST   /api/ai/improve-voice-match         - Improve voice match
```

---

## Implementation Details

### Phase 6.1: Voice Analysis (Week 1)

**Content Analysis Engine:**

```typescript
class ContentAnalyzer {
  async analyzeContent(content: string): Promise<VoiceCharacteristics> {
    return {
      // Tone Detection
      tone: await this.detectTone(content),
      formality: this.calculateFormality(content),
      emotion: this.detectEmotion(content),
      
      // Style Metrics
      avgSentenceLength: this.calculateAvgSentenceLength(content),
      avgWordLength: this.calculateAvgWordLength(content),
      readingLevel: this.calculateReadingLevel(content),
      
      // Vocabulary
      uniqueWords: this.extractUniqueWords(content),
      commonPhrases: this.extractCommonPhrases(content),
      technicalTerms: this.extractTechnicalTerms(content),
      
      // Patterns
      punctuationStyle: this.analyzePunctuation(content),
      emojiUsage: this.analyzeEmojis(content),
      questionFrequency: this.countQuestions(content),
      
      // Structure
      paragraphStructure: this.analyzeParagraphs(content),
      listUsage: this.detectLists(content),
      headingStyle: this.analyzeHeadings(content),
    };
  }
  
  private detectTone(content: string): string[] {
    const toneIndicators = {
      professional: ['furthermore', 'therefore', 'consequently'],
      casual: ['hey', 'cool', 'awesome', 'totally'],
      friendly: ['thanks', 'appreciate', 'glad', 'happy'],
      authoritative: ['must', 'should', 'required', 'essential'],
      witty: ['😄', 'lol', 'haha', 'joke'],
      urgent: ['now', 'immediately', 'asap', 'hurry'],
    };
    
    const tones: string[] = [];
    const lowerContent = content.toLowerCase();
    
    for (const [tone, indicators] of Object.entries(toneIndicators)) {
      const matches = indicators.filter(word => lowerContent.includes(word));
      if (matches.length > 2) tones.push(tone);
    }
    
    return tones;
  }
  
  private calculateFormality(content: string): number {
    const formalIndicators = [
      /\b(therefore|furthermore|consequently|moreover)\b/gi,
      /\b(utilize|implement|facilitate|endeavor)\b/gi,
    ];
    
    const casualIndicators = [
      /\b(hey|cool|awesome|gonna|wanna)\b/gi,
      /[!]{2,}/g, // Multiple exclamations
      /😀|😊|👍/g, // Emojis
    ];
    
    const formalScore = formalIndicators.reduce(
      (score, pattern) => score + (content.match(pattern)?.length || 0),
      0
    );
    
    const casualScore = casualIndicators.reduce(
      (score, pattern) => score + (content.match(pattern)?.length || 0),
      0
    );
    
    // Scale 1-10 (1=very casual, 10=very formal)
    return Math.min(10, Math.max(1, 5 + formalScore - casualScore));
  }
}
```

### Phase 6.2: Vector Embeddings (Week 2)

**Embedding Generation:**

```typescript
class VectorEmbedder {
  private openai: OpenAI;
  
  async createEmbedding(content: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: content,
      dimensions: 1536, // High-dimensional for accuracy
    });
    
    return response.data[0].embedding;
  }
  
  async createBrandVoiceEmbedding(
    examples: TrainingExample[]
  ): Promise<number[]> {
    // Create embeddings for all examples
    const embeddings = await Promise.all(
      examples.map(ex => this.createEmbedding(ex.content))
    );
    
    // Average embeddings to create brand voice vector
    return this.averageVectors(embeddings);
  }
  
  calculateSimilarity(vec1: number[], vec2: number[]): number {
    // Cosine similarity
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (mag1 * mag2);
  }
  
  private averageVectors(vectors: number[][]): number[] {
    const dimensions = vectors[0].length;
    const avgVector = new Array(dimensions).fill(0);
    
    for (const vector of vectors) {
      for (let i = 0; i < dimensions; i++) {
        avgVector[i] += vector[i];
      }
    }
    
    return avgVector.map(val => val / vectors.length);
  }
}
```

### Phase 6.3: Voice-Guided Generation (Week 3)

**Generation with Brand Voice:**

```typescript
class VoiceGuidedGenerator {
  async generateWithVoice(
    prompt: string,
    brandVoice: BrandVoice
  ): Promise<string> {
    // 1. Retrieve similar examples
    const examples = await this.retrieveSimilarExamples(prompt, brandVoice);
    
    // 2. Build enhanced prompt
    const enhancedPrompt = this.buildVoicePrompt(prompt, brandVoice, examples);
    
    // 3. Generate content
    const content = await this.generate(enhancedPrompt);
    
    // 4. Validate voice match
    const score = await this.scoreVoiceMatch(content, brandVoice);
    
    // 5. Improve if needed
    if (score < 0.85) {
      return await this.improveVoiceMatch(content, brandVoice);
    }
    
    return content;
  }
  
  private buildVoicePrompt(
    prompt: string,
    voice: BrandVoice,
    examples: TrainingExample[]
  ): string {
    return `
You are writing content for ${voice.name}.

Brand Voice Characteristics:
- Tone: ${voice.tone.join(', ')}
- Formality Level: ${voice.formality}/10
- Preferred Words: ${voice.preferredWords.join(', ')}
- Avoid: ${voice.avoidWords.join(', ')}

Examples of this brand's voice:
${examples.map((ex, i) => `
Example ${i + 1}:
${ex.content}
`).join('\n')}

Now write content about: ${prompt}

Match the exact tone, style, and vocabulary from the examples above.
    `.trim();
  }
  
  private async scoreVoiceMatch(
    content: string,
    voice: BrandVoice
  ): Promise<number> {
    // Create embedding for generated content
    const contentEmbedding = await this.embedder.createEmbedding(content);
    
    // Compare with brand voice embedding
    const similarity = this.embedder.calculateSimilarity(
      contentEmbedding,
      voice.embedding
    );
    
    // Also check characteristics match
    const characteristics = await this.analyzer.analyzeContent(content);
    const charScore = this.compareCharacteristics(characteristics, voice);
    
    // Weighted average
    return similarity * 0.7 + charScore * 0.3;
  }
  
  private async improveVoiceMatch(
    content: string,
    voice: BrandVoice
  ): Promise<string> {
    const improvements = await this.identifyImprovements(content, voice);
    
    const improvePrompt = `
Rewrite this content to better match the brand voice:

Original:
${content}

Brand Voice Requirements:
${improvements.map(i => `- ${i}`).join('\n')}

Rewrite maintaining the same message but matching the voice exactly.
    `;
    
    return await this.generate(improvePrompt);
  }
}
```

---

## Training Workflow

### User Experience Flow

```
1. Create Brand Voice Profile
   ↓
2. Choose Training Method:
   a) Upload past content (emails, posts, blogs)
   b) Connect social media accounts
   c) Analyze website/blog
   d) Manual examples
   ↓
3. AI Analyzes Content (2-3 minutes)
   - Extracts tone, style, vocabulary
   - Creates vector embeddings
   - Identifies patterns
   ↓
4. Review Voice Profile
   - See detected characteristics
   - Adjust if needed
   - Add preferred/avoided words
   ↓
5. Test Generation
   - Generate sample content
   - Rate voice match
   - Provide feedback
   ↓
6. Activate Voice
   - Set as default for all content
   - AI uses voice automatically
```

### Training Data Sources

```typescript
interface TrainingSource {
  type: 'upload' | 'url' | 'social' | 'manual';
  data: any;
}

const trainingMethods = {
  // Upload files
  upload: async (files: File[]): Promise<TrainingExample[]> => {
    const examples: TrainingExample[] = [];
    
    for (const file of files) {
      const content = await file.text();
      const chunks = this.splitIntoChunks(content, 500); // 500 words each
      
      examples.push(...chunks.map(chunk => ({
        content: chunk,
        contentType: this.detectType(chunk),
        source: 'upload',
      })));
    }
    
    return examples;
  },
  
  // Scrape website
  url: async (url: string): Promise<TrainingExample[]> => {
    const pages = await this.scrapeWebsite(url, maxPages: 20);
    
    return pages.map(page => ({
      content: page.text,
      contentType: 'blog',
      platform: 'website',
      source: 'url',
    }));
  },
  
  // Connect social media
  social: async (platform: string, token: string): Promise<TrainingExample[]> => {
    const posts = await this.fetchSocialPosts(platform, token, limit: 100);
    
    return posts.map(post => ({
      content: post.text,
      contentType: 'social',
      platform,
      source: 'social',
    }));
  },
  
  // Manual entry
  manual: (examples: string[]): TrainingExample[] => {
    return examples.map(content => ({
      content,
      contentType: 'manual',
      source: 'manual',
    }));
  },
};
```

---

## Quality Assurance

### Voice Match Scoring

```typescript
class VoiceQualityValidator {
  async validateVoiceMatch(
    content: string,
    brandVoice: BrandVoice
  ): Promise<VoiceMatchReport> {
    const scores = {
      // Embedding similarity (70% weight)
      embeddingSimilarity: await this.scoreEmbedding(content, brandVoice),
      
      // Characteristic match (30% weight)
      toneMatch: this.scoreTone(content, brandVoice),
      formalityMatch: this.scoreFormality(content, brandVoice),
      vocabularyMatch: this.scoreVocabulary(content, brandVoice),
      styleMatch: this.scoreStyle(content, brandVoice),
    };
    
    const overallScore = 
      scores.embeddingSimilarity * 0.7 +
      (scores.toneMatch + scores.formalityMatch + 
       scores.vocabularyMatch + scores.styleMatch) / 4 * 0.3;
    
    return {
      overallScore,
      breakdown: scores,
      passed: overallScore >= 0.85,
      suggestions: this.generateSuggestions(scores, brandVoice),
    };
  }
  
  private generateSuggestions(
    scores: any,
    voice: BrandVoice
  ): string[] {
    const suggestions: string[] = [];
    
    if (scores.toneMatch < 0.8) {
      suggestions.push(`Adjust tone to be more ${voice.tone.join(' and ')}`);
    }
    
    if (scores.formalityMatch < 0.8) {
      const target = voice.formality > 5 ? 'formal' : 'casual';
      suggestions.push(`Make language more ${target}`);
    }
    
    if (scores.vocabularyMatch < 0.8) {
      suggestions.push(`Use more brand-specific terms: ${voice.brandTerms.slice(0, 3).join(', ')}`);
    }
    
    return suggestions;
  }
}
```

---

## Launch Criteria

### Must Have ✅
- ⚪ Upload training content (files, URLs)
- ⚪ Analyze and extract voice characteristics
- ⚪ Generate content with voice
- ⚪ Voice match scoring (>85%)
- ⚪ Multiple voice profiles per user
- ⚪ Voice switching

### Nice to Have ⚪
- ⚪ Social media integration
- ⚪ Real-time voice feedback
- ⚪ Voice evolution over time
- ⚪ A/B test different voices

### Future Enhancements 🔮
- ⚪ Voice cloning from audio
- ⚪ Multi-language voices
- ⚪ Industry-specific voices
- ⚪ Voice marketplace

---

## Success Stories (Projected)

### Case Study 1: E-commerce Brand
**Before:**
- 40% of AI content required heavy editing
- Inconsistent tone across channels
- 2 hours editing per day

**After:**
- 95% brand voice match
- 10% edit rate
- 30 minutes editing per day
- **Saved 1.5 hours/day = $15K/year**

### Case Study 2: Marketing Agency
**Before:**
- Manual switching between 15 client voices
- Frequent brand guideline violations
- Client complaints about inconsistency

**After:**
- One-click voice switching
- 92% average voice match
- Zero brand violations
- **Increased client satisfaction by 40%**

---

## Related Documents

- [F2-AI-CONTENT.md](./F2-AI-CONTENT.md) - Base content generation
- [F8-CONTENT-REPURPOSING.md](./F8-CONTENT-REPURPOSING.md) - Voice across formats
- [F19-CUSTOM-AI-MODELS.md](./F19-CUSTOM-AI-MODELS.md) - Advanced training

---

**Status**: ⚪ Planned for Month 4  
**Last Updated**: 2025-10-06  
**Owner**: AI/ML Team  
**Stakeholders**: Product, Engineering, Design
