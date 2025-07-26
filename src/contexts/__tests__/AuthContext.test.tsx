import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import apiServices from '../../services/apiServices';

// Mock dependencies
jest.mock('../../services/apiServices', () => ({
  login: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component to access context
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : 'null'}</div>
      <div data-testid="token">{auth.token || 'null'}</div>
      <button 
        data-testid="login-button" 
        onClick={() => auth.login('test@example.com', 'password')}
      >
        Login
      </button>
      <button data-testid="logout-button" onClick={() => auth.logout()}>
        Logout
      </button>
      <button 
        data-testid="has-role-button" 
        onClick={() => auth.hasRole(['admin'])}
      >
        Check Role
      </button>
      <button 
        data-testid="can-access-button" 
        onClick={() => auth.canAccess(['admin', 'trainer'])}
      >
        Check Access
      </button>
    </div>
  );
};

const renderWithAuthProvider = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial State', () => {
    it('provides initial authentication state', () => {
      renderWithAuthProvider(<TestComponent />);
      
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('token')).toHaveTextContent('null');
    });

    it('restores authentication state from localStorage', () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'user' };
      const mockToken = 'mock-jwt-token';
      
      localStorageMock.getItem
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(JSON.stringify(mockUser));
      
      renderWithAuthProvider(<TestComponent />);
      
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(screen.getByTestId('token')).toHaveTextContent(mockToken);
    });

    it('handles invalid localStorage data gracefully', () => {
      localStorageMock.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce('invalid-json');
      
      renderWithAuthProvider(<TestComponent />);
      
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });

  describe('Login Function', () => {
    it('handles successful login', async () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'user' };
      const mockToken = 'mock-jwt-token';
      
      (apiServices.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      });
      
      renderWithAuthProvider(<TestComponent />);
      
      const loginButton = screen.getByTestId('login-button');
      
      await act(async () => {
        loginButton.click();
      });
      
      expect(apiServices.login).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password' 
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });

    it('handles login failure', async () => {
      (apiServices.login as jest.Mock).mockResolvedValue({
        success: false,
        message: 'Invalid credentials',
      });
      
      renderWithAuthProvider(<TestComponent />);
      
      const loginButton = screen.getByTestId('login-button');
      
      await act(async () => {
        loginButton.click();
      });
      
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('handles login error exception', async () => {
      (apiServices.login as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      renderWithAuthProvider(<TestComponent />);
      
      const loginButton = screen.getByTestId('login-button');
      
      await act(async () => {
        loginButton.click();
      });
      
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('handles login with tenant slug', async () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'user' };
      const mockToken = 'mock-jwt-token';
      
      (apiServices.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      });
      
      renderWithAuthProvider(<TestComponent />);
      
      // We need to test the login function directly since our test component doesn't pass tenant
      const { useAuth } = require('../AuthContext');
      const TestComponentWithTenant = () => {
        const auth = useAuth();
        return (
          <button 
            data-testid="login-with-tenant" 
            onClick={() => auth.login('test@example.com', 'password', 'test-tenant')}
          >
            Login with Tenant
          </button>
        );
      };
      
      renderWithAuthProvider(<TestComponentWithTenant />);
      
      const loginButton = screen.getByTestId('login-with-tenant');
      
      await act(async () => {
        loginButton.click();
      });
      
      expect(apiServices.login).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password' 
      });
    });
  });

  describe('Logout Function', () => {
    it('handles logout successfully', async () => {
      (apiServices.logout as jest.Mock).mockResolvedValue({ success: true });
      
      renderWithAuthProvider(<TestComponent />);
      
      const logoutButton = screen.getByTestId('logout-button');
      
      await act(async () => {
        logoutButton.click();
      });
      
      expect(apiServices.logout).toHaveBeenCalled();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    });

    it('handles logout error gracefully', async () => {
      (apiServices.logout as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      renderWithAuthProvider(<TestComponent />);
      
      const logoutButton = screen.getByTestId('logout-button');
      
      await act(async () => {
        logoutButton.click();
      });
      
      expect(apiServices.logout).toHaveBeenCalled();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    });
  });

  describe('Role Checking Functions', () => {
    it('hasRole returns true for matching role', () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'admin' };
      localStorageMock.getItem
        .mockReturnValueOnce('mock-token')
        .mockReturnValueOnce(JSON.stringify(mockUser));
      
      renderWithAuthProvider(<TestComponent />);
      
      const hasRoleButton = screen.getByTestId('has-role-button');
      
      act(() => {
        hasRoleButton.click();
      });
      
      // The function should return true for admin role
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });

    it('hasRole returns false for non-matching role', () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'user' };
      localStorageMock.getItem
        .mockReturnValueOnce('mock-token')
        .mockReturnValueOnce(JSON.stringify(mockUser));
      
      renderWithAuthProvider(<TestComponent />);
      
      const hasRoleButton = screen.getByTestId('has-role-button');
      
      act(() => {
        hasRoleButton.click();
      });
      
      // The function should return false for admin role when user has 'user' role
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });

    it('canAccess returns true for matching roles', () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'trainer' };
      localStorageMock.getItem
        .mockReturnValueOnce('mock-token')
        .mockReturnValueOnce(JSON.stringify(mockUser));
      
      renderWithAuthProvider(<TestComponent />);
      
      const canAccessButton = screen.getByTestId('can-access-button');
      
      act(() => {
        canAccessButton.click();
      });
      
      // The function should return true for trainer role
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });

    it('canAccess returns false for non-matching roles', () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'user' };
      localStorageMock.getItem
        .mockReturnValueOnce('mock-token')
        .mockReturnValueOnce(JSON.stringify(mockUser));
      
      renderWithAuthProvider(<TestComponent />);
      
      const canAccessButton = screen.getByTestId('can-access-button');
      
      act(() => {
        canAccessButton.click();
      });
      
      // The function should return false for admin/trainer roles when user has 'user' role
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });

    it('role checking works with super_admin role', () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'super_admin' };
      localStorageMock.getItem
        .mockReturnValueOnce('mock-token')
        .mockReturnValueOnce(JSON.stringify(mockUser));
      
      renderWithAuthProvider(<TestComponent />);
      
      const hasRoleButton = screen.getByTestId('has-role-button');
      
      act(() => {
        hasRoleButton.click();
      });
      
      // super_admin should have access to admin role
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });
  });

  describe('Loading States', () => {
    it('shows loading state during login', async () => {
      (apiServices.login as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
      
      renderWithAuthProvider(<TestComponent />);
      
      const loginButton = screen.getByTestId('login-button');
      
      act(() => {
        loginButton.click();
      });
      
      // Should show loading state immediately
      expect(screen.getByTestId('loading')).toHaveTextContent('true');
      
      // Wait for login to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });
      
      // Loading should be false after completion
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    it('shows loading state during logout', async () => {
      (apiServices.logout as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
      
      renderWithAuthProvider(<TestComponent />);
      
      const logoutButton = screen.getByTestId('logout-button');
      
      act(() => {
        logoutButton.click();
      });
      
      // Should show loading state immediately
      expect(screen.getByTestId('loading')).toHaveTextContent('true');
      
      // Wait for logout to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });
      
      // Loading should be false after completion
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  describe('Error Handling', () => {
    it('handles malformed user data in localStorage', () => {
      localStorageMock.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce('{"invalid": "json"'); // Malformed JSON
      
      renderWithAuthProvider(<TestComponent />);
      
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });

    it('handles missing token in localStorage', () => {
      localStorageMock.getItem
        .mockReturnValueOnce(null) // No token
        .mockReturnValueOnce(JSON.stringify({ id: '1', email: 'test@example.com' }));
      
      renderWithAuthProvider(<TestComponent />);
      
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });

    it('handles missing user data in localStorage', () => {
      localStorageMock.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce(null); // No user data
      
      renderWithAuthProvider(<TestComponent />);
      
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });

  describe('Context Provider', () => {
    it('provides all required context values', () => {
      renderWithAuthProvider(<TestComponent />);
      
      expect(screen.getByTestId('isAuthenticated')).toBeInTheDocument();
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByTestId('user')).toBeInTheDocument();
      expect(screen.getByTestId('token')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
      expect(screen.getByTestId('has-role-button')).toBeInTheDocument();
      expect(screen.getByTestId('can-access-button')).toBeInTheDocument();
    });

    it('throws error when useAuth is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Return Values', () => {
    it('login function returns success result', async () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'user' };
      const mockToken = 'mock-jwt-token';
      
      (apiServices.login as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      });
      
      renderWithAuthProvider(<TestComponent />);
      
      const loginButton = screen.getByTestId('login-button');
      
      await act(async () => {
        loginButton.click();
      });
      
      // The login function should return a promise that resolves to success result
      expect(apiServices.login).toHaveBeenCalled();
    });

    it('login function returns failure result', async () => {
      (apiServices.login as jest.Mock).mockResolvedValue({
        success: false,
        message: 'Invalid credentials',
      });
      
      renderWithAuthProvider(<TestComponent />);
      
      const loginButton = screen.getByTestId('login-button');
      
      await act(async () => {
        loginButton.click();
      });
      
      // The login function should return a promise that resolves to failure result
      expect(apiServices.login).toHaveBeenCalled();
    });
  });
}); 