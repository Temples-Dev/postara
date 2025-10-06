# Postara

**Marketing Automation Platform** - Combining Email Newsletters, Social Media Scheduling, and AI Content Generation

## 🚀 Overview

Postara is an all-in-one marketing automation platform designed for small businesses, creators, and agencies. It combines three powerful tools into one integrated solution:

1. **📧 Email Newsletter Tool** - Create, manage, and send beautiful email campaigns
2. **📱 Social Media Scheduler** - Schedule and publish posts across multiple platforms
3. **🤖 AI Content Generator** - Generate high-quality content using AI

## ✨ Features

### Email Newsletters
- Subscriber management with segmentation
- Drag-and-drop email editor
- Campaign scheduling and automation
- A/B testing
- Analytics and reporting
- Double opt-in support

### Social Media Scheduler
- Multi-platform support (Twitter, Facebook, Instagram, LinkedIn)
- Bulk scheduling
- Media upload and management
- Calendar view
- Post recycling
- Engagement analytics

### AI Content Generation
- Email subject lines and body content
- Social media posts
- Blog post outlines
- Content repurposing
- Multi-language support
- Customizable tone and style

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Authentication**: Better Auth
- **State Management**: React Context
- **Forms**: React Hook Form + Zod

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Cache/Queue**: Redis 7
- **API Documentation**: OpenAPI/Swagger

### DevOps
- **Containerization**: Docker
- **Development**: DevContainers
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 20+
- pnpm 10+
- Docker & Docker Compose (for containerized development)
- PostgreSQL 16+ (if running locally)
- Redis 7+ (if running locally)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd postara
   ```

2. **Set up environment variables**
   ```bash
   cp .env.docker .env
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Set up the database**
   ```bash
   docker-compose exec backend pnpm install
   docker-compose exec backend pnpm prisma:generate
   docker-compose exec backend pnpm prisma:migrate
   docker-compose exec backend pnpm db:seed
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Adminer (DB): http://localhost:8080

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed Docker instructions.

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

4. **Set up database**
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm db:seed
   ```

5. **Start development server**
   ```bash
   pnpm run start:dev
   ```

#### Frontend Setup

1. **Navigate to root directory**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   ```

## 📚 Documentation

- [Backend Roadmap](./BACKEND_ROADMAP.md) - Comprehensive development roadmap
- [Docker Setup](./DOCKER_SETUP.md) - Docker and DevContainer guide
- [Core Features](./CORE_FEATURE.md) - Feature specifications and pricing

## 🏗️ Project Structure

```
postara/
├── backend/                 # NestJS backend
│   ├── prisma/             # Database schema and migrations
│   ├── src/                # Source code
│   ├── test/               # Tests
│   └── Dockerfile          # Backend Docker configuration
├── src/                    # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and helpers
│   └── styles/             # Global styles
├── .devcontainer/          # VS Code DevContainer config
├── docker-compose.yml      # Docker Compose configuration
└── Dockerfile.frontend     # Frontend Docker configuration
```

## 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/postara
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_key
SENDGRID_API_KEY=your_key
STRIPE_SECRET_KEY=your_key
# See backend/.env.example for complete list
```

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
# See .env.example for complete list
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

### Frontend Tests

```bash
# Run tests (when configured)
pnpm test
```

## 📦 Building for Production

### Backend

```bash
cd backend
pnpm run build
pnpm run start:prod
```

### Frontend

```bash
pnpm run build
pnpm run start
```

### Docker Production Build

```bash
# Backend
docker build -t postara-backend:latest --target production ./backend

# Frontend
docker build -f Dockerfile.frontend -t postara-frontend:latest --target production .
```

## 🗺️ Development Roadmap

See [BACKEND_ROADMAP.md](./BACKEND_ROADMAP.md) for the complete development roadmap including:

- Phase 1: Foundation & Infrastructure (Weeks 1-2)
- Phase 2: Email Newsletter System (Weeks 3-5)
- Phase 3: Social Media Scheduler (Weeks 6-8)
- Phase 4: AI Content Generator (Weeks 9-11)
- Phase 5: Subscription & Billing (Weeks 12-13)
- Phase 6: Advanced Features (Weeks 14-16)
- Phase 7: Performance & Optimization (Weeks 17-18)
- Phase 8: Testing & Documentation (Weeks 19-20)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Check the [Docker Setup Guide](./DOCKER_SETUP.md)
- Review the [Backend Roadmap](./BACKEND_ROADMAP.md)
- Open an issue on GitHub

## 🎯 Pricing Strategy

- **Starter**: $79/month - Up to 1,000 subscribers
- **Professional**: $129/month - Up to 10,000 subscribers
- **Enterprise**: $199/month - Unlimited subscribers

**Revenue Goal**: 4-12 customers to hit $24/day target

---

Built with ❤️ for marketers, creators, and agencies
