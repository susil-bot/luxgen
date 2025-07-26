import React, { useState } from 'react';
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Image, Code, Quote } from 'lucide-react';
import contentCreatorAPI from '../../services/ContentCreatorAPI';

const ContentEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const toolbarButtons = [
    { icon: Bold, action: 'bold', label: 'Bold' },
    { icon: Italic, action: 'italic', label: 'Italic' },
    { icon: Underline, action: 'underline', label: 'Underline' },
    { icon: List, action: 'list', label: 'List' },
    { icon: AlignLeft, action: 'alignLeft', label: 'Align Left' },
    { icon: AlignCenter, action: 'alignCenter', label: 'Align Center' },
    { icon: AlignRight, action: 'alignRight', label: 'Align Right' },
    { icon: Link, action: 'link', label: 'Add Link' },
    { icon: Image, action: 'image', label: 'Add Image' },
    { icon: Code, action: 'code', label: 'Code Block' },
    { icon: Quote, action: 'quote', label: 'Quote' },
  ];

  const handleToolbarAction = (action: string) => {
    // Implement rich text editing actions
    console.log('Toolbar action:', action);
  };

  const handleAIEnhancement = async (improvementType: 'grammar' | 'style' | 'tone' | 'expand' | 'summarize') => {
    if (!content.trim()) return;
    
    try {
      const response = await contentCreatorAPI.improveContent(content, improvementType);
      
      if (response.success && response.data) {
        setContent(response.data.content);
      } else {
        console.error('AI enhancement failed:', response.error);
        // You could show an error notification here
      }
    } catch (error) {
      console.error('AI enhancement error:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Content Editor</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isEditing
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Edit Mode'}
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 flex-wrap">
            {toolbarButtons.map((button) => {
              const Icon = button.icon;
              return (
                <button
                  key={button.action}
                  onClick={() => handleToolbarAction(button.action)}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title={button.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor Area */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start editing your content here..."
              className="w-full h-64 p-4 border-0 focus:ring-0 resize-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Character Count */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{content.length} characters</span>
            <span>{content.split(' ').filter(word => word.length > 0).length} words</span>
          </div>
        </div>

        {/* AI Enhancement Tools */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">AI Enhancement Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
              onClick={() => handleAIEnhancement('style')}
              className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Improve Writing</span>
            </button>
            <button 
              onClick={() => handleAIEnhancement('grammar')}
              className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fix Grammar</span>
            </button>
            <button 
              onClick={() => handleAIEnhancement('expand')}
              className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expand Content</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3">
          <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor; 