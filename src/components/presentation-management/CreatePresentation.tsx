import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  Music, 
  X, 
  Plus, 
  Brain, 
  Sparkles,
  Save,
  Eye,
  Settings,
  Palette,
  Type,
  Layout,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'poll' | 'custom';
  order: number;
  duration?: number;
  background?: string;
  font?: string;
  fontSize?: number;
}

interface Presentation {
  id: string;
  title: string;
  description: string;
  type: 'ppt' | 'pdf' | 'slideshow' | 'custom';
  slides: Slide[];
  theme: string;
  settings: {
    autoAdvance: boolean;
    transitionTime: number;
    showProgress: boolean;
    allowInteraction: boolean;
  };
  aiFeatures: {
    autoGeneratePolls: boolean;
    contentOptimization: boolean;
    engagementTips: boolean;
    smartTransitions: boolean;
  };
}

const CreatePresentation: React.FC = () => {
  const [presentation, setPresentation] = useState<Presentation>({
    id: '',
    title: '',
    description: '',
    type: 'slideshow',
    slides: [],
    theme: 'modern',
    settings: {
      autoAdvance: true,
      transitionTime: 3,
      showProgress: true,
      allowInteraction: true,
    },
    aiFeatures: {
      autoGeneratePolls: true,
      contentOptimization: true,
      engagementTips: true,
      smartTransitions: true,
    },
  });

  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'ai' | 'settings'>('content');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setIsUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      setUploadedFiles(prev => [...prev, ...files]);
      setIsUploading(false);
      
      // Auto-generate slides from uploaded files
      files.forEach((file, index) => {
        const newSlide: Slide = {
          id: `slide_${Date.now()}_${index}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          content: `Content from ${file.name}`,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'text',
          order: presentation.slides.length + index + 1,
        };
        setPresentation(prev => ({
          ...prev,
          slides: [...prev.slides, newSlide]
        }));
      });
    }, 2000);
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide_${Date.now()}`,
      title: `Slide ${presentation.slides.length + 1}`,
      content: 'Add your content here...',
      type: 'text',
      order: presentation.slides.length + 1,
    };
    setPresentation(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
  };

  const updateSlide = (slideId: string, updates: Partial<Slide>) => {
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map(slide => 
        slide.id === slideId ? { ...slide, ...updates } : slide
      )
    }));
  };

  const removeSlide = (slideId: string) => {
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.filter(slide => slide.id !== slideId)
    }));
  };

  const generateAIPolls = () => {
    // Simulate AI poll generation
    const aiPolls = [
      {
        id: `poll_${Date.now()}_1`,
        title: 'Understanding Check',
        content: 'How well did you understand the previous content?',
        type: 'poll' as const,
        order: presentation.slides.length + 1,
      },
      {
        id: `poll_${Date.now()}_2`,
        title: 'Engagement Question',
        content: 'What aspect would you like to explore further?',
        type: 'poll' as const,
        order: presentation.slides.length + 2,
      }
    ];

    setPresentation(prev => ({
      ...prev,
      slides: [...prev.slides, ...aiPolls]
    }));
  };

  const optimizeContent = () => {
    // Simulate AI content optimization
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map(slide => ({
        ...slide,
        content: slide.content + ' (AI optimized)'
      }))
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/app/presentations"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create Presentation
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Build engaging presentations with AI support
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Presentation Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={presentation.title}
                    onChange={(e) => setPresentation(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter presentation title..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={presentation.description}
                    onChange={(e) => setPresentation(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your presentation..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={presentation.type}
                    onChange={(e) => setPresentation(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="slideshow">Slideshow</option>
                    <option value="ppt">PowerPoint</option>
                    <option value="pdf">PDF</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upload Files
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop files here, or{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Supports PPT, PDF, images, videos, and more
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              {isUploading && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      Processing files...
                    </span>
                  </div>
                </div>
              )}
              
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Uploaded Files
                  </h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">{file.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Slides */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Slides ({presentation.slides.length})
                </h3>
                <button
                  onClick={addSlide}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Slide</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {presentation.slides.map((slide, index) => (
                  <div key={slide.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Slide {index + 1}
                      </h4>
                      <button
                        onClick={() => removeSlide(slide.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                      placeholder="Slide title..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    />
                    
                    <textarea
                      value={slide.content}
                      onChange={(e) => updateSlide(slide.id, { content: e.target.value })}
                      placeholder="Slide content..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
                
                {presentation.slides.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="mx-auto h-12 w-12 mb-4" />
                    <p>No slides yet. Add your first slide or upload files to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Features
                </h3>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={generateAIPolls}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate AI Polls</span>
                </button>
                
                <button
                  onClick={optimizeContent}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  <span>Optimize Content</span>
                </button>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={presentation.aiFeatures.autoGeneratePolls}
                      onChange={(e) => setPresentation(prev => ({
                        ...prev,
                        aiFeatures: { ...prev.aiFeatures, autoGeneratePolls: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Auto-generate polls
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={presentation.aiFeatures.contentOptimization}
                      onChange={(e) => setPresentation(prev => ({
                        ...prev,
                        aiFeatures: { ...prev.aiFeatures, contentOptimization: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Content optimization
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={presentation.aiFeatures.engagementTips}
                      onChange={(e) => setPresentation(prev => ({
                        ...prev,
                        aiFeatures: { ...prev.aiFeatures, engagementTips: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Engagement tips
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Design Options */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Design
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={presentation.theme}
                    onChange={(e) => setPresentation(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-full h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg cursor-pointer border-2 border-blue-500"></div>
                  <div className="w-full h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg cursor-pointer border-2 border-transparent"></div>
                  <div className="w-full h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg cursor-pointer border-2 border-transparent"></div>
                  <div className="w-full h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg cursor-pointer border-2 border-transparent"></div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Settings
                </h3>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={presentation.settings.autoAdvance}
                    onChange={(e) => setPresentation(prev => ({
                      ...prev,
                      settings: { ...prev.settings, autoAdvance: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Auto-advance slides
                  </span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={presentation.settings.showProgress}
                    onChange={(e) => setPresentation(prev => ({
                      ...prev,
                      settings: { ...prev.settings, showProgress: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Show progress bar
                  </span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={presentation.settings.allowInteraction}
                    onChange={(e) => setPresentation(prev => ({
                      ...prev,
                      settings: { ...prev.settings, allowInteraction: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Allow audience interaction
                  </span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transition Time (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={presentation.settings.transitionTime}
                    onChange={(e) => setPresentation(prev => ({
                      ...prev,
                      settings: { ...prev.settings, transitionTime: parseInt(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePresentation; 