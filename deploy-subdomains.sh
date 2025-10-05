#!/bin/bash

# 🌐 Multi-Subdomain Deployment Script for LuxGen
# Deploys the same app to multiple Vercel projects for subdomain multi-tenancy

echo "🌐 Starting Multi-Subdomain Deployment for LuxGen..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    print_success "Vercel CLI ready"
}

# Deploy to LuxGen main tenant
deploy_luxgen() {
    print_status "Deploying to LuxGen main tenant..."
    
    # Set environment variables for LuxGen
    export REACT_APP_TENANT_ID=luxgen
    export REACT_APP_API_URL=https://luxgen-core-production.up.railway.app
    export REACT_APP_ENVIRONMENT=production
    
    # Build and deploy
    npm run build
    vercel --prod --name luxgen --yes
    
    print_success "LuxGen tenant deployed: https://luxgen.vercel.app"
}

# Deploy to Demo tenant
deploy_demo() {
    print_status "Deploying to Demo tenant..."
    
    # Set environment variables for Demo
    export REACT_APP_TENANT_ID=demo
    export REACT_APP_API_URL=https://luxgen-core-production.up.railway.app
    export REACT_APP_ENVIRONMENT=production
    
    # Build and deploy
    npm run build
    vercel --prod --name demo-luxgen --yes
    
    print_success "Demo tenant deployed: https://demo-luxgen.vercel.app"
}

# Deploy to Test tenant
deploy_test() {
    print_status "Deploying to Test tenant..."
    
    # Set environment variables for Test
    export REACT_APP_TENANT_ID=test
    export REACT_APP_API_URL=https://luxgen-core-production.up.railway.app
    export REACT_APP_ENVIRONMENT=production
    
    # Build and deploy
    npm run build
    vercel --prod --name test-luxgen --yes
    
    print_success "Test tenant deployed: https://test-luxgen.vercel.app"
}

# Deploy all tenants
deploy_all() {
    print_status "Deploying to all tenants..."
    
    deploy_luxgen
    echo ""
    deploy_demo
    echo ""
    deploy_test
    
    print_success "All tenants deployed successfully!"
}

# Main function
main() {
    echo "🌐 LuxGen Multi-Subdomain Deployment"
    echo "===================================="
    echo ""
    
    check_vercel_cli
    
    echo ""
    echo "Choose deployment option:"
    echo "1. Deploy LuxGen (Main tenant)"
    echo "2. Deploy Demo tenant"
    echo "3. Deploy Test tenant"
    echo "4. Deploy All tenants"
    echo ""
    
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            deploy_luxgen
            ;;
        2)
            deploy_demo
            ;;
        3)
            deploy_test
            ;;
        4)
            deploy_all
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Multi-subdomain deployment completed!"
    echo ""
    echo "🌐 Your Multi-Tenant URLs:"
    echo "LuxGen: https://luxgen.vercel.app"
    echo "Demo:   https://demo-luxgen.vercel.app"
    echo "Test:   https://test-luxgen.vercel.app"
    echo ""
    echo "🔧 Backend API: https://luxgen-core-production.up.railway.app"
    echo "📊 Health Check: https://luxgen-core-production.up.railway.app/health"
    echo ""
}

# Run main function
main "$@"
