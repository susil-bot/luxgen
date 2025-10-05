# 🌐 Subdomain Multi-Tenancy Deployment Strategy

## 🎯 Production Subdomain Setup

### 1. Vercel Subdomain Configuration

For **FREE** subdomain multi-tenancy, we need to deploy the same app to multiple Vercel projects:

#### Deployment Structure:
```
luxgen.vercel.app          → Main LuxGen tenant
demo-luxgen.vercel.app     → Demo tenant  
test-luxgen.vercel.app     → Test tenant
```

### 2. Why This Works for FREE:

#### Vercel Free Tier Benefits:
- ✅ **Unlimited static sites** (each subdomain = separate project)
- ✅ **100GB bandwidth/month** per project
- ✅ **Custom domains** support
- ✅ **Automatic HTTPS** for all subdomains
- ✅ **Global CDN** for fast loading

#### Railway Free Tier Benefits:
- ✅ **$5 credit/month** (covers small backend apps)
- ✅ **Unlimited deployments**
- ✅ **Custom domains** support
- ✅ **Built-in monitoring**

#### MongoDB Atlas Free Tier Benefits:
- ✅ **512MB storage** (sufficient for multi-tenant data)
- ✅ **Shared clusters** (cost-effective)
- ✅ **SSL connections** included
- ✅ **Automatic backups**

### 3. Dynamic Subdomain Detection:

The app automatically detects the subdomain and applies the correct tenant configuration:

```typescript
// Production subdomain detection
const getCurrentProductionTenant = (): ProductionTenantConfig | null => {
  const hostname = window.location.hostname;
  
  // Handle Vercel production domains
  if (hostname.includes('vercel.app')) {
    const subdomain = hostname.split('.')[0];
    return getProductionTenantBySubdomain(subdomain);
  }
  
  // Handle custom domains
  if (hostname.includes('luxgen.com')) {
    const subdomain = hostname.split('.')[0];
    return getProductionTenantBySubdomain(subdomain);
  }
  
  return null;
};
```

### 4. Deployment Commands:

#### Deploy to Multiple Vercel Projects:

```bash
# Deploy to main LuxGen tenant
vercel --prod --name luxgen

# Deploy to demo tenant  
vercel --prod --name demo-luxgen

# Deploy to test tenant
vercel --prod --name test-luxgen
```

### 5. Environment Variables per Tenant:

#### LuxGen (Main):
```env
REACT_APP_API_URL=https://luxgen-core-production.up.railway.app
REACT_APP_TENANT_ID=luxgen
REACT_APP_ENVIRONMENT=production
```

#### Demo:
```env
REACT_APP_API_URL=https://luxgen-core-production.up.railway.app
REACT_APP_TENANT_ID=demo
REACT_APP_ENVIRONMENT=production
```

#### Test:
```env
REACT_APP_API_URL=https://luxgen-core-production.up.railway.app
REACT_APP_TENANT_ID=test
REACT_APP_ENVIRONMENT=production
```

### 6. Backend Multi-Tenancy:

The backend automatically handles multiple tenants through:

#### Database Isolation:
```javascript
// Each tenant gets isolated database
const getTenantDatabase = (tenantId) => {
  return `luxgen_${tenantId}`;
};
```

#### API Routing:
```javascript
// Tenant-specific API endpoints
app.use('/api/:tenantId', tenantMiddleware);
```

### 7. Cost Breakdown (FREE):

#### Vercel:
- **3 projects** × **Free tier** = **$0/month**
- **300GB bandwidth** total (100GB × 3)
- **Unlimited deployments**

#### Railway:
- **1 backend** × **$5 credit** = **$0/month** (covered by free credit)
- **Unlimited deployments**
- **Built-in monitoring**

#### MongoDB Atlas:
- **1 database** × **Free tier** = **$0/month**
- **512MB storage** (sufficient for multi-tenant)
- **SSL connections included**

### 8. Monitoring (FREE):

#### Uptime Robot:
- **Monitor all 3 subdomains** for free
- **Email alerts** for downtime
- **Response time monitoring**

#### Vercel Analytics:
- **Built-in performance monitoring**
- **Real-time analytics**
- **Error tracking**

### 9. Scaling Strategy:

#### When to Upgrade:
- **Vercel Pro**: When bandwidth > 100GB/month per project
- **Railway Pro**: When backend needs more resources
- **MongoDB Atlas**: When storage > 512MB

#### Upgrade Costs:
- **Vercel Pro**: $20/month (unlimited bandwidth)
- **Railway Pro**: $5/month (more resources)
- **MongoDB Atlas**: $9/month (2GB storage)

### 10. Production URLs:

```
🌐 Multi-Tenant Production URLs:

LuxGen (Main):     https://luxgen.vercel.app
Demo Tenant:       https://demo-luxgen.vercel.app  
Test Tenant:       https://test-luxgen.vercel.app
Backend API:       https://luxgen-core-production.up.railway.app
Health Check:      https://luxgen-core-production.up.railway.app/health
```

## 🎯 Summary:

**✅ ENTIRELY FREE** multi-tenant deployment using:
- **3 Vercel projects** (free tier)
- **1 Railway backend** (free credit)
- **1 MongoDB Atlas** (free tier)
- **Automatic subdomain detection**
- **Dynamic tenant configuration**
- **Production-ready monitoring**

**Total Cost: $0/month** 🎉
