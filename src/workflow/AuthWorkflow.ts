/**
 * LUXGEN AUTHENTICATION WORKFLOW
 * Handles user authentication and session management
 */

import { Workflow, WorkflowContext, WorkflowResult, UserContext } from './types';

interface AuthData {
  user: UserContext;
  token: string;
  tenantConfig: any;
}

export class AuthWorkflow implements Workflow<AuthData> {
  id = 'auth';
  name = 'Authentication Workflow';

  async execute(context: WorkflowContext): Promise<WorkflowResult<AuthData>> {
    const { tenantId, data } = context;
    const { email, password, action } = data;

    try {
      switch (action) {
        case 'login':
          return await this.handleLogin(tenantId, email, password);
        case 'register':
          return await this.handleRegister(tenantId, data);
        case 'logout':
          return await this.handleLogout();
        case 'refresh':
          return await this.handleRefresh(tenantId, data.token);
        default:
          return {
            success: false,
            message: 'Invalid authentication action',
            errors: [{
              code: 'INVALID_ACTION',
              message: `Unknown authentication action: ${action}`
            }],
            statusCode: 400
          };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Authentication failed',
        errors: [{
          code: 'AUTH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown authentication error'
        }],
        statusCode: 500
      };
    }
  }

  private async handleLogin(tenantId: string, email: string, password: string): Promise<WorkflowResult<AuthData>> {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          message: result.message || 'Login failed',
          statusCode: response.status
        };
      }

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: result.data,
          token: result.data.token,
          tenantConfig: result.tenantConfig
        },
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error during login',
        errors: [{
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown network error'
        }],
        statusCode: 500
      };
    }
  }

  private async handleRegister(tenantId: string, userData: any): Promise<WorkflowResult<AuthData>> {
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          message: result.message || 'Registration failed',
          statusCode: response.status
        };
      }

      return {
        success: true,
        message: 'Registration successful',
        data: {
          user: result.data,
          token: result.data.token,
          tenantConfig: result.tenantConfig
        },
        statusCode: 201
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error during registration',
        errors: [{
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown network error'
        }],
        statusCode: 500
      };
    }
  }

  private async handleLogout(): Promise<WorkflowResult<AuthData>> {
    try {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('tenant_config');

      return {
        success: true,
        message: 'Logout successful',
        data: {
          user: null as any,
          token: '',
          tenantConfig: null
        },
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: 'Logout failed',
        errors: [{
          code: 'LOGOUT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown logout error'
        }],
        statusCode: 500
      };
    }
  }

  private async handleRefresh(tenantId: string, token: string): Promise<WorkflowResult<AuthData>> {
    try {
      const response = await fetch('/api/v1/auth/me', {
        method: 'GET',
        headers: {
          'X-Tenant-ID': tenantId,
          'X-User-ID': 'current-user',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          message: result.message || 'Token refresh failed',
          statusCode: response.status
        };
      }

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user: result.data,
          token: token,
          tenantConfig: result.tenantConfig
        },
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: 'Token refresh failed',
        errors: [{
          code: 'REFRESH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown refresh error'
        }],
        statusCode: 500
      };
    }
  }
}
