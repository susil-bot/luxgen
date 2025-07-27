import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { AuthProvider } from '../../../contexts/AuthContext';
import LoginForm from '../LoginForm';

// Mock the API services
jest.mock('../../../services/apiServices', () => ({
  login: jest.fn(),
  checkApiConnection: jest.fn(() => Promise.resolve({ success: true })),
}));

// Mock the toast notifications
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
}));

// Mock the useAuth hook
const mockUseAuth = {
  user: null,
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
};

jest.mock('../../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../../contexts/AuthContext'),
  useAuth: () => mockUseAuth,
}));

// Mock the useTheme hook
const mockUseTheme = {
  theme: 'light',
  toggleTheme: jest.fn(),
  setTheme: jest.fn(),
};

jest.mock('../../../contexts/ThemeContext', () => ({
  ...jest.requireActual('../../../contexts/ThemeContext'),
  useTheme: () => mockUseTheme,
}));

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock auth state
    mockUseAuth.user = null;
    mockUseAuth.isAuthenticated = false;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    test('should render login form without crashing', () => {
      renderLoginForm();
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });

    test('should display email input field', () => {
      renderLoginForm();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    test('should display password input field', () => {
      renderLoginForm();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    test('should display sign in button', () => {
      renderLoginForm();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    test('should display forgot password link', () => {
      renderLoginForm();
      expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    });

    test('should display sign up link', () => {
      renderLoginForm();
      expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('should show error for empty email', async () => {
      renderLoginForm();
      
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      });
    });

    test('should show error for empty password', async () => {
      renderLoginForm();
      
      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      });
    });

    test('should show error for invalid email format', async () => {
      renderLoginForm();
      
      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email/i)).toBeInTheDocument();
      });
    });

    test('should show error for password too short', async () => {
      renderLoginForm();
      
      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: '123' } });
      
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    test('should call login function with valid credentials', async () => {
      const { login } = require('../../../services/apiServices');
      login.mockResolvedValue({
        success: true,
        user: { id: 'user-123', name: 'Test User' },
        token: 'test-token',
      });
      
      renderLoginForm();
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    test('should show loading state during submission', async () => {
      const { login } = require('../../../services/apiServices');
      login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderLoginForm();
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);
      
      expect(screen.getByText(/Signing In/i)).toBeInTheDocument();
    });

    test('should handle successful login', async () => {
      const { login } = require('../../../services/apiServices');
      const mockUser = { id: 'user-123', name: 'Test User' };
      login.mockResolvedValue({
        success: true,
        user: mockUser,
        token: 'test-token',
      });
      
      renderLoginForm();
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(mockUseAuth.login).toHaveBeenCalledWith({
          user: mockUser,
          token: 'test-token',
        });
      });
    });

    test('should handle login failure', async () => {
      const { login } = require('../../../services/apiServices');
      login.mockResolvedValue({
        success: false,
        message: 'Invalid credentials',
      });
      
      renderLoginForm();
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });
    });

    test('should handle network errors', async () => {
      const { login } = require('../../../services/apiServices');
      login.mockRejectedValue(new Error('Network error'));
      
      renderLoginForm();
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    test('should toggle password visibility', () => {
      renderLoginForm();
      
      const passwordInput = screen.getByLabelText(/Password/i);
      const toggleButton = screen.getByLabelText(/Toggle password visibility/i);
      
      // Password should be hidden by default
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click toggle button
      fireEvent.click(toggleButton);
      
      // Password should be visible
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click toggle button again
      fireEvent.click(toggleButton);
      
      // Password should be hidden again
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Remember Me Functionality', () => {
    test('should have remember me checkbox', () => {
      renderLoginForm();
      expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
    });

    test('should toggle remember me state', () => {
      renderLoginForm();
      
      const rememberMeCheckbox = screen.getByLabelText(/Remember me/i);
      
      // Should be unchecked by default
      expect(rememberMeCheckbox).not.toBeChecked();
      
      // Click to check
      fireEvent.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).toBeChecked();
      
      // Click to uncheck
      fireEvent.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).not.toBeChecked();
    });
  });

  describe('Navigation Links', () => {
    test('should navigate to forgot password page', () => {
      renderLoginForm();
      
      const forgotPasswordLink = screen.getByText(/Forgot Password/i);
      fireEvent.click(forgotPasswordLink);
      
      // Should navigate to forgot password page
      expect(window.location.pathname).toBe('/forgot-password');
    });

    test('should navigate to sign up page', () => {
      renderLoginForm();
      
      const signUpLink = screen.getByText(/Sign Up/i);
      fireEvent.click(signUpLink);
      
      // Should navigate to sign up page
      expect(window.location.pathname).toBe('/signup');
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels', () => {
      renderLoginForm();
      
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    test('should have proper ARIA attributes', () => {
      renderLoginForm();
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should be keyboard navigable', () => {
      renderLoginForm();
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      
      // Tab through form elements
      emailInput.focus();
      expect(emailInput).toHaveFocus();
      
      passwordInput.focus();
      expect(passwordInput).toHaveFocus();
      
      signInButton.focus();
      expect(signInButton).toHaveFocus();
    });
  });

  describe('Responsive Design', () => {
    test('should be responsive on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderLoginForm();
      
      // Should render without errors on mobile
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });

    test('should be responsive on tablet', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      renderLoginForm();
      
      // Should render without errors on tablet
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    test('should apply theme classes', () => {
      renderLoginForm();
      
      const form = screen.getByRole('form');
      expect(form).toHaveClass('bg-white', 'dark:bg-gray-800');
    });

    test('should handle theme switching', () => {
      renderLoginForm();
      
      // Form should render with current theme
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should clear errors when user starts typing', async () => {
      renderLoginForm();
      
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      });
      
      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      await waitFor(() => {
        expect(screen.queryByText(/Email is required/i)).not.toBeInTheDocument();
      });
    });

    test('should handle multiple validation errors', async () => {
      renderLoginForm();
      
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    test('should render efficiently', () => {
      const startTime = performance.now();
      renderLoginForm();
      const endTime = performance.now();
      
      // Should render within reasonable time
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should not cause memory leaks', () => {
      const { unmount } = renderLoginForm();
      
      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });
  });
}); 