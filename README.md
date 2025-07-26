# Trainer Platform Frontend

A modern React TypeScript frontend application for the Trainer Platform, featuring a beautiful UI, real-time interactions, and comprehensive user management.

## 🚀 Features

- **Modern React 18**: Latest React features with hooks and concurrent rendering
- **TypeScript**: Full type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Multi-Tenant UI**: Dynamic theming and branding per tenant
- **Real-time Updates**: Live polling and notifications
- **Responsive Design**: Mobile-first responsive design
- **Dark/Light Mode**: Theme switching with system preference detection
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized bundle size and lazy loading
- **Testing**: Comprehensive test coverage

## 🏗️ Architecture

```
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── admin/       # Admin-specific components
│   │   ├── auth/        # Authentication components
│   │   ├── common/      # Shared components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── modals/      # Modal components
│   │   └── ...
│   ├── contexts/        # React contexts for state management
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services and utilities
│   ├── types/           # TypeScript type definitions
│   └── config/          # Configuration files
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (trainer-backend)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <your-frontend-repo-url>
cd trainer-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Configure API endpoint**
```bash
# Update REACT_APP_API_URL in .env
REACT_APP_API_URL=http://localhost:3001
```

## 🚀 Quick Start

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## 🎨 UI Components

### Core Components
- **Header**: Navigation and user menu
- **Sidebar**: Main navigation sidebar
- **Dashboard**: Main dashboard interface
- **Modals**: Reusable modal components
- **Forms**: Form components with validation
- **Tables**: Data tables with sorting and filtering

### Feature Components
- **Poll Management**: Create and manage polls
- **User Management**: User administration interface
- **Tenant Management**: Multi-tenant configuration
- **Analytics**: Charts and data visualization
- **Notifications**: Real-time notification system

## 🔌 API Integration

The frontend communicates with the backend API through:

- **REST API**: Standard HTTP requests
- **WebSocket**: Real-time updates
- **JWT Authentication**: Token-based auth
- **Error Handling**: Comprehensive error management

### API Services
- `apiClient.ts`: Base API client configuration
- `authService.ts`: Authentication services
- `userService.ts`: User management
- `pollService.ts`: Poll management
- `tenantService.ts`: Tenant management

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom design system
- Responsive breakpoints
- Dark mode support

### Component Styling
- CSS Modules for component-specific styles
- Tailwind utilities for rapid development
- Custom CSS variables for theming

## 🔒 Security

- **JWT Token Management**: Secure token storage and refresh
- **Input Validation**: Client-side validation
- **XSS Protection**: Sanitized inputs
- **CORS Configuration**: Proper CORS setup

## 📱 Responsive Design

- **Mobile First**: Mobile-optimized design
- **Breakpoints**: Responsive breakpoints
- **Touch Friendly**: Touch-optimized interactions
- **Progressive Enhancement**: Graceful degradation

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern=LoginForm
```

### Test Structure
- **Unit Tests**: Component and utility tests
- **Integration Tests**: API integration tests
- **E2E Tests**: End-to-end user flows

## 📦 Build & Deployment

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
docker build -t trainer-frontend .
docker run -p 3000:3000 trainer-frontend
```

## 📝 Environment Variables

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development

# Feature Flags
REACT_APP_ENABLE_AI_CHATBOT=true
REACT_APP_ENABLE_REAL_TIME=true
REACT_APP_ENABLE_ANALYTICS=true

# External Services
REACT_APP_MONGODB_ATLAS_URL=mongodb+srv://...

# Development Settings
REACT_APP_DEBUG_MODE=true
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_MOCK_DATA=false

# UI Configuration
REACT_APP_DEFAULT_THEME=light
REACT_APP_ENABLE_ANIMATIONS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

## 🚀 Performance Optimization

- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Optimized webpack configuration
- **Image Optimization**: Compressed and optimized images
- **Caching**: Browser caching strategies
- **CDN**: Content delivery network integration

## 🔧 Development Tools

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **React DevTools**: React debugging
- **Redux DevTools**: State management debugging

## 📊 Analytics & Monitoring

- **Error Tracking**: Error boundary and logging
- **Performance Monitoring**: Core Web Vitals
- **User Analytics**: User behavior tracking
- **A/B Testing**: Feature flag management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@trainerplatform.com or create an issue in the repository. 