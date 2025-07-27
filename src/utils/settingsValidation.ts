import { TenantSettings } from '../services/TenantSettingsService';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  info: ValidationError[];
}

class SettingsValidator {
  /**
   * Validate general settings
   */
  validateGeneral(settings: TenantSettings['general']): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!settings.companyName?.trim()) {
      errors.push({
        field: 'companyName',
        message: 'Company name is required',
        severity: 'error'
      });
    } else if (settings.companyName.length > 100) {
      errors.push({
        field: 'companyName',
        message: 'Company name must be less than 100 characters',
        severity: 'error'
      });
    }

    if (settings.domain && !this.isValidDomain(settings.domain)) {
      errors.push({
        field: 'domain',
        message: 'Please enter a valid domain name',
        severity: 'error'
      });
    }

    if (settings.subdomain && !this.isValidSubdomain(settings.subdomain)) {
      errors.push({
        field: 'subdomain',
        message: 'Subdomain can only contain lowercase letters, numbers, and hyphens',
        severity: 'error'
      });
    }

    if (!this.isValidTimezone(settings.timezone)) {
      errors.push({
        field: 'timezone',
        message: 'Please select a valid timezone',
        severity: 'error'
      });
    }

    if (!this.isValidLanguage(settings.language)) {
      errors.push({
        field: 'language',
        message: 'Please select a valid language',
        severity: 'error'
      });
    }

    if (!this.isValidCurrency(settings.currency)) {
      errors.push({
        field: 'currency',
        message: 'Please select a valid currency',
        severity: 'error'
      });
    }

    return errors;
  }

  /**
   * Validate security settings
   */
  validateSecurity(settings: TenantSettings['security']): ValidationError[] {
    const errors: ValidationError[] = [];

    if (settings.sessionTimeout < 15 || settings.sessionTimeout > 1440) {
      errors.push({
        field: 'sessionTimeout',
        message: 'Session timeout must be between 15 and 1440 minutes',
        severity: 'error'
      });
    }

    if (settings.passwordPolicy.minLength < 6) {
      errors.push({
        field: 'passwordPolicy.minLength',
        message: 'Minimum password length must be at least 6 characters',
        severity: 'error'
      });
    }

    if (settings.passwordPolicy.minLength > 50) {
      errors.push({
        field: 'passwordPolicy.minLength',
        message: 'Minimum password length cannot exceed 50 characters',
        severity: 'error'
      });
    }

    if (settings.passwordPolicy.maxAge < 1 || settings.passwordPolicy.maxAge > 365) {
      errors.push({
        field: 'passwordPolicy.maxAge',
        message: 'Password max age must be between 1 and 365 days',
        severity: 'error'
      });
    }

    if (settings.passwordPolicy.preventReuse < 0 || settings.passwordPolicy.preventReuse > 20) {
      errors.push({
        field: 'passwordPolicy.preventReuse',
        message: 'Password reuse prevention must be between 0 and 20',
        severity: 'error'
      });
    }

    // Validate IP whitelist
    settings.ipWhitelist.forEach((ip, index) => {
      if (!this.isValidIpAddress(ip)) {
        errors.push({
          field: `ipWhitelist.${index}`,
          message: 'Please enter a valid IP address or CIDR notation',
          severity: 'error'
        });
      }
    });

    // Validate allowed domains
    settings.allowedDomains.forEach((domain, index) => {
      if (!this.isValidDomain(domain)) {
        errors.push({
          field: `allowedDomains.${index}`,
          message: 'Please enter a valid domain name',
          severity: 'error'
        });
      }
    });

    return errors;
  }

  /**
   * Validate notification settings
   */
  validateNotifications(settings: TenantSettings['notifications']): ValidationError[] {
    const errors: ValidationError[] = [];

    if (settings.email.enabled) {
      if (!settings.email.fromEmail?.trim()) {
        errors.push({
          field: 'email.fromEmail',
          message: 'From email is required when email notifications are enabled',
          severity: 'error'
        });
      } else if (!this.isValidEmail(settings.email.fromEmail)) {
        errors.push({
          field: 'email.fromEmail',
          message: 'Please enter a valid email address',
          severity: 'error'
        });
      }

      if (!settings.email.fromName?.trim()) {
        errors.push({
          field: 'email.fromName',
          message: 'From name is required when email notifications are enabled',
          severity: 'error'
        });
      }

      if (settings.email.smtpSettings) {
        if (!settings.email.smtpSettings.host?.trim()) {
          errors.push({
            field: 'email.smtpSettings.host',
            message: 'SMTP host is required',
            severity: 'error'
          });
        }

        if (settings.email.smtpSettings.port < 1 || settings.email.smtpSettings.port > 65535) {
          errors.push({
            field: 'email.smtpSettings.port',
            message: 'SMTP port must be between 1 and 65535',
            severity: 'error'
          });
        }

        if (!settings.email.smtpSettings.username?.trim()) {
          errors.push({
            field: 'email.smtpSettings.username',
            message: 'SMTP username is required',
            severity: 'error'
          });
        }
      }
    }

    if (settings.sms.enabled) {
      if (!settings.sms.apiKey?.trim()) {
        errors.push({
          field: 'sms.apiKey',
          message: 'API key is required when SMS notifications are enabled',
          severity: 'error'
        });
      }

      if (!settings.sms.fromNumber?.trim()) {
        errors.push({
          field: 'sms.fromNumber',
          message: 'From number is required when SMS notifications are enabled',
          severity: 'error'
        });
      }
    }

    if (settings.push.enabled && !settings.push.webhookUrl?.trim()) {
      errors.push({
        field: 'push.webhookUrl',
        message: 'Webhook URL is required when push notifications are enabled',
        severity: 'error'
      });
    }

    return errors;
  }

  /**
   * Validate integration settings
   */
  validateIntegrations(settings: TenantSettings['integrations']): ValidationError[] {
    const errors: ValidationError[] = [];

    if (settings.slack.enabled && !settings.slack.webhookUrl?.trim()) {
      errors.push({
        field: 'slack.webhookUrl',
        message: 'Webhook URL is required when Slack integration is enabled',
        severity: 'error'
      });
    }

    if (settings.teams.enabled && !settings.teams.webhookUrl?.trim()) {
      errors.push({
        field: 'teams.webhookUrl',
        message: 'Webhook URL is required when Teams integration is enabled',
        severity: 'error'
      });
    }

    if (settings.webhook.enabled && !settings.webhook.url?.trim()) {
      errors.push({
        field: 'webhook.url',
        message: 'Webhook URL is required when webhook integration is enabled',
        severity: 'error'
      });
    }

    if (settings.api.rateLimit < 1 || settings.api.rateLimit > 100000) {
      errors.push({
        field: 'api.rateLimit',
        message: 'API rate limit must be between 1 and 100,000 requests per hour',
        severity: 'error'
      });
    }

    return errors;
  }

  /**
   * Validate branding settings
   */
  validateBranding(settings: TenantSettings['branding']): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!this.isValidColor(settings.primaryColor)) {
      errors.push({
        field: 'primaryColor',
        message: 'Please enter a valid hex color code',
        severity: 'error'
      });
    }

    if (!this.isValidColor(settings.secondaryColor)) {
      errors.push({
        field: 'secondaryColor',
        message: 'Please enter a valid hex color code',
        severity: 'error'
      });
    }

    if (!this.isValidColor(settings.accentColor)) {
      errors.push({
        field: 'accentColor',
        message: 'Please enter a valid hex color code',
        severity: 'error'
      });
    }

    if (settings.companyTagline && settings.companyTagline.length > 200) {
      errors.push({
        field: 'companyTagline',
        message: 'Company tagline must be less than 200 characters',
        severity: 'error'
      });
    }

    if (settings.customCss && settings.customCss.length > 10000) {
      errors.push({
        field: 'customCss',
        message: 'Custom CSS must be less than 10,000 characters',
        severity: 'error'
      });
    }

    return errors;
  }

  /**
   * Validate billing settings
   */
  validateBilling(settings: TenantSettings['billing']): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!settings.plan) {
      errors.push({
        field: 'plan',
        message: 'Plan is required',
        severity: 'error'
      });
    }

    if (!['monthly', 'yearly'].includes(settings.billingCycle)) {
      errors.push({
        field: 'billingCycle',
        message: 'Billing cycle must be either monthly or yearly',
        severity: 'error'
      });
    }

    if (settings.billingAddress) {
      if (!settings.billingAddress.name?.trim()) {
        errors.push({
          field: 'billingAddress.name',
          message: 'Billing name is required',
          severity: 'error'
        });
      }

      if (!settings.billingAddress.address?.trim()) {
        errors.push({
          field: 'billingAddress.address',
          message: 'Billing address is required',
          severity: 'error'
        });
      }

      if (!settings.billingAddress.city?.trim()) {
        errors.push({
          field: 'billingAddress.city',
          message: 'City is required',
          severity: 'error'
        });
      }

      if (!settings.billingAddress.country?.trim()) {
        errors.push({
          field: 'billingAddress.country',
          message: 'Country is required',
          severity: 'error'
        });
      }
    }

    return errors;
  }

  /**
   * Validate limits settings
   */
  validateLimits(settings: TenantSettings['limits']): ValidationError[] {
    const errors: ValidationError[] = [];

    if (settings.users.limit < 1) {
      errors.push({
        field: 'users.limit',
        message: 'User limit must be at least 1',
        severity: 'error'
      });
    }

    if (settings.storage.limit < 1) {
      errors.push({
        field: 'storage.limit',
        message: 'Storage limit must be at least 1 GB',
        severity: 'error'
      });
    }

    if (settings.apiCalls.limit < 1) {
      errors.push({
        field: 'apiCalls.limit',
        message: 'API calls limit must be at least 1',
        severity: 'error'
      });
    }

    if (settings.users.overagePrice < 0) {
      errors.push({
        field: 'users.overagePrice',
        message: 'Overage price cannot be negative',
        severity: 'error'
      });
    }

    if (settings.storage.overagePrice < 0) {
      errors.push({
        field: 'storage.overagePrice',
        message: 'Overage price cannot be negative',
        severity: 'error'
      });
    }

    if (settings.apiCalls.overagePrice < 0) {
      errors.push({
        field: 'apiCalls.overagePrice',
        message: 'Overage price cannot be negative',
        severity: 'error'
      });
    }

    return errors;
  }

  /**
   * Validate all settings
   */
  validateAllSettings(settings: Partial<TenantSettings>): ValidationResult {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationError[] = [];
    const allInfo: ValidationError[] = [];

    // Validate each category
    if (settings.general) {
      allErrors.push(...this.validateGeneral(settings.general));
    }

    if (settings.security) {
      allErrors.push(...this.validateSecurity(settings.security));
    }

    if (settings.notifications) {
      allErrors.push(...this.validateNotifications(settings.notifications));
    }

    if (settings.integrations) {
      allErrors.push(...this.validateIntegrations(settings.integrations));
    }

    if (settings.branding) {
      allErrors.push(...this.validateBranding(settings.branding));
    }

    if (settings.billing) {
      allErrors.push(...this.validateBilling(settings.billing));
    }

    if (settings.limits) {
      allErrors.push(...this.validateLimits(settings.limits));
    }

    // Add warnings for potential issues
    if (settings.security?.mfaRequired === false) {
      allWarnings.push({
        field: 'security.mfaRequired',
        message: 'Multi-factor authentication is recommended for enhanced security',
        severity: 'warning'
      });
    }

    if (settings.notifications?.email?.enabled === false && settings.notifications?.sms?.enabled === false) {
      allWarnings.push({
        field: 'notifications',
        message: 'No notification methods are enabled. Users may miss important updates.',
        severity: 'warning'
      });
    }

    // Add info messages
    if (settings.general?.timezone) {
      allInfo.push({
        field: 'general.timezone',
        message: `Timezone set to ${settings.general.timezone}. This affects all date/time displays.`,
        severity: 'info'
      });
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      info: allInfo
    };
  }

  // Helper methods for validation
  private isValidDomain(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain);
  }

  private isValidSubdomain(subdomain: string): boolean {
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
    return subdomainRegex.test(subdomain);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidIpAddress(ip: string): boolean {
    // Basic IP validation - can be enhanced for CIDR notation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:3[0-2]|[12]?[0-9]))?$/;
    return ipRegex.test(ip);
  }

  private isValidColor(color: string): boolean {
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return colorRegex.test(color);
  }

  private isValidTimezone(timezone: string): boolean {
    // This is a simplified check - in production, you might want to use a timezone library
    const validTimezones = [
      'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
      'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai'
    ];
    return validTimezones.includes(timezone);
  }

  private isValidLanguage(language: string): boolean {
    const validLanguages = ['en', 'es', 'fr', 'de', 'ja', 'zh'];
    return validLanguages.includes(language);
  }

  private isValidCurrency(currency: string): boolean {
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
    return validCurrencies.includes(currency);
  }
}

export default new SettingsValidator(); 