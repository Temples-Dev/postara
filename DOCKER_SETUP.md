# Docker Setup Guide for Postara

This guide will help you set up the Postara development environment using Docker and DevContainers.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- VS Code with Remote - Containers extension (for DevContainer support)
- Git

## Quick Start

### Option 1: Using Docker Compose (Recommended for Development)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd postara
   ```

2. **Copy environment variables**
   ```bash
   cp .env.docker .env
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Install backend dependencies and run migrations**
   ```bash
   # Enter the backend container
   docker-compose exec backend sh

   # Inside the container
   pnpm install
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm db:seed
   ```

5. **Access the services**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379
   - Adminer (DB Admin): http://localhost:8080
   - Redis Commander: http://localhost:8081

### Option 2: Using DevContainer (VS Code)

1. **Open in VS Code**
   ```bash
   code .
   ```

2. **Reopen in Container**
   - Press `F1` or `Ctrl+Shift+P`
   - Select "Dev Containers: Reopen in Container"
   - Wait for the container to build and start

3. **Run setup commands**
   ```bash
   cd backend
   pnpm install
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm db:seed
   pnpm run start:dev
   ```

## Docker Services

### Core Services

#### PostgreSQL Database
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Default Credentials**:
  - User: `postara`
  - Password: `postara_dev_password`
  - Database: `postara`

#### Redis Cache
- **Image**: redis:7-alpine
- **Port**: 6379
- **Default Password**: `postara_redis_password`

#### Backend (NestJS)
- **Port**: 3001
- **Hot Reload**: Enabled in development mode
- **Debugger Port**: 9229

#### Frontend (Next.js)
- **Port**: 3000
- **Profile**: `full-stack` (optional)

### Development Tools

#### Adminer (Database Management)
- **Port**: 8080
- **Profile**: `tools`
- Access at: http://localhost:8080
- Login with PostgreSQL credentials

#### Redis Commander
- **Port**: 8081
- **Profile**: `tools`
- Access at: http://localhost:8081

## Docker Compose Commands

### Start Services

```bash
# Start all core services (backend, postgres, redis)
docker-compose up -d

# Start with frontend included
docker-compose --profile full-stack up -d

# Start with development tools (Adminer, Redis Commander)
docker-compose --profile tools up -d

# Start everything
docker-compose --profile full-stack --profile tools up -d
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes all data)
docker-compose down -v
```

### View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Execute Commands in Containers

```bash
# Enter backend container
docker-compose exec backend sh

# Run Prisma commands
docker-compose exec backend pnpm prisma:studio
docker-compose exec backend pnpm prisma:migrate

# Enter PostgreSQL
docker-compose exec postgres psql -U postara -d postara
```

## Environment Variables

### Required Variables

Copy `.env.docker` to `.env` and update the following:

```env
# Database
DATABASE_URL=postgresql://postara:postara_dev_password@postgres:5432/postara?schema=public

# Redis
REDIS_URL=redis://:postara_redis_password@redis:6379

# Application
NODE_ENV=development
BACKEND_PORT=3001
FRONTEND_PORT=3000
```

### Optional API Keys (for full functionality)

```env
# Email Service
SENDGRID_API_KEY=your_key_here

# AI Service
OPENAI_API_KEY=your_key_here

# Social Media
TWITTER_CLIENT_ID=your_id_here
TWITTER_CLIENT_SECRET=your_secret_here
# ... (add others as needed)

# Payment
STRIPE_SECRET_KEY=your_key_here
```

## Database Management

### Prisma Commands

```bash
# Generate Prisma Client
docker-compose exec backend pnpm prisma:generate

# Create a new migration
docker-compose exec backend pnpm prisma:migrate

# Apply migrations (production)
docker-compose exec backend pnpm prisma:migrate:prod

# Seed the database
docker-compose exec backend pnpm db:seed

# Open Prisma Studio
docker-compose exec backend pnpm prisma:studio
# Access at: http://localhost:5555
```

### Direct Database Access

```bash
# Using psql
docker-compose exec postgres psql -U postara -d postara

# Using Adminer (GUI)
# 1. Start with tools profile: docker-compose --profile tools up -d
# 2. Open http://localhost:8080
# 3. Login with:
#    - System: PostgreSQL
#    - Server: postgres
#    - Username: postara
#    - Password: postara_dev_password
#    - Database: postara
```

## Troubleshooting

### Port Already in Use

If you get port conflicts:

```bash
# Check what's using the port
lsof -i :3001  # or :5432, :6379, etc.

# Change the port in .env
BACKEND_PORT=3002
```

### Container Won't Start

```bash
# Check container logs
docker-compose logs backend

# Rebuild the container
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Database Connection Issues

```bash
# Check if PostgreSQL is healthy
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check PostgreSQL logs
docker-compose logs postgres
```

### Reset Everything

```bash
# Stop all containers and remove volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

## Production Deployment

### Build Production Images

```bash
# Build backend for production
cd backend
docker build -t postara-backend:latest --target production .

# Build frontend for production
cd ..
docker build -f Dockerfile.frontend -t postara-frontend:latest --target production .
```

### Production Environment Variables

Update your production `.env` with:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@your-db-host:5432/postara
REDIS_URL=redis://your-redis-host:6379
# Add all production API keys
```

### Run Production Containers

```bash
# Using docker-compose
NODE_ENV=production docker-compose up -d

# Or run individually
docker run -d \
  --name postara-backend \
  -p 3001:3001 \
  --env-file .env.production \
  postara-backend:latest
```

## Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Backend health endpoint
curl http://localhost:3001/health

# PostgreSQL health
docker-compose exec postgres pg_isready -U postara

# Redis health
docker-compose exec redis redis-cli ping
```

## Performance Optimization

### Development

- Use volume mounts for hot reload
- Limit container resources if needed:
  ```yaml
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
  ```

### Production

- Use multi-stage builds (already configured)
- Enable production optimizations in Next.js
- Use connection pooling for database
- Configure Redis for persistence

## Security Notes

### Development

- Default passwords are for development only
- Never commit `.env` files
- Use `.env.example` as a template

### Production

- Use strong, unique passwords
- Enable SSL/TLS for all connections
- Use secrets management (AWS Secrets Manager, HashiCorp Vault)
- Run containers as non-root users (already configured)
- Keep images updated

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [VS Code DevContainers](https://code.visualstudio.com/docs/devcontainers/containers)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Documentation](https://docs.nestjs.com/)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Docker logs
3. Consult the main README.md
4. Open an issue on GitHub
