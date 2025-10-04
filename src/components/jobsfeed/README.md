# JobsFeed Component

A comprehensive job feed component that displays job postings with infinite scroll, filtering, and search capabilities, following the LuxGen component architecture.

## Architecture

This component follows the LuxGen component structure with:

- **index.tsx** - Main React component
- **JobsFeedHelper.ts** - Utility functions and business logic
- **fetcher.ts** - API data fetching logic
- **transformer.ts** - Data transformation between API and component formats
- **types.ts** - TypeScript interfaces and type definitions
- **constants.ts** - Configuration constants
- **queries.ts** - Database query builders
- **JobsFeed.spec.ts** - Unit tests
- **README.md** - Documentation

## Features

### Core Functionality
- **Infinite Scroll** - Load jobs progressively as user scrolls
- **Advanced Filtering** - Filter by location, job type, experience, salary
- **Search** - Full-text search across job titles, descriptions, and skills
- **Sorting** - Sort by title, company, location, salary, date, views, applications
- **Real-time Updates** - Live data from backend API

### Multi-tenancy Support
- **Tenant Isolation** - All queries include tenantId for data isolation
- **Dynamic Configuration** - Tenant-specific settings and branding
- **Role-based Access** - Different views for different user roles

### UI/UX Features
- **LinkedIn-style Design** - Professional, modern interface
- **Responsive Layout** - Works on all device sizes
- **Loading States** - Skeleton loading and progress indicators
- **Error Handling** - Graceful error states with retry options
- **Accessibility** - ARIA labels and keyboard navigation

## Usage

```tsx
import JobsFeed from './components/jobsfeed';

function App() {
  const handleError = (error: Error) => {
    console.error('JobsFeed Error:', error);
  };

  const handleSuccess = (message: string) => {
    console.log('JobsFeed Success:', message);
  };

  return (
    <JobsFeed
      onError={handleError}
      onSuccess={handleSuccess}
    />
  );
}
```

## API Integration

### Endpoints Used
- `GET /api/v1/jobs` - Fetch jobs with pagination and filters
- `GET /api/v1/jobs/featured` - Fetch featured jobs
- `GET /api/v1/jobs/statistics` - Get job statistics
- `GET /api/v1/jobs/search` - Search jobs

### Query Parameters
- `page` - Page number for pagination
- `limit` - Number of jobs per page
- `search` - Search query
- `location` - Location filter
- `jobType` - Job type filter
- `experience` - Experience level filter
- `salary` - Salary range filter
- `sortBy` - Sort field
- `sortOrder` - Sort direction (asc/desc)

## Data Flow

1. **Component Mount** - Initialize state and fetch initial data
2. **User Interaction** - Handle search, filters, sorting
3. **API Call** - Transform user input to API parameters
4. **Data Fetching** - Use fetcher to get data from API
5. **Data Transformation** - Transform API response to component format
6. **State Update** - Update component state with transformed data
7. **UI Render** - Render jobs with proper formatting

## Multi-tenancy

### Tenant Isolation
All API calls include the current tenant ID to ensure data isolation:

```typescript
// Fetcher automatically includes tenantId
const response = await JobsFeedFetcher.getJobs({
  page: 1,
  limit: 10,
  filters: { search: 'engineer' }
});
```

### Tenant-specific Features
- **Branding** - Tenant-specific colors, logos, and styling
- **Permissions** - Role-based access to different features
- **Configuration** - Tenant-specific settings and limits

## Performance Optimization

### Caching
- **API Response Caching** - Cache API responses for 5 minutes
- **Filter Caching** - Cache filter states for 30 minutes
- **Statistics Caching** - Cache job statistics for 15 minutes

### Lazy Loading
- **Infinite Scroll** - Load jobs on demand
- **Image Lazy Loading** - Lazy load company logos and images
- **Component Lazy Loading** - Lazy load heavy components

### Debouncing
- **Search Debouncing** - Debounce search input by 300ms
- **Filter Debouncing** - Debounce filter changes

## Error Handling

### Error Types
- **Network Errors** - Connection issues, timeouts
- **API Errors** - Server errors, validation errors
- **Data Errors** - Invalid data format, missing fields

### Error Recovery
- **Retry Logic** - Automatic retry for failed requests
- **Fallback Data** - Show cached data when API fails
- **User Feedback** - Clear error messages with retry options

## Testing

### Unit Tests
- **Component Tests** - Test component rendering and behavior
- **Helper Tests** - Test utility functions
- **Transformer Tests** - Test data transformation
- **Fetcher Tests** - Test API integration

### Test Coverage
- **Component Logic** - 100% coverage of component methods
- **Helper Functions** - 100% coverage of utility functions
- **Error Scenarios** - Test all error conditions
- **Edge Cases** - Test boundary conditions

## Configuration

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_CACHE_TTL=300000
REACT_APP_DEBOUNCE_MS=300
```

### Constants
```typescript
export const JOBS_FEED_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  CACHE_TTL: {
    JOBS: 5 * 60 * 1000, // 5 minutes
    STATISTICS: 15 * 60 * 1000 // 15 minutes
  }
};
```

## Dependencies

### Core Dependencies
- **React** - UI framework
- **TypeScript** - Type safety
- **Lucide React** - Icons

### Custom Hooks
- **useInfiniteScroll** - Infinite scroll functionality
- **useFormValidation** - Form validation

### External Services
- **API Services** - Backend API integration
- **Authentication** - JWT token management

## Future Enhancements

### Planned Features
- **Real-time Updates** - WebSocket integration for live updates
- **Advanced Analytics** - Detailed job performance metrics
- **AI Recommendations** - ML-based job recommendations
- **Social Features** - Job sharing and collaboration
- **Mobile App** - React Native version

### Performance Improvements
- **Virtual Scrolling** - For large job lists
- **Service Worker** - Offline support
- **CDN Integration** - Faster asset loading
- **Database Optimization** - Query optimization

## Contributing

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Run tests: `npm test`
4. Build for production: `npm run build`

### Code Standards
- **TypeScript** - Strict type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing

### Git Workflow
1. Create feature branch
2. Implement changes
3. Write tests
4. Update documentation
5. Create pull request

## License

This component is part of the LuxGen platform and follows the same licensing terms.
