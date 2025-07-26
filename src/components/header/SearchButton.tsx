import React from 'react';
import { Search } from 'lucide-react';
import { SearchModal } from '../modals';
import useModal from '../../hooks/useModal';

interface SearchButtonProps {
  className?: string;
  onSearch?: (query: string) => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ 
  className = "",
  onSearch 
}) => {
  const { isOpen, open, close } = useModal();

  const handleSearch = (query: string) => {
    onSearch?.(query);
    close();
  };

  return (
    <>
      <button
        onClick={open}
        className={`p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
        aria-label="Search"
      >
        <Search size={20} />
      </button>

      <SearchModal
        isOpen={isOpen}
        onClose={close}
        onSearch={handleSearch}
      />
    </>
  );
};

export default SearchButton; 