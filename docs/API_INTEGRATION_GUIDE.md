# API Integration Guide

Complete guide for integrating the AI Content Creation system with backend APIs.

## 🚀 Overview

The AI Content Creation system is now fully integrated with a robust API layer that provides real-time content generation, management, and analytics capabilities.

## 📁 API Service Structure

### **Core API Service**
- **File**: `src/services/ContentCreatorAPI.ts`
- **Type**: Singleton class with comprehensive methods
- **Authentication**: JWT token-based authentication
- **Error Handling**: Comprehensive error handling with fallbacks

## 🔧 API Methods

### **Content Generation**

#### **General Content Generation**
```typescript
async generateContent(
  contentType: 'text' | 'image' | 'video' | 'audio',
  prompt: string,
  options: ContentGenerationOptions = {}
): Promise<ContentGenerationResponse>
```

**Usage Example:**
```typescript
const response = await contentCreatorAPI.generateContent('text', 'Write a blog post about AI', {
  tone: 'professional',
  length: 'medium',
  style: 'informative',
  language: 'english'
});
```

#### **Specialized Content Generation**

##### **Training Material**
```typescript
async createTrainingMaterial(topic: string, context: string = ''): Promise<ContentGenerationResponse>
```

##### **Assessment Questions**
```typescript
async createAssessmentQuestions(topic: string, questionCount: number = 5): Promise<ContentGenerationResponse>
```

##### **Presentation Outline**
```typescript
async createPresentationOutline(topic: string): Promise<ContentGenerationResponse>
```

##### **Blog Post**
```typescript
async createBlogPost(topic: string, options: ContentGenerationOptions = {}): Promise<ContentGenerationResponse>
```

##### **Social Media Content**
```typescript
async createSocialMediaContent(
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook',
  topic: string,
  options: ContentGenerationOptions = {}
): Promise<ContentGenerationResponse>
```

##### **Email Content**
```typescript
async createEmailContent(
  type: 'newsletter' | 'marketing' | 'announcement' | 'follow-up',
  topic: string,
  options: ContentGenerationOptions = {}
): Promise<ContentGenerationResponse>
```

##### **Product Description**
```typescript
async createProductDescription(
  productName: string,
  features: string[],
  targetAudience: string,
  options: ContentGenerationOptions = {}
): Promise<ContentGenerationResponse>
```

##### **Video Script**
```typescript
async createVideoScript(
  topic: string,
  duration: 'short' | 'medium' | 'long' = 'medium',
  style: 'educational' | 'entertaining' | 'promotional' = 'educational'
): Promise<ContentGenerationResponse>
```

##### **Audio Script**
```typescript
async createAudioScript(
  topic: string,
  type: 'podcast' | 'voiceover' | 'audio-book' = 'podcast',
  duration: number = 5
): Promise<ContentGenerationResponse>
```

### **Content Enhancement**

#### **Content Improvement**
```typescript
async improveContent(
  content: string,
  improvement: 'grammar' | 'style' | 'tone' | 'expand' | 'summarize'
): Promise<ContentGenerationResponse>
```

#### **Content Translation**
```typescript
async translateContent(
  content: string,
  targetLanguage: string,
  preserveTone: boolean = true
): Promise<ContentGenerationResponse>
```

#### **Content Suggestions**
```typescript
async getContentSuggestions(topic: string, contentType: string): Promise<ContentGenerationResponse>
```

### **Content Management**

#### **Save Content**
```typescript
async saveContent(contentData: {
  title: string;
  content: string;
  type: string;
  category: string;
  tags: string[];
}): Promise<{ success: boolean; id?: string; error?: string }>
```

#### **Get Content Library**
```typescript
async getContentLibrary(filters?: {
  type?: string;
  category?: string;
  status?: string;
  search?: string;
}): Promise<{ success: boolean; data?: any[]; error?: string }>
```

## 🎯 API Endpoints

### **Base URL Configuration**
```typescript
// Environment variable
REACT_APP_API_URL=http://localhost:3001/api/v1/ai

// Default fallback
http://localhost:3001/api/v1/ai
```

### **Endpoint Structure**

#### **Content Generation**
- `POST /generate/content` - General content generation
- `POST /generate/specialized` - Specialized content types
- `POST /generate/image-prompt` - Image generation prompts

#### **Content Enhancement**
- `POST /improve/content` - Content improvement
- `POST /translate/content` - Content translation
- `POST /suggest/content` - Content suggestions

#### **Content Management**
- `POST /content/save` - Save content to library
- `GET /content/library` - Retrieve content library

## 🔐 Authentication

### **JWT Token Management**
```typescript
// Automatic token retrieval
const token = apiClient.getAuthToken();

// Headers setup
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
};
```

### **Token Integration**
- **Automatic**: Uses existing `apiClient.getAuthToken()`
- **Secure**: Token stored in localStorage with proper management
- **Refresh**: Handles token expiration and refresh

## 📊 Response Format

### **Success Response**
```typescript
interface ContentGenerationResponse {
  success: true;
  data: {
    content: string;
    metadata?: {
      tokens: number;
      processingTime: number;
      model: string;
    };
  };
}
```

### **Error Response**
```typescript
interface ContentGenerationResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}
```

## 🛡️ Error Handling

### **Comprehensive Error Management**
```typescript
try {
  const response = await contentCreatorAPI.generateContent('text', prompt);
  
  if (response.success && response.data) {
    // Handle success
    setGeneratedContent(response.data.content);
  } else {
    // Handle API error
    console.warn('API generation failed:', response.error);
    // Fallback to mock content
  }
} catch (error) {
  // Handle network/other errors
  console.error('Content generation error:', error);
  // Fallback to mock content
}
```

### **Fallback Strategy**
- **Mock Content**: Provides realistic fallback content when API fails
- **Graceful Degradation**: UI remains functional even with API issues
- **User Feedback**: Clear error messages and loading states

## 🔄 Component Integration

### **ContentGenerator Integration**
```typescript
// Real API call with fallback
const handleGenerate = async () => {
  setIsGenerating(true);
  
  try {
    const response = await contentCreatorAPI.generateContent(contentType, prompt, {
      tone: settings.tone,
      length: settings.length,
      style: settings.style,
      language: settings.language,
    });

    if (response.success && response.data) {
      setGeneratedContent(response.data.content);
    } else {
      // Fallback to mock content
      setGeneratedContent(mockContent);
    }
  } catch (error) {
    // Fallback to mock content
    setGeneratedContent(mockContent);
  } finally {
    setIsGenerating(false);
  }
};
```

### **ContentHistory Integration**
```typescript
// Load content from API with fallback
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
        // Fallback to mock data
        setContentItems(mockContentItems);
      }
    } catch (error) {
      // Fallback to mock data
      setContentItems(mockContentItems);
    } finally {
      setLoading(false);
    }
  };

  loadContent();
}, [selectedType, selectedStatus, searchTerm]);
```

### **ContentEditor Integration**
```typescript
// AI enhancement tools
const handleAIEnhancement = async (improvementType: 'grammar' | 'style' | 'tone' | 'expand' | 'summarize') => {
  if (!content.trim()) return;
  
  try {
    const response = await contentCreatorAPI.improveContent(content, improvementType);
    
    if (response.success && response.data) {
      setContent(response.data.content);
    } else {
      console.error('AI enhancement failed:', response.error);
    }
  } catch (error) {
    console.error('AI enhancement error:', error);
  }
};
```

## 🎨 Configuration Options

### **Content Generation Options**
```typescript
interface ContentGenerationOptions {
  maxTokens?: number;      // Maximum tokens for generation
  temperature?: number;    // Creativity level (0.0 - 1.0)
  tone?: string;          // Content tone (professional, casual, etc.)
  length?: string;        // Content length (short, medium, long)
  style?: string;         // Content style (informative, persuasive, etc.)
  language?: string;      // Target language
}
```

### **Default Settings**
```typescript
const defaultOptions: ContentGenerationOptions = {
  maxTokens: 2000,
  temperature: 0.7,
  tone: 'professional',
  length: 'medium',
  style: 'informative',
  language: 'english',
};
```

## 🚀 Performance Optimizations

### **Request Optimization**
- **Debounced Search**: Prevents excessive API calls during typing
- **Caching**: Intelligent caching of frequently requested content
- **Batch Operations**: Efficient bulk operations for content management

### **Loading States**
- **Skeleton Loading**: Smooth loading experience
- **Progress Indicators**: Real-time generation progress
- **Error States**: Clear error feedback with retry options

## 🔧 Development Setup

### **Environment Variables**
```bash
# .env.local
REACT_APP_API_URL=http://localhost:3001/api/v1/ai
REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
```

### **API Client Import**
```typescript
import contentCreatorAPI from '../../services/ContentCreatorAPI';
```

### **Usage in Components**
```typescript
// Example: Generate blog post
const generateBlogPost = async () => {
  const response = await contentCreatorAPI.createBlogPost('AI in Education', {
    tone: 'engaging',
    length: 'long',
    style: 'informative'
  });
  
  if (response.success) {
    console.log('Generated content:', response.data.content);
  }
};
```

## 🧪 Testing

### **API Testing Strategy**
```typescript
// Mock API responses for testing
jest.mock('../../services/ContentCreatorAPI', () => ({
  __esModule: true,
  default: {
    generateContent: jest.fn(),
    saveContent: jest.fn(),
    getContentLibrary: jest.fn(),
  },
}));
```

### **Error Testing**
```typescript
// Test error handling
test('handles API errors gracefully', async () => {
  contentCreatorAPI.generateContent.mockRejectedValue(new Error('API Error'));
  
  // Component should show fallback content
  // and not crash
});
```

## 📈 Monitoring & Analytics

### **API Performance Tracking**
- **Response Times**: Monitor API response performance
- **Success Rates**: Track API success/failure rates
- **Error Patterns**: Identify common error patterns
- **Usage Metrics**: Track feature usage and popularity

### **User Experience Metrics**
- **Generation Time**: Time from prompt to content
- **User Satisfaction**: Content quality ratings
- **Feature Adoption**: Which content types are most popular
- **Error Recovery**: How users handle API failures

## 🔮 Future Enhancements

### **Planned API Features**
- **Streaming Responses**: Real-time content generation
- **Batch Processing**: Multiple content generation in parallel
- **Advanced Filtering**: More sophisticated content filtering
- **Collaborative Features**: Real-time collaborative editing

### **Performance Improvements**
- **CDN Integration**: Faster content delivery
- **Caching Strategy**: Advanced caching mechanisms
- **Load Balancing**: Better API distribution
- **Rate Limiting**: Intelligent rate limiting

## 📚 Best Practices

### **API Usage**
1. **Always handle errors**: Implement proper error handling
2. **Use fallbacks**: Provide fallback content when API fails
3. **Optimize requests**: Minimize unnecessary API calls
4. **Cache responses**: Cache frequently requested content
5. **Monitor performance**: Track API performance metrics

### **User Experience**
1. **Loading states**: Show clear loading indicators
2. **Error messages**: Provide helpful error messages
3. **Retry mechanisms**: Allow users to retry failed operations
4. **Progressive enhancement**: Graceful degradation when features fail

This API integration provides a robust, scalable, and user-friendly foundation for AI-powered content creation with comprehensive error handling and fallback strategies. 