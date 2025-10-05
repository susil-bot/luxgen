import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface AuthFlowHandlerProps {
  children: React.ReactNode;
}

const AuthFlowHandler: React.FC<AuthFlowHandlerProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle authentication flow redirects
    const handleAuthFlow = () => {
      const currentPath = location.pathname;
      const searchParams = new URLSearchParams(location.search);

      // If user is authenticated
      if (isAuthenticated && user) {
        // Redirect from auth pages to dashboard
        if (['/login', '/register', '/verify-email'].includes(currentPath)) {
          // Check if user needs onboarding
          const onboardingCompleted = localStorage.getItem('onboardingCompleted');
          if (!onboardingCompleted && user.role === 'user') {
            navigate('/onboarding');
            toast('Welcome! Let\'s set up your profile.', {
              icon: '👋',
              style: {
                background: '#10B981',
                color: '#fff',
              },
            });
          } else {
            navigate('/feed');
            toast(`Welcome back, ${user.firstName}!`, {
              icon: '👋',
              style: {
                background: '#10B981',
                color: '#fff',
              },
            });
          }
        }

        // Handle email verification success
        if (searchParams.get('verified') === 'true') {
          toast('Email verified successfully! Welcome to the platform.', {
            icon: '✅',
            style: {
              background: '#10B981',
              color: '#fff',
            },
          });
          // Remove the query parameter
          navigate(currentPath, { replace: true });
        }

        // Handle password reset success
        if (searchParams.get('password-reset') === 'success') {
          toast('Password reset successfully! Please sign in with your new password.', {
            icon: '✅',
            style: {
              background: '#10B981',
              color: '#fff',
            },
          });
          navigate('/login', { replace: true });
        }
      } else {
        // If user is not authenticated
        const publicRoutes = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
        
        // Allow access to public routes
        if (publicRoutes.includes(currentPath)) {
          return;
        }

        // Redirect to login for protected routes
        if (currentPath !== '/') {
          navigate('/login', { 
            state: { 
              message: 'Please sign in to access this page.',
              returnTo: currentPath 
            } 
          });
        }
      }
    };

    handleAuthFlow();
  }, [isAuthenticated, user, location, navigate]);

  // Handle role-based access
  useEffect(() => {
    if (isAuthenticated && user) {
      const currentPath = location.pathname;
      
      // Admin-only routes
      const adminRoutes = ['/admin', '/user-management', '/tenant-management'];
      const isAdminRoute = adminRoutes.some(route => currentPath.startsWith(route));
      
      if (isAdminRoute && !['admin', 'super_admin'].includes(user.role)) {
        toast('Access denied. Admin privileges required.', {
          icon: '🚫',
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
        navigate('/feed');
      }

      // Trainer-only routes
      const trainerRoutes = ['/trainer', '/create-presentation', '/manage-polls'];
      const isTrainerRoute = trainerRoutes.some(route => currentPath.startsWith(route));
      
      if (isTrainerRoute && !['trainer', 'admin', 'super_admin'].includes(user.role)) {
        toast('Access denied. Trainer privileges required.', {
          icon: '🚫',
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
        navigate('/feed');
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  return <>{children}</>;
};

export default AuthFlowHandler; 