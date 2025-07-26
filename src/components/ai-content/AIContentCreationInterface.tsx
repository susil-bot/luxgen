import React, { useState } from 'react';
import { Plus, FileText, Image, Video, Music, Download, Share2, Settings, Sparkles } from 'lucide-react';
import ContentGenerator from './ContentGenerator';
import ContentEditor from './ContentEditor';
import ContentTemplates from './ContentTemplates';
import ContentHistory from './ContentHistory';
import ContentAnalytics from './ContentAnalytics';

type ContentType = 'text' | 'image' | 'video' | 'audio';
type TabType = 'generate' | 'edit' | 'templates' | 'history' | 'analytics';

const AIContentCreationInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('text');
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs = [
    { id: 'generate', label: 'Generate', icon: Sparkles },
    { id: 'edit', label: 'Edit', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Image },
    { id: 'history', label: 'History', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: Music },
  ];

  const contentTypes = [
    { id: 'text', label: 'Text Content', icon: FileText, description: 'Articles, blogs, social media posts' },
    { id: 'image', label: 'Images', icon: Image, description: 'Graphics, illustrations, photos' },
    { id: 'video', label: 'Videos', icon: Video, description: 'Short clips, presentations, animations' },
    { id: 'audio', label: 'Audio', icon: Music, description: 'Podcasts, voiceovers, music' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate':
        return <ContentGenerator contentType={selectedContentType} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />;
      case 'edit':
        return <ContentEditor />;
      case 'templates':
        return <ContentTemplates />;
      case 'history':
        return <ContentHistory />;
      case 'analytics':
        return <ContentAnalytics />;
      default:
        return <ContentGenerator contentType={selectedContentType} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Content Creation</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Content Type Selector */}
        {activeTab === 'generate' && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Content Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedContentType(type.id as ContentType)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedContentType === type.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 ${
                        selectedContentType === type.id ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      <div className="text-left">
                        <h3 className={`font-medium ${
                          selectedContentType === type.id ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-white'
                        }`}>
                          {type.label}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AIContentCreationInterface; 