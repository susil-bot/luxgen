import React, { useState } from 'react';
import ModernLoginForm from '../components/auth/ModernLoginForm';
import ModernRegisterForm from '../components/auth/ModernRegisterForm';

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
    <div className="min-h-screen">
      {authMode === 'login' ? (
        <ModernLoginForm 
          onSuccess={handleAuthSuccess}
        />
      ) : (
        <ModernRegisterForm 
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  );
};

export default AuthPage; 