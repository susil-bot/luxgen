#!/bin/bash

# LuxGen Frontend Vercel Deployment Script
# Manual deployment script for Vercel

set -e

echo "🚀 LuxGen Frontend Vercel Deployment"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="prj_ouUiFUxx80rcOjb4pB3dzGrj1u8G"
ORG_ID="team_JuevDBWv60LRQj0QLmA2WltU"
PROJECT_NAME="luxgen"
API_URL=${API_URL:-"https://luxgen-core-production.up.railway.app"}

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "Project ID: $PROJECT_ID"
echo "Organization ID: $ORG_ID"
echo "Project Name: $PROJECT_NAME"
echo "API URL: $API_URL"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if we're logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel. Please login first:${NC}"
    echo "Run: vercel login"
    exit 1
fi

echo -e "${BLUE}🔍 Checking project status...${NC}"

# Check if project exists
if vercel ls | grep -q "$PROJECT_NAME"; then
    echo -e "${GREEN}✅ Project found: $PROJECT_NAME${NC}"
else
    echo -e "${YELLOW}⚠️  Project not found. Creating new project...${NC}"
    vercel --yes
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

echo -e "${BLUE}🔨 Building application...${NC}"
REACT_APP_API_URL="$API_URL" REACT_APP_ENVIRONMENT=production npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"

# Deploy to Vercel
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo ""
    echo -e "${BLUE}📊 Deployment Details:${NC}"
    echo "🌐 Frontend URL: https://luxgen-multi-tenant.vercel.app"
    echo "🔧 Backend URL: $API_URL"
    echo "📱 Project: $PROJECT_NAME"
    echo ""
    echo -e "${GREEN}✅ Your LuxGen frontend is now live on Vercel!${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
    echo "1. Check your Vercel authentication: vercel whoami"
    echo "2. Verify project permissions"
    echo "3. Check build logs for errors"
    echo "4. Ensure all environment variables are set"
    echo ""
    echo -e "${BLUE}📋 Manual Deployment Steps:${NC}"
    echo "1. Go to https://vercel.com/new"
    echo "2. Import your GitHub repository"
    echo "3. Set environment variables:"
    echo "   - REACT_APP_API_URL: $API_URL"
    echo "   - REACT_APP_ENVIRONMENT: production"
    echo "4. Deploy"
    exit 1
fi

echo ""
echo -e "${BLUE}🔗 Useful Links:${NC}"
echo "📊 Vercel Dashboard: https://vercel.com/dashboard"
echo "🌐 Live Site: https://luxgen-multi-tenant.vercel.app"
echo "📋 Project Settings: https://vercel.com/$ORG_ID/$PROJECT_NAME"
echo "🔧 Backend API: $API_URL"
