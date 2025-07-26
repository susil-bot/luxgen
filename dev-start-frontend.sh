#!/bin/bash

# Development Frontend Service Starter
# This script starts the frontend service for development

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

echo "🎨 Starting Frontend Service for Development..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the trainer-platform root directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

# Set environment variables for development
export REACT_APP_API_URL=http://localhost:3001/api
export REACT_APP_WS_URL=ws://localhost:3001
export NODE_ENV=development

# Start frontend service
print_status "Starting frontend service..."
print_success "Frontend service starting on http://localhost:3000"
print_status "Press Ctrl+C to stop the service"
echo ""

npm start 