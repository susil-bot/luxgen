import React from 'react';
import { 
  User, Eye, TrendingUp, Building2, 
  Bookmark, Users, Newspaper, Briefcase,
  Plus, ExternalLink, ChevronRight
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  company?: string;
  title?: string;
  location?: string;
}

interface FeedSidebarProps {
  user: User | null;
}

const FeedSidebar: React.FC<FeedSidebarProps> = ({ user }) => {
  const profileViews = 46;
  const postImpressions = 94;

  const myPages = [
    { name: 'Wrights.ai', activity: 0 },
    { name: 'LuxGen', activity: 0 }
  ];

  const sidebarItems = [
    { icon: Bookmark, label: 'Saved items', href: '/app/saved' },
    { icon: Users, label: 'Groups', href: '/app/groups' },
    { icon: Newspaper, label: 'Newsletters', href: '/app/newsletters' }
  ];

  const mainAppItems = [
    { icon: Building2, label: 'Dashboard', href: '/app/dashboard' },
    { icon: Briefcase, label: 'Jobs', href: '/app/jobs' },
    { icon: Users, label: 'ATS', href: '/app/ats' },
    { icon: Bookmark, label: 'Training', href: '/app/my-training' }
  ];

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-0 left-4 transform translate-y-1/2">
            <div className="w-16 h-16 bg-white rounded-full border-4 border-white flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-8 px-4 pb-4">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h3>
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{user?.title}</p>
          <p className="text-sm text-gray-500">{user?.location}</p>
          <p className="text-sm text-gray-500 flex items-center mt-2">
            <Building2 className="w-4 h-4 mr-1" />
            {user?.company}
          </p>
        </div>

        {/* Profile Analytics */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Profile viewers</span>
            <span className="text-sm font-semibold text-blue-600">{profileViews}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Post impressions</span>
            <span className="text-sm font-semibold text-blue-600">{postImpressions}</span>
          </div>
        </div>
      </div>

      {/* My Pages Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">My Pages (2)</h4>
        </div>
        <div className="space-y-3">
          {myPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{page.name}</p>
                  <p className="text-xs text-gray-500">Activity {page.activity}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Grow Your Business Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Grow Your Business Faster</h4>
        <div className="space-y-2">
          <button className="w-full text-left text-sm text-blue-600 hover:underline">
            Try Premium Page
          </button>
          <button className="w-full text-left text-sm text-blue-600 hover:underline">
            Advertise on LinkedIn
          </button>
        </div>
      </div>

      {/* Main App Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Main App</h4>
        <div className="space-y-2">
          {mainAppItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-md transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Feed</h4>
        <div className="space-y-2">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-md transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedSidebar;
