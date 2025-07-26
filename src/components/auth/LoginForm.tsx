import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, Building2, CheckCircle } from 'lucide-react';
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
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
        showError(
          'Login Failed',
          response.message || 'Please check your credentials and try again.',
          { duration: 6000 }
        );
      }
    } catch (err: any) {
      handleError(err, 'login-form');
      setError(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) {
      setError(null);
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
                      // Navigate to registration
                      window.location.href = '/register';
                      break;
                    case 'EMAIL_NOT_VERIFIED':
                      // Navigate to email verification
                      window.location.href = '/verify-email';
                      break;
                    case 'ACCOUNT_LOCKED':
                    case 'INVALID_CREDENTIALS':
                      // Navigate to forgot password
                      window.location.href = '/forgot-password';
                      break;
                    case 'TENANT_NOT_FOUND':
                      // Clear tenant domain field
                      setFormData(prev => ({ ...prev, tenantDomain: '' }));
                      setError(null);
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
              <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Enter your email"
                />

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
                  className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="tenantDomain" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Domain (Optional)
              </label>
              <input
                id="tenantDomain"
                name="tenantDomain"
                type="text"
                value={formData.tenantDomain}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="your-organization.trainer.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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