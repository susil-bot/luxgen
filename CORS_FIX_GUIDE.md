# 🔧 CORS Fix Guide for LuxGen Frontend

## 🚨 Current Issues

### 1. **CORS Policy Errors**
```
Access to XMLHttpRequest at 'https://luxgen-core-production.up.railway.app/api/tenants/luxgen-multi-tenant' 
from origin 'https://luxgen-multi-tenant.vercel.app' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### 2. **401 Authentication Errors**
```
Failed to load resource: the server responded with a status of 401 ()
```

## ✅ **Solutions**

### **Solution 1: Backend CORS Configuration**

The backend API needs to be configured to allow requests from Vercel domains.

#### **Required CORS Headers in Backend:**
```javascript
// In your backend API (Railway deployment)
app.use(cors({
  origin: [
    'https://luxgen-frontend.vercel.app',
    'https://luxgen-multi-tenant.vercel.app',
    'https://luxgen-frontend-luxgens-projects.vercel.app',
    'https://luxgen-multi-tenant-luxgens-projects.vercel.app',
    'http://localhost:3000', // For development
    'http://localhost:3001'  // For development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

#### **Backend Environment Variables:**
```bash
# Add these to your Railway backend environment
CORS_ORIGINS=https://luxgen-frontend.vercel.app,https://luxgen-multi-tenant.vercel.app,http://localhost:3000
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
```

### **Solution 2: Frontend API Configuration**

Update the frontend to handle CORS properly.

#### **Update API Client Configuration:**
```typescript
// In src/core/api/ApiClient.ts
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://luxgen-core-production.up.railway.app',
  timeout: 10000,
  withCredentials: true, // Important for CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```

### **Solution 3: Vercel Environment Variables**

Set up proper environment variables in Vercel.

#### **Vercel Dashboard Configuration:**
1. Go to: https://vercel.com/luxgens-projects/luxgen-frontend/settings/environment-variables
2. Add these variables:

```bash
REACT_APP_API_URL=https://luxgen-core-production.up.railway.app
REACT_APP_ENVIRONMENT=production
REACT_APP_CORS_ENABLED=true
```

### **Solution 4: Proxy Configuration (Alternative)**

If CORS can't be fixed on the backend, use a proxy.

#### **Create Vercel Proxy:**
```javascript
// vercel.json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://luxgen-core-production.up.railway.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "/api",
    "REACT_APP_ENVIRONMENT": "production"
  }
}
```

## 🚀 **Immediate Actions Required**

### **Step 1: Fix Backend CORS (Priority 1)**
1. **Access Railway Dashboard**: https://railway.app/project/luxgen-core-production
2. **Go to Environment Variables**
3. **Add CORS configuration**:
   ```bash
   CORS_ORIGINS=https://luxgen-frontend.vercel.app,https://luxgen-multi-tenant.vercel.app
   CORS_CREDENTIALS=true
   ```
4. **Redeploy backend** to apply changes

### **Step 2: Update Frontend Configuration**
1. **Update API Client** to handle CORS properly
2. **Set Vercel environment variables**
3. **Redeploy frontend**

### **Step 3: Test the Fix**
1. **Check CORS headers** in browser dev tools
2. **Test API calls** from frontend
3. **Verify authentication** works

## 🔍 **Testing Commands**

### **Test CORS Headers:**
```bash
# Test CORS preflight
curl -H "Origin: https://luxgen-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://luxgen-core-production.up.railway.app/api/auth/login

# Test actual API call
curl -H "Origin: https://luxgen-frontend.vercel.app" \
     -H "Content-Type: application/json" \
     -X POST \
     https://luxgen-core-production.up.railway.app/api/auth/login \
     -d '{"email":"test@luxgen.com","password":"password"}'
```

### **Test Frontend:**
```bash
# Test frontend accessibility
curl -I https://luxgen-frontend.vercel.app

# Test API connectivity
curl -I https://luxgen-core-production.up.railway.app/api/health
```

## 📊 **Expected Results**

### **After CORS Fix:**
- ✅ No CORS errors in browser console
- ✅ API calls work from frontend
- ✅ Authentication works properly
- ✅ Tenant switching works
- ✅ All API endpoints accessible

### **Current Working URLs:**
- **Frontend**: https://luxgen-frontend.vercel.app ✅
- **Backend**: https://luxgen-core-production.up.railway.app ✅
- **Issue**: CORS blocking frontend → backend communication ❌

## 🎯 **Next Steps**

1. **Fix backend CORS** (Railway dashboard)
2. **Update frontend configuration**
3. **Test the integration**
4. **Deploy updated frontend**
5. **Verify everything works**

---

**The main issue is CORS configuration on the backend API. Once that's fixed, your LuxGen frontend will work perfectly! 🚀**
