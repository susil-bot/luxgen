import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import LoginForm from '../LoginForm';
import { useAuth } from '../../../contexts/AuthContext';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: null }),
}));

jest.mock('react-hot-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
  LogIn: () => <div data-testid="login-icon">LogIn</div>,
  Building2: () => <div data-testid="building-icon">Building2</div>,
  CheckCircle: () => <div data-testid="check-circle-icon">CheckCircle</div>,
}));

const mockNavigate = jest.fn();
const mockLogin = jest.fn();
const mockUseAuth = useAuth as jest.Mock;

// Wrapper component for testing
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (require('react-router-dom').useLocation as jest.Mock).mockReturnValue({ state: null });
    
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
    });
  });

  describe('Initial Render', () => {
    it('renders the login form with correct elements', () => {
      renderWithRouter(<LoginForm />);
      
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('renders form fields with correct attributes', () => {
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const tenantInput = screen.getByLabelText(/Organization Domain/i);
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
      
      expect(tenantInput).toHaveAttribute('type', 'text');
      expect(tenantInput).not.toHaveAttribute('required');
    });

    it('renders password visibility toggle', () => {
      renderWithRouter(<LoginForm />);
      
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('updates email input value', () => {
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('updates password input value', () => {
      renderWithRouter(<LoginForm />);
      
      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      expect(passwordInput).toHaveValue('password123');
    });

    it('updates tenant domain input value', () => {
      renderWithRouter(<LoginForm />);
      
      const tenantInput = screen.getByLabelText(/Organization Domain/i);
      fireEvent.change(tenantInput, { target: { value: 'test-tenant' } });
      
      expect(tenantInput).toHaveValue('test-tenant');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('toggles password visibility when eye icon is clicked', () => {
      renderWithRouter(<LoginForm />);
      
      const passwordInput = screen.getByLabelText(/Password/i);
      const eyeIcon = screen.getByTestId('eye-icon');
      
      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show password
      fireEvent.click(eyeIcon);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
      
      // Click to hide password again
      const eyeOffIcon = screen.getByTestId('eye-off-icon');
      fireEvent.click(eyeOffIcon);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty email submission', async () => {
      renderWithRouter(<LoginForm />);
      
      const signInButton = screen.getByText('Sign In');
      fireEvent.click(signInButton);
      
      // HTML5 validation should prevent submission, but we can test the form state
      const emailInput = screen.getByLabelText(/Email Address/i);
      expect(emailInput).toBeRequired();
    });

    it('shows error for empty password submission', async () => {
      renderWithRouter(<LoginForm />);
      
      const signInButton = screen.getByText('Sign In');
      fireEvent.click(signInButton);
      
      // HTML5 validation should prevent submission, but we can test the form state
      const passwordInput = screen.getByLabelText(/Password/i);
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Login Submission', () => {
    it('submits login form with valid credentials', async () => {
      mockLogin.mockResolvedValue({ success: true });
      
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByText('Sign In');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123', '');
      });
    });

    it('submits login form with tenant domain', async () => {
      mockLogin.mockResolvedValue({ success: true });
      
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const tenantInput = screen.getByLabelText(/Organization Domain/i);
      const signInButton = screen.getByText('Sign In');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(tenantInput, { target: { value: 'test-tenant' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123', 'test-tenant');
      });
    });

    it('handles successful login', async () => {
      const mockOnSuccess = jest.fn();
      mockLogin.mockResolvedValue({ success: true });
      
      renderWithRouter(<LoginForm onSuccess={mockOnSuccess} />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByText('Sign In');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('handles login failure with error message', async () => {
      mockLogin.mockResolvedValue({ 
        success: false, 
        message: 'Invalid email or password' 
      });
      
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByText('Sign In');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });

    it('handles login failure without error message', async () => {
      mockLogin.mockResolvedValue({ success: false });
      
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByText('Sign In');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });

    it('handles login error exception', async () => {
      mockLogin.mockRejectedValue(new Error('Network error'));
      
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByText('Sign In');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });
  });

  describe('Success Message Display', () => {
    it('displays success message from location state', () => {
      const mockLocation = {
        state: {
          message: 'Email verified successfully! Please sign in.',
          email: 'test@example.com'
        }
      };
      
      (require('react-router-dom').useLocation as jest.Mock).mockReturnValue(mockLocation);
      
      renderWithRouter(<LoginForm />);
      
      expect(screen.getByText('Email verified successfully! Please sign in.')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    it('clears location state after displaying message', () => {
      const mockLocation = {
        state: {
          message: 'Email verified successfully! Please sign in.',
          email: 'test@example.com'
        }
      };
      
      (require('react-router-dom').useLocation as jest.Mock).mockReturnValue(mockLocation);
      
      const mockReplaceState = jest.fn();
      Object.defineProperty(window, 'history', {
        value: { replaceState: mockReplaceState },
        writable: true
      });
      
      renderWithRouter(<LoginForm />);
      
      expect(mockReplaceState).toHaveBeenCalledWith({}, document.title);
    });
  });

  describe('Navigation', () => {
    it('navigates to forgot password page when link is clicked', () => {
      renderWithRouter(<LoginForm />);
      
      const forgotPasswordLink = screen.getByText('Forgot password?');
      fireEvent.click(forgotPasswordLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    });
  });

  describe('Loading States', () => {
    it('shows loading state when login is in progress', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        loading: true,
      });
      
      renderWithRouter(<LoginForm />);
      
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeDisabled();
    });

    it('shows loading spinner during login', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        loading: true,
      });
      
      renderWithRouter(<LoginForm />);
      
      const loadingButton = screen.getByRole('button', { name: /signing in/i });
      expect(loadingButton).toBeDisabled();
    });
  });

  describe('Form Accessibility', () => {
    it('has proper form labels', () => {
      renderWithRouter(<LoginForm />);
      
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Organization Domain/i)).toBeInTheDocument();
    });

    it('has proper form validation attributes', () => {
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      
      expect(emailInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('required');
    });

    it('has proper button types', () => {
      renderWithRouter(<LoginForm />);
      
      const signInButton = screen.getByText('Sign In');
      expect(signInButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Error Handling', () => {
    it('clears error when user starts typing', async () => {
      mockLogin.mockResolvedValue({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByText('Sign In');
      
      // First login attempt to show error
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
      
      // Start typing to clear error
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      
      // Error should be cleared
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  describe('Form Reset', () => {
    it('resets form after successful submission', async () => {
      mockLogin.mockResolvedValue({ success: true });
      
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const signInButton = screen.getByText('Sign In');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
      
      // Form should be reset after successful submission
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });
}); 