import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, Building2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm as LoginFormType } from '../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotifications } from '../common/NotificationSystem';
import { useErrorHandler } from '../../utils/errorHandler';
import ErrorDisplay from '../common/ErrorDisplay';
import { formatFormError } from '../../utils/authErrorHandler';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  tenantDomain?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotifications();
  const { handleError, handleAuthError } = useErrorHandler();
  
  const [formData, setFormData] = useState<LoginFormType>({
    email: '',
    password: '',
    tenantDomain: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle email verification success message
  useEffect(() => {
    const state = location.state as any;
    if (state?.message) {
      setSuccessMessage(state.message);
      if (state.email) {
        setFormData(prev => ({ ...prev, email: state.email }));
      }
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Clear errors when user starts typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear specific field error
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear general error
    if (error) {
      setError(null);
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Tenant domain validation (optional)
    if (formData.tenantDomain && !/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/.test(formData.tenantDomain)) {
      errors.tenantDomain = 'Please enter a valid domain name';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      showError('Validation Error', 'Please check the form and try again.', { duration: 5000 });
      return;
    }

    setIsSubmitting(true);

    try {
      showInfo('Signing In', 'Please wait while we authenticate your credentials...', { duration: 3000 });
      
      const response = await login(formData.email, formData.password, formData.tenantDomain);
      
      if (response.success) {
        showSuccess(
          'Welcome Back!', 
          `Successfully signed in as ${formData.email}`,
          { duration: 4000 }
        );
        onSuccess?.();
      } else {
        // Create error object for consistent handling
        const errorObj = {
          response: {
            status: 401,
            data: {
              message: response.message || 'Invalid email or password',
              code: 'INVALID_CREDENTIALS'
            }
          }
        };
        setError(errorObj);
        
        // Show specific error message based on response
        if (response.message?.includes('not found')) {
          showError('Account Not Found', 'No account found with this email address. Please check your email or create a new account.', { duration: 6000 });
        } else if (response.message?.includes('password')) {
          showError('Invalid Password', 'The password you entered is incorrect. Please try again or reset your password.', { duration: 6000 });
        } else if (response.message?.includes('verified')) {
          showError('Email Not Verified', 'Please verify your email address before signing in. Check your inbox for a verification link.', { duration: 6000 });
        } else if (response.message?.includes('locked')) {
          showError('Account Locked', 'Your account has been temporarily locked due to multiple failed attempts. Please try again in 15 minutes or reset your password.', { duration: 8000 });
        } else {
          showError('Login Failed', response.message || 'Please check your credentials and try again.', { duration: 6000 });
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle different types of errors
      if (err.name === 'NetworkError' || err.message?.includes('network')) {
        setError({
          response: {
            status: 0,
            data: {
              message: 'Network connection failed',
              code: 'NETWORK_ERROR'
            }
          }
        });
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection and try again.', { duration: 8000 });
      } else if (err.response?.status === 429) {
        setError({
          response: {
            status: 429,
            data: {
              message: 'Too many login attempts',
              code: 'RATE_LIMIT_EXCEEDED'
            }
          }
        });
        showError('Too Many Attempts', 'Too many login attempts. Please wait a few minutes before trying again.', { duration: 8000 });
      } else if (err.response?.status >= 500) {
        setError({
          response: {
            status: err.response.status,
            data: {
              message: 'Server error',
              code: 'SERVER_ERROR'
            }
          }
        });
        showError('Server Error', 'We\'re experiencing technical difficulties. Please try again in a few minutes.', { duration: 8000 });
      } else {
        setError(err);
        handleError(err, 'login-form');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: keyof ValidationErrors): string | undefined => {
    return validationErrors[fieldName];
  };

  const getFieldClassName = (fieldName: keyof ValidationErrors): string => {
    const baseClass = "appearance-none relative block w-full px-3 py-3 pr-10 border placeholder-gray-500 text-gray-900 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:z-10 sm:text-sm transition-colors";
    const hasError = getFieldError(fieldName);
    
    if (hasError) {
      return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`;
    }
    return `${baseClass} border-gray-300 focus:ring-primary-500 focus:border-primary-500`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            )}
            
            {error && (
              <ErrorDisplay
                error={error}
                context="login"
                onDismiss={() => setError(null)}
                onAction={(action) => {
                  switch (action) {
                    case 'USER_NOT_FOUND':
                      navigate('/register');
                      break;
                    case 'EMAIL_NOT_VERIFIED':
                      navigate('/verify-email');
                      break;
                    case 'ACCOUNT_LOCKED':
                    case 'INVALID_CREDENTIALS':
                      navigate('/forgot-password');
                      break;
                    case 'TENANT_NOT_FOUND':
                      setFormData(prev => ({ ...prev, tenantDomain: '' }));
                      setError(null);
                      break;
                    case 'NETWORK_ERROR':
                      // Retry the login
                      handleSubmit(new Event('submit') as any);
                      break;
                    default:
                      console.log('Action not implemented:', action);
                  }
                }}
              />
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={getFieldClassName('email')}
                  placeholder="Enter your email"
                />
                {getFieldError('email') && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={getFieldClassName('password')}
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {getFieldError('password') && (
                  <div className="absolute inset-y-0 right-0 pr-10 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
              )}
            </div>

            <div>
              <label htmlFor="tenantDomain" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Domain (Optional)
              </label>
              <div className="relative">
                <input
                  id="tenantDomain"
                  name="tenantDomain"
                  type="text"
                  value={formData.tenantDomain}
                  onChange={handleChange}
                  className={getFieldClassName('tenantDomain')}
                  placeholder="your-organization.trainer.com"
                />
                {getFieldError('tenantDomain') && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {getFieldError('tenantDomain') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('tenantDomain')}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {(loading || isSubmitting) ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Secure sign-in platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 