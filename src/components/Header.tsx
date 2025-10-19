import React from 'react';
import LuxgenLogo from './LuxgenLogo';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`bg-black text-white p-4 ${className}`}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <LuxgenLogo size="md" className="mr-4" />
          <h1 className="text-xl font-bold text-orange-500">
            Trainer Platform
          </h1>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a href="/dashboard" className="text-white hover:text-orange-500 transition-colors">
            Dashboard
          </a>
          <a href="/training" className="text-white hover:text-orange-500 transition-colors">
            Training
          </a>
          <a href="/users" className="text-white hover:text-orange-500 transition-colors">
            Users
          </a>
          <a href="/settings" className="text-white hover:text-orange-500 transition-colors">
            Settings
          </a>
        </nav>
        
        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
