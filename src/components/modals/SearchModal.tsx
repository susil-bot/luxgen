import React, { useState, useEffect, useRef } from 'react';
import { X, Search, FileText, Clock } from 'lucide-react';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'search' | 'page';
  timestamp?: string;
  url?: string;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
  recentSearches?: SearchResult[];
  recentPages?: SearchResult[];
  placeholder?: string;
  className?: string;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  recentSearches = [],
  recentPages = [],
  placeholder = "Search Anything...",
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Default recent searches if none provided
  const defaultRecentSearches: SearchResult[] = [
    {
      id: '1',
      title: 'Form Builder - 23 hours on-demand video',
      type: 'search',
      timestamp: '23 hours ago'
    },
    {
      id: '2',
      title: 'Access Mosaic on mobile and TV',
      type: 'search',
      timestamp: '1 day ago'
    },
    {
      id: '3',
      title: 'Product Update - Q4 2024',
      type: 'search',
      timestamp: '2 days ago'
    },
    {
      id: '4',
      title: 'Master Digital Marketing Strategy course',
      type: 'search',
      timestamp: '3 days ago'
    },
    {
      id: '5',
      title: 'Dedicated forms for products',
      type: 'search',
      timestamp: '1 week ago'
    },
    {
      id: '6',
      title: 'Product Update - Q4 2024',
      type: 'search',
      timestamp: '1 week ago'
    }
  ];

  // Default recent pages if none provided
  const defaultRecentPages: SearchResult[] = [
    {
      id: '1',
      title: 'Messages - Conversation / ... / Mike Mills',
      type: 'page',
      url: '/messages/conversation/mike-mills'
    },
    {
      id: '2',
      title: 'Messages - Conversation / ... / Eva Patrick',
      type: 'page',
      url: '/messages/conversation/eva-patrick'
    }
  ];

  const displayRecentSearches = recentSearches.length > 0 ? recentSearches : defaultRecentSearches;
  const displayRecentPages = recentPages.length > 0 ? recentPages : defaultRecentPages;

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      onSearch?.(searchQuery.trim());
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
        onClose();
      }, 1000);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'page' && result.url) {
      // Navigate to page
      window.location.href = result.url;
    } else {
      // Set as search query
      setSearchQuery(result.title);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-2xl ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{placeholder}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isSearching}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
              </div>
            )}
          </div>
        </form>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {displayRecentSearches.length > 0 && (
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Recent Searches
              </h3>
              <div className="space-y-2">
                {displayRecentSearches.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                  >
                    <Search className="text-gray-400 group-hover:text-purple-500 mr-3" size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {result.title}
                      </p>
                      {result.timestamp && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Clock size={12} className="mr-1" />
                          {result.timestamp}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Pages */}
          {displayRecentPages.length > 0 && (
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Recent Pages
              </h3>
              <div className="space-y-2">
                {displayRecentPages.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                  >
                    <FileText className="text-gray-400 group-hover:text-purple-500 mr-3" size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {result.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 