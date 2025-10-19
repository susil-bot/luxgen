import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../common/NotificationSystem';
import ErrorDisplay from '../common/ErrorDisplay';
import { apiServices } from '../../core/api/ApiService';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

const ModernForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<any>(null);
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await apiServices.auth.forgotPassword(formData.email);
      
      if (response.success) {
        setIsSubmitted(true);
        showSuccess('Success!', 'Password reset instructions sent to your email!');
        onSuccess?.();
      } else {
        setApiError({
          message: response.message || 'Failed to send reset instructions',
          type: 'FORGOT_PASSWORD_ERROR'
        });
      }
    } catch (error: any) {
      setApiError({
        message: error.message || 'An unexpected error occurred',
        type: 'NETWORK_ERROR'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getInputClasses = (field: string) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const errorClasses = errors[field] ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500";
    const focusClasses = isFocused === field ? "ring-2 ring-blue-500 border-blue-500" : "";
    
    return `${baseClasses} ${errorClasses} ${focusClasses}`;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Success State */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h1>
            <p className="text-gray-600 mb-8">
              We've sent password reset instructions to <strong>{formData.email}</strong>
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">What's next?</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Check your email inbox</li>
                      <li>Look for an email from LuxGen</li>
                      <li>Click the reset link in the email</li>
                      <li>Follow the instructions to set a new password</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Sign In
              </button>
              
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ email: '' });
                }}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Try Different Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">No worries! Enter your email and we'll send you reset instructions.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {apiError && (
            <div className="mb-6">
              <ErrorDisplay
                error={apiError}
                context="password-reset"
                onDismiss={() => setApiError(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  className={`${getInputClasses('email')} pl-10`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
                {formData.email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Sending Instructions...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Reset Instructions
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Need help?</h3>
            <p className="text-sm text-gray-600">
              If you don't receive an email within a few minutes, check your spam folder or contact support.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center mx-auto text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernForgotPasswordForm;
