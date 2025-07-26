import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Download, Share2, Trash2, Eye, Edit } from 'lucide-react';
import contentCreatorAPI from '../../services/ContentCreatorAPI';

interface ContentItem {
  id: string;
  title: string;
  type: 'text' | 'image' | 'video' | 'audio';
  category: string;
  createdAt: string;
  lastModified: string;
  status: 'draft' | 'published' | 'archived';
  size: string;
  tags: string[];
}

const ContentHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const statuses = ['all', 'draft', 'published', 'archived'];
  const types = ['all', 'text', 'image', 'video', 'audio'];
  const sortOptions = [
    { value: 'date', label: 'Date Created' },
    { value: 'modified', label: 'Last Modified' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Type' },
    { value: 'status', label: 'Status' }
  ];

  // Mock data for fallback
  const mockContentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Blog Post: AI in Modern Business',
      type: 'text',
      category: 'blog',
      createdAt: '2024-01-15T10:30:00Z',
      lastModified: '2024-01-16T14:20:00Z',
      status: 'published',
      size: '2.3 KB',
      tags: ['ai', 'business', 'technology']
    },
    {
      id: '2',
      title: 'Social Media Campaign Graphics',
      type: 'image',
      category: 'marketing',
      createdAt: '2024-01-14T09:15:00Z',
      lastModified: '2024-01-14T16:45:00Z',
      status: 'draft',
      size: '1.8 MB',
      tags: ['social', 'marketing', 'graphics']
    },
    {
      id: '3',
      title: 'Product Launch Video Script',
      type: 'video',
      category: 'presentation',
      createdAt: '2024-01-13T11:00:00Z',
      lastModified: '2024-01-15T08:30:00Z',
      status: 'published',
      size: '15.2 KB',
      tags: ['video', 'product', 'launch']
    },
    {
      id: '4',
      title: 'Email Newsletter Template',
      type: 'text',
      category: 'email',
      createdAt: '2024-01-12T13:45:00Z',
      lastModified: '2024-01-12T13:45:00Z',
      status: 'archived',
      size: '4.1 KB',
      tags: ['email', 'newsletter', 'template']
    },
    {
      id: '5',
      title: 'Podcast Intro Music',
      type: 'audio',
      category: 'creative',
      createdAt: '2024-01-11T15:20:00Z',
      lastModified: '2024-01-13T10:15:00Z',
      status: 'published',
      size: '8.7 MB',
      tags: ['audio', 'podcast', 'music']
    }
  ];

  // Load content from API
  useEffect(() => {
    const loadContent = async () => {
      try {
        const result = await contentCreatorAPI.getContentLibrary({
          type: selectedType === 'all' ? undefined : selectedType,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
          search: searchTerm || undefined,
        });

        if (result.success && result.data) {
          setContentItems(result.data);
        } else {
          // Fallback to mock data if API fails
          setContentItems(mockContentItems);
          console.warn('Failed to load content from API, using mock data:', result.error);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        // Fallback to mock data
        setContentItems(mockContentItems);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [selectedType, selectedStatus, searchTerm]);

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'image': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'video': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'audio': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Content History</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredContent.length} items
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.category}
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{item.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div>{formatDate(item.createdAt)}</div>
                      <div className="text-xs">Modified: {formatDate(item.lastModified)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {item.size}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Share">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No content found matching your criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentHistory; 