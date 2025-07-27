#!/bin/bash

# Setup Environment Variables Script
# This script helps set up the environment variables for the trainer platform

echo "🚀 Setting up environment variables for Trainer Platform..."

# Check if .env file already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. .env file unchanged."
        exit 0
    fi
fi

# Copy env.example to .env
if [ -f "env.example" ]; then
    cp env.example .env
    echo "✅ Created .env file from env.example"
else
    echo "❌ env.example file not found!"
    exit 1
fi

# For development, also copy frontend-specific variables
if [ -f "env.frontend.development" ]; then
    echo "" >> .env
    echo "# Frontend Development Variables" >> .env
    cat env.frontend.development >> .env
    echo "✅ Added frontend development variables to .env"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file to configure your specific settings"
echo "2. Update API URLs to point to your backend server"
echo "3. Set secure JWT and session secrets for production"
echo "4. Configure your database connection strings"
echo ""
echo "⚠️  Important: Never commit .env file to version control!"
echo "   It contains sensitive information like API keys and passwords."
echo ""
echo "🔧 To start development:"
echo "   npm start"
echo "" 