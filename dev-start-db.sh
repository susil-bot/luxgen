#!/bin/bash

# Development Database Services Starter
# This script starts only the database services for development

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

echo "🐘 Starting Database Services for Development..."

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Start database services
print_status "Starting PostgreSQL, Redis, and MongoDB..."
docker-compose up -d postgres redis mongodb

# Wait for services to be ready
print_status "Waiting for services to be ready..."

# Wait for PostgreSQL
until docker-compose exec -T postgres pg_isready -U trainer_user -d trainer_platform > /dev/null 2>&1; do
    print_status "Waiting for PostgreSQL..."
    sleep 2
done
print_success "PostgreSQL is ready!"

# Wait for Redis
until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
    print_status "Waiting for Redis..."
    sleep 2
done
print_success "Redis is ready!"

# Wait for MongoDB
until docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
    print_status "Waiting for MongoDB..."
    sleep 2
done
print_success "MongoDB is ready!"

echo ""
echo "=========================================="
echo "✅ Database Services Started Successfully!"
echo "=========================================="
echo ""
echo "📊 Services:"
echo "   PostgreSQL: localhost:5432"
echo "   Redis: localhost:6379"
echo "   MongoDB: localhost:27017"
echo ""
echo "🔧 Management Tools:"
echo "   pgAdmin: http://localhost:5050 (admin@trainer.com / pgadmin_password_2024)"
echo "   Redis Commander: http://localhost:8081"
echo ""
echo "📋 Useful Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Seed database: cd backend && npm run dev:seed"
echo ""
echo "==========================================" 