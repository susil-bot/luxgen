import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, LogIn, Building2, CheckCircle, AlertCircle, Loader2, X, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm as LoginFormType } from '../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotifications } from '../common/NotificationSystem';
// Removed old error handler import - using new error manager
import ErrorDisplay from '../common/ErrorDisplay';
// Removed old auth error handler import - using new error manager
import { 
  validateEmail, 
  validatePassword, 
  validateDomain, 
  validateLoginForm,
  getValidationIcon,
  getFieldClasses,
  type FieldValidation,
  type ValidationResult
} from '../../utils/validationUtils';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  tenantDomain?: string;
  general?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo, showWarning } = useNotifications();
  // Removed old error handler - using new error manager
  
  const [formData, setFormData] = useState<LoginFormType>({
    email: '',
    password: '',
    tenantDomain: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [fieldValidations, setFieldValidations] = useState<Record<string, FieldValidation>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<number>(0);
  const [storedFormData, setStoredFormData] = useState<LoginFormType | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [apiCallStatus, setApiCallStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

  // Cleanup effect to clear login in progress flag when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('loginInProgress');
    };
  }, []);

  // Handle email verification success message and restore stored data
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

    // Restore form data from localStorage if available
    try {
      const storedDetails = localStorage.getItem('userLoginDetails');
      if (storedDetails) {
        const userDetails = JSON.parse(storedDetails);
        // Only restore email and tenant domain, not password for security
        setFormData(prev => ({
          ...prev,
          email: userDetails.email || '',
          tenantDomain: userDetails.tenantDomain || ''
        }));
      }
    } catch (error) {
      console.warn('Could not restore user details from localStorage:', error);
    }
  }, [location.state]);

  // Additional effect to handle form data preservation on component unmount/remount
  useEffect(() => {
    // Store current form data in sessionStorage for immediate restoration
    const saveFormData = () => {
      try {
        sessionStorage.setItem('loginFormData', JSON.stringify({
          email: formData.email,
          tenantDomain: formData.tenantDomain,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.warn('Could not save form data to sessionStorage:', error);
      }
    };

    // Save form data when it changes
    if (formData.email || formData.tenantDomain) {
      saveFormData();
    }

    // Restore form data from sessionStorage on mount
    try {
      const sessionData = sessionStorage.getItem('loginFormData');
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        // Only restore if data is recent (within last 30 minutes)
        const isRecent = Date.now() - parsedData.timestamp < 30 * 60 * 1000;
        if (isRecent && (!formData.email || !formData.tenantDomain)) {
          setFormData(prev => ({
            ...prev,
            email: parsedData.email || '',
            tenantDomain: parsedData.tenantDomain || ''
          }));
        }
      }
    } catch (error) {
      console.warn('Could not restore form data from sessionStorage:', error);
    }
  }, [formData.email, formData.tenantDomain]);


  // Real-time validation on field change
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

    // Real-time validation
    let fieldValidation: FieldValidation;
    switch (name) {
      case 'email':
        fieldValidation = validateEmail(value);
        break;
      case 'password':
        fieldValidation = validatePassword(value);
        break;
      case 'tenantDomain':
        fieldValidation = validateDomain(value);
        break;
      default:
        fieldValidation = { isValid: true, severity: 'info' };
    }

    setFieldValidations(prev => ({
      ...prev,
      [name]: fieldValidation
    }));
  };

  // Comprehensive form validation
  const validateForm = (): { isValid: boolean; errors: ValidationErrors; warnings: string[] } => {
    const errors: ValidationErrors = {};
    const warnings: string[] = [];

    // Email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    } else if (passwordValidation.severity === 'warning' && passwordValidation.message) {
      warnings.push(passwordValidation.message);
    }

    // Tenant domain validation
    const domainValidation = validateDomain(formData.tenantDomain);
    if (!domainValidation.isValid) {
      errors.tenantDomain = domainValidation.message;
    }

    // Rate limiting check
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptTime;
    if (attemptCount >= 3 && timeSinceLastAttempt < 300000) { // 5 minutes
      const remainingTime = Math.ceil((300000 - timeSinceLastAttempt) / 1000 / 60);
      errors.general = `Too many login attempts. Please wait ${remainingTime} minutes before trying again.`;
    }

    setValidationErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors, warnings };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(null);
    setValidationErrors({});

    // Store current form data to preserve values during API call
    const currentFormData = { ...formData };
    setStoredFormData(currentFormData);

    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      // Show specific validation errors
      if (validation.errors.general) {
        showError('Rate Limited', validation.errors.general, { duration: 8000 });
      } else {
        const errorFields = Object.keys(validation.errors).filter(key => key !== 'general');
        const errorMessages = errorFields
          .map(field => validation.errors[field as keyof ValidationErrors])
          .filter((msg): msg is string => typeof msg === 'string')
          .join(', ');
        showError('Validation Error', `Please fix the following issues: ${errorMessages}`, { duration: 6000 });
      }
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        showWarning('Security Tip', warning, { duration: 4000 });
      });
    }

    setIsSubmitting(true);
    setAttemptCount(prev => prev + 1);
    setLastAttemptTime(Date.now());
    setApiCallStatus('pending');
    setIsLoginInProgress(true);
    
    // Set flag to prevent automatic redirects during login
    localStorage.setItem('loginInProgress', 'true');

    try {
      showInfo('Signing In', 'Please wait while we authenticate your credentials...', { duration: 3000 });
      
      const response = await login(formData.email, formData.password, formData.tenantDomain);
      
      if (response.success) {
        setApiCallStatus('success');
        showSuccess(
          'Welcome Back!', 
          `Successfully signed in as ${formData.email}`,
          { duration: 4000 }
        );
        setAttemptCount(0); // Reset attempt count on success
        
        // Store user details in localStorage for persistence
        const userDetails = {
          email: formData.email,
          tenantDomain: formData.tenantDomain,
          loginTime: new Date().toISOString(),
          lastLoginAttempt: Date.now()
        };
        
        try {
          localStorage.setItem('userLoginDetails', JSON.stringify(userDetails));
        } catch (error) {
          console.warn('Could not store user details in localStorage:', error);
        }
        
        // Set navigation flag to prevent further interactions
        setIsNavigating(true);
        
        // IMPORTANT: Only navigate after confirming API success
        // Wait a moment for the success message to be visible
        setTimeout(() => {
          // Clear any stored form data before navigation
          setStoredFormData(null);
          clearStoredUserData();
          
          // Clear the login in progress flag before navigation
          localStorage.removeItem('loginInProgress');
          
          // Only call onSuccess after API success is confirmed
          if (onSuccess) {
            onSuccess();
          }
        }, 1500); // Increased delay to ensure user sees success message
      } else {
        setApiCallStatus('failed');
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
        
        // Keep form data preserved for retry
        showInfo('Form Preserved', 'Your login details have been preserved. You can modify and try again.', { duration: 4000 });
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
        showInfo('Form Preserved', 'Your login details have been preserved. You can try again once connection is restored.', { duration: 4000 });
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
        showInfo('Form Preserved', 'Your login details have been preserved. You can try again after the cooldown period.', { duration: 4000 });
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
        showInfo('Form Preserved', 'Your login details have been preserved. You can try again once the server is back online.', { duration: 4000 });
      } else {
        setError(err);
        // Removed old error handler - using new error manager
        showInfo('Form Preserved', 'Your login details have been preserved. You can try again.', { duration: 4000 });
      }
    } finally {
      setIsSubmitting(false);
      setIsLoginInProgress(false);
      
      // Clear the login in progress flag
      localStorage.removeItem('loginInProgress');
      
      // Set API call status to failed if not already set to success
      if (apiCallStatus === 'pending') {
        setApiCallStatus('failed');
      }
      
      // Only clear stored form data on success, keep it on failure for retry
      if (apiCallStatus === 'success') {
        setStoredFormData(null);
      }
    }
  };

  const getFieldError = (fieldName: keyof ValidationErrors): string | undefined => {
    return validationErrors[fieldName];
  };

  const getFieldValidation = (fieldName: string): FieldValidation | undefined => {
    return fieldValidations[fieldName];
  };

  const getFieldClassName = (fieldName: keyof ValidationErrors): string => {
    const baseClass = "appearance-none relative block w-full px-3 py-3 pr-10 border placeholder-gray-500 text-gray-900 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:z-10 sm:text-sm transition-colors";
    const hasError = getFieldError(fieldName);
    const validation = getFieldValidation(fieldName);
    
    if (hasError) {
      return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`;
    }
    
    if (validation?.severity === 'warning') {
      return `${baseClass} border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500`;
    }
    
    if (validation?.isValid && validation.severity === 'info') {
      return `${baseClass} border-green-300 focus:ring-green-500 focus:border-green-500`;
    }
    
    return `${baseClass} border-gray-300 focus:ring-primary-500 focus:border-primary-500`;
  };

  const getFieldIcon = (fieldName: string) => {
    const validation = getFieldValidation(fieldName);
    const hasError = getFieldError(fieldName as keyof ValidationErrors);
    
    if (hasError) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
    
    if (validation?.severity === 'warning') {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    
    if (validation?.isValid && validation.severity === 'info') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    return null;
  };

  // Utility function to clear stored user data
  const clearStoredUserData = () => {
    try {
      localStorage.removeItem('userLoginDetails');
      sessionStorage.removeItem('loginFormData');
    } catch (error) {
      console.warn('Could not clear user details from storage:', error);
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 429:
        return 'Too Many Requests';
      case 500:
        return 'Internal Server Error';
      case 502:
        return 'Bad Gateway';
      case 503:
        return 'Service Unavailable';
      case 504:
        return 'Gateway Timeout';
      default:
        return 'Unknown';
    }
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
            {/* Validation Error Summary */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800 mb-2">
                      Please fix the following issues:
                    </h4>
                    <ul className="text-xs text-red-600 space-y-1">
                      {validationErrors.email && (
                        <li className="flex items-start">
                          <span className="text-red-500 mr-1">•</span>
                          <span><strong>Email:</strong> {validationErrors.email}</span>
                        </li>
                      )}
                      {validationErrors.password && (
                        <li className="flex items-start">
                          <span className="text-red-500 mr-1">•</span>
                          <span><strong>Password:</strong> {validationErrors.password}</span>
                        </li>
                      )}
                      {validationErrors.tenantDomain && (
                        <li className="flex items-start">
                          <span className="text-red-500 mr-1">•</span>
                          <span><strong>Organization Domain:</strong> {validationErrors.tenantDomain}</span>
                        </li>
                      )}
                      {validationErrors.general && (
                        <li className="flex items-start">
                          <span className="text-red-500 mr-1">•</span>
                          <span><strong>General:</strong> {validationErrors.general}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Warnings Summary */}
            {Object.values(fieldValidations).some(v => v?.severity === 'warning') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">
                      Security Recommendations:
                    </h4>
                    <ul className="text-xs text-yellow-600 space-y-1">
                      {fieldValidations.email?.severity === 'warning' && fieldValidations.email.message && (
                        <li className="flex items-start">
                          <span className="text-yellow-500 mr-1">•</span>
                          <span><strong>Email:</strong> {fieldValidations.email.message}</span>
                        </li>
                      )}
                      {fieldValidations.password?.severity === 'warning' && fieldValidations.password.message && (
                        <li className="flex items-start">
                          <span className="text-yellow-500 mr-1">•</span>
                          <span><strong>Password:</strong> {fieldValidations.password.message}</span>
                        </li>
                      )}
                      {fieldValidations.tenantDomain?.severity === 'warning' && fieldValidations.tenantDomain.message && (
                        <li className="flex items-start">
                          <span className="text-yellow-500 mr-1">•</span>
                          <span><strong>Organization Domain:</strong> {fieldValidations.tenantDomain.message}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Form Status Summary */}
            {(isSubmitting || isNavigating || Object.keys(validationErrors).length > 0 || Object.values(fieldValidations).some(v => v?.severity === 'warning') || apiCallStatus !== 'idle') && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">
                      Form Status
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      {apiCallStatus === 'pending' && (
                        <div className="flex items-center">
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          <span>API call in progress...</span>
                        </div>
                      )}
                      {apiCallStatus === 'success' && (
                        <div className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          <span>API call successful, preparing navigation...</span>
                        </div>
                      )}
                      {apiCallStatus === 'failed' && (
                        <div className="flex items-center">
                          <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
                          <span>API call failed, form preserved for retry</span>
                        </div>
                      )}
                      {isSubmitting && (
                        <div className="flex items-center">
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          <span>Submitting login request...</span>
                        </div>
                      )}
                      {isNavigating && (
                        <div className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          <span>Login successful, redirecting...</span>
                        </div>
                      )}
                      {Object.keys(validationErrors).length > 0 && (
                        <div className="flex items-center">
                          <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
                          <span>{Object.keys(validationErrors).length} validation error(s)</span>
                        </div>
                      )}
                      {Object.values(fieldValidations).some(v => v?.severity === 'warning') && (
                        <div className="flex items-center">
                          <AlertTriangle className="w-3 h-3 text-yellow-500 mr-1" />
                          <span>Security recommendations available</span>
                        </div>
                      )}
                      {attemptCount > 0 && (
                        <div className="flex items-center">
                          <span className="text-gray-500">Attempt {attemptCount} of 3</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            )}
            
            {storedFormData && !error && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center">
                  <Info className="w-5 h-5 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-800">
                    Form data preserved. Please wait while we authenticate your credentials...
                  </p>
                </div>
              </div>
            )}
            
            {storedFormData && error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800">
                    Form data preserved for retry. You can modify your credentials and try again.
                  </p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="space-y-3">
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
                
                {/* Detailed Error Information */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-800 mb-2">
                        Error Details
                      </h4>
                      
                      {/* Error Code */}
                      {error?.response?.data?.code && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-red-700">Error Code:</span>
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {error.response.data.code}
                          </span>
                        </div>
                      )}
                      
                      {/* Error Message */}
                      {error?.response?.data?.message && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-red-700">Message:</span>
                          <p className="text-xs text-red-600 mt-1">
                            {error.response.data.message}
                          </p>
                        </div>
                      )}
                      
                      {/* HTTP Status */}
                      {error?.response?.status && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-red-700">Status:</span>
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {error.response.status} {getStatusText(error.response.status)}
                          </span>
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <div className="mb-2">
                        <span className="text-xs font-medium text-red-700">Time:</span>
                        <span className="ml-2 text-xs text-red-600">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {/* Attempt Count */}
                      {attemptCount > 0 && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-red-700">Attempt:</span>
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {attemptCount} of 3
                          </span>
                        </div>
                      )}
                      
                      {/* Troubleshooting Tips */}
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <h5 className="text-xs font-medium text-red-700 mb-2">Troubleshooting Tips:</h5>
                        <ul className="text-xs text-red-600 space-y-1">
                          {error?.response?.data?.code === 'INVALID_CREDENTIALS' && (
                            <>
                              <li>• Check your email address for typos</li>
                              <li>• Ensure your password is correct</li>
                              <li>• Try resetting your password if needed</li>
                            </>
                          )}
                          {error?.response?.data?.code === 'USER_NOT_FOUND' && (
                            <>
                              <li>• Verify your email address is correct</li>
                              <li>• Check if you need to create an account</li>
                              <li>• Contact support if you believe this is an error</li>
                            </>
                          )}
                          {error?.response?.data?.code === 'EMAIL_NOT_VERIFIED' && (
                            <>
                              <li>• Check your email for a verification link</li>
                              <li>• Check your spam/junk folder</li>
                              <li>• Request a new verification email</li>
                            </>
                          )}
                          {error?.response?.data?.code === 'ACCOUNT_LOCKED' && (
                            <>
                              <li>• Wait 15 minutes before trying again</li>
                              <li>• Use the "Forgot Password" option</li>
                              <li>• Contact support if the issue persists</li>
                            </>
                          )}
                          {error?.response?.status === 0 && (
                            <>
                              <li>• Check your internet connection</li>
                              <li>• Try refreshing the page</li>
                              <li>• Check if the service is available</li>
                            </>
                          )}
                          {error?.response?.status >= 500 && (
                            <>
                              <li>• This is a server issue, not your fault</li>
                              <li>• Try again in a few minutes</li>
                              <li>• Contact support if the problem continues</li>
                            </>
                          )}
                          {error?.response?.status === 429 && (
                            <>
                              <li>• Too many login attempts</li>
                              <li>• Wait a few minutes before trying again</li>
                              <li>• Use the "Forgot Password" option</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  disabled={isSubmitting || isNavigating}
                />
                {getFieldIcon('email') && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {getFieldIcon('email')}
                  </div>
                )}
              </div>
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
              {getFieldValidation('email')?.severity === 'warning' && (
                <p className="mt-1 text-sm text-yellow-600 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  {getFieldValidation('email')?.message}
                </p>
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
                  disabled={isSubmitting || isNavigating}
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
                {getFieldIcon('password') && (
                  <div className="absolute inset-y-0 right-0 pr-10 flex items-center pointer-events-none">
                    {getFieldIcon('password')}
                  </div>
                )}
              </div>
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
              )}
              {getFieldValidation('password')?.severity === 'warning' && (
                <p className="mt-1 text-sm text-yellow-600 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  {getFieldValidation('password')?.message}
                </p>
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
                  disabled={isSubmitting || isNavigating}
                />
                {getFieldIcon('tenantDomain') && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {getFieldIcon('tenantDomain')}
                  </div>
                )}
              </div>
              {getFieldError('tenantDomain') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('tenantDomain')}</p>
              )}
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Security Tips:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Use a strong, unique password</li>
                    <li>• Never share your credentials</li>
                    <li>• Enable two-factor authentication if available</li>
                    <li>• Log out from shared devices</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || isSubmitting || isNavigating}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isNavigating ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Redirecting...
                  </div>
                ) : (loading || isSubmitting) ? (
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
              
              {!isSubmitting && !isNavigating && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ email: '', password: '', tenantDomain: '' });
                      clearStoredUserData();
                      setError(null);
                      setValidationErrors({});
                      setFieldValidations({});
                      setStoredFormData(null);
                      // Also clear sessionStorage
                      try {
                        sessionStorage.removeItem('loginFormData');
                      } catch (error) {
                        console.warn('Could not clear sessionStorage:', error);
                      }
                    }}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Clear Form
                  </button>
                  
                  {error && storedFormData && (
                    <button
                      type="button"
                      disabled={apiCallStatus === 'pending' || isSubmitting}
                      onClick={() => {
                        setError(null);
                        setValidationErrors({});
                        setFieldValidations({});
                        setApiCallStatus('idle');
                        // Re-submit with current form data
                        handleSubmit(new Event('submit') as any);
                      }}
                      className="w-full flex justify-center py-2 px-4 border border-blue-300 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {apiCallStatus === 'pending' ? 'Retrying...' : 'Retry Login'}
                    </button>
                  )}
                </div>
              )}
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