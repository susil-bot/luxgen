# My Training Interface

A comprehensive training management interface that provides participants with a complete view of their learning journey, progress tracking, and access to training materials.

## Features

### 🎯 Overview Dashboard
- **Training Statistics**: Total programs, hours learned, certificates earned, and current streak
- **Recent Activity**: Latest program interactions and progress updates
- **Recommended Learning Paths**: AI-powered suggestions for next steps
- **Weekly Progress Chart**: Visual representation of learning activity

### 📚 My Programs
- **Program Grid**: Visual cards showing enrolled programs with thumbnails
- **Progress Tracking**: Real-time progress bars and completion status
- **Search & Filter**: Find programs by name, status, or category
- **Sort Options**: Sort by recent activity, progress, name, or duration
- **Program Details**: Modal with detailed module information and actions

### 📝 Assessments
- **Available Assessments**: List of quizzes and tests for enrolled programs
- **Assessment Details**: Passing scores, time limits, and attempt history
- **Take Assessment**: Direct access to assessment interface
- **Progress Tracking**: View previous attempts and scores

### 📖 Materials Library
- **Training Materials**: Videos, documents, presentations, and files
- **Material Types**: Support for various content formats
- **Download Options**: Offline access to training materials
- **Organization**: Materials grouped by program and module

### 🏆 Certificates
- **Earned Certificates**: Digital certificates for completed programs
- **Certificate Details**: Completion dates, instructor information, and ratings
- **Download Options**: PDF certificate downloads
- **Sharing**: Social sharing capabilities for achievements

### 📊 Analytics
- **Skill Progress**: Visual progress tracking for different skills
- **Learning Statistics**: Average scores, completion rates, and streaks
- **Performance Metrics**: Detailed analytics and insights
- **Progress Trends**: Historical data and improvement tracking

## Components

### MyTrainingInterface
The main component that orchestrates all training functionality.

**Props**: None (uses context for user data)

**State**:
- `activeTab`: Current active tab ('overview' | 'programs' | 'assessments' | 'materials' | 'certificates' | 'analytics')
- `programs`: Array of enrolled training programs
- `assessments`: Array of available assessments
- `learningPaths`: Array of recommended learning paths
- `stats`: Training statistics and analytics
- `loading`: Loading state for data fetching
- `searchTerm`: Search filter for programs
- `filterStatus`: Status filter for programs
- `filterCategory`: Category filter for programs
- `sortBy`: Sort option for programs
- `selectedProgram`: Currently selected program for details
- `showProgramDetails`: Modal visibility state

## API Integration

### Required API Endpoints

```typescript
// Training Programs
GET /training/courses - Get enrolled programs
GET /training/learning-paths - Get recommended learning paths
POST /training/programs/{programId}/modules/{moduleId}/start - Start a module
POST /training/programs/{programId}/modules/{moduleId}/complete - Complete a module

// Assessments
GET /training/assessments - Get available assessments
POST /training/assessments/{assessmentId}/start - Start an assessment

// Certificates
GET /training/programs/{programId}/certificate - Download certificate

// Analytics
GET /training/participants/{participantId}/stats - Get participant statistics
```

### Data Types

```typescript
interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  modules: TrainingModule[];
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  thumbnail?: string;
  rating: number;
  enrolledAt: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  lastAccessed?: string;
  estimatedCompletion?: string;
  certificate?: string;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'interactive';
  duration: number;
  content: string;
  isRequired: boolean;
  order: number;
  isCompleted: boolean;
  materials: TrainingMaterial[];
  quiz?: Quiz;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  programId: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit?: number;
  isActive: boolean;
  attempts: AssessmentAttempt[];
  nextAttemptDate?: string;
}

interface TrainingStats {
  totalPrograms: number;
  completedPrograms: number;
  inProgressPrograms: number;
  totalHoursLearned: number;
  averageScore: number;
  certificatesEarned: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: WeeklyProgress[];
  skillProgress: SkillProgress[];
}
```

## Usage

### Basic Implementation

```tsx
import MyTrainingInterface from './components/training/MyTrainingInterface';

function App() {
  return (
    <AuthProvider>
      <MyTrainingInterface />
    </AuthProvider>
  );
}
```

### With Custom Styling

```tsx
import MyTrainingInterface from './components/training/MyTrainingInterface';

function CustomTrainingPage() {
  return (
    <div className="custom-training-container">
      <MyTrainingInterface />
    </div>
  );
}
```

## Features in Detail

### Program Management
- **Enrollment Tracking**: Monitor enrollment status and dates
- **Progress Visualization**: Real-time progress bars and completion percentages
- **Module Navigation**: Easy access to individual training modules
- **Status Updates**: Track program status (not started, in progress, completed, paused)

### Assessment System
- **Multiple Attempts**: Support for retaking assessments
- **Time Limits**: Configurable time constraints for assessments
- **Passing Scores**: Minimum score requirements for completion
- **Attempt History**: View previous attempts and scores

### Material Access
- **Multi-format Support**: Videos, documents, presentations, links, and files
- **Offline Access**: Download materials for offline learning
- **Progress Tracking**: Track completion of individual materials
- **Organization**: Materials organized by program and module

### Certificate Management
- **Digital Certificates**: PDF certificates for completed programs
- **Verification**: Secure certificate verification system
- **Sharing**: Social media integration for sharing achievements
- **Archival**: Historical certificate access

### Analytics & Insights
- **Skill Mapping**: Track progress across different skill areas
- **Learning Patterns**: Analyze study habits and preferences
- **Performance Metrics**: Detailed performance analytics
- **Goal Setting**: Set and track learning goals

## Accessibility Features

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast themes
- **Focus Management**: Proper focus handling for modals and tabs
- **Responsive Design**: Mobile-friendly interface

## Performance Optimizations

- **Lazy Loading**: Load data on demand
- **Caching**: Cache frequently accessed data
- **Virtual Scrolling**: Handle large lists efficiently
- **Image Optimization**: Optimized thumbnails and media
- **Bundle Splitting**: Code splitting for better performance

## Error Handling

- **API Error Recovery**: Graceful handling of API failures
- **Loading States**: Clear loading indicators
- **Error Messages**: User-friendly error messages
- **Retry Mechanisms**: Automatic retry for failed requests
- **Fallback UI**: Fallback content when data is unavailable

## Testing

The component includes comprehensive test coverage:

- **Unit Tests**: Individual component testing
- **Integration Tests**: API integration testing
- **User Interaction Tests**: Click, type, and navigation testing
- **Error Handling Tests**: Error scenario testing
- **Accessibility Tests**: Accessibility compliance testing

### Running Tests

```bash
npm test -- --testPathPattern=MyTrainingInterface
```

## Customization

### Theming
The component uses Tailwind CSS classes and can be customized through:

- **CSS Variables**: Custom CSS properties for colors and spacing
- **Tailwind Config**: Extend Tailwind configuration
- **Component Props**: Pass custom styling props

### Localization
Support for multiple languages through:

- **i18n Integration**: Internationalization support
- **Date Formatting**: Localized date and time display
- **Number Formatting**: Localized number formatting

## Dependencies

- **React**: Core framework
- **React Router**: Navigation and routing
- **Lucide React**: Icon library
- **React Hot Toast**: Toast notifications
- **Tailwind CSS**: Styling framework

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This component is part of the Trainer Platform and follows the same license terms. 