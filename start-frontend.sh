#!/bin/bash

# Quick Start Script for Frontend Development
# This script starts the frontend and connects to your deployed API

echo "🚀 Starting Frontend Development..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please run: cp env.frontend.development .env"
    echo "Then update REACT_APP_API_URL with your deployed API URL"
    exit 1
fi

# Check if API URL is configured
if ! grep -q "REACT_APP_API_URL=" .env; then
    echo "❌ REACT_APP_API_URL not found in .env"
    echo "Please update .env with your deployed API URL"
    exit 1
fi

# Get API URL
API_URL=$(grep "REACT_APP_API_URL=" .env | cut -d'=' -f2)

echo "📡 Connecting to API: $API_URL"

# Test API connection
echo "🔍 Testing API connection..."
if curl -s "$API_URL/health" > /dev/null; then
    echo "✅ API is reachable"
else
    echo "⚠️  Warning: API might not be reachable"
    echo "   Make sure your API is deployed and running"
fi

# Start frontend
echo "🌐 Starting frontend development server..."
npm start
