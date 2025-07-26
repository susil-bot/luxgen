import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleSwitchToRegister = () => {
    setAuthMode('register');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleAuthSuccess = () => {
    // Handle successful authentication
    console.log('Authentication successful');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {authMode === 'login' ? (
        <LoginForm 
          onSuccess={handleAuthSuccess}
        />
      ) : (
        <RegisterForm 
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
      
      {/* Switch buttons */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white rounded-lg shadow-lg px-6 py-3">
          <p className="text-sm text-gray-600">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={authMode === 'login' ? handleSwitchToRegister : handleSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 