#!/bin/bash

# Development Setup Script
# Implements: Deploy API freely + Run Frontend locally + Connect to MongoDB Atlas

set -e

echo "🚀 Setting up Development Environment..."
echo "📋 Plan: Deploy API freely + Run Frontend locally + Connect to MongoDB Atlas"

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the trainer-platform directory."
    exit 1
fi

# Step 1: Setup API for deployment
setup_api_deployment() {
    print_status "Step 1: Setting up API for deployment..."
    
    cd backend
    
    # Run the deployment script
    if [ -f "deploy-api.sh" ]; then
        chmod +x deploy-api.sh
        ./deploy-api.sh render
        print_success "API deployment files created!"
    else
        print_error "deploy-api.sh not found in backend directory"
        exit 1
    fi
    
    cd ..
}

# Step 2: Setup frontend environment
setup_frontend_environment() {
    print_status "Step 2: Setting up frontend environment..."
    
    # Copy environment template
    if [ -f "env.frontend.development" ]; then
        cp env.frontend.development .env
        print_success "Frontend environment file created: .env"
        print_warning "Please update REACT_APP_API_URL in .env with your deployed API URL"
    else
        print_error "env.frontend.development not found"
        exit 1
    fi
}

# Step 3: Install dependencies
install_dependencies() {
    print_status "Step 3: Installing dependencies..."
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    print_success "Dependencies installed successfully!"
}

# Step 4: Create deployment instructions
create_deployment_guide() {
    print_status "Step 4: Creating deployment guide..."
    
    cat > DEVELOPMENT_GUIDE.md << 'EOF'
# Development Setup Guide

## 🎯 Your Plan: Deploy API Freely + Run Frontend Locally

### Phase 1: Deploy API (Choose One)

#### Option A: Render (Recommended - Free)
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Setup API for deployment"
   git push origin main
   ```

2. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `trainer-platform-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Set Environment Variables:
     - `MONGODB_URL`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A strong secret key
     - `CORS_ORIGIN`: `http://localhost:3000`
     - `NODE_ENV`: `production`
   - Deploy!

#### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set environment variables
4. Deploy!

#### Option C: Heroku
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Set environment variables
4. Deploy: `git push heroku main`

### Phase 2: Update Frontend Configuration

1. **Get your deployed API URL** (e.g., `https://your-api-name.onrender.com`)

2. **Update frontend environment:**
   ```bash
   # Edit .env file
   REACT_APP_API_URL=https://your-api-name.onrender.com
   ```

3. **Start frontend locally:**
   ```bash
   npm start
   ```

### Phase 3: Development Workflow

#### Making API Changes:
1. Make changes to backend code
2. Test locally: `cd backend && npm run dev`
3. Push to GitHub
4. API automatically redeploys (if using Render/Railway)

#### Making Frontend Changes:
1. Make changes to frontend code
2. Frontend automatically reloads (hot reload)
3. Test with deployed API

### Environment Variables Reference

#### Backend (.env.production.template):
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/trainer_platform
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:3000
NODE_ENV=production
PORT=10000
```

#### Frontend (.env):
```
REACT_APP_API_URL=https://your-api-name.onrender.com
REACT_APP_ENV=development
REACT_APP_DEBUG_MODE=true
```

### Quick Commands

```bash
# Start frontend only (connects to deployed API)
npm start

# Test API locally (for development)
cd backend && npm run dev

# Deploy API changes
git add . && git commit -m "Update API" && git push

# Check API health
curl https://your-api-name.onrender.com/health
```

### Troubleshooting

#### Frontend not connecting to API:
1. Check `REACT_APP_API_URL` in `.env`
2. Verify API is deployed and running
3. Check CORS settings in API

#### API deployment issues:
1. Check environment variables in deployment platform
2. Verify MongoDB Atlas connection
3. Check deployment logs

#### Local development:
1. Use `npm run dev` in backend for local API
2. Update `REACT_APP_API_URL` to `http://localhost:3001`
3. Restart frontend after changing environment variables
EOF

    print_success "Development guide created: DEVELOPMENT_GUIDE.md"
}

# Step 5: Create quick start script
create_quick_start_script() {
    print_status "Step 5: Creating quick start script..."
    
    cat > start-frontend.sh << 'EOF'
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
EOF

    chmod +x start-frontend.sh
    print_success "Quick start script created: start-frontend.sh"
}

# Step 6: Create API deployment script
create_api_deploy_script() {
    print_status "Step 6: Creating API deployment script..."
    
    cat > deploy-api.sh << 'EOF'
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
EOF

    chmod +x deploy-api.sh
    print_success "API deployment script created: deploy-api.sh"
}

# Main execution
print_status "Starting development setup..."

setup_api_deployment
setup_frontend_environment
install_dependencies
create_deployment_guide
create_quick_start_script
create_api_deploy_script

print_success "🎉 Development setup completed!"
echo ""
print_status "Next steps:"
print_status "1. Deploy your API to Render/Railway/Heroku"
print_status "2. Update REACT_APP_API_URL in .env with your deployed API URL"
print_status "3. Run: ./start-frontend.sh"
echo ""
print_status "📚 See DEVELOPMENT_GUIDE.md for detailed instructions"
print_status "🚀 Quick start: ./start-frontend.sh"
print_status "📤 Deploy API changes: ./deploy-api.sh" 