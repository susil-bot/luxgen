import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginForm } from '../types';

// Add new user detection
const isNewUser = (email: string): boolean => {
  const existingUsers = ['superadmin@trainer.com', 'admin@trainer.com', 'trainer@trainer.com', 'user@trainer.com'];
  return !existingUsers.includes(email);
};

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
      // Simulate API call with dummy data
      const dummyUsers: User[] = [
        {
          id: '1',
          email: 'superadmin@trainer.com',
          firstName: 'Super',
          lastName: 'Admin',
          role: 'super_admin',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        {
          id: '2',
          email: 'admin@trainer.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        {
          id: '3',
          email: 'trainer@trainer.com',
          firstName: 'Lead',
          lastName: 'Trainer',
          role: 'trainer',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        {
          id: '4',
          email: 'user@trainer.com',
          firstName: 'Regular',
          lastName: 'User',
          role: 'user',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
      ];

      // Find user by email
      const user = dummyUsers.find(u => u.email === email);
      
      if (user && password === 'password123') {
        const token = 'dummy-jwt-token-' + user.id;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        return { success: true };
      } else if (isNewUser(email) && password === 'password123') {
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          email: email,
          firstName: email.split('@')[0],
          lastName: 'User',
          role: 'user',
          tenantId: tenantSlug || 'tenant-1',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        };
        
        const token = 'dummy-jwt-token-' + newUser.id;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Mark as new user for onboarding
        localStorage.removeItem('onboardingCompleted');
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: newUser, token } });
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
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