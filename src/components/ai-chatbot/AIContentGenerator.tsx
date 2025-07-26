import React, { useState } from 'react';
import { useAIChatbot } from '../../contexts/AIChatbotContext';

const AIContentGenerator: React.FC = () => {
  const { contentTemplates, generateContent, isLoading, userNiche } = useAIChatbot();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [activeTab, setActiveTab] = useState('templates');

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setVariables({});
    setGeneratedContent('');
    
    // Pre-fill variables with defaults
    const defaultVars: Record<string, string> = {};
    template.variables.forEach((varName: string) => {
      if (varName === 'niche') {
        defaultVars[varName] = userNiche;
      } else {
        defaultVars[varName] = '';
      }
    });
    setVariables(defaultVars);
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    
    try {
      const content = await generateContent(selectedTemplate, variables);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const handleDownloadContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedTemplate?.name || 'content'}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const quickActions = [
    {
      title: 'LinkedIn Post',
      description: 'Professional networking content',
      icon: '💼',
      action: () => handleTemplateSelect(contentTemplates.find(t => t.id === 'linkedin-post'))
    },
    {
      title: 'Client Follow-up',
      description: 'Build relationships',
      icon: '📧',
      action: () => handleTemplateSelect(contentTemplates.find(t => t.id === 'client-followup'))
    },
    {
      title: 'Training Module',
      description: 'Educational content',
      icon: '📚',
      action: () => handleTemplateSelect(contentTemplates.find(t => t.id === 'training-module'))
    },
    {
      title: 'Assessment',
      description: 'Evaluation questions',
      icon: '📝',
      action: () => handleTemplateSelect(contentTemplates.find(t => t.id === 'assessment-question'))
    }
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-1">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'templates'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'quick'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Quick Actions
        </button>
      </div>

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                  {template.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
              {template.platform && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Platform: {template.platform}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'quick' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-left"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Template Variables Form */}
      {selectedTemplate && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">
            Configure {selectedTemplate.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {selectedTemplate.variables.map((variable: string) => (
              <div key={variable}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {variable.charAt(0).toUpperCase() + variable.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  value={variables[variable] || ''}
                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder={`Enter ${variable}`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || Object.values(variables).some(v => !v.trim())}
            className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Generated Content</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyContent}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
              >
                Copy
              </button>
              <button
                onClick={handleDownloadContent}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
              >
                Download
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white font-sans">
              {generatedContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator; 