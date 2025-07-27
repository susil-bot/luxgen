# Tenant Settings Management Guide

## Overview

The Tenant Settings Management system provides comprehensive configuration capabilities for managing tenant environments. This guide covers all aspects of the settings functionality, including general settings, security configuration, branding, notifications, integrations, billing, and usage limits.

## Table of Contents

1. [General Settings](#general-settings)
2. [Security Configuration](#security-configuration)
3. [Branding & Customization](#branding--customization)
4. [Notification Settings](#notification-settings)
5. [Integration Configuration](#integration-configuration)
6. [Billing Management](#billing-management)
7. [Usage & Limits](#usage--limits)
8. [API Reference](#api-reference)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## General Settings

### Company Information
- **Company Name**: The display name for your tenant (required)
- **Domain**: Custom domain for your tenant (optional)
- **Subdomain**: Subdomain for your tenant (optional)

### Regional Settings
- **Timezone**: Affects all date/time displays throughout the application
- **Language**: Primary language for the interface
- **Currency**: Default currency for billing and pricing displays
- **Date Format**: How dates are displayed (MM/DD/YYYY, DD/MM/YYYY, etc.)
- **Time Format**: 12-hour or 24-hour time format

### Validation Rules
```typescript
// Company name validation
- Required field
- Maximum 100 characters
- Cannot be empty or whitespace only

// Domain validation
- Must be a valid domain format
- Supports subdomains
- Cannot contain special characters except hyphens

// Timezone validation
- Must be a valid IANA timezone identifier
- Common options: America/New_York, Europe/London, Asia/Tokyo
```

## Security Configuration

### Multi-Factor Authentication (MFA)
- **Enable MFA**: Require all users to use two-factor authentication
- **MFA Methods**: SMS, authenticator apps, email codes
- **Grace Period**: Allow users time to set up MFA after enabling

### Session Management
- **Session Timeout**: How long users remain logged in (15-1440 minutes)
- **Idle Timeout**: Automatic logout after inactivity
- **Concurrent Sessions**: Limit number of simultaneous logins per user

### Password Policy
```typescript
interface PasswordPolicy {
  minLength: number;           // 6-50 characters
  requireUppercase: boolean;   // Require uppercase letters
  requireLowercase: boolean;   // Require lowercase letters
  requireNumbers: boolean;     // Require numeric characters
  requireSpecialChars: boolean; // Require special characters
  preventCommonPasswords: boolean; // Block common passwords
  maxAge: number;             // Days until password expires (1-365)
  preventReuse: number;       // Prevent reuse of last N passwords (0-20)
}
```

### Access Control
- **IP Whitelist**: Restrict access to specific IP addresses or ranges
- **Allowed Domains**: Restrict user registration to specific email domains
- **Audit Logs**: Track all security-related activities
- **Login Notifications**: Alert on suspicious login attempts

## Branding & Customization

### Visual Branding
- **Primary Color**: Main brand color (hex format)
- **Secondary Color**: Secondary brand color (hex format)
- **Accent Color**: Highlight color for interactive elements
- **Logo**: Company logo (PNG, JPG, SVG up to 5MB)
- **Favicon**: Browser tab icon (ICO, PNG up to 1MB)

### Content Customization
- **Company Tagline**: Brief company description (max 200 characters)
- **Custom CSS**: Custom styling for advanced customization
- **Enable Custom Branding**: Toggle for custom branding features

### Validation Rules
```typescript
// Color validation
- Must be valid hex color format (#RRGGBB or #RGB)
- Cannot be empty or invalid format

// Logo validation
- Supported formats: PNG, JPG, SVG
- Maximum size: 5MB
- Recommended dimensions: 200x200px minimum

// Tagline validation
- Maximum 200 characters
- Cannot contain HTML or script tags
```

## Notification Settings

### Email Configuration
```typescript
interface EmailSettings {
  enabled: boolean;
  smtpSettings?: {
    host: string;           // SMTP server hostname
    port: number;           // SMTP port (1-65535)
    username: string;       // SMTP username
    password: string;       // SMTP password
    encryption: 'none' | 'ssl' | 'tls';
  };
  fromEmail: string;        // Sender email address
  fromName: string;         // Sender display name
}
```

### SMS Configuration
```typescript
interface SmsSettings {
  enabled: boolean;
  provider: string;         // SMS provider (twilio, aws-sns, etc.)
  apiKey: string;           // Provider API key
  fromNumber: string;       // Sender phone number
}
```

### Push Notifications
```typescript
interface PushSettings {
  enabled: boolean;
  webhookUrl: string;       // Webhook URL for push notifications
}
```

### Notification Preferences
- **Welcome Email**: Send welcome email to new users
- **Password Reset Email**: Notify on password reset attempts
- **Account Lockout Email**: Alert on account lockouts
- **Security Alerts**: Notify on security events
- **Weekly Digest**: Send weekly activity summary
- **Monthly Report**: Send monthly usage report

## Integration Configuration

### Slack Integration
```typescript
interface SlackIntegration {
  enabled: boolean;
  webhookUrl: string;       // Slack webhook URL
  channel: string;          // Default channel (#general)
}
```

### Microsoft Teams Integration
```typescript
interface TeamsIntegration {
  enabled: boolean;
  webhookUrl: string;       // Teams webhook URL
}
```

### Webhook Integration
```typescript
interface WebhookIntegration {
  enabled: boolean;
  url: string;              // Webhook endpoint URL
  events: string[];         // Events to send (user.created, user.updated, etc.)
}
```

### API Configuration
```typescript
interface ApiSettings {
  enabled: boolean;
  rateLimit: number;        // Requests per hour (1-100,000)
  allowedOrigins: string[]; // CORS allowed origins
  enableApiKeys: boolean;   // Enable API key authentication
}
```

## Billing Management

### Plan Configuration
- **Current Plan**: Active subscription plan
- **Billing Cycle**: Monthly or yearly billing
- **Auto Renew**: Automatically renew subscription
- **Next Billing Date**: Date of next charge

### Payment Method
```typescript
interface PaymentMethod {
  type: 'card' | 'bank' | 'paypal';
  last4?: string;           // Last 4 digits of card/account
  expiryMonth?: number;     // Card expiry month
  expiryYear?: number;      // Card expiry year
}
```

### Billing Address
```typescript
interface BillingAddress {
  name: string;             // Contact name
  company: string;          // Company name
  address: string;          // Street address
  city: string;             // City
  state: string;            // State/Province
  zipCode: string;          // ZIP/Postal code
  country: string;          // Country
}
```

### Invoice Settings
- **Auto Send**: Automatically send invoices
- **Include Tax**: Include tax calculations
- **Currency**: Invoice currency

## Usage & Limits

### User Limits
```typescript
interface UserLimits {
  current: number;          // Current number of users
  limit: number;            // Maximum allowed users
  allowOverage: boolean;    // Allow exceeding limit
  overagePrice: number;     // Price per additional user
}
```

### Storage Limits
```typescript
interface StorageLimits {
  current: number;          // Current storage used (GB)
  limit: number;            // Maximum storage (GB)
  allowOverage: boolean;    // Allow exceeding limit
  overagePrice: number;     // Price per additional GB
}
```

### API Call Limits
```typescript
interface ApiCallLimits {
  current: number;          // Current API calls used
  limit: number;            // Maximum API calls per month
  allowOverage: boolean;    // Allow exceeding limit
  overagePrice: number;     // Price per additional call
}
```

### Feature Limits
- **Custom Domains**: Number of custom domains allowed
- **Integrations**: Number of third-party integrations
- **API Keys**: Number of API keys per tenant

## API Reference

### Get Tenant Settings
```typescript
GET /api/tenants/{tenantId}/settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "general": { /* general settings */ },
    "security": { /* security settings */ },
    "branding": { /* branding settings */ },
    "notifications": { /* notification settings */ },
    "integrations": { /* integration settings */ },
    "billing": { /* billing settings */ },
    "limits": { /* usage limits */ }
  }
}
```

### Update Tenant Settings
```typescript
PUT /api/tenants/{tenantId}/settings
```

**Request Body:**
```json
{
  "general": {
    "companyName": "Updated Company",
    "timezone": "America/New_York"
  },
  "security": {
    "mfaRequired": true,
    "sessionTimeout": 240
  }
}
```

### Update Specific Category
```typescript
PATCH /api/tenants/{tenantId}/settings/{category}
```

**Example:**
```typescript
PATCH /api/tenants/tenant-1/settings/security
{
  "mfaRequired": true,
  "sessionTimeout": 120
}
```

### Validate Settings
```typescript
POST /api/tenants/{tenantId}/settings/validate
```

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "field": "security.mfaRequired",
      "message": "Multi-factor authentication is recommended",
      "severity": "warning"
    }
  ]
}
```

### Export Settings
```typescript
GET /api/tenants/{tenantId}/settings/export
```

**Response:** JSON file download

### Import Settings
```typescript
POST /api/tenants/{tenantId}/settings/import
Content-Type: multipart/form-data
```

**Request:** Form data with settings file

### Test Email Configuration
```typescript
POST /api/tenants/{tenantId}/settings/test-email
{
  "host": "smtp.gmail.com",
  "port": 587,
  "username": "user@gmail.com",
  "password": "password",
  "encryption": "tls"
}
```

## Best Practices

### Security
1. **Enable MFA**: Always enable multi-factor authentication for enhanced security
2. **Strong Password Policy**: Use comprehensive password requirements
3. **Regular Session Timeouts**: Set reasonable session timeouts (2-4 hours)
4. **IP Whitelisting**: Restrict access to known IP ranges when possible
5. **Audit Logs**: Enable audit logging for compliance and security monitoring

### Notifications
1. **Email Configuration**: Use a reliable SMTP provider (SendGrid, AWS SES, etc.)
2. **Test Notifications**: Always test email/SMS configurations before going live
3. **Webhook Security**: Use HTTPS for webhook URLs and validate webhook signatures
4. **Rate Limiting**: Implement appropriate rate limits for notification channels

### Branding
1. **Logo Guidelines**: Use high-resolution logos (minimum 200x200px)
2. **Color Accessibility**: Ensure brand colors meet WCAG contrast requirements
3. **Consistent Branding**: Maintain consistency across all branded elements
4. **Custom CSS**: Test custom CSS thoroughly across different browsers

### Performance
1. **API Rate Limits**: Set appropriate rate limits based on your usage patterns
2. **Storage Monitoring**: Monitor storage usage and set up alerts for approaching limits
3. **Integration Limits**: Limit the number of active integrations to essential ones
4. **Caching**: Implement caching for frequently accessed settings

### Compliance
1. **Data Retention**: Configure appropriate data retention policies
2. **Privacy Settings**: Ensure notification preferences comply with privacy regulations
3. **Audit Trails**: Maintain comprehensive audit logs for compliance requirements
4. **Data Export**: Provide data export capabilities for GDPR compliance

## Troubleshooting

### Common Issues

#### Email Notifications Not Working
1. **Check SMTP Settings**: Verify host, port, username, and password
2. **Test Connection**: Use the test email configuration feature
3. **Check Firewall**: Ensure SMTP ports are not blocked
4. **Verify Credentials**: Check if email provider requires app-specific passwords

#### Settings Not Saving
1. **Validation Errors**: Check for validation errors in the form
2. **Network Issues**: Verify API connectivity
3. **Permissions**: Ensure user has settings modification permissions
4. **Browser Cache**: Clear browser cache and try again

#### Security Settings Not Applied
1. **User Sessions**: Users may need to log out and back in for security changes
2. **Caching**: Clear application cache
3. **Database**: Verify settings are properly saved in database
4. **Environment**: Check if settings are environment-specific

#### Integration Failures
1. **Webhook URLs**: Verify webhook URLs are accessible and use HTTPS
2. **API Keys**: Check if API keys are valid and have proper permissions
3. **Rate Limits**: Ensure you're not exceeding provider rate limits
4. **Event Configuration**: Verify events are properly configured

### Debug Tools

#### Settings Validation
```typescript
// Validate settings before saving
const validation = await settingsValidator.validateAllSettings(settings);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}
```

#### API Testing
```typescript
// Test API endpoints
const response = await fetch('/api/tenants/tenant-1/settings/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(emailConfig)
});
```

#### Audit Logs
```typescript
// View settings audit logs
const logs = await settingsService.getSettingsAuditLog(tenantId, {
  page: 1,
  limit: 50,
  category: 'security'
});
```

### Support Resources

1. **Documentation**: Refer to this guide for detailed information
2. **API Reference**: Use the API documentation for technical details
3. **Support Team**: Contact support for complex issues
4. **Community**: Check community forums for common solutions
5. **Status Page**: Monitor service status for known issues

## Conclusion

The Tenant Settings Management system provides comprehensive configuration capabilities for managing tenant environments. By following the best practices outlined in this guide and using the provided tools and APIs, you can effectively configure and maintain your tenant settings for optimal performance, security, and user experience.

For additional support or questions, please refer to the support resources or contact the development team. 