import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import apiServices from '../../services/apiServices';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast('Please enter your email address', {
        icon: '⚠️',
        style: {
          background: '#F59E0B',
          color: '#fff',
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiServices.forgotPassword({ email });
      
      if (response.success) {
        setIsSubmitted(true);
        toast('Password reset email sent! Check your inbox.', {
          icon: '✅',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
      } else {
        toast(response.message || 'Failed to send reset email', {
          icon: '❌',
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast('Failed to send reset email. Please try again.', {
        icon: '❌',
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Mail className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
            Check Your Email
          </h1>
          <p className="text-center text-sm text-gray-600">
            We've sent password reset instructions
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Reset email sent!
              </h2>
              
              <p className="text-sm text-gray-600 mb-6">
                We sent password reset instructions to:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-sm font-medium text-gray-900">{email}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-blue-900 mb-2">What to do next:</h3>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Check your email inbox (and spam folder)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Click the password reset link in the email</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Create a new password</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Sign In
                </button>
                
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Mail className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Forgot Password
        </h1>
        <p className="text-center text-sm text-gray-600">
          Enter your email to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Sending...
                  </div>
                ) : (
                  'Send Reset Email'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 