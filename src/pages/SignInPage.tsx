import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ModernLoginForm from '../components/auth/ModernLoginForm';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleSuccess = () => {
    const redirectTo = searchParams.get('redirect') || '/dashboard';
        navigate(redirectTo, { replace: true });
  };

  return <ModernLoginForm onSuccess={handleSuccess} />;
};

export default SignInPage; 