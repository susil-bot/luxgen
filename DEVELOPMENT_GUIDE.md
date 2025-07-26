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
