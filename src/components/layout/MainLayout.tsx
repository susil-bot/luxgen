import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { SearchModal } from '../modals';
import ThemeToggle from '../common/ThemeToggle';
import NotificationBell from '../common/NotificationBell';
import useModal from '../../hooks/useModal';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import OnboardingTrigger from '../onboarding/OnboardingTrigger';
import LuxgenLogo from '../LuxgenLogo';

const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const searchModal = useModal();

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top navigation bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Logo for mobile */}
              <div className="lg:hidden ml-2">
                <LuxgenLogo size="small" variant="icon" />
              </div>

              {/* Page title - will be dynamic based on route */}
              <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search icon button */}
              <button
                onClick={searchModal.open}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <NotificationBell />

              {/* User profile dropdown placeholder */}
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModal.isOpen}
        onClose={searchModal.close}
        onSearch={(query) => {
          console.log('Searching for:', query);
          // Handle search logic here
        }}
      />

      {/* Onboarding Components - Only for authenticated users */}
      <OnboardingFlow />
      <OnboardingTrigger />
    </div>
  );
};

export default MainLayout; 