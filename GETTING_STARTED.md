# Getting Started with Postara

Welcome to Postara! This guide will help you get up and running quickly.

## 📋 What You'll Need

- **Docker Desktop** (recommended) OR Node.js 20+ with PostgreSQL and Redis
- **VS Code** (optional, for DevContainer support)
- **API Keys** (optional for full functionality):
  - OpenAI API key (for AI content generation)
  - SendGrid/AWS SES API key (for email sending)
  - Stripe API key (for billing)
  - Social media API credentials (for social posting)

## 🚀 Quick Start (5 minutes)

### Using Docker (Easiest)

1. **Clone and navigate to the project**
   ```bash
   git clone <your-repo-url>
   cd postara
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

   That's it! The script will:
   - Create your `.env` file
   - Start all Docker services
   - Set up the database
   - Seed initial data

3. **Access the application**
   - 🌐 Frontend: http://localhost:3000
   - 🔌 Backend API: http://localhost:3001
   - 🗄️ Database Admin: http://localhost:8080

### Manual Docker Setup

If you prefer to run commands manually:

```bash
# 1. Copy environment file
cp .env.docker .env

# 2. Start services
docker-compose up -d

# 3. Set up backend
docker-compose exec backend pnpm install
docker-compose exec backend pnpm prisma:generate
docker-compose exec backend pnpm prisma:migrate
docker-compose exec backend pnpm db:seed

# 4. Open http://localhost:3000
```

## 🔐 Default Credentials

After seeding, you can log in with:
- **Email**: admin@postara.dev
- **Password**: (Set during seed - check `backend/prisma/seed.ts`)

## 📝 Next Steps

### 1. Add Your API Keys

Edit `.env` and add your API keys:

```env
# AI Content Generation
OPENAI_API_KEY=sk-...

# Email Sending
SENDGRID_API_KEY=SG...

# Payment Processing
STRIPE_SECRET_KEY=sk_test_...

# Social Media (optional)
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
```

### 2. Explore the Features

#### Email Newsletters
1. Go to Dashboard → Email Lists
2. Create a new email list
3. Import subscribers or add manually
4. Create your first campaign
5. Schedule or send immediately

#### Social Media Scheduler
1. Go to Dashboard → Social Media
2. Connect your social accounts
3. Create a new post
4. Schedule for later or post now

#### AI Content Generator
1. Go to Dashboard → AI Content
2. Select content type (email, social, blog)
3. Enter your prompt
4. Generate and refine content
5. Save to content library

### 3. Customize Your Workspace

1. Create a workspace for your team
2. Invite team members
3. Set up roles and permissions
4. Configure billing and subscription

## 🛠️ Development Workflow

### Starting the Development Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Making Backend Changes

```bash
# Enter backend container
docker-compose exec backend sh

# Run migrations after schema changes
pnpm prisma:migrate

# View database in Prisma Studio
pnpm prisma:studio
# Opens at http://localhost:5555
```

### Making Frontend Changes

The frontend has hot reload enabled. Just edit files in `src/` and see changes instantly at http://localhost:3000

### Database Management

**Using Adminer (GUI)**
1. Open http://localhost:8080
2. Login:
   - System: PostgreSQL
   - Server: postgres
   - Username: postara
   - Password: postara_dev_password
   - Database: postara

**Using Prisma Studio**
```bash
docker-compose exec backend pnpm prisma:studio
```

**Using psql (CLI)**
```bash
docker-compose exec postgres psql -U postara -d postara
```

## 🧪 Testing Your Setup

### Test Backend API

```bash
# Health check
curl http://localhost:3001/health

# Should return: {"status":"ok"}
```

### Test Database Connection

```bash
docker-compose exec backend pnpm prisma:studio
```

### Test Redis

```bash
docker-compose exec redis redis-cli ping
# Should return: PONG
```

## 📚 Learn More

- **[Backend Roadmap](./BACKEND_ROADMAP.md)** - Full development plan
- **[Docker Setup](./DOCKER_SETUP.md)** - Detailed Docker guide
- **[README](./README.md)** - Complete project documentation

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3001

# Change port in .env
BACKEND_PORT=3002
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### "Module not found" Errors

```bash
# Reinstall dependencies
docker-compose exec backend pnpm install

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

### Reset Everything

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Start fresh
./scripts/setup.sh
```

## 💡 Tips

1. **Use DevContainer**: Open in VS Code and select "Reopen in Container" for the best development experience

2. **Enable Development Tools**: 
   ```bash
   docker-compose --profile tools up -d
   ```
   This starts Adminer and Redis Commander

3. **Watch Logs**: Keep a terminal open with `docker-compose logs -f` to see real-time logs

4. **Prisma Studio**: Great for viewing and editing database records during development

5. **Hot Reload**: Both frontend and backend support hot reload - no need to restart!

## 🎯 Your First Task

Try creating a complete workflow:

1. **Create an email list** with a few test subscribers
2. **Generate email content** using AI
3. **Create a campaign** with the AI-generated content
4. **Schedule a social media post** to promote the campaign
5. **View analytics** for both email and social media

## 🆘 Need Help?

- Check the [Docker Setup Guide](./DOCKER_SETUP.md) for detailed instructions
- Review the [Backend Roadmap](./BACKEND_ROADMAP.md) for architecture details
- Open an issue on GitHub
- Check Docker logs: `docker-compose logs -f`

---

**Happy coding! 🚀**
