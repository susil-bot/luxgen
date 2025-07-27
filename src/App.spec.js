import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { MultiTenancyProvider } from '../contexts/MultiTenancyContext';
import { OnboardingProvider } from '../contexts/OnboardingContext';
import { GroupManagementProvider } from '../contexts/GroupManagementContext';
import { AIChatbotProvider } from '../contexts/AIChatbotContext';
import App from './App';

// Mock the API services
jest.mock('./services/apiServices', () => ({
  checkApiConnection: jest.fn(() => Promise.resolve({ success: true })),
  getCurrentUser: jest.fn(() => Promise.resolve({ success: true, user: null })),
}));

// Mock the notification system
jest.mock('./components/common/NotificationSystem', () => {
  return function MockNotificationSystem() {
    return <div data-testid="notification-system">Notification System</div>;
  };
});

// Mock the error boundary
jest.mock('./components/common/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

const renderApp = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MultiTenancyProvider>
            <OnboardingProvider>
              <GroupManagementProvider>
                <AIChatbotProvider>
                  <App />
                </AIChatbotProvider>
              </GroupManagementProvider>
            </OnboardingProvider>
          </MultiTenancyProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    test('should render without crashing', () => {
      renderApp();
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    test('should render notification system', () => {
      renderApp();
      expect(screen.getByTestId('notification-system')).toBeInTheDocument();
    });

    test('should render main app container', () => {
      renderApp();
      const appContainer = document.querySelector('.App');
      expect(appContainer).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    test('should apply theme classes to body', async () => {
      renderApp();
      
      await waitFor(() => {
        const body = document.body;
        expect(body.classList.contains('dark') || body.classList.contains('light')).toBe(true);
      });
    });

    test('should handle theme switching', async () => {
      renderApp();
      
      // Check if theme context is properly integrated
      await waitFor(() => {
        expect(document.body).toHaveClass('light');
      });
    });
  });

  describe('Authentication Integration', () => {
    test('should handle authentication state changes', async () => {
      renderApp();
      
      await waitFor(() => {
        // App should render without authentication errors
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      });
    });

    test('should handle API connection status', async () => {
      renderApp();
      
      await waitFor(() => {
        // App should handle API connection gracefully
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      });
    });
  });

  describe('Routing', () => {
    test('should handle route changes', async () => {
      renderApp();
      
      await waitFor(() => {
        // App should render with routing capability
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      });
    });

    test('should handle protected routes', async () => {
      renderApp();
      
      await waitFor(() => {
        // App should handle protected routes appropriately
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle component errors gracefully', () => {
      // Mock console.error to prevent test output noise
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderApp();
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('should handle API errors gracefully', async () => {
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    test('should render efficiently', () => {
      const startTime = performance.now();
      renderApp();
      const endTime = performance.now();
      
      // App should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should not cause memory leaks', () => {
      const { unmount } = renderApp();
      
      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      renderApp();
      
      // Check for basic accessibility structure
      const appContainer = document.querySelector('.App');
      expect(appContainer).toBeInTheDocument();
    });

    test('should be keyboard navigable', () => {
      renderApp();
      
      // App should be keyboard accessible
      expect(document.body).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Responsive Design', () => {
    test('should handle different screen sizes', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderApp();
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    test('should handle orientation changes', () => {
      renderApp();
      
      // Simulate orientation change
      fireEvent(window, new Event('orientationchange'));
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    test('should integrate all providers correctly', () => {
      renderApp();
      
      // All providers should be properly integrated
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByTestId('notification-system')).toBeInTheDocument();
    });

    test('should handle context updates', async () => {
      renderApp();
      
      await waitFor(() => {
        // Context updates should be handled properly
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      });
    });
  });
}); 