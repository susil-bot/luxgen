/**
 * LUXGEN TENANT WORKFLOW
 * Handles tenant configuration and management
 */

import { Workflow, WorkflowContext, WorkflowResult, TenantConfig } from './types';

interface TenantData {
  currentTenant: TenantConfig | null;
  availableTenants: TenantConfig[];
}

export class TenantWorkflow implements Workflow<TenantData> {
  id = 'tenant';
  name = 'Tenant Management Workflow';

  async execute(context: WorkflowContext): Promise<WorkflowResult<TenantData>> {
    const { tenantId, data } = context;
    const { action } = data;

    try {
      switch (action) {
        case 'getCurrentTenant':
          return await this.getCurrentTenant(tenantId);
        case 'getAllTenants':
          return await this.getAllTenants();
        case 'switchTenant':
          return await this.switchTenant(tenantId);
        case 'updateTenantConfig':
          return await this.updateTenantConfig(tenantId, data.config);
        default:
          return {
            success: false,
            message: 'Invalid tenant action',
            errors: [{
              code: 'INVALID_ACTION',
              message: `Unknown tenant action: ${action}`
            }],
            statusCode: 400
          };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Tenant operation failed',
        errors: [{
          code: 'TENANT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown tenant error'
        }],
        statusCode: 500
      };
    }
  }

  private async getCurrentTenant(tenantId: string): Promise<WorkflowResult<TenantData>> {
    try {
      const response = await fetch(`/api/v1/tenants/${tenantId}/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          message: result.message || 'Failed to get tenant configuration',
          statusCode: response.status
        };
      }

      return {
        success: true,
        message: 'Tenant configuration retrieved successfully',
        data: {
          currentTenant: result.data,
          availableTenants: []
        },
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error while fetching tenant configuration',
        errors: [{
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown network error'
        }],
        statusCode: 500
      };
    }
  }

  private async getAllTenants(): Promise<WorkflowResult<TenantData>> {
    try {
      const response = await fetch('/api/v1/tenants', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          message: result.message || 'Failed to get tenants',
          statusCode: response.status
        };
      }

      return {
        success: true,
        message: 'Tenants retrieved successfully',
        data: {
          currentTenant: null,
          availableTenants: result.data.tenants
        },
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error while fetching tenants',
        errors: [{
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown network error'
        }],
        statusCode: 500
      };
    }
  }

  private async switchTenant(newTenantId: string): Promise<WorkflowResult<TenantData>> {
    try {
      // Update local storage
      localStorage.setItem('current_tenant_id', newTenantId);

      // Get the new tenant configuration
      const tenantResponse = await fetch(`/api/v1/tenants/${newTenantId}/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const tenantResult = await tenantResponse.json();

      if (!tenantResult.success) {
        return {
          success: false,
          message: tenantResult.message || 'Failed to switch tenant',
          statusCode: tenantResponse.status
        };
      }

      return {
        success: true,
        message: 'Tenant switched successfully',
        data: {
          currentTenant: tenantResult.data,
          availableTenants: []
        },
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error while switching tenant',
        errors: [{
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown network error'
        }],
        statusCode: 500
      };
    }
  }

  private async updateTenantConfig(tenantId: string, config: Partial<TenantConfig>): Promise<WorkflowResult<TenantData>> {
    try {
      // This would typically be a PUT request to update tenant configuration
      // For now, we'll just return success as this is a mock implementation
      
      return {
        success: true,
        message: 'Tenant configuration updated successfully',
        data: {
          currentTenant: config as TenantConfig,
          availableTenants: []
        },
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update tenant configuration',
        errors: [{
          code: 'UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown update error'
        }],
        statusCode: 500
      };
    }
  }
}
