import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Globe, 
  Mail, 
  Calendar, 
  Building, 
  Star,
  MoreHorizontal,
  MessageCircle,
  Check,
  Users,
  Award,
  Activity,
  Settings,
  Edit,
  Camera,
  Plus,
  Play,
  Search,
  HelpCircle,
  Info,
  Sun,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface ProfileData {
  fullName: string;
  tagline: string;
  location: string;
  website: string;
  title: string;
  email: string;
  birthdate: string;
  joinedDate: string;
  about: string;
  departments: string[];
  connections: number;
  contributions: number;
  avatar?: string;
  coverImage?: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'connections' | 'contributions'>('general');
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: user ? `${user.firstName} ${user.lastName}` : 'Carolyn McNeail',
    tagline: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    location: 'Milan, IT',
    website: 'carolinmcneail.com',
    title: 'Senior Product Designer',
    email: user?.email || 'carolinmcneail@acme.com',
    birthdate: '4 April, 1987',
    joinedDate: '7 April, 2017',
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    departments: ['Acme Marketing', 'Acme Product'],
    connections: 284,
    contributions: 156
  });

  const [isFollowing, setIsFollowing] = useState(true);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with team members */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Acme Inc.</span>
              <button className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Info className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Sun className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Acme Inc.</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Team members */}
          <div className="pb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">TEAM MEMBERS</h3>
            <div className="flex items-center space-x-2">
              {[
                { name: 'Carolyn McNeail', active: true },
                { name: 'Mary Roszczewski', active: false },
                { name: 'Jerzy Wierzy', active: false },
                { name: 'Tisha Yanchev', active: false },
                { name: 'Simona Lürwer', active: false },
                { name: 'Adrian Przetocki', active: false },
                { name: 'Brian Halligan', active: false }
              ].map((member, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer ${member.active ? 'ring-2 ring-primary-500' : ''}`}
                >
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {member.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Cover image */}
          <div className="relative h-64 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Profile picture */}
            <div className="absolute bottom-4 left-8">
              <div className="relative">
                <div className="h-24 w-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white dark:border-gray-800 shadow-lg hover:scale-105 transition-transform duration-200">
                  {profileData.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute -bottom-1 -right-1 h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile info */}
          <div className="px-8 pt-20 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column */}
              <div className="lg:col-span-2">
                {/* Name and tagline */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {profileData.fullName}
                    </h1>
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {profileData.tagline}
                  </p>
                </div>

                {/* Location and website */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Globe className="h-4 w-4" />
                    <a href={`https://${profileData.website}`} className="text-primary-600 hover:text-primary-700">
                      {profileData.website}
                    </a>
                  </div>
                </div>

                {/* Navigation tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <nav className="flex space-x-8">
                    {[
                      { id: 'general', label: 'General' },
                      { id: 'connections', label: 'Connections' },
                      { id: 'contributions', label: 'Contributions' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab content */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    {/* About Me */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">About Me</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {profileData.about}
                      </p>
                    </div>

                    {/* Departments */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Departments</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {profileData.departments.map((dept, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                              <Play className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-gray-900 dark:text-gray-100 font-medium">{dept}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'connections' && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {profileData.connections} Connections
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      View and manage your professional connections
                    </p>
                  </div>
                )}

                {activeTab === 'contributions' && (
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {profileData.contributions} Contributions
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Track your contributions and achievements
                    </p>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Action buttons */}
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleFollowToggle}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Information list */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Title</span>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{profileData.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{profileData.location} - Remote</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{profileData.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Birthdate</span>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{profileData.birthdate}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Joined Acme</span>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{profileData.joinedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 