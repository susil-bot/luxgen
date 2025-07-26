#!/bin/bash

# API Deployment Script
# This script helps deploy API changes

echo "🚀 Deploying API changes..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the trainer-platform directory"
    exit 1
fi

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Changes detected. Committing..."
    git add .
    git commit -m "Update API - $(date)"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ API changes pushed to GitHub"
echo "🔄 Your deployment platform will automatically redeploy"
echo "⏱️  Deployment usually takes 2-5 minutes"
echo ""
echo "🔍 Check deployment status:"
echo "   - Render: https://dashboard.render.com"
echo "   - Railway: https://railway.app/dashboard"
echo "   - Heroku: https://dashboard.heroku.com"
