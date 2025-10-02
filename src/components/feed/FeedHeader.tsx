import React, { useState } from 'react';
import { 
  Search, Bell, MessageCircle, User, Settings, 
  ChevronDown, Globe, Image, Video, FileText,
  Home, Users, Briefcase, Bell as BellIcon
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  company?: string;
  title?: string;
}

interface FeedHeaderProps {
  user: User | null;
  notifications: number;
  networkRequests: number;
}

const FeedHeader: React.FC<FeedHeaderProps> = ({ 
  user, 
  notifications, 
  networkRequests 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Search */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/app/dashboard" className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">in</span>
                </div>
              </a>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Center Navigation */}
          <div className="flex items-center space-x-1">
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors relative">
              <Users className="w-6 h-6" />
              <span className="text-xs mt-1">My Network</span>
              {networkRequests > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {networkRequests}
                </span>
              )}
            </button>
            
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              <Briefcase className="w-6 h-6" />
              <span className="text-xs mt-1">Jobs</span>
            </button>
            
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors relative">
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs mt-1">Messaging</span>
            </button>
            
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="text-xs mt-1">Notifications</span>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Right Section - User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-gray-600">{user?.title}</p>
                  </div>
                  <a href="/app/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    View Profile
                  </a>
                  <a href="/app/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Settings
                  </a>
                  <a href="/app/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Help
                  </a>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Premium Button */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Try Premium for ₹0
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FeedHeader;
