/**
 * Brand Identity Service
 * Frontend service for managing brand identity configurations
 */

import apiClient from '../core/api/ApiClient';

export interface BrandIdentity {
  colors?: {
    palette?: Record<string, string>;
    consumption?: any;
    discovery?: any;
    foundation?: any;
    background?: any;
    interactive?: any;
    navigation?: any;
  };
  spacing?: Record<string, string>;
  typography?: {
    definitions?: Record<string, any>;
    typefaces?: Record<string, any>;
  };
  decorations?: Record<string, any>;
  motion?: Record<string, any>;
  interactive?: Record<string, any>;
  navigation?: Record<string, any>;
  'container-styles'?: Record<string, any>;
}

export interface BrandAsset {
  name: string;
  path: string;
  type: string;
}

export interface BrandAssets {
  [category: string]: BrandAsset[];
}

export interface BrandHealth {
  status: 'healthy' | 'unhealthy';
  tenantId: string;
  brandId: string;
  lastUpdated: string;
  hasColors?: boolean;
  hasTypography?: boolean;
  hasSpacing?: boolean;
  hasMotion?: boolean;
  hasInteractive?: boolean;
  hasNavigation?: boolean;
  hasDecorations?: boolean;
  error?: string;
}

class BrandIdentityService {
  private baseUrl = '/api/v1/brand-identity';

  /**
   * Get current brand identity for tenant
   */
  async getCurrentBrandIdentity(): Promise<BrandIdentity> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/`);
      if (response.success && response.data) {
        const data = response.data as any;
        return data.data?.brandIdentity || data.brandIdentity || data;
      }
      throw new Error((response.data as any)?.message || 'Failed to get brand identity');
    } catch (error) {
      console.error('Failed to get current brand identity:', error);
      throw error;
    }
  }

  /**
   * Get available brand identities for tenant
   */
  async getAvailableBrands(): Promise<string[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/available`);
      if (response.success && response.data) {
        const data = response.data as any;
        return data.data?.availableBrands || data.availableBrands || [];
      }
      throw new Error((response.data as any)?.message || 'Failed to get available brands');
    } catch (error) {
      console.error('Failed to get available brands:', error);
      throw error;
    }
  }

  /**
   * Get specific brand identity
   */
  async getBrandIdentity(brandId: string): Promise<BrandIdentity> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${brandId}`);
      if (response.success && response.data) {
        const data = response.data as any;
        return data.data?.brandIdentity || data.brandIdentity || data;
      }
      throw new Error((response.data as any)?.message || 'Failed to get brand identity');
    } catch (error) {
      console.error(`Failed to get brand identity: ${brandId}`, error);
      throw error;
    }
  }

  /**
   * Create new brand identity
   */
  async createBrandIdentity(brandId: string, brandIdentity: BrandIdentity): Promise<BrandIdentity> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${brandId}`, brandIdentity);
      if (response.success && response.data) {
        const data = response.data as any;
        return data.data?.brandIdentity || data.brandIdentity || data;
      }
      throw new Error((response.data as any)?.message || 'Failed to get brand identity');
    } catch (error) {
      console.error(`Failed to create brand identity: ${brandId}`, error);
      throw error;
    }
  }

  /**
   * Update brand identity
   */
  async updateBrandIdentity(brandId: string, brandIdentity: BrandIdentity): Promise<BrandIdentity> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${brandId}`, brandIdentity);
      if (response.success && response.data) {
        const data = response.data as any;
        return data.data?.brandIdentity || data.brandIdentity || data;
      }
      throw new Error((response.data as any)?.message || 'Failed to get brand identity');
    } catch (error) {
      console.error(`Failed to update brand identity: ${brandId}`, error);
      throw error;
    }
  }

  /**
   * Delete brand identity
   */
  async deleteBrandIdentity(brandId: string): Promise<boolean> {
    try {
      await apiClient.delete(`${this.baseUrl}/${brandId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete brand identity: ${brandId}`, error);
      throw error;
    }
  }

  /**
   * Get brand assets
   */
  async getBrandAssets(brandId: string): Promise<BrandAssets> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${brandId}/assets`);
      if (response.success && response.data) {
        const data = response.data as any;
        return data.data?.assets || data.assets || [];
      }
      throw new Error((response.data as any)?.message || 'Failed to get brand assets');
    } catch (error) {
      console.error(`Failed to get brand assets: ${brandId}`, error);
      throw error;
    }
  }

  /**
   * Get brand CSS variables
   */
  async getBrandCSS(brandId: string): Promise<string> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${brandId}/css`, {
        headers: {
          'Accept': 'text/css'
        }
      });
      if (response.success && response.data) {
        return response.data as string;
      }
      throw new Error((response.data as any)?.message || 'Failed to get brand CSS');
    } catch (error) {
      console.error(`Failed to get brand CSS: ${brandId}`, error);
      throw error;
    }
  }

  /**
   * Get brand health status
   */
  async getBrandHealth(brandId: string): Promise<BrandHealth> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${brandId}/health`);
      if (response.success && response.data) {
        const data = response.data as any;
        return data.data || data;
      }
      throw new Error((response.data as any)?.message || 'Failed to get response data');
    } catch (error) {
      console.error(`Failed to get brand health: ${brandId}`, error);
      throw error;
    }
  }

  /**
   * Clear brand identity cache
   */
  async clearBrandCache(brandId: string): Promise<boolean> {
    try {
      await apiClient.post(`${this.baseUrl}/${brandId}/clear-cache`);
      return true;
    } catch (error) {
      console.error(`Failed to clear brand cache: ${brandId}`, error);
      throw error;
    }
  }

  /**
   * Apply brand identity to document
   */
  async applyBrandIdentity(brandId: string): Promise<void> {
    try {
      const css = await this.getBrandCSS(brandId);
      
      // Remove existing brand CSS
      const existingStyle = document.getElementById('brand-identity-css');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Add new brand CSS
      const style = document.createElement('style');
      style.id = 'brand-identity-css';
      style.textContent = css;
      document.head.appendChild(style);

      // Store current brand ID in localStorage
      localStorage.setItem('currentBrandId', brandId);
    } catch (error) {
      console.error(`Failed to apply brand identity: ${brandId}`, error);
      throw error;
    }
  }

  /**
   * Get current brand ID from localStorage
   */
  getCurrentBrandId(): string {
    return localStorage.getItem('currentBrandId') || 'default';
  }

  /**
   * Set current brand ID in localStorage
   */
  setCurrentBrandId(brandId: string): void {
    localStorage.setItem('currentBrandId', brandId);
  }
}

export const brandIdentityService = new BrandIdentityService();
