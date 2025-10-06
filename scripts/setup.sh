#!/bin/bash

# Postara Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Postara Development Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.docker...${NC}"
    cp .env.docker .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and add your API keys${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

echo ""
echo "Starting Docker services..."
docker-compose up -d

echo ""
echo "Waiting for services to be healthy..."
sleep 10

echo ""
echo "Installing backend dependencies..."
docker-compose exec -T backend pnpm install

echo ""
echo "Generating Prisma client..."
docker-compose exec -T backend pnpm prisma:generate

echo ""
echo "Running database migrations..."
docker-compose exec -T backend pnpm prisma:migrate

echo ""
echo "Seeding database..."
docker-compose exec -T backend pnpm db:seed

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Services are running at:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:3001"
echo "  - Adminer (DB): http://localhost:8080"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to add your API keys to .env:${NC}"
echo "  - OPENAI_API_KEY"
echo "  - SENDGRID_API_KEY"
echo "  - STRIPE_SECRET_KEY"
echo "  - Social media API credentials"
