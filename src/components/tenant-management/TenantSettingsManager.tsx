import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Globe, 
  Shield, 
  Bell, 
  Palette, 
  Users, 
  Database, 
  Zap, 
  Key, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  Plus, 
  Minus, 
  Edit, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  ExternalLink, 
  Mail, 
  Phone, 
  MessageCircle, 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  Building, 
  CreditCard, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Trophy, 
  Medal, 
  Badge, 
  Star, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Bookmark, 
  Share2, 
  MoreHorizontal, 
  MoreVertical, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  Move, 
  Grid, 
  List, 
  Columns, 
  Rows, 
  Layout, 
  Sidebar, 
  Menu, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  User, 
  UserPlus, 
  UserMinus, 
  UserCheck, 
  UserX, 
  Users as UsersIcon, 
  UserCog, 
  User as UserEdit, 
  UserSearch, 
  UserPlus as UserPlus2, 
  UserMinus as UserMinus2, 
  UserCheck as UserCheck2, 
  UserX as UserX2, 
  UserCog as UserCog2, 
  User as UserEdit2, 
  UserSearch as UserSearch2, 
  UserPlus as UserPlus3, 
  UserMinus as UserMinus3, 
  UserCheck as UserCheck3, 
  UserX as UserX3, 
  UserCog as UserCog3, 
  User as UserEdit3, 
  UserSearch as UserSearch3, 
  UserPlus as UserPlus4, 
  UserMinus as UserMinus4, 
  UserCheck as UserCheck4, 
  UserX as UserX4, 
  UserCog as UserCog4, 
  User as UserEdit4, 
  UserSearch as UserSearch4, 
  UserPlus as UserPlus5, 
  UserMinus as UserMinus5, 
  UserCheck as UserCheck5, 
  UserX as UserX5, 
  UserCog as UserCog5, 
  User as UserEdit5, 
  UserSearch as UserSearch5, 
  UserPlus as UserPlus6, 
  UserMinus as UserMinus6, 
  UserCheck as UserCheck6, 
  UserX as UserX6, 
  UserCog as UserCog6, 
  User as UserEdit6, 
  UserSearch as UserSearch6, 
  UserPlus as UserPlus7, 
  UserMinus as UserMinus7, 
  UserCheck as UserCheck7, 
  UserX as UserX7, 
  UserCog as UserCog7, 
  User as UserEdit7, 
  UserSearch as UserSearch7, 
  UserPlus as UserPlus8, 
  UserMinus as UserMinus8, 
  UserCheck as UserCheck8, 
  UserX as UserX8, 
  UserCog as UserCog8, 
  User as UserEdit8, 
  UserSearch as UserSearch8, 
  UserPlus as UserPlus9, 
  UserMinus as UserMinus9, 
  UserCheck as UserCheck9, 
  UserX as UserX9, 
  UserCog as UserCog9, 
  User as UserEdit9, 
  UserSearch as UserSearch9, 
  UserPlus as UserPlus10, 
  UserMinus as UserMinus10, 
  UserCheck as UserCheck10, 
  UserX as UserX10, 
  UserCog as UserCog10, 
  User as UserEdit10, 
  UserSearch as UserSearch10
} from 'lucide-react';
import { Tenant } from '../../types/multiTenancy';
import apiClient from '../../core/api/ApiClient';
import { toast } from 'react-hot-toast';

interface TenantSettingsManagerProps {
  tenant: Tenant;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTenant: Tenant) => void;
}

interface SettingsData {
  general: {
    companyName: string;
    domain: string;
    subdomain: string;
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
  };
  branding: {
    logo: File | null;
    favicon: File | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    companyTagline: string;
    customCss: string;
    enableCustomBranding: boolean;
  };
  security: {
    mfaRequired: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      preventCommonPasswords: boolean;
      maxAge: number;
      preventReuse: number;
    };
    ipWhitelist: string[];
    allowedDomains: string[];
    enableAuditLogs: boolean;
    enableLoginNotifications: boolean;
    enableSuspiciousActivityAlerts: boolean;
  };
  notifications: {
    email: {
      enabled: boolean;
      smtpSettings: {
        host: string;
        port: number;
        username: string;
        password: string;
        encryption: 'none' | 'ssl' | 'tls';
      };
      fromEmail: string;
      fromName: string;
    };
    sms: {
      enabled: boolean;
      provider: string;
      apiKey: string;
      fromNumber: string;
    };
    push: {
      enabled: boolean;
      webhookUrl: string;
    };
    preferences: {
      welcomeEmail: boolean;
      passwordResetEmail: boolean;
      accountLockoutEmail: boolean;
      securityAlerts: boolean;
      weeklyDigest: boolean;
      monthlyReport: boolean;
    };
  };
  integrations: {
    slack: {
      enabled: boolean;
      webhookUrl: string;
      channel: string;
    };
    teams: {
      enabled: boolean;
      webhookUrl: string;
    };
    webhook: {
      enabled: boolean;
      url: string;
      events: string[];
    };
    api: {
      enabled: boolean;
      rateLimit: number;
      allowedOrigins: string[];
      enableApiKeys: boolean;
    };
  };
  billing: {
    plan: string;
    billingCycle: 'monthly' | 'yearly';
    autoRenew: boolean;
    paymentMethod: {
      type: 'card' | 'bank' | 'paypal';
      last4: string;
      expiryMonth: number;
      expiryYear: number;
    };
    billingAddress: {
      name: string;
      company: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    invoices: {
      autoSend: boolean;
      includeTax: boolean;
      currency: string;
    };
  };
  limits: {
    users: {
      current: number;
      limit: number;
      allowOverage: boolean;
      overagePrice: number;
    };
    storage: {
      current: number;
      limit: number;
      allowOverage: boolean;
      overagePrice: number;
    };
    apiCalls: {
      current: number;
      limit: number;
      allowOverage: boolean;
      overagePrice: number;
    };
    customDomains: {
      current: number;
      limit: number;
    };
    integrations: {
      current: number;
      limit: number;
    };
  };
}

const TenantSettingsManager: React.FC<TenantSettingsManagerProps> = ({
  tenant,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      companyName: tenant.name || '',
      domain: tenant.domain || '',
      subdomain: tenant.subdomain || '',
      timezone: tenant.metadata?.timezone || 'America/New_York',
      language: tenant.metadata?.language || 'en',
      currency: tenant.metadata?.currency || 'USD',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
    },
    branding: {
      logo: null,
      favicon: null,
      primaryColor: tenant.settings?.branding?.primaryColor || '#3B82F6',
      secondaryColor: tenant.settings?.branding?.secondaryColor || '#1F2937',
      accentColor: '#10B981',
      companyTagline: '',
      customCss: '',
      enableCustomBranding: false,
    },
    security: {
      mfaRequired: tenant.settings?.security?.mfaRequired || false,
      sessionTimeout: tenant.settings?.security?.sessionTimeout || 240,
      passwordPolicy: {
        minLength: tenant.settings?.security?.passwordPolicy?.minLength || 8,
        requireUppercase: tenant.settings?.security?.passwordPolicy?.requireUppercase || true,
        requireLowercase: tenant.settings?.security?.passwordPolicy?.requireLowercase || true,
        requireNumbers: tenant.settings?.security?.passwordPolicy?.requireNumbers || true,
        requireSpecialChars: tenant.settings?.security?.passwordPolicy?.requireSpecialChars || false,
        preventCommonPasswords: tenant.settings?.security?.passwordPolicy?.preventCommonPasswords || true,
        maxAge: tenant.settings?.security?.passwordPolicy?.maxAge || 90,
        preventReuse: 5,
      },
      ipWhitelist: tenant.settings?.security?.ipWhitelist || [],
      allowedDomains: [],
      enableAuditLogs: tenant.settings?.features?.enableAuditLogs || false,
      enableLoginNotifications: true,
      enableSuspiciousActivityAlerts: true,
    },
    notifications: {
      email: {
        enabled: tenant.settings?.notifications?.email || true,
        smtpSettings: {
          host: '',
          port: 587,
          username: '',
          password: '',
          encryption: 'tls' as const,
        },
        fromEmail: tenant.settings?.branding?.supportEmail || '',
        fromName: tenant.name || '',
      },
      sms: {
        enabled: tenant.settings?.notifications?.sms || false,
        provider: 'twilio',
        apiKey: '',
        fromNumber: '',
      },
      push: {
        enabled: tenant.settings?.notifications?.push || true,
        webhookUrl: '',
      },
      preferences: {
        welcomeEmail: true,
        passwordResetEmail: true,
        accountLockoutEmail: true,
        securityAlerts: true,
        weeklyDigest: false,
        monthlyReport: true,
      },
    },
    integrations: {
      slack: {
        enabled: false,
        webhookUrl: '',
        channel: '#general',
      },
      teams: {
        enabled: false,
        webhookUrl: '',
      },
      webhook: {
        enabled: false,
        url: '',
        events: ['user.created', 'user.updated', 'user.deleted'],
      },
      api: {
        enabled: true,
        rateLimit: 1000,
        allowedOrigins: ['*'],
        enableApiKeys: true,
      },
    },
    billing: {
      plan: tenant.plan?.type || 'professional',
      billingCycle: 'monthly',
      autoRenew: true,
      paymentMethod: {
        type: 'card' as const,
        last4: '1234',
        expiryMonth: 12,
        expiryYear: 2025,
      },
      billingAddress: {
        name: '',
        company: tenant.name || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
      },
      invoices: {
        autoSend: true,
        includeTax: true,
        currency: 'USD',
      },
    },
    limits: {
      users: {
        current: tenant.limits?.current?.users || 0,
        limit: tenant.plan?.limits?.users || 100,
        allowOverage: false,
        overagePrice: 5,
      },
      storage: {
        current: tenant.limits?.usage?.storageUsed || 0,
        limit: tenant.plan?.limits?.storage || 100,
        allowOverage: false,
        overagePrice: 0.1,
      },
      apiCalls: {
        current: tenant.limits?.usage?.apiCallsUsed || 0,
        limit: tenant.plan?.limits?.apiCalls || 10000,
        allowOverage: false,
        overagePrice: 0.001,
      },
      customDomains: {
        current: tenant.limits?.current?.customDomains || 0,
        limit: tenant.plan?.limits?.customDomains || 2,
      },
      integrations: {
        current: tenant.limits?.current?.integrations || 0,
        limit: tenant.plan?.limits?.integrations || 10,
      },
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'limits', label: 'Usage & Limits', icon: BarChart3 },
  ];

  const handleSettingChange = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof SettingsData],
        [field]: value,
      },
    }));
    setHasChanges(true);
    
    // Clear error when user starts typing
    if (errors[`${category}.${field}`]) {
      setErrors(prev => ({ ...prev, [`${category}.${field}`]: '' }));
    }
  };

  const validateSettings = (): boolean => {
    const newErrors: Record<string, string> = {};

    // General validation
    if (!settings.general.companyName.trim()) {
      newErrors['general.companyName'] = 'Company name is required';
    }

    if (settings.general.domain && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(settings.general.domain)) {
      newErrors['general.domain'] = 'Please enter a valid domain';
    }

    // Security validation
    if (settings.security.sessionTimeout < 15 || settings.security.sessionTimeout > 1440) {
      newErrors['security.sessionTimeout'] = 'Session timeout must be between 15 and 1440 minutes';
    }

    if (settings.security.passwordPolicy.minLength < 6) {
      newErrors['security.passwordPolicy.minLength'] = 'Minimum password length must be at least 6 characters';
    }

    // Notifications validation
    if (settings.notifications.email.enabled && !settings.notifications.email.fromEmail) {
      newErrors['notifications.email.fromEmail'] = 'From email is required when email notifications are enabled';
    }

    if (settings.notifications.sms.enabled && !settings.notifications.sms.apiKey) {
      newErrors['notifications.sms.apiKey'] = 'API key is required when SMS notifications are enabled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedTenant: Partial<Tenant> = {
        name: settings.general.companyName,
        domain: settings.general.domain || undefined,
        subdomain: settings.general.subdomain || undefined,
        settings: {
          branding: {
            primaryColor: settings.branding.primaryColor,
            secondaryColor: settings.branding.secondaryColor,
            companyName: settings.general.companyName,
            // tagline: settings.branding.companyTagline, // Removed - not in Tenant type
            supportEmail: settings.notifications.email.fromEmail,
          },
          features: {
            enableAI: tenant.settings?.features?.enableAI || true,
            enableAnalytics: tenant.settings?.features?.enableAnalytics || true,
            enableIntegrations: tenant.settings?.features?.enableIntegrations || true,
            enableCustomDomain: tenant.settings?.features?.enableCustomDomain || false,
            enableSSO: tenant.settings?.features?.enableSSO || false,
            enableAuditLogs: settings.security.enableAuditLogs,
          },
          security: {
            passwordPolicy: settings.security.passwordPolicy,
            sessionTimeout: settings.security.sessionTimeout,
            mfaRequired: settings.security.mfaRequired,
            ipWhitelist: settings.security.ipWhitelist,
            // allowedDomains: settings.security.allowedDomains, // Removed - not in Tenant type
          },
          notifications: {
            email: settings.notifications.email.enabled,
            sms: settings.notifications.sms.enabled,
            push: settings.notifications.push.enabled,
          },
        },
        metadata: {
          industry: tenant.metadata?.industry || '',
          size: tenant.metadata?.size || 'medium',
          region: tenant.metadata?.region || 'North America',
          timezone: settings.general.timezone,
          language: settings.general.language,
          currency: settings.general.currency,
        },
      };

      const response = await apiClient.put(`/api/tenants/${tenant.id}`, updatedTenant);
      if (response.success && response.data) {
        toast.success('Settings saved successfully!');
        onUpdate(response.data as Tenant);
        setHasChanges(false);
      } else {
        toast.error(response.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              value={settings.general.companyName}
              onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors['general.companyName'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter company name"
            />
            {errors['general.companyName'] && (
              <p className="text-red-500 text-sm mt-1">{errors['general.companyName']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain
            </label>
            <input
              type="text"
              value={settings.general.domain}
              onChange={(e) => handleSettingChange('general', 'domain', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors['general.domain'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example.com"
            />
            {errors['general.domain'] && (
              <p className="text-red-500 text-sm mt-1">{errors['general.domain']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              value={settings.general.timezone}
              onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Asia/Shanghai">Shanghai</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={settings.general.language}
              onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Multi-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Require MFA for all users</p>
            </div>
            <input
              type="checkbox"
              checked={settings.security.mfaRequired}
              onChange={(e) => handleSettingChange('security', 'mfaRequired', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors['security.sessionTimeout'] ? 'border-red-500' : 'border-gray-300'
              }`}
              min="15"
              max="1440"
            />
            {errors['security.sessionTimeout'] && (
              <p className="text-red-500 text-sm mt-1">{errors['security.sessionTimeout']}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Password Policy</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Length
                </label>
                <input
                  type="number"
                  value={settings.security.passwordPolicy.minLength}
                  onChange={(e) => handleSettingChange('security', 'passwordPolicy', {
                    ...settings.security.passwordPolicy,
                    minLength: parseInt(e.target.value)
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors['security.passwordPolicy.minLength'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="6"
                  max="50"
                />
                {errors['security.passwordPolicy.minLength'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['security.passwordPolicy.minLength']}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordPolicy.requireUppercase}
                    onChange={(e) => handleSettingChange('security', 'passwordPolicy', {
                      ...settings.security.passwordPolicy,
                      requireUppercase: e.target.checked
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm text-gray-700">Require uppercase letters</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordPolicy.requireLowercase}
                    onChange={(e) => handleSettingChange('security', 'passwordPolicy', {
                      ...settings.security.passwordPolicy,
                      requireLowercase: e.target.checked
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm text-gray-700">Require lowercase letters</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordPolicy.requireNumbers}
                    onChange={(e) => handleSettingChange('security', 'passwordPolicy', {
                      ...settings.security.passwordPolicy,
                      requireNumbers: e.target.checked
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm text-gray-700">Require numbers</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'branding':
        return <div className="text-center py-8"><p className="text-gray-500">Branding settings coming soon...</p></div>;
      case 'notifications':
        return <div className="text-center py-8"><p className="text-gray-500">Notification settings coming soon...</p></div>;
      case 'integrations':
        return <div className="text-center py-8"><p className="text-gray-500">Integration settings coming soon...</p></div>;
      case 'billing':
        return <div className="text-center py-8"><p className="text-gray-500">Billing settings coming soon...</p></div>;
      case 'limits':
        return <div className="text-center py-8"><p className="text-gray-500">Usage & limits coming soon...</p></div>;
      default:
        return <div className="text-center py-8"><p className="text-gray-500">Select a tab to configure settings</p></div>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Settings className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tenant Settings</h2>
            {hasChanges && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Unsaved Changes
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 border-primary-300 border text-primary-900'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {renderTabContent()}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantSettingsManager; 