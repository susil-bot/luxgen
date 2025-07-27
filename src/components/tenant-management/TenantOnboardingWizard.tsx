import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  X,
  Settings, 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Palette, 
  Bell, 
  Database, 
  Network, 
  Cloud, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  RotateCcw, 
  Power, 
  PowerOff, 
  Play, 
  Pause, 
  Square as Stop, 
  SkipBack, 
  SkipForward, 
  Volume, 
  VolumeX, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Image, 
  File, 
  Folder, 
  Download, 
  Upload, 
  Share, 
  Copy, 
  Edit, 
  Trash2, 
  Archive, 
  ArchiveRestore, 
  Star, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Award, 
  Trophy, 
  Medal, 
  Badge, 
  Award as Certificate, 
  Crown, 
  Diamond, 
  Gem, 
  Sparkles, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Cpu, 
  HardDrive, 
  Cpu as Memory, 
  HardDrive as HardDrive2, 
    Database as Database2,
  Server as Server2,
  Network as Network2,
  Wifi as Wifi2, 
  Bluetooth, 
  BluetoothOff, 
  Signal, 
  SignalHigh, 
  SignalMedium, 
  SignalLow, 
  SignalZero, 
  Battery, 
  BatteryCharging, 
  BatteryFull, 
  BatteryMedium, 
  BatteryLow, 
  Battery as BatteryEmpty, 
  Plug, 
  Plug as Plug2, 
  Power as Power2, 
  PowerOff as PowerOff2, 
  Zap as Zap2, 
  Zap as Lightning, 
  Sun, 
  Moon, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  Wind, 
  Umbrella, 
  Droplets, 
  Thermometer, 
  ThermometerSun, 
  ThermometerSnowflake, 
  Gauge, 
  Timer, 
  TimerOff, 
  TimerReset, 
  Clock, 
  Calendar, 
  CalendarDays, 
  CalendarCheck, 
  CalendarX, 
  CalendarPlus, 
  CalendarMinus, 
  CalendarRange, 
  Calendar as CalendarEvent, 
  CalendarClock, 
  CalendarHeart, 
  CalendarSearch as CalendarStar, 
  CalendarPlus as CalendarUser, 
  Calendar as CalendarWeek, 
  Calendar as CalendarMonth, 
  CalendarHeart as CalendarYear, 
  CalendarRange as CalendarRange2, 
  Calendar as CalendarEvent2, 
  CalendarClock as CalendarClock2, 
  CalendarHeart as CalendarHeart2, 
  CalendarSearch as CalendarStar2, 
  CalendarPlus as CalendarUser2, 
  Calendar as CalendarWeek2, 
  Calendar as CalendarMonth2, 
  CalendarHeart as CalendarYear2, 
  CalendarRange as CalendarRange3, 
  Calendar as CalendarEvent3, 
  CalendarClock as CalendarClock3, 
  CalendarHeart as CalendarHeart3, 
  CalendarSearch as CalendarStar3, 
  CalendarPlus as CalendarUser3, 
  Calendar as CalendarWeek3, 
  Calendar as CalendarMonth3, 
  CalendarHeart as CalendarYear3, 
  CalendarRange as CalendarRange4, 
  Calendar as CalendarEvent4, 
  CalendarClock as CalendarClock4, 
  CalendarHeart as CalendarHeart4, 
  CalendarSearch as CalendarStar4, 
  CalendarPlus as CalendarUser4, 
  Calendar as CalendarWeek4, 
  Calendar as CalendarMonth4, 
  CalendarHeart as CalendarYear4, 
  CalendarRange as CalendarRange5, 
  Calendar as CalendarEvent5, 
  CalendarClock as CalendarClock5, 
  CalendarHeart as CalendarHeart5, 
  CalendarSearch as CalendarStar5, 
  CalendarPlus as CalendarUser5, 
  Calendar as CalendarWeek5, 
  Calendar as CalendarMonth5, 
  CalendarHeart as CalendarYear5, 
  CalendarRange as CalendarRange6, 
  Calendar as CalendarEvent6, 
  CalendarClock as CalendarClock6, 
  CalendarHeart as CalendarHeart6, 
  CalendarSearch as CalendarStar6, 
  CalendarPlus as CalendarUser6, 
  Calendar as CalendarWeek6, 
  Calendar as CalendarMonth6, 
  CalendarHeart as CalendarYear6, 
  CalendarRange as CalendarRange7, 
  Calendar as CalendarEvent7, 
  CalendarClock as CalendarClock7, 
  CalendarHeart as CalendarHeart7, 
  CalendarSearch as CalendarStar7, 
  CalendarPlus as CalendarUser7, 
  Calendar as CalendarWeek7, 
  Calendar as CalendarMonth7, 
  CalendarHeart as CalendarYear7, 
  CalendarRange as CalendarRange8, 
  Calendar as CalendarEvent8, 
  CalendarClock as CalendarClock8, 
  CalendarHeart as CalendarHeart8, 
  CalendarSearch as CalendarStar8, 
  CalendarPlus as CalendarUser8, 
  Calendar as CalendarWeek8, 
  Calendar as CalendarMonth8, 
  CalendarHeart as CalendarYear8, 
  CalendarRange as CalendarRange9, 
  Calendar as CalendarEvent9, 
  CalendarClock as CalendarClock9, 
  CalendarHeart as CalendarHeart9, 
  CalendarSearch as CalendarStar9, 
  CalendarPlus as CalendarUser9, 
  Calendar as CalendarWeek9, 
  Calendar as CalendarMonth9, 
  CalendarHeart as CalendarYear9, 
  CalendarRange as CalendarRange10, 
  Calendar as CalendarEvent10, 
  CalendarClock as CalendarClock10, 
  CalendarHeart as CalendarHeart10, 
  CalendarSearch as CalendarStar10, 
  CalendarPlus as CalendarUser10, 
  Calendar as CalendarWeek10, 
  Calendar as CalendarMonth10, 
  CalendarHeart as CalendarYear10
} from 'lucide-react';
import { Tenant } from '../../types/multiTenancy';
import { toast } from 'react-hot-toast';

interface TenantOnboardingWizardProps {
  tenant: Tenant;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (tenant: Tenant) => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  required: boolean;
}

const TenantOnboardingWizard: React.FC<TenantOnboardingWizardProps> = ({
  tenant,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to Your Tenant',
      description: 'Get started with your new tenant setup',
      icon: Rocket,
      completed: false,
      required: true,
    },
    {
      id: 'admin-setup',
      title: 'Admin Account Setup',
      description: 'Create your administrator account',
      icon: Users,
      completed: false,
      required: true,
    },
    {
      id: 'security',
      title: 'Security Configuration',
      description: 'Configure security settings and policies',
      icon: Shield,
      completed: false,
      required: true,
    },
    {
      id: 'branding',
      title: 'Branding & Customization',
      description: 'Customize your tenant appearance',
      icon: Palette,
      completed: false,
      required: false,
    },
    {
      id: 'integrations',
      title: 'Integrations Setup',
      description: 'Connect your favorite tools and services',
      icon: Zap,
      completed: false,
      required: false,
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      description: 'Configure how you want to receive updates',
      icon: Bell,
      completed: false,
      required: false,
    },
    {
      id: 'data-import',
      title: 'Data Import',
      description: 'Import your existing data and users',
      icon: Database,
      completed: false,
      required: false,
    },
    {
      id: 'completion',
      title: 'Setup Complete',
      description: 'Your tenant is ready to use',
      icon: CheckCircle,
      completed: false,
      required: true,
    },
  ]);

  const [formData, setFormData] = useState({
    adminUser: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    security: {
      mfaEnabled: true,
      sessionTimeout: 240,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
      },
    },
    branding: {
      logo: null as File | null,
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      companyName: tenant.name,
      tagline: '',
    },
    integrations: {
      slack: false,
      teams: false,
      email: false,
      webhook: false,
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      weekly: true,
      monthly: true,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (stepIndex: number): boolean => {
    const step = steps[stepIndex];
    const newErrors: Record<string, string> = {};

    switch (step.id) {
      case 'admin-setup':
        if (!formData.adminUser.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.adminUser.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        if (!formData.adminUser.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminUser.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.adminUser.password) {
          newErrors.password = 'Password is required';
        } else if (formData.adminUser.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.adminUser.password !== formData.adminUser.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Mark current step as completed
      const updatedSteps = [...steps];
      updatedSteps[currentStep].completed = true;
      setSteps(updatedSteps);

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    const updatedSteps = [...steps];
    updatedSteps[currentStep].completed = true;
    setSteps(updatedSteps);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      // Here you would typically save the onboarding data
      toast.success('Onboarding completed successfully!');
      onComplete(tenant);
      onClose();
    } catch (error) {
      toast.error('Failed to complete onboarding');
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <Rocket className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to {tenant.name}!
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Let's get your tenant set up and ready to use. This wizard will guide you through the essential configuration steps.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
              <h3 className="font-medium text-blue-900 mb-2">What you'll configure:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Administrator account</li>
                <li>• Security settings</li>
                <li>• Branding and customization</li>
                <li>• Integrations and notifications</li>
              </ul>
            </div>
          </div>
        );

      case 'admin-setup':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Account Setup</h2>
              <p className="text-gray-600">Create your administrator account to manage your tenant.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.adminUser.firstName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adminUser: { ...prev.adminUser, firstName: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.adminUser.lastName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adminUser: { ...prev.adminUser, lastName: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.adminUser.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adminUser: { ...prev.adminUser, email: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.adminUser.password}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adminUser: { ...prev.adminUser, password: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={formData.adminUser.confirmPassword}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adminUser: { ...prev.adminUser, confirmPassword: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Security Configuration</h2>
              <p className="text-gray-600">Configure security settings to protect your tenant.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Multi-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Require MFA for all users</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.security.mfaEnabled}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    security: { ...prev.security, mfaEnabled: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={formData.security.sessionTimeout}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="15"
                  max="1440"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.security.passwordPolicy.requireUppercase}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          passwordPolicy: {
                            ...prev.security.passwordPolicy,
                            requireUppercase: e.target.checked
                          }
                        }
                      }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-700">Require uppercase letters</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.security.passwordPolicy.requireLowercase}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          passwordPolicy: {
                            ...prev.security.passwordPolicy,
                            requireLowercase: e.target.checked
                          }
                        }
                      }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-700">Require lowercase letters</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.security.passwordPolicy.requireNumbers}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          passwordPolicy: {
                            ...prev.security.passwordPolicy,
                            requireNumbers: e.target.checked
                          }
                        }
                      }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-700">Require numbers</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.security.passwordPolicy.requireSpecialChars}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          passwordPolicy: {
                            ...prev.security.passwordPolicy,
                            requireSpecialChars: e.target.checked
                          }
                        }
                      }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-700">Require special characters</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'completion':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Setup Complete!
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your tenant has been successfully configured and is ready to use. You can now start managing your organization.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 max-w-md mx-auto">
              <h3 className="font-medium text-green-900 mb-2">What's next:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Invite team members</li>
                <li>• Configure integrations</li>
                <li>• Import your data</li>
                <li>• Explore features</li>
              </ul>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Step content coming soon...</p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Tenant Onboarding</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentStep === index
                      ? 'bg-primary-100 border-primary-300 border'
                      : step.completed
                      ? 'bg-green-50 border-green-200 border'
                      : 'bg-white border-gray-200 border hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      currentStep === index
                        ? 'bg-primary-600 text-white'
                        : step.completed
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        currentStep === index ? 'text-primary-900' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {renderStepContent()}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex space-x-3">
                  {!steps[currentStep].required && (
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Skip
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                  >
                    {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantOnboardingWizard; 