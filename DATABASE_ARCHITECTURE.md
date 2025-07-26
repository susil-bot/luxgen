# Trainer Platform - MongoDB Database Architecture

## 🏗️ Database Overview

The Trainer Platform uses MongoDB Atlas as the primary NoSQL database with a multi-tenant architecture. The database is designed to support training organizations, polls, user management, and analytics.

---

## 📊 Database Collections Structure

### 1. **tenants** Collection
**Purpose**: Multi-tenant organization management

**Schema**:
```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String (unique, required),
  description: String,
  
  // Contact Information
  contactEmail: String (required),
  contactPhone: String,
  website: String,
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Business Info
  industry: String,
  companySize: Enum['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
  timezone: String (default: 'UTC'),
  language: String (default: 'en'),
  
  // Subscription & Billing
  subscription: {
    plan: Enum['free', 'basic', 'professional', 'enterprise'],
    status: Enum['active', 'trial', 'expired', 'cancelled', 'suspended'],
    startDate: Date,
    endDate: Date,
    trialEndDate: Date,
    billingCycle: Enum['monthly', 'yearly'],
    amount: Number,
    currency: String (default: 'USD'),
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  
  // Features & Settings
  features: {
    polls: { enabled: Boolean, maxPolls: Number, maxRecipients: Number },
    analytics: { enabled: Boolean, retention: Number },
    integrations: { slack: Boolean, teams: Boolean, email: Boolean },
    branding: { enabled: Boolean, logo: String, colors: Object },
    security: { sso: Boolean, mfa: Boolean, ipWhitelist: [String] }
  },
  
  // Usage Statistics
  usage: {
    pollsCreated: Number,
    totalRecipients: Number,
    totalResponses: Number,
    lastActivity: Date
  },
  
  // Status
  status: Enum['active', 'inactive', 'suspended', 'pending'],
  isVerified: Boolean,
  verificationToken: String,
  verificationExpires: Date,
  
  // Settings
  settings: {
    allowPublicPolls: Boolean,
    requireEmailVerification: Boolean,
    autoArchivePolls: Boolean,
    archiveAfterDays: Number,
    notificationPreferences: Object
  },
  
  // Metadata
  metadata: {
    source: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ slug: 1 }` (unique)
- `{ contactEmail: 1 }`
- `{ "subscription.status": 1 }`
- `{ status: 1 }`
- `{ createdAt: -1 }`
- `{ "usage.lastActivity": -1 }`

---

### 2. **users** Collection
**Purpose**: User authentication and basic profile

**Schema**:
```javascript
{
  _id: ObjectId,
  tenantId: String (required, indexed),
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, indexed),
  password: String (hashed, required),
  role: Enum['super_admin', 'admin', 'trainer', 'user'],
  avatar: String,
  phone: String,
  department: String,
  position: String,
  isActive: Boolean (default: true),
  lastLogin: Date,
  
  // Preferences
  preferences: {
    notifications: {
      email: Boolean (default: true),
      push: Boolean (default: true),
      sms: Boolean (default: false)
    },
    theme: Enum['light', 'dark', 'auto'],
    language: String (default: 'en')
  },
  
  // Metadata
  metadata: Map<String, String>,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ tenantId: 1, email: 1 }`
- `{ tenantId: 1, role: 1 }`
- `{ email: 1 }`

---

### 3. **userdetails** Collection
**Purpose**: Extended user profile information

**Schema**:
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, unique),
  
  // Personal Information
  dateOfBirth: Date,
  gender: Enum['male', 'female', 'other', 'prefer_not_to_say'],
  nationality: String,
  profilePicture: String,
  bio: String (max: 500),
  
  // Contact Information
  alternateEmail: String,
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  
  // Addresses
  addresses: [{
    type: Enum['home', 'work', 'billing', 'shipping'],
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    isDefault: Boolean
  }],
  
  // Skills
  skills: [{
    name: String,
    level: Enum['beginner', 'intermediate', 'advanced', 'expert'],
    yearsOfExperience: Number,
    category: String,
    verified: Boolean
  }],
  
  // Work Experience
  workExperience: [{
    company: String,
    position: String,
    location: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean,
    description: String
  }],
  
  // Education
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: Number,
    description: String
  }],
  
  // Certifications
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    verificationUrl: String
  }],
  
  // Social Links
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String,
    portfolio: String
  },
  
  // Preferences
  preferences: {
    timezone: String,
    language: String,
    communicationPreferences: Object,
    privacySettings: Object
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ userId: 1 }` (unique)
- `{ "skills.name": 1 }`
- `{ "workExperience.company": 1 }`

---

### 4. **userregistrations** Collection
**Purpose**: User registration process management

**Schema**:
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (hashed, required),
  confirmPassword: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  phone: String,
  company: String,
  jobTitle: String,
  department: String,
  industry: String,
  companySize: String,
  tenantId: String (required),
  tenantDomain: String,
  
  // Consent
  marketingConsent: Boolean,
  termsAccepted: Boolean (required),
  privacyPolicyAccepted: Boolean (required),
  
  // Tracking
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  userAgent: String,
  ipAddress: String,
  deviceType: String,
  registrationSource: Enum['web', 'api'],
  
  // Verification
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  isEmailVerified: Boolean (default: false),
  emailVerifiedAt: Date,
  
  // Status
  status: Enum['pending', 'verified', 'completed', 'expired'],
  completedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ email: 1 }` (unique)
- `{ tenantId: 1 }`
- `{ status: 1 }`
- `{ emailVerificationToken: 1 }`
- `{ createdAt: -1 }`

---

### 5. **polls** Collection
**Purpose**: Polling and feedback system

**Schema**:
```javascript
{
  _id: ObjectId,
  tenantId: String (required),
  title: String (required),
  description: String,
  niche: String,
  targetAudience: [String],
  
  // Questions
  questions: [{
    question: String (required),
    type: Enum['multiple_choice', 'rating', 'text', 'yes_no'],
    options: [String],
    required: Boolean (default: false),
    order: Number (default: 0)
  }],
  
  // Distribution
  channels: [Enum['email', 'slack', 'teams', 'web']],
  status: Enum['draft', 'sent', 'active', 'closed', 'archived'],
  priority: Enum['low', 'medium', 'high', 'urgent'],
  tags: [String],
  
  // Scheduling
  scheduledDate: Date,
  sentDate: Date,
  expiresAt: Date,
  
  // Recipients
  recipients: [{
    userId: ObjectId (ref: 'User'),
    email: String,
    name: String,
    sentAt: Date,
    respondedAt: Date,
    status: Enum['pending', 'sent', 'delivered', 'opened', 'responded', 'failed']
  }],
  
  // Responses
  responses: [{
    userId: ObjectId (ref: 'User'),
    userName: String,
    userEmail: String,
    answers: [{
      questionId: Number,
      answer: Mixed,
      timestamp: Date
    }],
    ipAddress: String,
    userAgent: String,
    submittedAt: Date
  }],
  
  // Analytics
  analytics: {
    totalRecipients: Number,
    totalResponses: Number,
    responseRate: Number,
    averageCompletionTime: Number,
    topQuestions: [Object]
  },
  
  // Settings
  settings: {
    isAnonymous: Boolean (default: false),
    allowMultipleResponses: Boolean (default: false),
    requireAuthentication: Boolean (default: true),
    showResults: Boolean (default: false),
    autoClose: Boolean (default: true)
  },
  
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ tenantId: 1 }`
- `{ status: 1 }`
- `{ createdBy: 1 }`
- `{ scheduledDate: 1 }`
- `{ expiresAt: 1 }`
- `{ "recipients.email": 1 }`
- `{ createdAt: -1 }`

---

### 6. **tenantschemas** Collection
**Purpose**: Tenant styling and branding configuration

**Schema**:
```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String (required, unique),
  description: String,
  contactEmail: String (required),
  contactPhone: String,
  website: String,
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Business Info
  industry: String,
  companySize: Enum['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
  timezone: String (default: 'UTC'),
  language: String (default: 'en'),
  
  // Styling Configuration
  styling: {
    branding: {
      logo: String,
      favicon: String,
      primaryColor: String (default: '#3B82F6'),
      secondaryColor: String (default: '#1E40AF'),
      accentColor: String (default: '#10B981'),
      backgroundColor: String (default: '#FFFFFF'),
      surfaceColor: String (default: '#F9FAFB')
    },
    typography: {
      fontFamily: String (default: 'Inter, sans-serif'),
      headingFont: String,
      bodyFont: String,
      fontSize: {
        xs: String (default: '0.75rem'),
        sm: String (default: '0.875rem'),
        base: String (default: '1rem'),
        lg: String (default: '1.125rem'),
        xl: String (default: '1.25rem'),
        '2xl': String (default: '1.5rem'),
        '3xl': String (default: '1.875rem'),
        '4xl': String (default: '2.25rem')
      },
      fontWeight: {
        light: Number (default: 300),
        normal: Number (default: 400),
        medium: Number (default: 500),
        semibold: Number (default: 600),
        bold: Number (default: 700)
      }
    },
    spacing: {
      xs: String (default: '0.25rem'),
      sm: String (default: '0.5rem'),
      md: String (default: '1rem'),
      lg: String (default: '1.5rem'),
      xl: String (default: '2rem'),
      '2xl': String (default: '3rem')
    },
    components: {
      buttons: {
        primary: Object,
        secondary: Object,
        outline: Object
      },
      forms: {
        input: Object,
        select: Object,
        checkbox: Object
      },
      cards: {
        default: Object,
        elevated: Object
      }
    }
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ slug: 1 }` (unique)
- `{ contactEmail: 1 }`
- `{ createdAt: -1 }`

---

## 🔗 Relationships & Data Flow

### Primary Relationships:
1. **Tenant → Users**: One-to-Many (tenantId)
2. **User → UserDetails**: One-to-One (userId)
3. **Tenant → Polls**: One-to-Many (tenantId)
4. **User → Polls**: One-to-Many (createdBy)
5. **Poll → Responses**: One-to-Many (embedded)
6. **Tenant → TenantSchema**: One-to-One (slug)

### Data Flow:
```
Tenant Creation → User Registration → User Details → Poll Creation → Poll Responses → Analytics
```

---

## 📈 Performance Considerations

### Indexing Strategy:
- **Compound Indexes**: For multi-field queries
- **Text Indexes**: For search functionality
- **TTL Indexes**: For data expiration
- **Sparse Indexes**: For optional fields

### Sharding Strategy:
- **Shard Key**: `tenantId` (for multi-tenant isolation)
- **Chunk Size**: 64MB (default)
- **Balancing**: Automatic

### Caching Strategy:
- **Redis**: Session storage, API responses
- **Application Cache**: Frequently accessed data
- **CDN**: Static assets, generated CSS

---

## 🔒 Security & Access Control

### Authentication:
- JWT tokens for API access
- Session-based authentication for web
- Multi-factor authentication (optional)

### Authorization:
- Role-based access control (RBAC)
- Tenant isolation
- Resource-level permissions

### Data Protection:
- Field-level encryption for sensitive data
- Audit logging for all operations
- Data retention policies

---

## 📊 Analytics & Monitoring

### Metrics to Track:
- User engagement
- Poll response rates
- System performance
- Error rates
- Usage patterns

### Monitoring:
- Database performance
- Query optimization
- Connection pooling
- Storage usage

---

## 🚀 Deployment Considerations

### MongoDB Atlas Configuration:
- **Cluster Tier**: M10 or higher for production
- **Region**: Closest to users
- **Backup**: Daily automated backups
- **Monitoring**: Cloud monitoring enabled

### Environment Variables:
```bash
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_POOL_SIZE=10
MONGODB_RETRY_WRITES=true
MONGODB_W=majority
```

### Connection Pooling:
- **Min Pool Size**: 2
- **Max Pool Size**: 10
- **Max Idle Time**: 30 seconds
- **Server Selection Timeout**: 30 seconds

---

## 🔧 Maintenance & Operations

### Regular Tasks:
- Index optimization
- Data archival
- Performance monitoring
- Security updates
- Backup verification

### Scaling Strategy:
- Horizontal scaling via sharding
- Read replicas for analytics
- Caching layer expansion
- CDN integration

---

## 📋 Implementation Checklist

### Phase 1: Core Setup
- [ ] Create MongoDB Atlas cluster
- [ ] Configure network access
- [ ] Set up database users
- [ ] Create initial collections
- [ ] Configure indexes

### Phase 2: Application Integration
- [ ] Update connection strings
- [ ] Test database connections
- [ ] Implement data migration
- [ ] Set up monitoring
- [ ] Configure backups

### Phase 3: Optimization
- [ ] Performance tuning
- [ ] Index optimization
- [ ] Query optimization
- [ ] Caching implementation
- [ ] Security hardening

---

## 🎯 Success Metrics

### Performance Targets:
- **Query Response Time**: < 100ms for 95% of queries
- **Connection Pool Utilization**: < 80%
- **Index Hit Ratio**: > 95%
- **Storage Growth**: < 10% per month

### Business Metrics:
- **User Registration**: Track conversion rates
- **Poll Engagement**: Monitor response rates
- **Tenant Retention**: Measure subscription renewals
- **System Uptime**: Target 99.9% availability 