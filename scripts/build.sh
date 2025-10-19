#!/bin/bash

# 🏗️ Frontend Build Script
# Comprehensive build process with quality checks

set -e

echo "🚀 Starting Frontend Build Process..."

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

print_success "npm version: $(npm -v)"

# Set environment variables
export NODE_ENV=${NODE_ENV:-production}
export REACT_APP_ENVIRONMENT=${REACT_APP_ENVIRONMENT:-production}
export REACT_APP_API_URL=${REACT_APP_API_URL:-https://luxgen-backend.netlify.app}

print_status "Environment: $NODE_ENV"
print_status "API URL: $REACT_APP_API_URL"

# Clean previous build
print_status "Cleaning previous build..."
rm -rf build/
rm -rf dist/
print_success "Build directory cleaned"

# Install dependencies
print_status "Installing dependencies..."
npm ci --silent
print_success "Dependencies installed"

# Run quality checks
print_status "Running quality checks..."

# ESLint check
print_status "Running ESLint..."
npm run lint
print_success "ESLint passed"

# TypeScript check
print_status "Running TypeScript check..."
npm run type-check
print_success "TypeScript check passed"

# Run tests
print_status "Running tests..."
npm test -- --coverage --watchAll=false --passWithNoTests
print_success "Tests passed"

# Build application
print_status "Building application..."
npm run build
print_success "Build completed"

# Analyze bundle size
print_status "Analyzing bundle size..."
if [ -d "build/static/js" ]; then
    echo "JavaScript bundles:"
    du -sh build/static/js/*.js | sort -hr
fi

if [ -d "build/static/css" ]; then
    echo "CSS bundles:"
    du -sh build/static/css/*.css | sort -hr
fi

# Check build size
BUILD_SIZE=$(du -sh build | cut -f1)
print_success "Build size: $BUILD_SIZE"

# Create build info
print_status "Creating build info..."
cat > build/build-info.json << EOF
{
  "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "nodeVersion": "$(node -v)",
  "npmVersion": "$(npm -v)",
  "environment": "$NODE_ENV",
  "apiUrl": "$REACT_APP_API_URL",
  "buildSize": "$BUILD_SIZE",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')"
}
EOF

print_success "Build info created"

# Final success message
print_success "🎉 Frontend build completed successfully!"
print_status "Build directory: build/"
print_status "Build size: $BUILD_SIZE"
print_status "Environment: $NODE_ENV"

# Optional: Start preview server
if [ "$1" = "--preview" ]; then
    print_status "Starting preview server..."
    npx serve -s build -l 3000
fi
