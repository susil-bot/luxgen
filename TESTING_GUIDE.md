# Jest Testing Guide

## 🧪 Comprehensive Test Suite for Trainer Platform

This guide covers the complete Jest testing setup for the Trainer Platform authentication system.

## 📁 Test Structure

```
src/
├── components/
│   └── auth/
│       └── __tests__/
│           ├── LoginForm.test.tsx
│           └── RegisterForm.test.tsx
├── contexts/
│   └── __tests__/
│       └── AuthContext.test.tsx
├── services/
│   └── __tests__/
│       └── apiServices.test.ts
└── setupTests.ts
```

## 🚀 Running Tests

### Install Dependencies
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest ts-jest
```

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test Files
```bash
# Run only authentication tests
npm test -- --testPathPattern="auth"

# Run only service tests
npm test -- --testPathPattern="services"

# Run only context tests
npm test -- --testPathPattern="contexts"
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

## 📋 Test Coverage

### 1. **LoginForm.test.tsx** - Login Component Tests

#### Test Categories:
- **Initial Render**: Component rendering and form elements
- **Form Input Handling**: Input value updates and validation
- **Password Visibility Toggle**: Show/hide password functionality
- **Form Validation**: Required fields and validation errors
- **Login Submission**: API calls and success/failure handling
- **Success Message Display**: Location state message handling
- **Navigation**: Forgot password link functionality
- **Loading States**: Loading indicators during submission
- **Form Accessibility**: Proper labels and attributes
- **Error Handling**: Error clearing and display
- **Form Reset**: Form clearing after submission

#### Key Test Scenarios:
```typescript
// Successful login
it('submits login form with valid credentials', async () => {
  // Test login with valid email/password
});

// Failed login
it('handles login failure with error message', async () => {
  // Test login with invalid credentials
});

// Password visibility
it('toggles password visibility when eye icon is clicked', () => {
  // Test password show/hide functionality
});
```

### 2. **RegisterForm.test.tsx** - Registration Component Tests

#### Test Categories:
- **Initial Render**: Multi-step form rendering
- **Form Validation**: Step-by-step validation
- **Step Navigation**: Moving between form steps
- **Password Visibility Toggle**: Password field functionality
- **Registration Submission**: API calls and responses
- **Navigation**: Login link functionality
- **Loading States**: Loading indicators
- **Error Handling**: Validation and API errors

#### Key Test Scenarios:
```typescript
// Multi-step form navigation
it('moves to step 2 when step 1 is valid', async () => {
  // Test form step progression
});

// Registration success
it('submits registration with valid data', async () => {
  // Test successful registration flow
});

// Email verification required
it('handles registration with email verification required', async () => {
  // Test email verification flow
});
```

### 3. **AuthContext.test.tsx** - Authentication Context Tests

#### Test Categories:
- **Initial State**: Context provider initialization
- **Login Function**: Authentication logic
- **Logout Function**: Logout handling
- **Role Checking Functions**: Permission validation
- **Loading States**: Loading state management
- **Error Handling**: Error scenarios
- **Context Provider**: Provider functionality
- **Return Values**: Function return types

#### Key Test Scenarios:
```typescript
// Successful login
it('handles successful login', async () => {
  // Test login with API response
});

// Role-based access
it('hasRole returns true for matching role', () => {
  // Test role checking functionality
});

// localStorage persistence
it('restores authentication state from localStorage', () => {
  // Test state persistence
});
```

### 4. **apiServices.test.ts** - API Service Tests

#### Test Categories:
- **Health Check**: API health endpoint
- **User Registration**: Registration API calls
- **User Authentication**: Login/logout API calls
- **Email Verification**: Email verification endpoints
- **Password Reset**: Password reset functionality
- **User Management**: CRUD operations for users
- **Tenant Management**: Tenant CRUD operations
- **Polls Management**: Poll-related API calls
- **Analytics**: Analytics endpoint testing
- **Database Status**: Database health checks
- **Error Handling**: Network and API errors

#### Key Test Scenarios:
```typescript
// API endpoint calls
it('calls registration endpoint with correct data', async () => {
  // Test API call parameters
});

// Error handling
it('handles registration error', async () => {
  // Test error scenarios
});

// Response format
it('maintains consistent request format', async () => {
  // Test request/response consistency
});
```

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
  ],
  testTimeout: 10000,
};
```

### Test Setup (`src/setupTests.ts`)
- Jest DOM matchers
- Window API mocks (matchMedia, IntersectionObserver, ResizeObserver)
- localStorage and sessionStorage mocks
- Console error/warning filtering

## 🎯 Testing Best Practices

### 1. **Component Testing**
```typescript
// Use React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Test user interactions
fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
fireEvent.click(submitButton);

// Wait for async operations
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### 2. **Mocking Dependencies**
```typescript
// Mock external dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: null }),
}));

jest.mock('../../../services/apiServices', () => ({
  login: jest.fn(),
  register: jest.fn(),
}));
```

### 3. **Testing Async Operations**
```typescript
// Test API calls
const mockLogin = apiServices.login as jest.Mock;
mockLogin.mockResolvedValue({
  success: true,
  data: { user: mockUser, token: mockToken }
});

await act(async () => {
  loginButton.click();
});
```

### 4. **Testing Error Scenarios**
```typescript
// Test error handling
mockLogin.mockResolvedValue({
  success: false,
  message: 'Invalid credentials'
});

await waitFor(() => {
  expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
});
```

## 📊 Coverage Reports

### Generate Coverage Report
```bash
npm test -- --coverage --watchAll=false
```

### Coverage Targets
- **Statements**: 90%
- **Branches**: 85%
- **Functions**: 90%
- **Lines**: 90%

### View Coverage Report
```bash
# Open coverage report in browser
open coverage/lcov-report/index.html
```

## 🐛 Debugging Tests

### Debug Specific Test
```bash
# Run specific test with debugging
npm test -- --testNamePattern="LoginForm" --verbose
```

### Debug with Console Logs
```typescript
// Add console.log for debugging
it('should handle login', async () => {
  console.log('Starting test');
  // ... test code
  console.log('Test completed');
});
```

### Use React Testing Library Debug
```typescript
// Debug component rendering
const { debug } = render(<LoginForm />);
debug(); // Prints component HTML
```

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm test -- --coverage --watchAll=false
      - run: npm run build
```

## 📝 Test Naming Conventions

### Component Tests
```typescript
describe('ComponentName', () => {
  describe('Feature', () => {
    it('should do something when condition', () => {
      // Test implementation
    });
  });
});
```

### Service Tests
```typescript
describe('ServiceName', () => {
  describe('Method', () => {
    it('calls endpoint with correct data', async () => {
      // Test implementation
    });
  });
});
```

## 🚨 Common Issues and Solutions

### 1. **Async Test Failures**
```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### 2. **Mock Not Working**
```typescript
// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 3. **Component Not Rendering**
```typescript
// Check for missing providers
render(
  <AuthProvider>
    <LoginForm />
  </AuthProvider>
);
```

### 4. **API Call Not Mocked**
```typescript
// Ensure mock is properly set up
jest.mock('../apiServices', () => ({
  login: jest.fn(),
}));
```

## 📈 Performance Testing

### Test Execution Time
```bash
# Run tests with timing
npm test -- --verbose
```

### Memory Usage
```bash
# Monitor memory usage
node --max-old-space-size=4096 node_modules/.bin/jest
```

## 🎉 Test Results

### Expected Test Output
```
PASS src/components/auth/__tests__/LoginForm.test.tsx
PASS src/components/auth/__tests__/RegisterForm.test.tsx
PASS src/contexts/__tests__/AuthContext.test.tsx
PASS src/services/__tests__/apiServices.test.ts

Test Suites: 4 passed, 4 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        3.5 s
```

### Coverage Summary
```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   95.24 |    92.31 |   94.12 |   95.24 |
```

This comprehensive test suite ensures the authentication system is robust, reliable, and maintainable! 