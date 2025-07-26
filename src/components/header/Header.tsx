import React, { useState } from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import AuthButtons from './AuthButtons';
import MobileMenuToggle from './MobileMenuToggle';
import MobileMenu from './MobileMenu';

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

interface HeaderProps {
  className?: string;
  navigationItems?: NavigationItem[];
  showNavigation?: boolean;
  logoProps?: {
    showText?: boolean;
    className?: string;
  };
}

const Header: React.FC<HeaderProps> = ({
  className = "",
  navigationItems,
  showNavigation = true,
  logoProps
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Logo {...logoProps} />

          <div className="flex flex-1 items-center justify-end md:justify-between">
            {/* Desktop Navigation */}
            {showNavigation && (
              <Navigation items={navigationItems} />
            )}

            <div className="flex items-center gap-4">
              {/* Auth Buttons */}
              <AuthButtons />

              {/* Mobile Menu Toggle */}
              <MobileMenuToggle 
                isOpen={isMobileMenuOpen}
                onToggle={toggleMobileMenu}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        navigationItems={navigationItems}
      />
    </>
  );
};

export default Header; 