import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthButtonsProps {
  className?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ className = "" }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-teal-600" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <Link
            to="/app/dashboard"
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
        
        {/* Mobile authenticated view */}
        <div className="sm:hidden">
          <Link
            to="/app/dashboard"
            className="rounded-md bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="sm:flex sm:gap-4">
        <Link
          to="/login"
          className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default AuthButtons; 