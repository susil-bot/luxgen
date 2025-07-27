import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotifications } from '../common/NotificationSystem';
import { useErrorHandler } from '../../utils/errorHandler';
import ErrorDisplay from '../common/ErrorDisplay';
import apiServices from '../../services/apiServices';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  role: 'user' | 'trainer' | 'admin';
  agreeToTerms: boolean;
  marketingConsent: boolean;
}

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const { handleError } = useErrorHandler();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    role: 'user',
    agreeToTerms: false,
    marketingConsent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<any>(null);
  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
        
        if (!formData.password) newErrors.password = 'Password is required';
        else if (!validatePassword(formData.password)) {
          newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
        }
        
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 2:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.company) newErrors.company = 'Company name is required';
        break;

      case 3:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear step error when user makes changes
    if (stepErrors[currentStep]) {
      setStepErrors(prev => {
        const newStepErrors = { ...prev };
        delete newStepErrors[currentStep];
        return newStepErrors;
      });
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      // Clear any step-specific errors when moving forward
      setStepErrors(prev => {
        const newStepErrors = { ...prev };
        delete newStepErrors[currentStep];
        return newStepErrors;
      });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Function to map API errors to specific steps
  const mapApiErrorToStep = (error: any): number => {
    const errorMessage = error?.response?.data?.message?.toLowerCase() || '';
    const errorCode = error?.response?.data?.code?.toLowerCase() || '';
    
    // Email-related errors -> Step 1
    if (errorMessage.includes('email') || 
        errorMessage.includes('already exists') || 
        errorCode.includes('email') ||
        errorMessage.includes('invalid email')) {
      return 1;
    }
    
    // Password-related errors -> Step 1
    if (errorMessage.includes('password') || 
        errorMessage.includes('weak') ||
        errorCode.includes('password')) {
      return 1;
    }
    
    // Personal info errors -> Step 2
    if (errorMessage.includes('name') || 
        errorMessage.includes('phone') || 
        errorMessage.includes('company') ||
        errorMessage.includes('first') ||
        errorMessage.includes('last')) {
      return 2;
    }
    
    // Terms-related errors -> Step 3
    if (errorMessage.includes('terms') || 
        errorMessage.includes('agreement') ||
        errorCode.includes('terms')) {
      return 3;
    }
    
    // Default to current step if can't determine
    return currentStep;
  };

  // Function to extract field-specific error from API error
  const extractFieldError = (error: any): Record<string, string> => {
    const errorMessage = error?.response?.data?.message?.toLowerCase() || '';
    const fieldErrors: Record<string, string> = {};
    
    if (errorMessage.includes('email') || errorMessage.includes('already exists')) {
      fieldErrors.email = 'This email is already registered. Please use a different email or sign in.';
    }
    
    if (errorMessage.includes('password') || errorMessage.includes('weak')) {
      fieldErrors.password = 'Password is too weak. Please choose a stronger password.';
    }
    
    if (errorMessage.includes('first name')) {
      fieldErrors.firstName = 'First name is required.';
    }
    
    if (errorMessage.includes('last name')) {
      fieldErrors.lastName = 'Last name is required.';
    }
    
    if (errorMessage.includes('phone')) {
      fieldErrors.phone = 'Phone number is required.';
    }
    
    if (errorMessage.includes('company')) {
      fieldErrors.company = 'Company name is required.';
    }
    
    if (errorMessage.includes('terms') || errorMessage.includes('agreement')) {
      fieldErrors.agreeToTerms = 'You must agree to the terms and conditions.';
    }
    
    return fieldErrors;
  };

  const handleSubmit = async () => {
    console.log('👉 Submit button clicked. Starting registration process...');
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setApiError(null);
    setStepErrors({});
    
    try {
      const response = await apiServices.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        company: formData.company,
        role: formData.role,
        marketingConsent: formData.marketingConsent,
      });

      if (response.success) {
        // Check if user was automatically logged in (has token)
        if (response.data?.token) {
          showSuccess(
            'Account Created Successfully!',
            'Your account has been created successfully. You are now signed in.',
            { duration: 5000 }
          );
          onSuccess?.();
          // Navigate to dashboard or onboarding
          navigate('/dashboard');
        } else {
          // User needs email verification
          showSuccess(
            'Account Created Successfully!',
            'Please check your email for verification instructions.',
            { 
              duration: 6000,
              action: {
                label: 'Resend Email',
                onClick: async () => {
                  try {
                    // Import the API service
                    const apiServices = (await import('../../services/apiServices')).default;
                    
                    // Get the registrationId from the current state or localStorage
                    const registrationId = localStorage.getItem('registrationId') || 
                                          (window.history.state?.usr?.registrationId);
                    
                    if (!registrationId) {
                      showError('Error', 'Registration ID not found. Please try registering again.');
                      return;
                    }
                    
                    const response = await apiServices.resendVerificationEmail({
                      email: formData.email,
                      registrationId: registrationId
                    });
                    
                    if (response.success) {
                      showSuccess('Email Sent', 'Verification email has been resent successfully.');
                    } else {
                      showError('Error', response.message || 'Failed to resend verification email.');
                    }
                  } catch (error) {
                    console.error('Error resending verification email:', error);
                    showError('Error', 'Failed to resend verification email. Please try again later.');
                  }
                }
              }
            }
          );
          // Store email and registrationId in localStorage for resend functionality
          localStorage.setItem('pendingVerificationEmail', formData.email);
          if (response.data?.registrationId) {
            localStorage.setItem('registrationId', response.data.registrationId);
          }
          
          onSuccess?.();
          navigate('/verify-email', { 
            state: { email: formData.email, registrationId: response.data?.registrationId }
          });
        }
      } else {
        // Handle API errors by mapping them to the appropriate step
        const errorStep = mapApiErrorToStep({
          response: {
            status: 400,
            data: {
              message: response.message || 'Unable to create your account. Please try again.',
              code: 'REGISTRATION_FAILED'
            }
          }
        });
        
        // Navigate to the step where the error occurred
        setCurrentStep(errorStep);
        
        // Set field-specific errors
        const fieldErrors = extractFieldError({
          response: {
            status: 400,
            data: {
              message: response.message || 'Unable to create your account. Please try again.',
              code: 'REGISTRATION_FAILED'
            }
          }
        });
        
        setErrors(fieldErrors);
        
        // Set step-specific error message
        setStepErrors(prev => ({
          ...prev,
          [errorStep]: response.message || 'Please fix the errors above and try again.'
        }));
        
        // Show error notification
        showError(
          'Registration Failed',
          response.message || 'Unable to create your account. Please fix the errors and try again.',
          { duration: 6000 }
        );
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle network/API errors by mapping them to the appropriate step
      const errorStep = mapApiErrorToStep(error);
      setCurrentStep(errorStep);
      
      // Set field-specific errors
      const fieldErrors = extractFieldError(error);
      setErrors(fieldErrors);
      
      // Set step-specific error message
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'An unexpected error occurred. Please try again.';
      
      setStepErrors(prev => ({
        ...prev,
        [errorStep]: errorMessage
      }));
      
      // Show error notification
      showError(
        'Registration Failed',
        errorMessage,
        { duration: 6000 }
      );
      
      handleError(error, 'registration-form');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>
      
      {/* Step-specific error message */}
      {stepErrors[1] && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 text-sm">{stepErrors[1]}</p>
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.password}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters with uppercase, lowercase, and number
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.confirmPassword}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
      
      {/* Step-specific error message */}
      {stepErrors[2] && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 text-sm">{stepErrors[2]}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your first name"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your last name"
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.company ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your company name"
          />
        </div>
        {errors.company && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.company}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="user">User</option>
          <option value="trainer">Trainer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms & Preferences</h2>
      
      {/* Step-specific error message */}
      {stepErrors[3] && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 text-sm">{stepErrors[3]}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
              errors.agreeToTerms ? 'border-red-500' : ''
            }`}
          />
          <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
            I agree to the{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500 underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.agreeToTerms}
          </p>
        )}

        <div className="flex items-start">
          <input
            type="checkbox"
            id="marketingConsent"
            checked={formData.marketingConsent}
            onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="marketingConsent" className="ml-2 block text-sm text-gray-700">
            I would like to receive marketing communications about new features and updates
          </label>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderStepIndicator()}
          
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {apiError && (
              <ErrorDisplay
                error={apiError}
                context="register"
                onDismiss={() => setApiError(null)}
                onAction={(action) => {
                  switch (action) {
                    case 'EMAIL_ALREADY_EXISTS':
                      // Navigate to login
                      onSwitchToLogin?.();
                      break;
                    case 'DOMAIN_NOT_ALLOWED':
                      // Clear email field
                      setFormData(prev => ({ ...prev, email: '' }));
                      setApiError(null);
                      break;
                    case 'WEAK_PASSWORD':
                      // Go back to step 1 (password step)
                      setCurrentStep(1);
                      setApiError(null);
                      break;
                    case 'TERMS_NOT_ACCEPTED':
                      // Go to step 3 (terms step)
                      setCurrentStep(3);
                      setApiError(null);
                      break;
                    default:
                      console.log('Action not implemented:', action);
                  }
                }}
              />
            )}
            {renderCurrentStep()}

            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/3 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={`${
                    currentStep > 1 ? 'w-1/3' : 'w-full'
                  } bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors`}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`${
                    currentStep > 1 ? 'w-1/3' : 'w-full'
                  } bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Sign in to your account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 