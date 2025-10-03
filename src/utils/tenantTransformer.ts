import { TenantConfiguration, TenantBranding, TenantFeatures, TenantLimits, TenantSecurity } from '../types/tenant';

/**
 * Comprehensive Tenant Transformation System
 * Transforms components, styles, and behavior based on tenant configuration
 */

export interface TransformationRule {
  name: string;
  transform: (component: any, tenantConfig: TenantConfiguration) => any;
  priority: number;
}

export class TenantTransformer {
  private static instance: TenantTransformer;
  private transformationRules: Map<string, TransformationRule> = new Map();
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 300000; // 5 minutes

  private constructor() {
    this.initializeDefaultRules();
  }

  static getInstance(): TenantTransformer {
    if (!TenantTransformer.instance) {
      TenantTransformer.instance = new TenantTransformer();
    }
    return TenantTransformer.instance;
  }

  /**
   * Initialize default transformation rules
   */
  private initializeDefaultRules(): void {
    // Theme transformation rule
    this.addRule({
      name: 'theme',
      priority: 1,
      transform: (component, tenantConfig) => {
        const branding = tenantConfig.branding;
        if (!branding) return component;

        return {
          ...component,
          theme: {
            name: branding.theme || 'default',
            colors: branding.colors || {},
            fonts: branding.fonts || {},
            logo: branding.logo,
            favicon: branding.favicon,
          },
        };
      },
    });

    // Features transformation rule
    this.addRule({
      name: 'features',
      priority: 2,
      transform: (component, tenantConfig) => {
        const features = tenantConfig.features || [];
        
        return {
          ...component,
          features: {
            enabled: features,
            disabled: this.getDisabledFeatures(features),
            available: this.getAllAvailableFeatures(),
          },
        };
      },
    });

    // Limits transformation rule
    this.addRule({
      name: 'limits',
      priority: 3,
      transform: (component, tenantConfig) => {
        const limits = tenantConfig.limits || {};
        
        return {
          ...component,
          limits: {
            ...limits,
            usage: this.getCurrentUsage(tenantConfig),
            remaining: this.calculateRemainingLimits(limits, this.getCurrentUsage(tenantConfig)),
          },
        };
      },
    });

    // Security transformation rule
    this.addRule({
      name: 'security',
      priority: 4,
      transform: (component, tenantConfig) => {
        const security = tenantConfig.security || {};
        
        return {
          ...component,
          security: {
            ...security,
            permissions: security.permissions || ['read'],
            sso: security.sso || false,
            mfa: security.mfa || false,
          },
        };
      },
    });

    // Custom fields transformation rule
    this.addRule({
      name: 'customFields',
      priority: 5,
      transform: (component, tenantConfig) => {
        const customFields = tenantConfig.customFields || {};
        
        return {
          ...component,
          customFields,
        };
      },
    });

    // Integrations transformation rule
    this.addRule({
      name: 'integrations',
      priority: 6,
      transform: (component, tenantConfig) => {
        const integrations = tenantConfig.integrations || {};
        
        return {
          ...component,
          integrations: {
            ...integrations,
            enabled: Object.keys(integrations).filter(key => integrations[key]?.enabled),
          },
        };
      },
    });
  }

  /**
   * Add a transformation rule
   */
  addRule(rule: TransformationRule): void {
    this.transformationRules.set(rule.name, rule);
  }

  /**
   * Remove a transformation rule
   */
  removeRule(name: string): void {
    this.transformationRules.delete(name);
  }

  /**
   * Transform component based on tenant configuration
   */
  transformComponent(
    component: any,
    tenantConfig: TenantConfiguration,
    transformationTypes: string[] = ['all']
  ): any {
    try {
      const cacheKey = this.generateCacheKey(component, tenantConfig, transformationTypes);
      
      // Check cache first
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid(cached.timestamp)) {
        return cached.data;
      }

      let transformedComponent = { ...component };

      if (transformationTypes.includes('all')) {
        // Apply all rules in priority order
        const sortedRules = Array.from(this.transformationRules.values())
          .sort((a, b) => a.priority - b.priority);

        for (const rule of sortedRules) {
          transformedComponent = rule.transform(transformedComponent, tenantConfig);
        }
      } else {
        // Apply specific rules
        for (const type of transformationTypes) {
          const rule = this.transformationRules.get(type);
          if (rule) {
            transformedComponent = rule.transform(transformedComponent, tenantConfig);
          }
        }
      }

      // Add tenant context
      transformedComponent.tenantContext = {
        tenant: tenantConfig.slug,
        id: tenantConfig.id,
        name: tenantConfig.name,
        domain: tenantConfig.domain,
        lastUpdated: tenantConfig.lastUpdated,
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: transformedComponent,
        timestamp: Date.now(),
      });

      return transformedComponent;
    } catch (error) {
      console.error('Component transformation failed:', error);
      return component; // Return original component on error
    }
  }

  /**
   * Transform CSS styles based on tenant branding
   */
  transformStyles(styles: any, tenantConfig: TenantConfiguration): any {
    const branding = tenantConfig.branding;
    if (!branding) return styles;

    const transformedStyles = { ...styles };

    // Apply color transformations
    if (branding.colors) {
      Object.entries(branding.colors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          transformedStyles[`--tenant-${key}`] = value;
        }
      });
    }

    // Apply font transformations
    if (branding.fonts) {
      if (branding.fonts.primary) {
        transformedStyles['--tenant-font-primary'] = branding.fonts.primary;
      }
      if (branding.fonts.secondary) {
        transformedStyles['--tenant-font-secondary'] = branding.fonts.secondary;
      }
      if (branding.fonts.sizes) {
        Object.entries(branding.fonts.sizes).forEach(([key, value]) => {
          transformedStyles[`--tenant-font-size-${key}`] = value;
        });
      }
    }

    return transformedStyles;
  }

  /**
   * Transform component props based on tenant features
   */
  transformProps(props: any, tenantConfig: TenantConfiguration): any {
    const features = tenantConfig.features || [];
    const transformedProps = { ...props };

    // Disable features based on tenant configuration
    if (!features.includes('ai')) {
      transformedProps.aiEnabled = false;
    }
    if (!features.includes('analytics')) {
      transformedProps.analyticsEnabled = false;
    }
    if (!features.includes('integrations')) {
      transformedProps.integrationsEnabled = false;
    }
    if (!features.includes('custom_domain')) {
      transformedProps.customDomainEnabled = false;
    }
    if (!features.includes('sso')) {
      transformedProps.ssoEnabled = false;
    }
    if (!features.includes('audit_logs')) {
      transformedProps.auditLogsEnabled = false;
    }

    return transformedProps;
  }

  /**
   * Transform component behavior based on tenant limits
   */
  transformBehavior(component: any, tenantConfig: TenantConfiguration): any {
    const limits = tenantConfig.limits || {};
    const usage = this.getCurrentUsage(tenantConfig);

    // Apply limit-based transformations
    if (limits.users && usage.users >= limits.users) {
      component.userLimitReached = true;
    }
    if (limits.storage && usage.storage >= limits.storage) {
      component.storageLimitReached = true;
    }
    if (limits.apiCalls && usage.apiCalls >= limits.apiCalls) {
      component.apiLimitReached = true;
    }

    return component;
  }

  /**
   * Transform component security based on tenant security settings
   */
  transformSecurity(component: any, tenantConfig: TenantConfiguration): any {
    const security = tenantConfig.security || {};

    return {
      ...component,
      security: {
        permissions: security.permissions || ['read'],
        sso: security.sso || false,
        mfa: security.mfa || false,
        sessionTimeout: security.sessionTimeout || 3600,
        ipWhitelist: security.ipWhitelist || [],
      },
    };
  }

  /**
   * Clear transformation cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get all available transformation rules
   */
  getAvailableRules(): string[] {
    return Array.from(this.transformationRules.keys());
  }

  /**
   * Helper methods
   */
  private getDisabledFeatures(enabledFeatures: string[]): string[] {
    const allFeatures = ['ai', 'analytics', 'integrations', 'custom_domain', 'sso', 'audit_logs'];
    return allFeatures.filter(feature => !enabledFeatures.includes(feature));
  }

  private getAllAvailableFeatures(): string[] {
    return ['ai', 'analytics', 'integrations', 'custom_domain', 'sso', 'audit_logs'];
  }

  private getCurrentUsage(tenantConfig: TenantConfiguration): any {
    // This would typically query actual usage from database
    return {
      users: 0,
      storage: 0,
      apiCalls: 0,
      lastActivity: new Date(),
    };
  }

  private calculateRemainingLimits(limits: any, usage: any): any {
    const remaining: any = {};
    
    for (const [key, limit] of Object.entries(limits)) {
      if (typeof limit === 'number' && typeof usage[key] === 'number') {
        remaining[key] = Math.max(0, limit - usage[key]);
      }
    }
    
    return remaining;
  }

  private generateCacheKey(component: any, tenantConfig: TenantConfiguration, transformationTypes: string[]): string {
    return `${JSON.stringify(component)}_${tenantConfig.slug}_${transformationTypes.join(',')}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }
}

// Export singleton instance
export const tenantTransformer = TenantTransformer.getInstance();

// Export utility functions
export function transformComponent(
  component: any,
  tenantConfig: TenantConfiguration,
  transformationTypes: string[] = ['all']
): any {
  return tenantTransformer.transformComponent(component, tenantConfig, transformationTypes);
}

export function transformStyles(styles: any, tenantConfig: TenantConfiguration): any {
  return tenantTransformer.transformStyles(styles, tenantConfig);
}

export function transformProps(props: any, tenantConfig: TenantConfiguration): any {
  return tenantTransformer.transformProps(props, tenantConfig);
}

export function transformBehavior(component: any, tenantConfig: TenantConfiguration): any {
  return tenantTransformer.transformBehavior(component, tenantConfig);
}

export function transformSecurity(component: any, tenantConfig: TenantConfiguration): any {
  return tenantTransformer.transformSecurity(component, tenantConfig);
}

export default tenantTransformer;
