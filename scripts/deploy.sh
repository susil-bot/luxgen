#!/bin/bash

# 🚀 Frontend Deployment Script
# Automated deployment to Vercel with quality gates

set -e

echo "🚀 Starting Frontend Deployment Process..."

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

# Parse command line arguments
ENVIRONMENT=${1:-production}
FORCE=${2:-false}

print_status "Deployment environment: $ENVIRONMENT"
print_status "Force deployment: $FORCE"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

print_success "Vercel CLI version: $(vercel --version)"

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_error "Not logged in to Vercel. Please run 'vercel login' first."
    exit 1
fi

print_success "Logged in to Vercel as: $(vercel whoami)"

# Run build process
print_status "Running build process..."
./scripts/build.sh
print_success "Build completed"

# Set environment variables based on deployment target
case $ENVIRONMENT in
    "staging")
        export VERCEL_ENV=preview
        export REACT_APP_ENVIRONMENT=staging
        export REACT_APP_API_URL=${REACT_APP_API_URL:-https://staging-api.luxgen.com}
        ;;
    "production")
        export VERCEL_ENV=production
        export REACT_APP_ENVIRONMENT=production
        export REACT_APP_API_URL=${REACT_APP_API_URL:-https://luxgen-backend.netlify.app}
        ;;
    *)
        print_error "Invalid environment: $ENVIRONMENT. Use 'staging' or 'production'."
        exit 1
        ;;
esac

print_status "Environment variables set:"
print_status "  VERCEL_ENV: $VERCEL_ENV"
print_status "  REACT_APP_ENVIRONMENT: $REACT_APP_ENVIRONMENT"
print_status "  REACT_APP_API_URL: $REACT_APP_API_URL"

# Deploy to Vercel
print_status "Deploying to Vercel..."
if [ "$FORCE" = "true" ]; then
    vercel --prod --force
else
    vercel --prod
fi

print_success "Deployment completed"

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "unknown")
print_success "Deployment URL: https://$DEPLOYMENT_URL"

# Run post-deployment checks
print_status "Running post-deployment checks..."

# Check if deployment is accessible
if [ "$DEPLOYMENT_URL" != "unknown" ]; then
    print_status "Checking deployment accessibility..."
    if curl -s -o /dev/null -w "%{http_code}" "https://$DEPLOYMENT_URL" | grep -q "200"; then
        print_success "Deployment is accessible"
    else
        print_warning "Deployment may not be fully ready yet"
    fi
fi

# Create deployment report
print_status "Creating deployment report..."
cat > deployment-report.json << EOF
{
  "deploymentTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "environment": "$ENVIRONMENT",
  "vercelEnv": "$VERCEL_ENV",
  "deploymentUrl": "https://$DEPLOYMENT_URL",
  "apiUrl": "$REACT_APP_API_URL",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "buildSize": "$(du -sh build | cut -f1)"
}
EOF

print_success "Deployment report created"

# Final success message
print_success "🎉 Frontend deployment completed successfully!"
print_status "Environment: $ENVIRONMENT"
print_status "Deployment URL: https://$DEPLOYMENT_URL"
print_status "API URL: $REACT_APP_API_URL"

# Optional: Open deployment URL
if [ "$3" = "--open" ]; then
    print_status "Opening deployment URL..."
    if command -v open &> /dev/null; then
        open "https://$DEPLOYMENT_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://$DEPLOYMENT_URL"
    else
        print_warning "Cannot open URL automatically. Please visit: https://$DEPLOYMENT_URL"
    fi
fi
