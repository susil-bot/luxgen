#!/bin/bash

# Development Setup Script for Trainer Platform
# This script sets up the development environment with demo data

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for service to be ready
wait_for_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service to be ready on port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z localhost $port 2>/dev/null; then
            print_success "$service is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - $service not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service failed to start within expected time"
    return 1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists docker; then
        missing_deps+=("docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_deps+=("docker-compose")
    fi
    
    if ! command_exists node; then
        missing_deps+=("node")
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_success "All prerequisites are installed!"
}

# Function to create environment file
create_env_file() {
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
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

# Email Configuration (for development)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=dev_user
EMAIL_PASS=dev_password
EMAIL_FROM=noreply@trainer.com

# Logging Configuration
LOG_LEVEL=debug
LOG_FILE=logs/app.log

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
EOF
        print_success ".env file created!"
    else
        print_warning ".env file already exists, skipping creation"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        print_status "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
    fi
    
    # Install frontend dependencies
    if [ -d "src" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    print_success "Dependencies installed!"
}

# Function to start database services
start_database_services() {
    print_status "Starting database services..."
    
    # Stop any existing containers
    docker-compose down 2>/dev/null || true
    
    # Start only database services
    docker-compose up -d postgres redis mongodb
    
    # Wait for services to be ready
    wait_for_service "PostgreSQL" 5432
    wait_for_service "Redis" 6379
    wait_for_service "MongoDB" 27017
    
    print_success "Database services started successfully!"
}

# Function to seed database
seed_database() {
    print_status "Seeding database with demo data..."
    
    # Wait a bit more for database to be fully ready
    sleep 5
    
    # Run the development seed script
    cd backend
    node src/scripts/devSeedData.js
    cd ..
    
    print_success "Database seeded successfully!"
}

# Function to start backend service
start_backend() {
    print_status "Starting backend service..."
    
    cd backend
    
    # Set environment variables for development
    export NODE_ENV=development
    export PORT=3001
    
    # Start backend in development mode
    npm run dev &
    BACKEND_PID=$!
    
    cd ..
    
    # Wait for backend to be ready
    wait_for_service "Backend" 3001
    
    print_success "Backend service started successfully!"
}

# Function to start frontend service
start_frontend() {
    print_status "Starting frontend service..."
    
    # Set environment variables for development
    export REACT_APP_API_URL=http://localhost:3001/api
    export REACT_APP_WS_URL=ws://localhost:3001
    
    # Start frontend in development mode
    npm start &
    FRONTEND_PID=$!
    
    # Wait for frontend to be ready
    wait_for_service "Frontend" 3000
    
    print_success "Frontend service started successfully!"
}

# Function to start monitoring services
start_monitoring_services() {
    print_status "Starting monitoring services..."
    
    # Start pgAdmin and Redis Commander
    docker-compose up -d pgadmin redis-commander
    
    print_success "Monitoring services started!"
}

# Function to display service information
display_service_info() {
    echo ""
    echo "=========================================="
    echo "🚀 Trainer Platform Development Environment"
    echo "=========================================="
    echo ""
    echo "📊 Services Status:"
    echo "   ✅ PostgreSQL: http://localhost:5432"
    echo "   ✅ Redis: http://localhost:6379"
    echo "   ✅ MongoDB: http://localhost:27017"
    echo "   ✅ Backend API: http://localhost:3001"
    echo "   ✅ Frontend: http://localhost:3000"
    echo "   ✅ pgAdmin: http://localhost:5050"
    echo "   ✅ Redis Commander: http://localhost:8081"
    echo ""
    echo "🔐 Demo Credentials:"
    echo "   Super Admin: superadmin@trainer.com / password123"
    echo "   Admin: admin@trainer.com / password123"
    echo "   Trainer: trainer@trainer.com / password123"
    echo "   User: user@trainer.com / password123"
    echo ""
    echo "📋 Useful Commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Restart backend: kill $BACKEND_PID && cd backend && npm run dev &"
    echo "   Restart frontend: kill $FRONTEND_PID && npm start &"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Login with any of the demo credentials above"
    echo "   3. Explore the application features"
    echo ""
    echo "=========================================="
}

# Function to handle cleanup on script exit
cleanup() {
    print_status "Cleaning up..."
    
    # Kill background processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    print_success "Cleanup completed!"
}

# Set up trap to handle script exit
trap cleanup EXIT

# Main execution
main() {
    echo "🚀 Starting Trainer Platform Development Setup..."
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Create environment file
    create_env_file
    
    # Install dependencies
    install_dependencies
    
    # Start database services
    start_database_services
    
    # Seed database
    seed_database
    
    # Start backend service
    start_backend
    
    # Start frontend service
    start_frontend
    
    # Start monitoring services
    start_monitoring_services
    
    # Display service information
    display_service_info
    
    # Keep script running
    print_status "Development environment is ready! Press Ctrl+C to stop all services."
    
    # Wait for user to stop
    wait
}

# Run main function
main "$@" 