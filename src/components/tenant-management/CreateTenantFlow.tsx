import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Globe, 
  Users, 
  Database, 
  Shield, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Mail,
  Phone,
  Building,
  Settings,
  Palette,
  Bell,
  Lock,
  Zap,
  TrendingUp,
  CreditCard,
  FileText,
  Download,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Star,
  Clock,
  Calendar,
  MapPin,
  Globe2,
  Server,
  Network,
  Cloud,
  Key,
  Wifi,
  Monitor,
  HardDrive,
  Cpu,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Rocket,
  Award,
  Gift,
  Heart,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Crown,
  Diamond,
  Gem,
  Trophy,
  Medal,
  Badge,
  Award as Certificate,
  Flag,
  Home,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Minus,
  Edit,
  Copy,
  Trash2,
  Archive,
  ArchiveRestore,
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
  MoreHorizontal,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Square as Stop,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  CameraOff,
  Image,
  File,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  FilePlus,
  FileMinus,
  FileX,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  Presentation as FilePresentation,
  FileText as FilePdf,
  FileText as FileWord,
  FileText as FileExcel,
  FileText as FilePowerpoint,
  FileText as FileZip,
  FileText as FileCsv,
  FileJson,
  FileX as FileXml,
  FileText as FileYaml,
  FileText as FileMarkdown,
  FileText as FileHtml,
  FileText as FileCss,
  FileText as FileJs,
  FileText as FileTs,
  FileText as FileReact,
  FileText as FileVue,
  FileText as FileAngular,
  FileCode as FileNode,
  FileText as FilePython,
  FileText as FileJava,
  FileText as FileCpp,
  FileText as FileC,
  FileText as FilePhp,
  FileText as FileRuby,
  FileText as FileGo,
  FileText as FileRust,
  FileText as FileSwift,
  FileText as FileKotlin,
  FileText as FileScala,
  FileText as FileR,
  FileText as FileMatlab,
  FileText as FileJulia,
  FileText as FileDocker,
  FileText as FileKubernetes,
  FileText as FileTerraform,
  FileText as FileAnsible,
  FileText as FileJenkins,
  FileText as FileGit,
  FileText as FileGithub,
  FileText as FileGitlab,
  FileText as FileBitbucket,
  FileText as FileSlack,
  FileText as FileDiscord,
  FileText as FileTeams,
  FileText as FileZoom,
  FileText as FileMeet,
  FileText as FileSkype,
  FileText as FileWhatsapp,
  FileText as FileTelegram,
  FileText as FileSignal,
  FileText as FileWechat,
  FileText as FileLine,
  FileText as FileViber,
  FileText as FileSnapchat,
  FileText as FileInstagram,
  FileText as FileFacebook,
  FileText as FileTwitter,
  FileText as FileLinkedin,
  FileText as FileYoutube,
  FileText as FileTwitch,
  FileText as FileTiktok,
  FileText as FilePinterest,
  FileText as FileReddit,
  FileText as FileQuora,
  FileText as FileStackoverflow,
  FileText as FileMedium,
  FileText as FileDev,
  FileText as FileHashnode,
  FileText as FileSubstack,
  FileText as FileNewsletter,
  FileText as FileBlog,
  FileText as FilePortfolio,
  FileText as FileResume,
  FileText as FileCv,
  FileText as FileInvoice,
  FileText as FileReceipt,
  FileText as FileContract,
  FileText as FileAgreement,
  FileText as FilePolicy,
  FileText as FileTerms,
  FileText as FilePrivacy,
  FileText as FileCookie,
  FileText as FileGdpr,
  FileText as FileCcp,
  FileText as FileSox,
  FileText as FileHipaa,
  FileText as FilePci,
  FileText as FileIso,
  FileText as FileCert,
  FileText as FileLicense,
  FileText as FilePatent,
  FileText as FileTrademark,
  FileText as FileCopyright,
  FileText as FileNda,
  FileText as FileMsa,
  FileText as FileSla,
  FileText as FileSow,
  FileText as FileRfp,
  FileText as FileRfq,
  FileText as FileProposal,
  FileText as FileQuote,
  FileText as FileEstimate,
  FileText as FileBudget,
  FileText as FileFinancial,
  FileText as FileAccounting,
  FileText as FileTax,
  FileText as FileAudit,
  FileText as FileCompliance,
  FileText as FileSecurity,
  FileText as FileBackup,
  FileText as FileRecovery,
  FileText as FileMigration,
  FileText as FileDeployment,
  FileText as FileRelease,
  FileText as FileVersion,
  FileText as FileChangelog,
  FileText as FileReadme,
  FileText as FileLicense2,
  FileText as FileContributing,
  FileText as FileCodeOfConduct,
  FileText as FileSecurity2,
  FileText as FileSupport,
  FileText as FileDocumentation,
  FileText as FileApi,
  FileText as FileSdk,
  FileText as FilePlugin,
  FileText as FileExtension,
  FileText as FileTheme,
  FileText as FileTemplate,
  FileText as FileComponent,
  FileText as FileModule,
  FileText as FilePackage,
  FileText as FileLibrary,
  FileText as FileFramework,
  FileText as FileToolkit,
  FileText as FileUtility,
  FileText as FileService,
  FileText as FileApi2,
  FileText as FileEndpoint,
  FileText as FileRoute,
  FileText as FileController,
  FileText as FileModel,
  FileText as FileView,
  FileText as FileLayout,
  FileText as FileStyle,
  FileText as FileScript,
  FileText as FileConfig,
  FileText as FileEnv,
  FileText as FileDockerfile,
  FileText as FileCompose,
  FileText as FileK8s,
  FileText as FileHelm,
  FileText as FileChart,
  FileText as FileValues,
  FileText as FileSecret,
  FileText as FileConfigmap,
  FileText as FileIngress,
  FileText as FileService2,
  FileText as FileDeployment2,
  FileText as FilePod,
  FileText as FileNode2,
  FileText as FileNamespace,
  FileText as FileCluster,
  FileText as FileContext,
  FileText as FileKubeconfig,
  FileText as FileManifest,
  FileText as FileYaml2,
  FileText as FileJson2,
  FileText as FileToml,
  FileText as FileIni,
  FileText as FileProperties,
  FileText as FileXml2,
  FileText as FileHtml2,
  FileText as FileCss2,
  FileText as FileScss,
  FileText as FileSass,
  FileText as FileLess,
  FileText as FileStylus,
  FileText as FilePostcss,
  FileText as FileTailwind,
  FileText as FileBootstrap,
  FileText as FileMaterial,
  FileText as FileAntd,
  FileText as FileChakra,
  FileText as FileMui,
  FileText as FileSemantic,
  FileText as FileBulma,
  FileText as FileFoundation,
  FileText as FilePure,
  FileText as FileSkeleton,
  FileText as FileMilligram,
  FileText as FileSpectre,
  FileText as FileW3,
  FileText as FileNormalize,
  FileText as FileReset,
  FileText as FileBase,
  FileText as FileSanitize,
  FileText as FileModern,
  FileText as FileNecolas,
  FileText as FileYui,
  FileText as FileBlueprint,
  FileText as FileEvergreen,
  FileText as FileGrommet,
  FileText as FileRebass,
  FileText as FileThemeUi,
  FileText as FileStyled,
  FileText as FileEmotion,
  FileText as FileStyledComponents,
  FileText as FileRadium,
  FileText as FileAphrodite,
  FileText as FileGlamor,
  FileText as FileFela,
  FileText as FileStyletron,
  FileText as FileLinaria,
  FileText as FileAstroturf,
  FileText as FileCssModules,
  FileText as FileSassModules,
  FileText as FileLessModules,
  FileText as FileStylusModules,
  FileText as FilePostcssModules,
  FileText as FileTailwindModules,
  FileText as FileBootstrapModules,
  FileText as FileMaterialModules,
  FileText as FileAntdModules,
  FileText as FileChakraModules,
  FileText as FileMuiModules,
  FileText as FileSemanticModules,
  FileText as FileBulmaModules,
  FileText as FileFoundationModules,
  FileText as FilePureModules,
  FileText as FileSkeletonModules,
  FileText as FileMilligramModules,
  FileText as FileSpectreModules,
  FileText as FileW3Modules,
  FileText as FileNormalizeModules,
  FileText as FileResetModules,
  FileText as FileBaseModules,
  FileText as FileSanitizeModules,
  FileText as FileModernModules,
  FileText as FileNecolasModules,
  FileText as FileYuiModules,
  FileText as FileBlueprintModules,
  FileText as FileEvergreenModules,
  FileText as FileGrommetModules,
  FileText as FileRebassModules,
  FileText as FileThemeUiModules,
  FileText as FileStyledModules,
  FileText as FileEmotionModules,
  FileText as FileStyledComponentsModules,
  FileText as FileRadiumModules,
  FileText as FileAphroditeModules,
  FileText as FileGlamorModules,
  FileText as FileFelaModules,
  FileText as FileStyletronModules,
  FileText as FileLinariaModules,
  FileText as FileAstroturfModules,
  FileText as FileCssModules2,
  FileText as FileSassModules2,
  FileText as FileLessModules2,
  FileText as FileStylusModules2,
  FileText as FilePostcssModules2,
  FileText as FileTailwindModules2,
  FileText as FileBootstrapModules2,
  FileText as FileMaterialModules2,
  FileText as FileAntdModules2,
  FileText as FileChakraModules2,
  FileText as FileMuiModules2,
  FileText as FileSemanticModules2,
  FileText as FileBulmaModules2,
  FileText as FileFoundationModules2,
  FileText as FilePureModules2,
  FileText as FileSkeletonModules2,
  FileText as FileMilligramModules2,
  FileText as FileSpectreModules2,
  FileText as FileW3Modules2,
  FileText as FileNormalizeModules2,
  FileText as FileResetModules2,
  FileText as FileBaseModules2,
  FileText as FileSanitizeModules2,
  FileText as FileModernModules2,
  FileText as FileNecolasModules2,
  FileText as FileYuiModules2,
  FileText as FileBlueprintModules2,
  FileText as FileEvergreenModules2,
  FileText as FileGrommetModules2,
  FileText as FileRebassModules2,
  FileText as FileThemeUiModules2,
  FileText as FileStyledModules2,
  FileText as FileEmotionModules2,
  FileText as FileStyledComponentsModules2,
  FileText as FileRadiumModules2,
  FileText as FileAphroditeModules2,
  FileText as FileGlamorModules2,
  FileText as FileFelaModules2,
  FileText as FileStyletronModules2,
  FileText as FileLinariaModules2,
  FileText as FileAstroturfModules2
} from 'lucide-react';
import { Tenant, TenantPlan } from '../../types/multiTenancy';
import apiClient from '../../services/apiClient';
import { toast } from 'react-hot-toast';

interface CreateTenantFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tenant: Tenant) => void;
}

interface StepData {
  basicInfo: {
    name: string;
    slug: string;
    domain: string;
    subdomain: string;
    industry: string;
    size: string;
    region: string;
    timezone: string;
    language: string;
    currency: string;
  };
  planSelection: {
    planType: string;
    billingCycle: 'monthly' | 'yearly';
    customFeatures: string[];
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: File | null;
    favicon: File | null;
    companyName: string;
    tagline: string;
    website: string;
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
    };
    ipWhitelist: string[];
    allowedDomains: string[];
  };
  features: {
    enableAI: boolean;
    enableAnalytics: boolean;
    enableIntegrations: boolean;
    enableCustomDomain: boolean;
    enableSSO: boolean;
    enableAuditLogs: boolean;
    enableBackup: boolean;
    enableMonitoring: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    webhook: boolean;
    supportEmail: string;
    adminEmail: string;
    emergencyContact: string;
  };
  setup: {
    autoProvision: boolean;
    welcomeEmail: boolean;
    onboardingFlow: boolean;
    defaultRoles: string[];
    initialUsers: Array<{
      email: string;
      role: string;
      firstName: string;
      lastName: string;
    }>;
  };
}

const CreateTenantFlow: React.FC<CreateTenantFlowProps> = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(7);
  const [formData, setFormData] = useState<StepData>({
    basicInfo: {
      name: '',
      slug: '',
      domain: '',
      subdomain: '',
      industry: '',
      size: 'medium',
      region: 'North America',
      timezone: 'America/New_York',
      language: 'en',
      currency: 'USD',
    },
    planSelection: {
      planType: 'professional',
      billingCycle: 'monthly',
      customFeatures: [],
    },
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      logo: null,
      favicon: null,
      companyName: '',
      tagline: '',
      website: '',
    },
    security: {
      mfaRequired: false,
      sessionTimeout: 240,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        preventCommonPasswords: true,
        maxAge: 90,
      },
      ipWhitelist: [],
      allowedDomains: [],
    },
    features: {
      enableAI: true,
      enableAnalytics: true,
      enableIntegrations: true,
      enableCustomDomain: false,
      enableSSO: false,
      enableAuditLogs: false,
      enableBackup: true,
      enableMonitoring: true,
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      webhook: false,
      supportEmail: '',
      adminEmail: '',
      emergencyContact: '',
    },
    setup: {
      autoProvision: true,
      welcomeEmail: true,
      onboardingFlow: true,
      defaultRoles: ['admin', 'user'],
      initialUsers: [],
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const planOptions: Record<string, TenantPlan> = {
    free: {
      id: 'free',
      name: 'Free',
      type: 'free',
      features: ['basic'],
      limits: { users: 5, storage: 10, apiCalls: 1000, customDomains: 0, integrations: 2 },
      pricing: { monthly: 0, yearly: 0, currency: 'USD' },
    },
    basic: {
      id: 'basic',
      name: 'Basic',
      type: 'basic',
      features: ['basic', 'analytics'],
      limits: { users: 25, storage: 50, apiCalls: 5000, customDomains: 1, integrations: 5 },
      pricing: { monthly: 29, yearly: 290, currency: 'USD' },
    },
    professional: {
      id: 'professional',
      name: 'Professional',
      type: 'professional',
      features: ['ai', 'analytics', 'integrations'],
      limits: { users: 100, storage: 100, apiCalls: 10000, customDomains: 2, integrations: 10 },
      pricing: { monthly: 99, yearly: 999, currency: 'USD' },
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      type: 'enterprise',
      features: ['ai', 'analytics', 'integrations', 'custom_domain', 'sso', 'audit_logs'],
      limits: { users: 1000, storage: 1000, apiCalls: 100000, customDomains: 10, integrations: 50 },
      pricing: { monthly: 999, yearly: 9999, currency: 'USD' },
    },
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Info
        if (!formData.basicInfo.name.trim()) newErrors.name = 'Tenant name is required';
        if (!formData.basicInfo.slug.trim()) newErrors.slug = 'Slug is required';
        else if (!/^[a-z0-9-]+$/.test(formData.basicInfo.slug)) {
          newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
        }
        if (formData.basicInfo.domain && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.basicInfo.domain)) {
          newErrors.domain = 'Please enter a valid domain';
        }
        break;

      case 6: // Notifications
        if (!formData.notifications.supportEmail.trim()) newErrors.supportEmail = 'Support email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.notifications.supportEmail)) {
          newErrors.supportEmail = 'Please enter a valid email address';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const selectedPlan = planOptions[formData.planSelection.planType];
      
      const payload = {
        name: formData.basicInfo.name,
        slug: formData.basicInfo.slug,
        domain: formData.basicInfo.domain || undefined,
        subdomain: formData.basicInfo.subdomain || undefined,
        status: 'active' as const,
        plan: selectedPlan,
        settings: {
          branding: {
            primaryColor: formData.branding.primaryColor,
            secondaryColor: formData.branding.secondaryColor,
            companyName: formData.branding.companyName || formData.basicInfo.name,
            tagline: formData.branding.tagline,
            website: formData.branding.website,
            supportEmail: formData.notifications.supportEmail,
          },
          features: formData.features,
          security: {
            passwordPolicy: formData.security.passwordPolicy,
            sessionTimeout: formData.security.sessionTimeout,
            mfaRequired: formData.security.mfaRequired,
            ipWhitelist: formData.security.ipWhitelist,
            allowedDomains: formData.security.allowedDomains,
          },
          notifications: formData.notifications,
        },
        limits: {
          current: { users: 0, storage: 0, apiCalls: 0, customDomains: 0, integrations: 0 },
          usage: { storageUsed: 0, apiCallsUsed: 0, lastReset: new Date() },
        },
        metadata: {
          industry: formData.basicInfo.industry,
          size: formData.basicInfo.size,
          region: formData.basicInfo.region,
          timezone: formData.basicInfo.timezone,
          language: formData.basicInfo.language,
          currency: formData.basicInfo.currency,
        },
        setup: formData.setup,
      };

      const response = await apiClient.post('/api/tenants/create', payload);
      if (response.success && response.data) {
        toast.success('Tenant created successfully!');
        onSuccess(response.data as Tenant);
        handleClose();
      } else {
        toast.error(response.message || 'Failed to create tenant');
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast.error('An error occurred while creating the tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      basicInfo: { name: '', slug: '', domain: '', subdomain: '', industry: '', size: 'medium', region: 'North America', timezone: 'America/New_York', language: 'en', currency: 'USD' },
      planSelection: { planType: 'professional', billingCycle: 'monthly', customFeatures: [] },
      branding: { primaryColor: '#3B82F6', secondaryColor: '#1F2937', logo: null, favicon: null, companyName: '', tagline: '', website: '' },
      security: { mfaRequired: false, sessionTimeout: 240, passwordPolicy: { minLength: 8, requireUppercase: true, requireLowercase: true, requireNumbers: true, requireSpecialChars: false, preventCommonPasswords: true, maxAge: 90 }, ipWhitelist: [], allowedDomains: [] },
      features: { enableAI: true, enableAnalytics: true, enableIntegrations: true, enableCustomDomain: false, enableSSO: false, enableAuditLogs: false, enableBackup: true, enableMonitoring: true },
      notifications: { email: true, sms: false, push: true, webhook: false, supportEmail: '', adminEmail: '', emergencyContact: '' },
      setup: { autoProvision: true, welcomeEmail: true, onboardingFlow: true, defaultRoles: ['admin', 'user'], initialUsers: [] },
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Create New Tenant</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Step {currentStep} of {totalSteps}</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSupport(!showSupport)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Get Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              {[
                { step: 1, title: 'Basic Information', icon: Building, description: 'Company details and domain setup' },
                { step: 2, title: 'Plan Selection', icon: CreditCard, description: 'Choose your subscription plan' },
                { step: 3, title: 'Branding', icon: Palette, description: 'Customize your appearance' },
                { step: 4, title: 'Security', icon: Shield, description: 'Configure security settings' },
                { step: 5, title: 'Features', icon: Zap, description: 'Enable desired features' },
                { step: 6, title: 'Notifications', icon: Bell, description: 'Set up communication preferences' },
                { step: 7, title: 'Setup', icon: Rocket, description: 'Final configuration and launch' },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentStep === item.step
                      ? 'bg-primary-100 border-primary-300 border'
                      : currentStep > item.step
                      ? 'bg-green-50 border-green-200 border'
                      : 'bg-white border-gray-200 border hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentStep(item.step)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      currentStep === item.step
                        ? 'bg-primary-600 text-white'
                        : currentStep > item.step
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > item.step ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <item.icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        currentStep === item.step ? 'text-primary-900' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Support Panel */}
            {showSupport && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h4>
                <div className="space-y-2 text-xs text-blue-700">
                  <p>• Contact our support team</p>
                  <p>• View documentation</p>
                  <p>• Schedule a demo</p>
                  <button className="w-full mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                    Get Support
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Step Content */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Information</h3>
                    <p className="text-sm text-gray-600">Provide your company details and domain configuration.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tenant Name *
                      </label>
                      <input
                        type="text"
                        value={formData.basicInfo.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, name: e.target.value }
                        }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your company name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug *
                      </label>
                      <input
                        type="text"
                        value={formData.basicInfo.slug}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, slug: e.target.value.toLowerCase() }
                        }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.slug ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your-company-slug"
                      />
                      {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Domain
                      </label>
                      <input
                        type="text"
                        value={formData.basicInfo.domain}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, domain: e.target.value }
                        }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.domain ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="example.com"
                      />
                      {errors.domain && <p className="text-red-500 text-sm mt-1">{errors.domain}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        value={formData.basicInfo.industry}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, industry: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Technology, Healthcare, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Size
                      </label>
                      <select
                        value={formData.basicInfo.size}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, size: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="startup">Startup (1-10)</option>
                        <option value="small">Small (11-50)</option>
                        <option value="medium">Medium (51-200)</option>
                        <option value="large">Large (201-1000)</option>
                        <option value="enterprise">Enterprise (1000+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Region
                      </label>
                      <select
                        value={formData.basicInfo.region}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, region: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="North America">North America</option>
                        <option value="Europe">Europe</option>
                        <option value="Asia Pacific">Asia Pacific</option>
                        <option value="Latin America">Latin America</option>
                        <option value="Middle East">Middle East</option>
                        <option value="Africa">Africa</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  {currentStep === totalSteps ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting ? 'Creating...' : 'Create Tenant'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTenantFlow; 