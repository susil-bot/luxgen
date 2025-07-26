import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  ChevronDown, ChevronRight, Settings, User, Bell, 
  Link as LinkIcon, CreditCard, FileText, MessageSquare,
  Home, ShoppingCart, Users, DollarSign, Briefcase, 
  CheckSquare, Mail, Calendar, BarChart3, Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  children?: SettingsMenuItem[];
}

const settingsMenuItems: SettingsMenuItem[] = [
  {
    id: 'my-account',
    label: 'My Account',
    icon: User,
    path: '/app/settings/account',
  },
  {
    id: 'notifications',
    label: 'My Notifications',
    icon: Bell,
    path: '/app/settings/notifications',
  },
  {
    id: 'connected-apps',
    label: 'Connected Apps',
    icon: LinkIcon,
    path: '/app/settings/connected-apps',
  },
  {
    id: 'plans',
    label: 'Plans',
    icon: CreditCard,
    path: '/app/settings/plans',
  },
  {
    id: 'billing',
    label: 'Billing & Invoices',
    icon: FileText,
    path: '/app/settings/billing',
  },
  {
    id: 'feedback',
    label: 'Give Feedback',
    icon: MessageSquare,
    path: '/app/settings/feedback',
  },
];

const mainMenuItems: SettingsMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/app/dashboard',
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    icon: ShoppingCart,
    path: '/app/ecommerce',
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    path: '/app/community',
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    path: '/app/finance',
  },
  {
    id: 'job-board',
    label: 'Job Board',
    icon: Briefcase,
    path: '/app/job-board',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    path: '/app/tasks',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: Mail,
    path: '/app/messages',
    children: [
      { id: 'inbox', label: 'Inbox', icon: Mail, path: '/app/messages/inbox' },
      { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/app/messages/calendar' },
      { id: 'campaigns', label: 'Campaigns', icon: BarChart3, path: '/app/messages/campaigns' },
    ],
  },
];

const SettingsLayout: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['settings']);
  const location = useLocation();
  const { user } = useAuth();

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderMenuItem = (item: SettingsMenuItem, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.id);
    const isActiveItem = isActive(item.path);

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleSection(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActiveItem
                ? 'bg-purple-100 text-purple-900'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            } ${level > 0 ? 'ml-6' : ''}`}
          >
            <div className="flex items-center">
              <Icon className="mr-3 h-5 w-5" />
              <span>{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive: linkActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                linkActive || isActiveItem
                  ? 'bg-purple-100 text-purple-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              } ${level > 0 ? 'ml-6' : ''}`
            }
          >
            <Icon className="mr-3 h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="ml-3 flex items-center">
              <Star className="h-4 w-4 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* PAGES Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              PAGES
            </h3>
            <nav className="space-y-1">
              {mainMenuItems.map(item => renderMenuItem(item))}
            </nav>
          </div>

          {/* SETTINGS Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              SETTINGS
            </h3>
            <nav className="space-y-1">
              {settingsMenuItems.map(item => renderMenuItem(item))}
            </nav>
          </div>

          {/* UTILITY Section */}
          <div>
            <button
              onClick={() => toggleSection('utility')}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
            >
              <span>UTILITY</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
              </div>
              <span className="text-sm text-gray-600">Use the sidebar to navigate</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Buy Now - $69
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>
          </div>
          
          {/* Secondary Header */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <span className="sr-only">Search</span>
                🔍
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <span className="sr-only">Notifications</span>
                🔔
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <span className="sr-only">Info</span>
                ℹ️
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <span className="sr-only">Theme</span>
                ☀️
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <span className="sr-only">Play</span>
                ▶️
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">LuxGen Inc.</span>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                ▼
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout; 