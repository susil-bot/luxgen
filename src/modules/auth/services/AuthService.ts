/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import { apiClient } from '../../../shared/services/api/ApiClient';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User,
  AuthService as IAuthService 
} from '../types';

class AuthService implements IAuthService {
  private readonly baseUrl = '/api/v1/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/login`, credentials);
      
      if (response.data.success) {
        // Store tokens
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/register`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(`${this.baseUrl}/refresh`, {
        refreshToken,
      });

      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      return response.data;
    } catch (error: any) {
      // Clear tokens on refresh failure
      this.logout();
      return {
        success: false,
        message: 'Token refresh failed',
      };
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/me`);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  }

  async updateProfile(data: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/profile`, data);
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
      };
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/change-password`, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed',
      };
    }
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/reset-password`, { email });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
      };
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/verify-email`, { token });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed',
      };
    }
  }
}

export const authService = new AuthService();
export default authService;
