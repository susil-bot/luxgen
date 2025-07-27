import { securityConfig } from '../config/security';
import { ApiResponse } from '../types/api';

const baseURL = securityConfig.apiBaseUrl;

// JWT Token management
let authToken: string | null = null;

const getAuthToken = (): string | null => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};

const setAuthToken = (token: string | null): void => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

const getHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const apiClient = {
  // JWT Token management
  setAuthToken,
  getAuthToken,

  async get<T = unknown>(endpoint: string, config: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, { 
        ...config, 
        method: 'GET',
        headers: getHeaders(config.headers as Record<string, string>),
      });
      const data = await response.json();
      return {
        success: response.ok,
        data: data.data || data,
        message: data.message,
        error: data.error,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async post<T = unknown>(endpoint: string, data?: unknown, config: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        ...config,
        method: 'POST',
        headers: getHeaders(config.headers as Record<string, string>),
        body: data ? JSON.stringify(data) : undefined,
      });
      const responseData = await response.json();
      return {
        success: response.ok,
        data: responseData.data || responseData,
        message: responseData.message,
        error: responseData.error,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async put<T = unknown>(endpoint: string, data?: unknown, config: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        ...config,
        method: 'PUT',
        headers: getHeaders(config.headers as Record<string, string>),
        body: data ? JSON.stringify(data) : undefined,
      });
      const responseData = await response.json();
      return {
        success: response.ok,
        data: responseData.data || responseData,
        message: responseData.message,
        error: responseData.error,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async delete<T = unknown>(endpoint: string, config: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, { 
        ...config, 
        method: 'DELETE',
        headers: getHeaders(config.headers as Record<string, string>),
      });
      const data = await response.json();
      return {
        success: response.ok,
        data: data.data || data,
        message: data.message,
        error: data.error,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
        timestamp: new Date().toISOString(),
      };
    }
  },
};

export default apiClient; 