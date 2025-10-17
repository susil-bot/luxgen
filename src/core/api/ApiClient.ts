/**
 * ROBUST API CLIENT
 * Centralized API client with consistent response handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Standard API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
  timestamp?: string;
  pagination?: any;
}

// API Client Configuration
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

// Request/Response Interceptors
interface RequestContext {
  tenantId?: string;
  userId?: string;
  requestId: string;
  timestamp: number;
}

class RobustApiClient {
  private client: AxiosInstance;
  private config: ApiClientConfig;
  private requestQueue: Map<string, AbortController> = new Map();

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.client = this.createAxiosInstance();
    this.setupInterceptors();
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      withCredentials: true, // Enable CORS credentials
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        const requestId = this.generateRequestId();
        const context: RequestContext = {
          requestId,
          timestamp: Date.now(),
          tenantId: this.getCurrentTenantId() || undefined,
          userId: this.getCurrentUserId() || undefined,
        };

        // Add authentication token
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add tenant context
        if (context.tenantId) {
          config.headers['X-Tenant-ID'] = context.tenantId;
        }

        // Add request tracking
        config.headers['X-Request-ID'] = requestId;
        (config as any).metadata = { context };

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        this.handleSuccessResponse(response);
        return response;
      },
      (error) => {
        return this.handleErrorResponse(error);
      }
    );
  }

  private handleSuccessResponse(response: AxiosResponse): void {
    const requestId = response.config.headers['X-Request-ID'];
    console.log(`✅ API Success [${requestId}]:`, {
      status: response.status,
      url: response.config.url,
      method: response.config.method,
    });
  }

  private handleErrorResponse(error: any): Promise<never> {
    const requestId = error.config?.headers?.['X-Request-ID'];
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`❌ API Error [${requestId}]:`, {
        status,
        url: error.config?.url,
        method: error.config?.method,
        data,
      });

      // Handle specific error codes
      switch (status) {
        case 401:
          this.handleUnauthorized();
          break;
        case 403:
          this.handleForbidden();
          break;
        case 404:
          this.handleNotFound();
          break;
        case 429:
          this.handleRateLimit();
          break;
        case 500:
          this.handleServerError();
          break;
        default:
          this.handleGenericError(data?.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error
      console.error(`🌐 Network Error [${requestId}]:`, error.message);
      this.handleNetworkError();
    } else {
      // Other error
      console.error(`💥 Unknown Error [${requestId}]:`, error.message);
      this.handleGenericError('An unexpected error occurred');
    }

    return Promise.reject(this.normalizeError(error));
  }

  // Error Handlers
  private handleUnauthorized(): void {
    this.clearAuthData();
    toast.error('Session expired. Please sign in again.');
    window.location.href = '/signin';
  }

  private handleForbidden(): void {
    toast.error('You don\'t have permission to perform this action.');
  }

  private handleNotFound(): void {
    toast.error('The requested resource was not found.');
  }

  private handleRateLimit(): void {
    toast.error('Too many requests. Please wait a moment and try again.');
  }

  private handleServerError(): void {
    toast.error('Server error. Please try again later.');
  }

  private handleNetworkError(): void {
    toast.error('Network error. Please check your connection.');
  }

  private handleGenericError(message: string): void {
    toast.error(message);
  }

  private normalizeError(error: any): ApiResponse {
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || error.message,
        statusCode: error.response.status,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: false,
      error: error.message || 'An error occurred',
      statusCode: 0,
      timestamp: new Date().toISOString(),
    };
  }

  // Public API Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return this.normalizeResponse(response);
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return this.normalizeResponse(response);
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return this.normalizeResponse(response);
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return this.normalizeResponse(response);
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  private normalizeResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    // Handle different response formats
    const data = response.data;
    
    // If backend already returns our format
    if (data && typeof data === 'object' && 'success' in data) {
      return data as ApiResponse<T>;
    }

    // Convert standard HTTP response to our format
    return {
      success: response.status >= 200 && response.status < 300,
      data: data,
      statusCode: response.status,
      timestamp: new Date().toISOString(),
    };
  }

  // Utility Methods
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }


  private getCurrentTenantId(): string | null {
    return localStorage.getItem('currentTenantId');
  }

  private getCurrentUserId(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }

  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('currentTenantId');
  }

  // Public utility methods
  setAuthToken(token: string | null): void {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setTenantId(tenantId: string | null): void {
    if (tenantId) {
      localStorage.setItem('currentTenantId', tenantId);
    } else {
      localStorage.removeItem('currentTenantId');
    }
  }

  getTenantId(): string | null {
    return this.getCurrentTenantId();
  }
}

// Create singleton instance
const apiClient = new RobustApiClient({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
});

export default apiClient;
export { RobustApiClient };
