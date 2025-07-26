import React, { useState } from 'react';
import { Search, Filter, Plus, Copy, Star, Download } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'text' | 'image' | 'video' | 'audio';
  tags: string[];
  isFavorite: boolean;
  usageCount: number;
}

const ContentTemplates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = ['all', 'marketing', 'social-media', 'blog', 'email', 'presentation', 'creative'];
  const types = ['all', 'text', 'image', 'video', 'audio'];

  const templates: Template[] = [
    {
      id: '1',
      name: 'Blog Post Introduction',
      description: 'Engaging blog post introductions that hook readers from the start',
      category: 'blog',
      type: 'text',
      tags: ['blog', 'introduction', 'engaging'],
      isFavorite: false,
      usageCount: 1250
    },
    {
      id: '2',
      name: 'Social Media Post',
      description: 'Optimized social media posts for various platforms',
      category: 'social-media',
      type: 'text',
      tags: ['social', 'post', 'viral'],
      isFavorite: true,
      usageCount: 890
    },
    {
      id: '3',
      name: 'Email Newsletter',
      description: 'Professional email newsletter templates',
      category: 'email',
      type: 'text',
      tags: ['email', 'newsletter', 'professional'],
      isFavorite: false,
      usageCount: 567
    },
    {
      id: '4',
      name: 'Product Description',
      description: 'Compelling product descriptions that drive sales',
      category: 'marketing',
      type: 'text',
      tags: ['product', 'sales', 'marketing'],
      isFavorite: false,
      usageCount: 432
    },
    {
      id: '5',
      name: 'Infographic Design',
      description: 'Eye-catching infographic templates',
      category: 'creative',
      type: 'image',
      tags: ['infographic', 'design', 'visual'],
      isFavorite: true,
      usageCount: 234
    },
    {
      id: '6',
      name: 'Video Script',
      description: 'Professional video script templates',
      category: 'presentation',
      type: 'video',
      tags: ['video', 'script', 'presentation'],
      isFavorite: false,
      usageCount: 189
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleUseTemplate = (template: Template) => {
    console.log('Using template:', template);
  };

  const handleToggleFavorite = (templateId: string) => {
    console.log('Toggle favorite:', templateId);
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Content Templates</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Template</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
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
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
                </div>
                <button
                  onClick={() => handleToggleFavorite(template.id)}
                  className={`p-1 rounded-full transition-colors ${
                    template.isFavorite
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    template.type === 'text' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    template.type === 'image' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    template.type === 'video' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  }`}>
                    {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                    {template.category}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {template.usageCount} uses
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Use Template</span>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No templates found matching your criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentTemplates; 