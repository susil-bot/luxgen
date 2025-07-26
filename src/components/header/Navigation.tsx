import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavigationProps {
  className?: string;
  items?: NavigationItem[];
}

const defaultNavigationItems: NavigationItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Services', href: '/services' },
  { label: 'Support', href: '/support' },
  { label: 'Blog', href: '/blog' },
];

const Navigation: React.FC<NavigationProps> = ({ 
  className = "", 
  items = defaultNavigationItems 
}) => {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav aria-label="Global" className={`hidden md:block ${className}`}>
      <ul className="flex items-center gap-6 text-sm">
        {items.map((item, index) => (
          <li key={index}>
            {item.external ? (
              <a
                className={`transition hover:text-gray-500/75 ${
                  isActive(item.href)
                    ? 'text-teal-600 font-medium'
                    : 'text-gray-500'
                }`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ) : (
              <Link
                className={`transition hover:text-gray-500/75 ${
                  isActive(item.href)
                    ? 'text-teal-600 font-medium'
                    : 'text-gray-500'
                }`}
                to={item.href}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 