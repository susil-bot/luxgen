import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import apiServices from '../../services/apiServices';

interface LocationState {
  email: string;
  registrationId: string;
}

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const [registrationId, setRegistrationId] = useState('');

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.email && state?.registrationId) {
      setEmail(state.email);
      setRegistrationId(state.registrationId);
    } else {
      // If no state, redirect to registration
      navigate('/register');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    try {
      // Note: This endpoint might need to be added to your API
      const response = await apiServices.resendVerificationEmail({
        email: email,
        registrationId: registrationId,
      });

      if (response.success) {
        toast('Verification email sent successfully!', {
          icon: '✅',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        setCountdown(60); // 60 second cooldown
      } else {
        toast(response.message || 'Failed to resend verification email', {
          icon: '❌',
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
      }
    } catch (error: any) {
      console.error('Resend error:', error);
      toast('Failed to resend verification email. Please try again.', {
        icon: '❌',
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsLoading(true);
    try {
      // Note: This endpoint might need to be added to your API
      const response = await apiServices.checkEmailVerification(registrationId);

      if ((response.status === 200 || response.status === 201) && response.data?.isEmailVerified) {
        toast('Email verified successfully! You can now sign in.', {
          icon: '✅',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        navigate('/login', { 
          state: { 
            message: 'Email verified successfully! Please sign in with your credentials.',
            email: email 
          }
        });
      } else {
        // Email not verified yet, continue showing verification page
        toast('Email not verified yet. Please check your email and click the verification link.', {
          icon: '⚠️',
          style: {
            background: '#F59E0B',
            color: '#fff',
          },
        });
      }
    } catch (error: any) {
      console.error('Verification check error:', error);
      toast('Failed to check verification status. Please try again.', {
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

  const handleBackToRegister = () => {
    navigate('/register');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Mail className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Verify Your Email
        </h1>
        <p className="text-center text-sm text-gray-600">
          We've sent a verification link to your email
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Check your email
            </h2>
            
            <p className="text-sm text-gray-600 mb-6">
              We sent a verification link to:
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
                  <span>Click the verification link in the email</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Return here and click "I've verified my email"</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCheckVerification}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    I've verified my email
                  </>
                )}
              </button>

              <button
                onClick={handleResendEmail}
                disabled={isResending || countdown > 0}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend verification email
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleBackToRegister}
                className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to registration
              </button>
              
              <button
                onClick={handleGoToLogin}
                className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Already have an account? Sign in
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Didn't receive the email?</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• Make sure the email address is correct</li>
                    <li>• Wait a few minutes and try resending</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 