import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import RegisterForm from '../RegisterForm';
import apiServices from '../../../services/apiServices';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('../../../services/apiServices', () => ({
  register: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  Lock: () => <div data-testid="lock-icon">Lock</div>,
  User: () => <div data-testid="user-icon">User</div>,
  Phone: () => <div data-testid="phone-icon">Phone</div>,
  Building: () => <div data-testid="building-icon">Building</div>,
  CheckCircle: () => <div data-testid="check-circle-icon">CheckCircle</div>,
  AlertCircle: () => <div data-testid="alert-circle-icon">AlertCircle</div>,
}));

const mockNavigate = jest.fn();

// Wrapper component for testing
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  describe('Initial Render', () => {
    it('renders the registration form with step indicator', () => {
      renderWithRouter(<RegisterForm />);
      
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Join our training platform and start your journey')).toBeInTheDocument();
      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    });

    it('shows step 1 by default', () => {
      renderWithRouter(<RegisterForm />);
      
      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    it('renders all form fields in step 1', () => {
      renderWithRouter(<RegisterForm />);
      
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty email', async () => {
      renderWithRouter(<RegisterForm />);
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('shows error for invalid email format', async () => {
      renderWithRouter(<RegisterForm />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
      });
    });

    it('shows error for weak password', async () => {
      renderWithRouter(<RegisterForm />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 8 characters/)).toBeInTheDocument();
      });
    });

    it('shows error for password mismatch', async () => {
      renderWithRouter(<RegisterForm />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123' } });
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });
  });

  describe('Step Navigation', () => {
    it('moves to step 2 when step 1 is valid', async () => {
      renderWithRouter(<RegisterForm />);
      
      // Fill step 1 with valid data
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123' } });
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });
    });

    it('shows step 2 fields', async () => {
      renderWithRouter(<RegisterForm />);
      
      // Navigate to step 2
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123' } });
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your last name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your phone number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your company name')).toBeInTheDocument();
      });
    });

    it('validates step 2 required fields', async () => {
      renderWithRouter(<RegisterForm />);
      
      // Navigate to step 2
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123' } });
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });
      
      // Try to proceed without filling required fields
      const nextButton2 = screen.getByText('Next');
      fireEvent.click(nextButton2);
      
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Phone number is required')).toBeInTheDocument();
        expect(screen.getByText('Company name is required')).toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('toggles password visibility', () => {
      renderWithRouter(<RegisterForm />);
      
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      // Initially passwords should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      
      // Toggle password visibility
      const passwordToggle = screen.getAllByTestId('eye-icon')[0];
      fireEvent.click(passwordToggle);
      
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Toggle confirm password visibility
      const confirmPasswordToggle = screen.getAllByTestId('eye-icon')[1];
      fireEvent.click(confirmPasswordToggle);
      
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Registration Submission', () => {
    it('submits registration with valid data', async () => {
      const mockRegister = apiServices.register as jest.Mock;
      mockRegister.mockResolvedValue({
        success: true,
        data: {
          user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
          token: 'mock-jwt-token'
        }
      });
      
      renderWithRouter(<RegisterForm />);
      
      // Fill all steps with valid data
      // Step 1
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123' } });
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });
      
      // Step 2
      const firstNameInput = screen.getByPlaceholderText('Enter your first name');
      const lastNameInput = screen.getByPlaceholderText('Enter your last name');
      const phoneInput = screen.getByPlaceholderText('Enter your phone number');
      const companyInput = screen.getByPlaceholderText('Enter your company name');
      
      fireEvent.change(firstNameInput, { target: { value: 'Test' } });
      fireEvent.change(lastNameInput, { target: { value: 'User' } });
      fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
      fireEvent.change(companyInput, { target: { value: 'Test Company' } });
      
      const nextButton2 = screen.getByText('Next');
      fireEvent.click(nextButton2);
      
      await waitFor(() => {
        expect(screen.getByText('Terms & Preferences')).toBeInTheDocument();
      });
      
      // Step 3
      const agreeToTermsCheckbox = screen.getByLabelText(/I agree to the/);
      fireEvent.click(agreeToTermsCheckbox);
      
      const createAccountButton = screen.getByText('Create Account');
      fireEvent.click(createAccountButton);
      
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'StrongPass123',
          firstName: 'Test',
          lastName: 'User',
          phone: '+1234567890',
          company: 'Test Company',
          role: 'user',
          marketingConsent: false
        });
      });
      
      expect(toast).toHaveBeenCalledWith(
        'Registration successful! Welcome to the platform.',
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('handles registration with email verification required', async () => {
      const mockRegister = apiServices.register as jest.Mock;
      mockRegister.mockResolvedValue({
        success: true,
        data: {
          registrationId: 'mock-registration-id'
        }
      });
      
      renderWithRouter(<RegisterForm />);
      
      // Fill and submit form (simplified for this test)
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123' } });
      
      // Navigate through steps and submit
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });
      
      // Fill step 2
      const firstNameInput = screen.getByPlaceholderText('Enter your first name');
      const lastNameInput = screen.getByPlaceholderText('Enter your last name');
      const phoneInput = screen.getByPlaceholderText('Enter your phone number');
      const companyInput = screen.getByPlaceholderText('Enter your company name');
      
      fireEvent.change(firstNameInput, { target: { value: 'Test' } });
      fireEvent.change(lastNameInput, { target: { value: 'User' } });
      fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
      fireEvent.change(companyInput, { target: { value: 'Test Company' } });
      
      const nextButton2 = screen.getByText('Next');
      fireEvent.click(nextButton2);
      
      await waitFor(() => {
        expect(screen.getByText('Terms & Preferences')).toBeInTheDocument();
      });
      
      // Agree to terms and submit
      const agreeToTermsCheckbox = screen.getByLabelText(/I agree to the/);
      fireEvent.click(agreeToTermsCheckbox);
      
      const createAccountButton = screen.getByText('Create Account');
      fireEvent.click(createAccountButton);
      
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(
          'Registration successful! Please check your email for verification.',
          expect.any(Object)
        );
        expect(mockNavigate).toHaveBeenCalledWith('/verify-email', {
          state: { email: 'test@example.com', registrationId: 'mock-registration-id' }
        });
      });
    });

    it('handles registration error', async () => {
      const mockRegister = apiServices.register as jest.Mock;
      mockRegister.mockResolvedValue({
        success: false,
        message: 'User with this email already exists'
      });
      
      renderWithRouter(<RegisterForm />);
      
      // Fill and submit form (simplified)
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123' } });
      
      // Navigate and submit
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });
      
      // Fill step 2
      const firstNameInput = screen.getByPlaceholderText('Enter your first name');
      const lastNameInput = screen.getByPlaceholderText('Enter your last name');
      const phoneInput = screen.getByPlaceholderText('Enter your phone number');
      const companyInput = screen.getByPlaceholderText('Enter your company name');
      
      fireEvent.change(firstNameInput, { target: { value: 'Test' } });
      fireEvent.change(lastNameInput, { target: { value: 'User' } });
      fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
      fireEvent.change(companyInput, { target: { value: 'Test Company' } });
      
      const nextButton2 = screen.getByText('Next');
      fireEvent.click(nextButton2);
      
      await waitFor(() => {
        expect(screen.getByText('Terms & Preferences')).toBeInTheDocument();
      });
      
      // Agree to terms and submit
      const agreeToTermsCheckbox = screen.getByLabelText(/I agree to the/);
      fireEvent.click(agreeToTermsCheckbox);
      
      const createAccountButton = screen.getByText('Create Account');
      fireEvent.click(createAccountButton);
      
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(
          'User with this email already exists',
          expect.any(Object)
        );
      });
    });

    it('handles network error during registration', async () => {
      const mockRegister = apiServices.register as jest.Mock;
      mockRegister.mockRejectedValue(new Error('Network error'));
      
      renderWithRouter(<RegisterForm />);
      
      // Fill and submit form (simplified)
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123' } });
      
      // Navigate and submit
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });
      
      // Fill step 2
      const firstNameInput = screen.getByPlaceholderText('Enter your first name');
      const lastNameInput = screen.getByPlaceholderText('Enter your last name');
      const phoneInput = screen.getByPlaceholderText('Enter your phone number');
      const companyInput = screen.getByPlaceholderText('Enter your company name');
      
      fireEvent.change(firstNameInput, { target: { value: 'Test' } });
      fireEvent.change(lastNameInput, { target: { value: 'User' } });
      fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
      fireEvent.change(companyInput, { target: { value: 'Test Company' } });
      
      const nextButton2 = screen.getByText('Next');
      fireEvent.click(nextButton2);
      
      await waitFor(() => {
        expect(screen.getByText('Terms & Preferences')).toBeInTheDocument();
      });
      
      // Agree to terms and submit
      const agreeToTermsCheckbox = screen.getByLabelText(/I agree to the/);
      fireEvent.click(agreeToTermsCheckbox);
      
      const createAccountButton = screen.getByText('Create Account');
      fireEvent.click(createAccountButton);
      
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(
          'Registration failed. Please try again.',
          expect.any(Object)
        );
      });
    });
  });

  describe('Navigation', () => {
    it('navigates to login when "Sign in to your account" is clicked', () => {
      const mockOnSwitchToLogin = jest.fn();
      renderWithRouter(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
      
      const signInButton = screen.getByText('Sign in to your account');
      fireEvent.click(signInButton);
      
      expect(mockOnSwitchToLogin).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('shows loading state during form submission', async () => {
      const mockRegister = apiServices.register as jest.Mock;
      mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderWithRouter(<RegisterForm />);
      
      // Fill and submit form (simplified)
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Create a strong password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123' } });
      
      // Navigate and submit
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });
      
      // Fill step 2
      const firstNameInput = screen.getByPlaceholderText('Enter your first name');
      const lastNameInput = screen.getByPlaceholderText('Enter your last name');
      const phoneInput = screen.getByPlaceholderText('Enter your phone number');
      const companyInput = screen.getByPlaceholderText('Enter your company name');
      
      fireEvent.change(firstNameInput, { target: { value: 'Test' } });
      fireEvent.change(lastNameInput, { target: { value: 'User' } });
      fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
      fireEvent.change(companyInput, { target: { value: 'Test Company' } });
      
      const nextButton2 = screen.getByText('Next');
      fireEvent.click(nextButton2);
      
      await waitFor(() => {
        expect(screen.getByText('Terms & Preferences')).toBeInTheDocument();
      });
      
      // Agree to terms and submit
      const agreeToTermsCheckbox = screen.getByLabelText(/I agree to the/);
      fireEvent.click(agreeToTermsCheckbox);
      
      const createAccountButton = screen.getByText('Create Account');
      fireEvent.click(createAccountButton);
      
      await waitFor(() => {
        expect(screen.getByText('Creating Account...')).toBeInTheDocument();
      });
    });
  });
}); 