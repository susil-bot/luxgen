import { toast } from 'react-hot-toast';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  maxRetryDelay: 10000,
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
  retryable?: boolean;
}

// Request Configuration
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retry?: boolean;
  showToast?: boolean;
  showLoading?: boolean;
  cache?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
}

// Cache interface
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;
  private maxRetryDelay: number;
  private authToken: string | null = null;
  private loadingStates: Map<string, boolean> = new Map();
  private cache: Map<string, CacheEntry> = new Map();
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig> = [];
  private responseInterceptors: Array<(response: ApiResponse) => ApiResponse> = [];
  private errorInterceptors: Array<(error: ApiError) => ApiError> = [];

  constructor(config = API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.retryAttempts = config.retryAttempts;
    this.retryDelay = config.retryDelay;
    this.maxRetryDelay = config.maxRetryDelay;
    this.loadAuthToken();
    this.setupCacheCleanup();
  }

  // Add request interceptor
  addRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: (response: ApiResponse) => ApiResponse) {
    this.responseInterceptors.push(interceptor);
  }

  // Add error interceptor
  addErrorInterceptor(interceptor: (error: ApiError) => ApiError) {
    this.errorInterceptors.push(interceptor);
  }

  // Set authentication token
  setAuthToken(token: string | null) {
    this.authToken = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Load authentication token from localStorage
  private loadAuthToken() {
    this.authToken = localStorage.getItem('authToken');
  }

  // Get default headers
  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  // Create request timeout promise
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  // Handle API errors
  private handleError(error: any, endpoint: string): ApiError {
    console.error(`API Error for ${endpoint}:`, error);

    let apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: 500,
      code: 'UNKNOWN_ERROR',
      retryable: false,
    };

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      apiError = {
        message: 'Network error - Unable to connect to server',
        status: 0,
        code: 'NETWORK_ERROR',
        retryable: true,
      };
    } else if (error.status === 401) {
      // Handle unauthorized access
      this.setAuthToken(null);
      window.location.href = '/login';
      apiError = {
        message: 'Session expired. Please login again.',
        status: 401,
        code: 'UNAUTHORIZED',
        retryable: false,
      };
    } else if (error.status === 403) {
      apiError = {
        message: 'Access denied. You do not have permission to perform this action.',
        status: 403,
        code: 'FORBIDDEN',
        retryable: false,
      };
    } else if (error.status === 404) {
      apiError = {
        message: 'Resource not found.',
        status: 404,
        code: 'NOT_FOUND',
        retryable: false,
      };
    } else if (error.status === 429) {
      apiError = {
        message: 'Too many requests. Please try again later.',
        status: 429,
        code: 'RATE_LIMITED',
        retryable: true,
      };
    } else if (error.status >= 500) {
      apiError = {
        message: 'Server error. Please try again later.',
        status: error.status,
        code: 'SERVER_ERROR',
        retryable: true,
      };
    } else if (error.message) {
      apiError = {
        message: error.message,
        status: error.status || 500,
        code: error.code || 'UNKNOWN_ERROR',
        details: error.details,
        retryable: error.retryable || false,
      };
    }

    // Apply error interceptors
    this.errorInterceptors.forEach(interceptor => {
      apiError = interceptor(apiError);
    });

    return apiError;
  }

  // Show loading state
  private setLoadingState(endpoint: string, loading: boolean) {
    this.loadingStates.set(endpoint, loading);
    // Emit custom event to notify components
    window.dispatchEvent(new CustomEvent('apiLoadingState', {
      detail: { endpoint, loading }
    }));
  }

  // Cache management
  private getCachedResponse(cacheKey: string): any | null {
    const entry = this.cache.get(cacheKey);
    if (entry && Date.now() - entry.timestamp < entry.ttl) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(cacheKey);
    }
    return null;
  }

  private setCachedResponse(cacheKey: string, data: any, ttl: number) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private setupCacheCleanup() {
    setInterval(() => {
      const now = Date.now();
      this.cache.forEach((entry, key) => {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      });
    }, 60000); // Clean up every minute
  }

  // Retry request with exponential backoff
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempts: number,
    delay: number
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error: any) {
      if (attempts <= 0 || !error.retryable || error.status === 401 || error.status === 403) {
        throw error;
      }

      console.warn(`Request failed, retrying... (${attempts} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const nextDelay = Math.min(delay * 2, this.maxRetryDelay);
      return this.retryRequest(requestFn, attempts - 1, nextDelay);
    }
  }

  // Main request method
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
      retry = true,
      showToast = true,
      showLoading = true,
      cache = false,
      cacheKey,
      cacheTTL = 300000, // 5 minutes default
    } = config;

    const fullUrl = `${this.baseURL}${endpoint}`;
    const requestId = `${method}_${endpoint}_${Date.now()}`;
    const finalCacheKey = cacheKey || `${method}_${endpoint}`;

    // Check cache for GET requests
    if (cache && method === 'GET') {
      const cachedData = this.getCachedResponse(finalCacheKey);
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: 'Data retrieved from cache',
          timestamp: new Date().toISOString(),
        };
      }
    }

    if (showLoading) {
      this.setLoadingState(requestId, true);
    }

    try {
      // Apply request interceptors
      let finalConfig = { ...config };
      this.requestInterceptors.forEach(interceptor => {
        finalConfig = interceptor(finalConfig);
      });

      const requestFn = async (): Promise<ApiResponse<T>> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const requestConfig: RequestInit = {
          method,
          headers: {
            ...this.getDefaultHeaders(),
            ...headers,
          },
          signal: controller.signal,
        };

        if (body && method !== 'GET') {
          requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        const response = await fetch(fullUrl, requestConfig);
        clearTimeout(timeoutId);

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          if (response.ok) {
            const textData = await response.text();
            return {
              success: true,
              data: textData as any,
              status: response.status,
            };
          } else {
            throw {
              status: response.status,
              message: `HTTP ${response.status}: ${response.statusText}`,
              retryable: response.status >= 500,
            };
          }
        }

        const data = await response.json();

        if (!response.ok) {
          throw {
            status: response.status,
            message: data.message || data.error || `HTTP ${response.status}`,
            code: data.code,
            details: data.details,
            retryable: response.status >= 500 || response.status === 429,
          };
        }

        const result: ApiResponse<T> = {
          success: true,
          data: data.data || data,
          message: data.message,
          timestamp: data.timestamp,
          status: response.status,
        };

        // Apply response interceptors
        this.responseInterceptors.forEach(interceptor => {
          Object.assign(result, interceptor(result));
        });

        return result;
      };

      const result = retry
        ? await this.retryRequest(requestFn, this.retryAttempts, this.retryDelay)
        : await requestFn();

      // Cache successful GET responses
      if (cache && method === 'GET' && result.success) {
        this.setCachedResponse(finalCacheKey, result.data, cacheTTL);
      }

      if (showToast && result.message) {
        toast.success(result.message);
      }

      return result;
    } catch (error: any) {
      const apiError = this.handleError(error, endpoint);
      
      if (showToast) {
        toast.error(apiError.message);
      }

      return {
        success: false,
        error: apiError.message,
        timestamp: new Date().toISOString(),
        status: apiError.status,
      };
    } finally {
      if (showLoading) {
        this.setLoadingState(requestId, false);
      }
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async delete<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async patch<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  // Check if a specific endpoint is loading
  isLoading(endpoint: string): boolean {
    return this.loadingStates.get(endpoint) || false;
  }

  // Get all loading states
  getLoadingStates(): Map<string, boolean> {
    return new Map(this.loadingStates);
  }

  // Clear loading states
  clearLoadingStates() {
    this.loadingStates.clear();
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.get('/health');
  }

  // Detailed health check
  async detailedHealthCheck(): Promise<ApiResponse> {
    return this.get('/health/detailed');
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Add default interceptors
apiClient.addRequestInterceptor((config) => {
  // Add request ID for tracking
  config.headers = {
    ...config.headers,
    'X-Request-ID': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  return config;
});

apiClient.addResponseInterceptor((response) => {
  // Log successful responses in development
  if (process.env.NODE_ENV === 'development' && response.success) {
    console.log('API Response:', response);
  }
  return response;
});

apiClient.addErrorInterceptor((error) => {
  // Log errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }
  return error;
});

export default apiClient; 