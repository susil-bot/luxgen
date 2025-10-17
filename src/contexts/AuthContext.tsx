import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginForm, UserRole } from '../types';
import apiServices from '../services/apiServices';
import { useNotifications } from '../components/common/NotificationSystem';
import { useErrorHandler } from '../utils/errorHandler';

// User detection will be handled by the API response

interface AuthContextType extends AuthState {
  login: (email: string, password: string, tenantSlug?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  canAccess: (requiredRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { showSuccess, showError, showInfo } = useNotifications();
  const { handleError, handleAuthError } = useErrorHandler();

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string, tenantSlug?: string): Promise<{ success: boolean; message?: string }> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await apiServices.login({ email, password });
      
      if (response && (response.status === 200 || response.status === 201) && response.data) {
        const apiUser = response.data.user;
        const token = response.data.token;
        
        // Transform API user to match User interface
        const user: User = {
          id: apiUser.id,
          email: apiUser.email,
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          role: apiUser.role as UserRole,
          tenantId: apiUser.tenantId || '',
          isActive: true, // Default to true for logged-in users
          createdAt: new Date(), // Default to current date
          lastLogin: new Date()
        };
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        
        showSuccess(
          'Login Successful',
          `Welcome back, ${user.firstName || user.email}!`,
          { duration: 4000 }
        );
        
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        
        // Provide more specific error messages based on response
        let errorMessage = response?.message || 'Invalid email or password';
        
        // Check for specific error patterns in the message
        if (response?.message?.toLowerCase().includes('not found')) {
          errorMessage = 'No account found with this email address';
        } else if (response?.message?.toLowerCase().includes('password') || response?.message?.toLowerCase().includes('invalid')) {
          errorMessage = 'Invalid email or password';
        } else if (response?.message?.toLowerCase().includes('verify') || response?.message?.toLowerCase().includes('email')) {
          errorMessage = 'Please verify your email address before signing in';
        } else if (response?.message?.toLowerCase().includes('lock')) {
          errorMessage = 'Account is temporarily locked due to multiple failed attempts';
        } else if (response?.message?.toLowerCase().includes('disable')) {
          errorMessage = 'Account has been disabled. Please contact support';
        } else if (response?.message?.toLowerCase().includes('tenant') || response?.message?.toLowerCase().includes('organization')) {
          errorMessage = 'Organization not found. Please check the domain';
        }
        
        return { success: false, message: errorMessage };
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      
      // Handle specific error types
      let errorMessage = 'Login failed';
      
      if (error.name === 'NetworkError' || error.message?.includes('network')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again in a few minutes.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Please contact your administrator.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Service not found. Please check the URL.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      handleError(error, 'auth-login');
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await apiServices.logout();
      showInfo('Logged Out', 'You have been successfully logged out.', { duration: 3000 });
    } catch (error: any) {
      console.error('Logout error:', error);
      handleError(error, 'auth-logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const hasRole = (roles: string[]): boolean => {
    if (!state.user) return false;
    return roles.includes(state.user.role);
  };

  const canAccess = (requiredRoles: string[]): boolean => {
    if (!state.user) return false;
    
    // Super admin can access everything
    if (state.user.role === 'super_admin') return true;
    
    return requiredRoles.includes(state.user.role);
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    hasRole,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 