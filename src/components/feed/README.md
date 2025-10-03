# ActivityFeed Component

A comprehensive activity feed component for the LuxGen platform that displays real-time activities, engagement metrics, and user interactions.

## Overview

The ActivityFeed component provides a social media-like feed interface for displaying various types of activities within the LuxGen training platform. It supports filtering, searching, engagement actions, and real-time updates.

## Features

- **Real-time Activity Display**: Shows various types of activities (user joins, training completions, assessments, etc.)
- **Interactive Engagement**: Like, comment, and share functionality
- **Advanced Filtering**: Filter by activity type, date range, users, and tags
- **Search Functionality**: Full-text search across activities
- **Statistics Dashboard**: Real-time engagement metrics and analytics
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Multi-tenant Support**: Tenant-isolated data and operations
- **Accessibility**: ARIA labels and keyboard navigation support

## Component Structure

Following LuxGen component structure rules, the ActivityFeed component includes all 10 required files:

```
ActivityFeed/
├── index.tsx                 # Main component
├── helpers/
│   └── ActivityFeedHelper.js # Utility functions
├── fetchers/
│   └── ActivityFeedFetcher.js # API calls
├── transformers/
│   └── ActivityFeedTransformer.js # Data transformation
├── specs/
│   └── ActivityFeed.spec.js  # Unit tests
├── queries.js               # Database queries
├── fixture.js               # Mock data
├── types/
│   └── types.ts             # TypeScript types
├── constants/
│   └── constants.ts         # Constants
└── README.md               # Documentation
```

## Usage

### Basic Implementation

```tsx
import ActivityFeed from './components/feed';

const App = () => {
  return (
    <div className="app">
      <ActivityFeed />
    </div>
  );
};
```

### With Custom Props

```tsx
import ActivityFeed from './components/feed';

const App = () => {
  const handleActivityClick = (activity) => {
    console.log('Activity clicked:', activity);
  };

  const handleActivityAction = (activityId, action) => {
    console.log('Action performed:', action, 'on', activityId);
  };

  return (
    <ActivityFeed
      tenantId="tenant-123"
      userId="user-456"
      onActivityClick={handleActivityClick}
      onActivityAction={handleActivityAction}
    />
  );
};
```

## API Integration

### Required API Endpoints

The component expects the following API endpoints to be available:

- `GET /api/activities` - Fetch activities
- `GET /api/activities/stats` - Fetch feed statistics
- `POST /api/activities/{id}/actions` - Perform activity actions
- `GET /api/activities/search` - Search activities

### Database Schema

The component expects the following database collections:

#### Activities Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  type: String, // user_joined, program_created, etc.
  userId: ObjectId,
  tenantId: ObjectId,
  metadata: Object,
  tags: [String],
  likes: Number,
  comments: Number,
  shares: Number,
  visibility: String, // public, private, internal
  priority: Number,
  status: String, // active, archived, deleted
  createdAt: Date,
  updatedAt: Date
}
```

#### Activity Actions Collection
```javascript
{
  _id: ObjectId,
  activityId: ObjectId,
  userId: ObjectId,
  tenantId: ObjectId,
  action: String, // like, comment, share, bookmark
  metadata: Object,
  createdAt: Date
}
```

## Configuration

### Constants

The component uses various constants defined in `constants/constants.ts`:

```typescript
export const FEED_CONSTANTS = {
  ACTIVITY_TYPES: {
    USER_JOINED: 'user_joined',
    PROGRAM_CREATED: 'program_created',
    // ... more types
  },
  FILTER_OPTIONS: [
    { value: 'all', label: 'All Activities' },
    // ... more options
  ],
  DEFAULT_SETTINGS: {
    autoRefresh: true,
    refreshInterval: 30000,
    itemsPerPage: 20,
    // ... more settings
  }
};
```

### Settings

The component supports various settings that can be configured:

```typescript
interface ActivityFeedSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  itemsPerPage: number;
  showTimestamps: boolean;
  showUserAvatars: boolean;
  enableNotifications: boolean;
  defaultFilter: ActivityFeedFilter;
  sortOrder: 'asc' | 'desc';
  groupByDate: boolean;
}
```

## Activity Types

The component supports the following activity types:

- `user_joined` - New user registration
- `program_created` - Training program creation
- `session_completed` - Training session completion
- `assessment_taken` - Assessment completion
- `training_started` - Training program start
- `certificate_earned` - Certificate achievement
- `feedback_submitted` - Feedback submission
- `poll_created` - Poll creation
- `announcement` - System announcements
- `milestone_reached` - Milestone achievement

## Styling

The component uses Tailwind CSS classes and follows the LuxGen design system:

- **Colors**: Activity type-specific color schemes
- **Icons**: Lucide React icons for consistency
- **Layout**: Responsive grid system
- **Dark Mode**: Full dark mode support
- **Animations**: Smooth transitions and hover effects

## Performance

### Optimization Features

- **Virtual Scrolling**: For large activity lists
- **Debounced Search**: Prevents excessive API calls
- **Caching**: Client-side caching of activities
- **Lazy Loading**: Progressive loading of activities
- **Memoization**: React.memo for component optimization

### Performance Settings

```typescript
PERFORMANCE: {
  VIRTUAL_SCROLLING_THRESHOLD: 100,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  MAX_CONCURRENT_REQUESTS: 5
}
```

## Accessibility

The component includes comprehensive accessibility features:

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling
- **Color Contrast**: WCAG compliant color schemes
- **Screen Reader Support**: Semantic HTML structure

### Keyboard Shortcuts

- `r` - Refresh activities
- `/` - Focus search input
- `f` - Toggle filters
- `m` - Load more activities

## Testing

### Unit Tests

The component includes comprehensive unit tests covering:

- Component rendering
- User interactions
- API integration
- Helper functions
- Data transformation
- Error handling

### Test Structure

```javascript
describe('ActivityFeed Component', () => {
  describe('Rendering', () => {
    // Test rendering scenarios
  });
  
  describe('Interactions', () => {
    // Test user interactions
  });
  
  describe('API Integration', () => {
    // Test API calls
  });
});
```

## Error Handling

The component includes robust error handling:

- **Network Errors**: Graceful handling of API failures
- **Validation Errors**: Input validation and sanitization
- **Loading States**: Proper loading indicators
- **Fallback Data**: Mock data for development
- **Error Boundaries**: React error boundaries for crashes

## Security

### Data Protection

- **Tenant Isolation**: Strict tenant-based data separation
- **Input Validation**: All inputs are validated and sanitized
- **XSS Prevention**: Proper escaping of user content
- **CSRF Protection**: CSRF tokens for state-changing operations

### Privacy

- **Data Minimization**: Only necessary data is fetched
- **User Consent**: Respects user privacy settings
- **Audit Logging**: Activity actions are logged for audit

## Deployment

### Environment Variables

```bash
REACT_APP_API_BASE_URL=https://api.luxgen.com
REACT_APP_FEED_REFRESH_INTERVAL=30000
REACT_APP_FEED_ITEMS_PER_PAGE=20
```

### Build Configuration

The component is built with:
- **React 18**: Latest React features
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **Jest**: Testing framework

## Troubleshooting

### Common Issues

1. **Activities not loading**
   - Check API endpoints are accessible
   - Verify tenant ID is correct
   - Check network connectivity

2. **Search not working**
   - Ensure search API endpoint is implemented
   - Check search query format
   - Verify database indexes

3. **Performance issues**
   - Reduce items per page
   - Enable virtual scrolling
   - Check API response times

### Debug Mode

Enable debug mode by setting:

```javascript
localStorage.setItem('feed-debug', 'true');
```

This will log detailed information about:
- API calls
- Data transformations
- Component state changes
- Performance metrics

## Contributing

### Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npm test
   ```

### Code Standards

- Follow LuxGen coding standards
- Use TypeScript for type safety
- Write comprehensive tests
- Document all functions
- Follow component structure rules

## License

This component is part of the LuxGen platform and follows the same licensing terms.

## Support

For support and questions:
- Check the documentation
- Review the test cases
- Contact the development team
- Create an issue in the repository
