# JobPost Component

A comprehensive job posting management component for the LuxGen platform, following the 10-file component structure with full admin/user permission controls and engagement functionality.

## 📁 Component Structure

```
jobpost/
├── index.tsx                    # Main JobPost component
├── JobPostHelper.ts             # Utility functions
├── JobPostFetcher.ts            # API calls
├── JobPostTransformer.ts       # Data transformation
├── JobPost.spec.ts              # Unit tests
├── queries.ts                   # Database queries
├── fixture.ts                    # Mock data
├── types.ts                     # TypeScript interfaces
├── constants.ts                 # Constants and configuration
└── README.md                   # Documentation
```

## 🚀 Features

### **Admin/Super Admin Features**
- ✅ **Create Job Posts** - Full job post creation with rich form
- ✅ **Edit Job Posts** - Update existing job posts
- ✅ **Delete Job Posts** - Remove job posts with confirmation
- ✅ **Manage Status** - Change job post status (active, inactive, draft, archived)
- ✅ **Analytics Dashboard** - View engagement metrics and statistics

### **User Features**
- ✅ **View Job Posts** - Browse all available job postings
- ✅ **Search & Filter** - Find job posts by department, location, type, status
- ✅ **Like/Unlike** - Engage with job posts through likes
- ✅ **Comment** - Add comments to job posts
- ✅ **Share** - Share job posts with others
- ✅ **Bookmark** - Save job posts for later viewing

### **Engagement Features**
- ✅ **Like System** - Like/unlike job posts with real-time updates
- ✅ **Comment System** - Add comments with user attribution
- ✅ **Share System** - Share job posts across platforms
- ✅ **View Tracking** - Track job post views and engagement
- ✅ **Bookmark System** - Save job posts for later reference

## 🎯 Usage

### **Basic Usage**
```tsx
import { JobPost } from './components/jobpost';

function JobPostPage() {
  const user = {
    id: 'user1',
    role: 'admin',
    // ... other user properties
  };

  return (
    <JobPost 
      user={user}
      isAdmin={true}
      isSuperAdmin={false}
      onError={(error) => console.error('JobPost Error:', error)}
    />
  );
}
```

### **User-Only View**
```tsx
import { JobPost } from './components/jobpost';

function JobPostFeed() {
  const user = {
    id: 'user2',
    role: 'user',
    // ... other user properties
  };

  return (
    <JobPost 
      user={user}
      isAdmin={false}
      isSuperAdmin={false}
    />
  );
}
```

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |
| `onError` | `(error: Error) => void` | `undefined` | Error callback function |
| `user` | `User` | `undefined` | Current user object |
| `isAdmin` | `boolean` | `false` | Whether user is admin |
| `isSuperAdmin` | `boolean` | `false` | Whether user is super admin |

## 📊 Data Types

### **JobPostItem**
```typescript
interface JobPostItem {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  status: 'active' | 'inactive' | 'draft' | 'archived';
  salary?: number;
  requirements: string;
  benefits: string[];
  skills: string[];
  experience: string;
  education: string;
  company: string;
  contactEmail: string;
  contactPhone?: string;
  applicationDeadline?: string;
  startDate?: string;
  isRemote: boolean;
  isUrgent: boolean;
  isFeatured: boolean;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  metadata: Record<string, any>;
}
```

### **JobPostFilters**
```typescript
interface JobPostFilters {
  status: string;
  department: string;
  location: string;
  type: string;
}
```

## 🎨 Styling

The component uses Tailwind CSS classes and follows the LuxGen design system:

- **Primary Colors**: Blue (#3B82F6) for primary actions
- **Success Colors**: Green for positive actions
- **Warning Colors**: Yellow for urgent items
- **Error Colors**: Red for errors and destructive actions
- **Neutral Colors**: Gray for secondary information

## 🔒 Permissions

### **Admin Permissions**
- Create new job posts
- Edit their own job posts
- Delete their own job posts
- View all job posts
- Access analytics

### **Super Admin Permissions**
- All admin permissions
- Edit any job post
- Delete any job post
- Manage all job posts
- Access advanced analytics

### **User Permissions**
- View active job posts
- Like/unlike job posts
- Comment on job posts
- Share job posts
- Bookmark job posts

## 🧪 Testing

Run the test suite:
```bash
npm test -- --testPathPattern=JobPost.spec.ts
```

### **Test Coverage**
- ✅ Component rendering
- ✅ User interactions
- ✅ Permission controls
- ✅ Error handling
- ✅ Helper functions
- ✅ API integration
- ✅ Data transformation

## 📈 Analytics

The component provides comprehensive analytics:

- **Engagement Metrics**: Likes, comments, shares, views
- **Performance Tracking**: Job post performance over time
- **User Behavior**: User interaction patterns
- **Content Analysis**: Most popular job posts and skills

## 🔄 State Management

The component manages its own state using React hooks:

- **Loading States**: For API calls and data fetching
- **Error States**: For error handling and user feedback
- **Filter States**: For search and filtering functionality
- **Pagination States**: For paginated data display

## 🚀 Performance

### **Optimizations**
- ✅ **Memoization**: React.memo for component optimization
- ✅ **useMemo**: For expensive calculations
- ✅ **useCallback**: For function optimization
- ✅ **Lazy Loading**: For large datasets
- ✅ **Debouncing**: For search input

### **Bundle Size**
- Component: ~15KB gzipped
- Dependencies: ~8KB gzipped
- Total: ~23KB gzipped

## 🔧 Configuration

### **Environment Variables**
```env
REACT_APP_API_BASE_URL=https://api.luxgen.com
REACT_APP_JOB_POSTS_PER_PAGE=10
REACT_APP_MAX_JOB_POSTS=100
```

### **Constants**
```typescript
const JOB_POST_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },
  VALIDATION: {
    TITLE: { MIN_LENGTH: 5, MAX_LENGTH: 200 },
    DESCRIPTION: { MIN_LENGTH: 20, MAX_LENGTH: 2000 }
  }
};
```

## 🐛 Troubleshooting

### **Common Issues**

1. **Permission Errors**
   - Ensure user has correct role
   - Check isAdmin/isSuperAdmin props

2. **API Errors**
   - Verify API endpoints are correct
   - Check network connectivity
   - Validate API responses

3. **Rendering Issues**
   - Check component props
   - Verify data structure
   - Check console for errors

### **Debug Mode**
Enable debug mode by setting:
```typescript
const DEBUG = process.env.NODE_ENV === 'development';
```

## 📚 Examples

### **Create Job Post**
```typescript
const jobPostData = {
  title: 'Senior Developer',
  description: 'Join our team...',
  department: 'Engineering',
  location: 'Remote',
  type: 'full-time',
  salary: 120000,
  requirements: '5+ years experience...',
  skills: ['JavaScript', 'React', 'Node.js'],
  benefits: ['Health Insurance', '401(k)'],
  isRemote: true,
  isUrgent: false,
  isFeatured: true
};

await JobPostFetcher.createJobPost(jobPostData);
```

### **Filter Job Posts**
```typescript
const filters = {
  status: 'active',
  department: 'engineering',
  location: 'remote',
  type: 'full-time'
};

const result = await JobPostFetcher.getJobPosts({
  page: 1,
  limit: 10,
  filters
});
```

### **Engage with Job Post**
```typescript
// Like a job post
await JobPostFetcher.likeJobPost('job-post-id');

// Comment on a job post
await JobPostFetcher.commentJobPost('job-post-id', 'Great opportunity!');

// Share a job post
await JobPostFetcher.shareJobPost('job-post-id');
```

## 🤝 Contributing

1. Follow the LuxGen component structure
2. Write comprehensive tests
3. Update documentation
4. Follow TypeScript best practices
5. Ensure accessibility compliance

## 📄 License

This component is part of the LuxGen platform and follows the project's licensing terms.
