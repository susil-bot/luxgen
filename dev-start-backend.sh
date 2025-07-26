#!/bin/bash

# Development Backend Service Starter
# This script starts the backend service for development

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "🚀 Starting Backend Service for Development..."

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    print_error "Backend directory not found. Please run this script from the trainer-platform root directory."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating one..."
    cat > .env << EOF
# Development Environment Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trainer_platform
DB_USER=trainer_user
DB_PASSWORD=trainer_password_2024
DATABASE_URL=postgresql://trainer_user:trainer_password_2024@localhost:5432/trainer_platform

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_2024
REDIS_URL=redis://:redis_password_2024@localhost:6379

# MongoDB Configuration
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USER=trainer_admin
MONGODB_PASSWORD=mongo_password_2024
MONGODB_DATABASE=trainer_platform
MONGODB_URL=mongodb://trainer_admin:mongo_password_2024@localhost:27017/trainer_platform?authSource=admin

# JWT Configuration
JWT_SECRET=dev_jwt_secret_key_2024_super_secure_for_development_only
JWT_REFRESH_SECRET=dev_jwt_refresh_secret_key_2024_super_secure_for_development_only

# Application Configuration
TENANT_ISOLATION_STRATEGY=database_per_tenant
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=dev_session_secret_2024

# Logging Configuration
LOG_LEVEL=debug
LOG_FILE=logs/app.log
EOF
    print_success ".env file created!"
fi

# Check if node_modules exists in backend
if [ ! -d "backend/node_modules" ]; then
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Check if database is seeded
print_status "Checking if database is seeded..."
cd backend
if ! node -e "
const { Pool } = require('pg');
const pool = new Pool();
pool.query('SELECT COUNT(*) FROM tenants').then(r => {
  if (r.rows[0].count == 0) {
    console.log('Database not seeded, running seed script...');
    require('./src/scripts/devSeedData.js');
  } else {
    console.log('Database already seeded');
  }
  pool.end();
}).catch(e => {
  console.error('Database error:', e.message);
  process.exit(1);
});
" 2>/dev/null; then
    print_status "Seeding database..."
    npm run dev:seed
fi
cd ..

# Start backend service
print_status "Starting backend service..."
cd backend

# Set environment variables
export NODE_ENV=development
export PORT=3001

# Start the service
print_success "Backend service starting on http://localhost:3001"
print_status "Press Ctrl+C to stop the service"
echo ""

npm run dev 