import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from '../RegisterForm';
import apiServices from '../../../services/apiServices';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('../../../services/apiServices');
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../../utils/errorHandler', () => ({
  useErrorHandler: () => ({
    handleError: jest.fn(),
  }),
}));

jest.mock('../../common/NotificationSystem', () => ({
  useNotifications: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );
  };

  describe('Component Rendering', () => {
    test('renders registration form with step indicator', () => {
      renderComponent();
      
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.getByText('Personal Information')).not.toBeInTheDocument();
      expect(screen.getByText('Terms & Preferences')).not.toBeInTheDocument();
      
      // Check step indicator
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('renders step 1 fields correctly', () => {
      renderComponent();
      
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('Step Navigation', () => {
    test('moves to step 2 when step 1 is valid', async () => {
      renderComponent();
      
      // Fill step 1 with valid data
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      
      fireEvent.click(screen.getByText('Next'));
      
      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
      });
    });

    test('moves to step 3 when step 2 is valid', async () => {
      renderComponent();
      
      // Fill step 1 and move to step 2
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      // Fill step 2
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/Company Name/i), {
        target: { value: 'Test Company' }
      });
      
      fireEvent.click(screen.getByText('Next'));
      
      await waitFor(() => {
        expect(screen.getByText('Terms & Preferences')).toBeInTheDocument();
        expect(screen.getByLabelText(/I agree to the/i)).toBeInTheDocument();
      });
    });

    test('goes back to previous step', async () => {
      renderComponent();
      
      // Move to step 2
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      // Go back to step 1
      fireEvent.click(screen.getByText('Previous'));
      
      await waitFor(() => {
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    test('shows validation errors for invalid email', async () => {
      renderComponent();
      
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'invalid-email' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
      });
    });

    test('shows validation errors for weak password', async () => {
      renderComponent();
      
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'weak' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 8 characters/)).toBeInTheDocument();
      });
    });

    test('shows validation errors for mismatched passwords', async () => {
      renderComponent();
      
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'DifferentPassword123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    test('shows validation errors for missing personal information', async () => {
      renderComponent();
      
      // Move to step 2
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      // Try to proceed without filling required fields
      fireEvent.click(screen.getByText('Next'));
      
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Phone number is required')).toBeInTheDocument();
        expect(screen.getByText('Company name is required')).toBeInTheDocument();
      });
    });

    test('shows validation errors for missing terms agreement', async () => {
      renderComponent();
      
      // Move to step 3
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/Company Name/i), {
        target: { value: 'Test Company' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      // Try to submit without agreeing to terms
      fireEvent.click(screen.getByText('Create Account'));
      
      await waitFor(() => {
        expect(screen.getByText('You must agree to the terms and conditions')).toBeInTheDocument();
      });
    });
  });

  describe('API Error Handling', () => {
    test('shows email error in step 1 when email already exists', async () => {
      apiServices.register.mockResolvedValue({
        success: false,
        message: 'Email already exists'
      });

      renderComponent();
      
      // Fill all steps and submit
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'existing@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/Company Name/i), {
        target: { value: 'Test Company' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.click(screen.getByLabelText(/I agree to the/i));
      fireEvent.click(screen.getByText('Create Account'));
      
      await waitFor(() => {
        // Should navigate back to step 1
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByText('This email is already registered. Please use a different email or sign in.')).toBeInTheDocument();
      });
    });

    test('shows password error in step 1 when password is weak', async () => {
      apiServices.register.mockResolvedValue({
        success: false,
        message: 'Password is too weak'
      });

      renderComponent();
      
      // Fill all steps and submit
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/Company Name/i), {
        target: { value: 'Test Company' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.click(screen.getByLabelText(/I agree to the/i));
      fireEvent.click(screen.getByText('Create Account'));
      
      await waitFor(() => {
        // Should navigate back to step 1
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByText('Password is too weak. Please choose a stronger password.')).toBeInTheDocument();
      });
    });

    test('shows personal info error in step 2 when name is missing', async () => {
      apiServices.register.mockResolvedValue({
        success: false,
        message: 'First name is required'
      });

      renderComponent();
      
      // Fill all steps and submit
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/Company Name/i), {
        target: { value: 'Test Company' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.click(screen.getByLabelText(/I agree to the/i));
      fireEvent.click(screen.getByText('Create Account'));
      
      await waitFor(() => {
        // Should navigate back to step 2
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
        expect(screen.getByText('First name is required.')).toBeInTheDocument();
      });
    });

    test('shows terms error in step 3 when terms not accepted', async () => {
      apiServices.register.mockResolvedValue({
        success: false,
        message: 'Terms and conditions must be accepted'
      });

      renderComponent();
      
      // Fill all steps and submit
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/Company Name/i), {
        target: { value: 'Test Company' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.click(screen.getByLabelText(/I agree to the/i));
      fireEvent.click(screen.getByText('Create Account'));
      
      await waitFor(() => {
        // Should navigate back to step 3
        expect(screen.getByText('Terms & Preferences')).toBeInTheDocument();
        expect(screen.getByText('You must agree to the terms and conditions.')).toBeInTheDocument();
      });
    });
  });

  describe('Successful Registration', () => {
    test('handles successful registration with automatic login', async () => {
      apiServices.register.mockResolvedValue({
        success: true,
        data: {
          token: 'mock-token',
          user: {
            id: 'user-123',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user'
          }
        }
      });

      renderComponent();
      
      // Fill all steps and submit
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/Company Name/i), {
        target: { value: 'Test Company' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.click(screen.getByLabelText(/I agree to the/i));
      fireEvent.click(screen.getByText('Create Account'));
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    test('handles successful registration with email verification', async () => {
      apiServices.register.mockResolvedValue({
        success: true,
        data: {
          registrationId: 'reg-123'
        }
      });

      renderComponent();
      
      // Fill all steps and submit
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/Company Name/i), {
        target: { value: 'Test Company' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.click(screen.getByLabelText(/I agree to the/i));
      fireEvent.click(screen.getByText('Create Account'));
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/verify-email', {
          state: { email: 'test@example.com', registrationId: 'reg-123' }
        });
      });
    });
  });

  describe('Error Clearing', () => {
    test('clears field errors when user starts typing', async () => {
      renderComponent();
      
      // Trigger validation error
      fireEvent.click(screen.getByText('Next'));
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      
      // Start typing to clear error
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });

    test('clears step errors when user makes changes', async () => {
      apiServices.register.mockResolvedValue({
        success: false,
        message: 'Email already exists'
      });

      renderComponent();
      
      // Fill and submit to trigger error
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'existing@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/Company Name/i), {
        target: { value: 'Test Company' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.click(screen.getByLabelText(/I agree to the/i));
      fireEvent.click(screen.getByText('Create Account'));
      
      await waitFor(() => {
        expect(screen.getByText('This email is already registered. Please use a different email or sign in.')).toBeInTheDocument();
      });
      
      // Change email to clear error
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'new@example.com' }
      });
      
      await waitFor(() => {
        expect(screen.queryByText('This email is already registered. Please use a different email or sign in.')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper form labels and ARIA attributes', () => {
      renderComponent();
      
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    test('supports keyboard navigation', () => {
      renderComponent();
      
      const emailInput = screen.getByLabelText(/Email Address/i);
      emailInput.focus();
      expect(emailInput).toHaveFocus();
    });
  });

  describe('Loading States', () => {
    test('shows loading state during submission', async () => {
      apiServices.register.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      );

      renderComponent();
      
      // Fill all steps
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'Password123' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/Company Name/i), {
        target: { value: 'Test Company' }
      });
      fireEvent.click(screen.getByText('Next'));
      
      fireEvent.click(screen.getByLabelText(/I agree to the/i));
      fireEvent.click(screen.getByText('Create Account'));
      
      expect(screen.getByText('Creating Account...')).toBeInTheDocument();
      expect(screen.getByText('Creating Account...')).toBeDisabled();
    });
  });
}); 