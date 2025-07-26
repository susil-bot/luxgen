import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ 
  isOpen, 
  onToggle, 
  className = "" 
}) => {
  return (
    <button
      onClick={onToggle}
      className={`block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden ${className}`}
      aria-label="Toggle mobile menu"
      aria-expanded={isOpen}
    >
      <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </button>
  );
};

export default MobileMenuToggle; 