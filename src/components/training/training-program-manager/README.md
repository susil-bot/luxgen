# Training Program Manager

A comprehensive React component for managing training programs with a structured file organization following the established pattern.

## 📁 File Structure

```
training-program-manager/
├── client.entry.ts          # Main entry point for client-side functionality
├── fetchers.ts              # API calls and data fetching
├── fetchers.spec.js         # Unit tests for fetchers
├── transformers.ts          # Data transformation and business logic
├── transformers.spec.js     # Unit tests for transformers
├── helpers.ts               # Utility functions and helpers
├── queries.js               # Database queries and operations
├── fixture.js               # Mock data and test fixtures
├── index.ts                 # Main React component
├── types.ts                 # TypeScript interfaces and types
├── constants.ts             # Constants and configuration values
└── README.md               # This documentation file
```

## 🚀 Features

### Core Functionality
- **Program Management**: Create, read, update, delete training programs
- **Advanced Filtering**: Filter by status, category, level, type, instructor, and more
- **Search**: Full-text search across program titles, descriptions, and tags
- **Sorting**: Sort by various criteria (title, date, price, rating, etc.)
- **Pagination**: Efficient pagination for large datasets
- **Bulk Actions**: Perform actions on multiple programs at once

### Data Management
- **CRUD Operations**: Complete create, read, update, delete functionality
- **Data Validation**: Comprehensive form validation with error handling
- **Data Transformation**: Convert between API and UI formats
- **Export/Import**: CSV, Excel, and PDF export/import capabilities
- **Analytics**: Program performance metrics and statistics

### User Interface
- **Multiple View Modes**: Table, cards, and list views
- **Responsive Design**: Mobile-friendly interface
- **Accessibility**: WCAG compliant with keyboard navigation
- **Internationalization**: Multi-language support
- **Theme Support**: Customizable styling

## 🛠️ Usage

### Basic Implementation

```tsx
import TrainingProgramManager from './training-program-manager';

function App() {
  return (
    <TrainingProgramManager
      onProgramSelect={(program) => console.log('Selected:', program)}
      onProgramCreate={(program) => console.log('Created:', program)}
      onProgramUpdate={(program) => console.log('Updated:', program)}
      onProgramDelete={(programId) => console.log('Deleted:', programId)}
      showCreateButton={true}
      showFilters={true}
      showSearch={true}
      showStats={true}
      viewMode="cards"
      pageSize={12}
    />
  );
}
```

### Advanced Configuration

```tsx
import TrainingProgramManager from './training-program-manager';

function App() {
  const initialFilters = {
    status: 'published',
    category: 'technology',
    level: 'beginner',
    isActive: true,
    isPublic: true
  };

  return (
    <TrainingProgramManager
      initialFilters={initialFilters}
      onProgramSelect={handleProgramSelect}
      onProgramCreate={handleProgramCreate}
      onProgramUpdate={handleProgramUpdate}
      onProgramDelete={handleProgramDelete}
      showCreateButton={true}
      showFilters={true}
      showSearch={true}
      showStats={true}
      viewMode="table"
      pageSize={20}
    />
  );
}
```

## 📋 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onProgramSelect` | `(program: TrainingProgram) => void` | - | Callback when a program is selected |
| `onProgramCreate` | `(program: TrainingProgram) => void` | - | Callback when a program is created |
| `onProgramUpdate` | `(program: TrainingProgram) => void` | - | Callback when a program is updated |
| `onProgramDelete` | `(programId: string) => void` | - | Callback when a program is deleted |
| `initialFilters` | `TrainingProgramFilters` | `{}` | Initial filter values |
| `showCreateButton` | `boolean` | `true` | Show create program button |
| `showFilters` | `boolean` | `true` | Show filter controls |
| `showSearch` | `boolean` | `true` | Show search input |
| `showStats` | `boolean` | `true` | Show statistics cards |
| `viewMode` | `'table' \| 'cards' \| 'list'` | `'cards'` | Display mode |
| `pageSize` | `number` | `12` | Number of items per page |

### Methods

#### TrainingProgramManagerFetcher

```typescript
// Fetch all programs with filters
const programs = await TrainingProgramManagerFetcher.getTrainingPrograms(filters);

// Fetch single program
const program = await TrainingProgramManagerFetcher.getTrainingProgramById(id);

// Create new program
const newProgram = await TrainingProgramManagerFetcher.createTrainingProgram(data);

// Update program
const updatedProgram = await TrainingProgramManagerFetcher.updateTrainingProgram(id, data);

// Delete program
await TrainingProgramManagerFetcher.deleteTrainingProgram(id);

// Get statistics
const stats = await TrainingProgramManagerFetcher.getTrainingProgramStats();
```

#### TrainingProgramManagerTransformer

```typescript
// Transform API response to program format
const program = TrainingProgramManagerTransformer.transformApiResponseToProgram(apiData);

// Transform program to form data
const formData = TrainingProgramManagerTransformer.transformProgramToFormData(program);

// Transform form data to API format
const apiData = TrainingProgramManagerTransformer.transformFormDataToApi(formData);

// Transform for display
const displayData = TrainingProgramManagerTransformer.transformProgramForDisplay(program);
```

#### TrainingProgramManagerHelper

```typescript
// Validate form data
const validation = TrainingProgramManagerHelper.validateFormData(formData);

// Filter programs
const filtered = TrainingProgramManagerHelper.filterPrograms(programs, filters);

// Sort programs
const sorted = TrainingProgramManagerHelper.sortPrograms(programs, sortBy, sortOrder);

// Paginate programs
const paginated = TrainingProgramManagerHelper.paginatePrograms(programs, page, limit);

// Get statistics
const stats = TrainingProgramManagerHelper.getProgramStatistics(programs);

// Export to CSV
const csv = TrainingProgramManagerHelper.exportProgramsToCSV(programs);
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test files
npm test fetchers.spec.js
npm test transformers.spec.js

# Run with coverage
npm test -- --coverage
```

### Test Structure

- **fetchers.spec.js**: Tests for API calls and data fetching
- **transformers.spec.js**: Tests for data transformation logic
- **fixture.js**: Mock data and test fixtures

### Example Test

```javascript
describe('TrainingProgramManagerFetcher', () => {
  it('should fetch training programs successfully', async () => {
    const mockPrograms = [
      { id: '1', title: 'Test Program', status: 'active' }
    ];
    const mockResponse = {
      success: true,
      data: mockPrograms,
      pagination: { total: 1, page: 1, limit: 10 }
    };

    apiServices.getTrainingPrograms.mockResolvedValue(mockResponse);

    const result = await TrainingProgramManagerFetcher.getTrainingPrograms();

    expect(result.programs).toEqual(mockPrograms);
    expect(result.total).toBe(1);
  });
});
```

## 🎨 Styling

### CSS Classes

The component uses Tailwind CSS classes for styling:

```css
.training-program-manager {
  @apply bg-white rounded-lg border border-gray-200;
}

.program-card {
  @apply bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow;
}

.program-table {
  @apply min-w-full divide-y divide-gray-200;
}

.status-badge {
  @apply px-2 py-1 text-xs rounded-full;
}

.status-draft {
  @apply bg-yellow-100 text-yellow-800;
}

.status-published {
  @apply bg-green-100 text-green-800;
}
```

### Custom Styling

You can override default styles by providing custom CSS:

```css
.training-program-manager {
  --primary-color: #3b82f6;
  --secondary-color: #6b7280;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}
```

## 🔧 Configuration

### Environment Variables

```env
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_SUPPORTED_FORMATS=jpg,png,pdf,mp4
REACT_APP_ENABLE_ANALYTICS=true
```

### Feature Flags

```typescript
const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_BULK_ACTIONS: true,
  ENABLE_EXPORT: true,
  ENABLE_IMPORT: true
};
```

## 📊 Analytics

### Available Metrics

- **Program Views**: Number of times programs are viewed
- **Enrollments**: Number of user enrollments
- **Completions**: Number of completed programs
- **Ratings**: Average ratings and total ratings
- **Completion Rate**: Percentage of enrolled users who complete
- **Drop-off Points**: Where users typically stop

### Analytics Integration

```typescript
// Track program view
analytics.track('program_viewed', {
  programId: program.id,
  programTitle: program.title,
  category: program.category
});

// Track program creation
analytics.track('program_created', {
  programId: program.id,
  category: program.category,
  level: program.level
});
```

## 🚀 Performance

### Optimization Strategies

1. **Lazy Loading**: Load programs on demand
2. **Virtual Scrolling**: For large datasets
3. **Debounced Search**: Reduce API calls
4. **Caching**: Cache frequently accessed data
5. **Memoization**: Prevent unnecessary re-renders

### Performance Monitoring

```typescript
// Measure component render time
const startTime = performance.now();
// ... component logic
const endTime = performance.now();
console.log(`Render time: ${endTime - startTime}ms`);
```

## 🔒 Security

### Data Validation

- **Input Sanitization**: Clean user inputs
- **XSS Protection**: Prevent cross-site scripting
- **CSRF Protection**: Cross-site request forgery prevention
- **File Upload Security**: Validate file types and sizes

### Access Control

```typescript
// Check user permissions
const canCreate = user.permissions.includes('create_programs');
const canEdit = user.permissions.includes('edit_programs');
const canDelete = user.permissions.includes('delete_programs');
```

## 🌐 Internationalization

### Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)

### Usage

```typescript
import { useTranslation } from 'react-i18next';

function TrainingProgramManager() {
  const { t } = useTranslation();
  
  return (
    <h2>{t('trainingPrograms.title')}</h2>
  );
}
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check API endpoint configuration
   - Verify network connectivity
   - Check authentication tokens

2. **Data Loading Issues**
   - Verify data format matches expected structure
   - Check for missing required fields
   - Validate API response format

3. **Performance Issues**
   - Reduce page size for large datasets
   - Implement virtual scrolling
   - Optimize database queries

### Debug Mode

```typescript
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Training Program Manager Debug:', {
    programs: programs.length,
    filters: filters,
    searchTerm: searchTerm
  });
}
```

## 📝 Changelog

### Version 1.0.0
- Initial release
- Basic CRUD operations
- Filtering and search
- Export/import functionality
- Responsive design

### Version 1.1.0
- Added analytics integration
- Improved performance
- Enhanced accessibility
- Added bulk actions

### Version 1.2.0
- Added internationalization
- Enhanced security
- Improved error handling
- Added caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**Note**: This component follows the established file structure pattern with separate files for fetchers, transformers, helpers, queries, fixtures, types, constants, and comprehensive documentation.
