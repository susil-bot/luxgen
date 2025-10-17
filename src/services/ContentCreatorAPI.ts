import apiClient from './apiClient';
import { securityConfig } from '../config/security';
import { apiLogger } from '../utils/logger';

interface ContentGenerationOptions {
  maxTokens?: number;
  temperature?: number;
  tone?: string;
  length?: string;
  style?: string;
  language?: string;
}

interface ContentGenerationRequest {
  type: string;
  prompt: string;
  context?: string;
  options: ContentGenerationOptions;
}

interface ContentGenerationResponse {
  success: boolean;
  data?: {
    content: string;
    metadata?: {
      tokens: number;
      processingTime: number;
      model: string;
    };
  };
  error?: {
    message: string;
    code: string;
  };
}

class ContentCreatorAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = `${securityConfig.apiBaseUrl}/ai`;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  private async makeRequest(endpoint: string, data: any): Promise<ContentGenerationResponse> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      apiLogger.apiError(endpoint, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'API_ERROR',
        },
      };
    }
  }

  // Generate general content
  async generateContent(
    contentType: 'text' | 'image' | 'video' | 'audio',
    prompt: string,
    options: ContentGenerationOptions = {}
  ): Promise<ContentGenerationResponse> {
    const defaultOptions: ContentGenerationOptions = {
      maxTokens: 2000,
      temperature: 0.7,
      tone: 'professional',
      length: 'medium',
      style: 'informative',
      language: 'english',
      ...options,
    };

    return this.makeRequest('/generate/content', {
      type: contentType,
      prompt,
      options: defaultOptions,
    });
  }

  // Generate training material
  async createTrainingMaterial(topic: string, context: string = ''): Promise<ContentGenerationResponse> {
    return this.makeRequest('/generate/specialized', {
      type: 'training_material',
      prompt: topic,
      context,
      options: {
        maxTokens: 2000,
        temperature: 0.7,
      },
    });
  }

  // Generate assessment questions
  async createAssessmentQuestions(topic: string, questionCount: number = 5): Promise<ContentGenerationResponse> {
    return this.makeRequest('/generate/specialized', {
      type: 'assessment_questions',
      prompt: topic,
      context: `Create ${questionCount} multiple choice questions`,
      options: {
        maxTokens: 1500,
        temperature: 0.8,
      },
    });
  }

  // Generate presentation outline
  async createPresentationOutline(topic: string): Promise<ContentGenerationResponse> {
    return this.makeRequest('/generate/specialized', {
      type: 'presentation_outline',
      prompt: topic,
      options: {
        maxTokens: 1000,
        temperature: 0.6,
      },
    });
  }

  // Generate blog post
  async createBlogPost(topic: string, options: ContentGenerationOptions = {}): Promise<ContentGenerationResponse> {
    return this.makeRequest('/generate/specialized', {
      type: 'blog_post',
      prompt: topic,
      options: {
        maxTokens: 2500,
        temperature: 0.7,
        tone: 'engaging',
        style: 'informative',
        ...options,
      },
    });
  }

  // Generate social media content
  async createSocialMediaContent(
    platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook',
    topic: string,
    options: ContentGenerationOptions = {}
  ): Promise<ContentGenerationResponse> {
    return this.makeRequest('/generate/specialized', {
      type: 'social_media',
      prompt: topic,
      context: `Platform: ${platform}`,
      options: {
        maxTokens: platform === 'twitter' ? 280 : 1000,
        temperature: 0.8,
        tone: 'casual',
        style: 'conversational',
        ...options,
      },
    });
  }

  // Generate email content
  async createEmailContent(
    type: 'newsletter' | 'marketing' | 'announcement' | 'follow-up',
    topic: string,
    options: ContentGenerationOptions = {}
  ): Promise<ContentGenerationResponse> {
    return this.makeRequest('/generate/specialized', {
      type: 'email',
      prompt: topic,
      context: `Email type: ${type}`,
      options: {
        maxTokens: 1500,
        temperature: 0.6,
        tone: 'professional',
        style: 'persuasive',
        ...options,
      },
    });
  }

  // Generate product description
  async createProductDescription(
    productName: string,
    features: string[],
    targetAudience: string,
    options: ContentGenerationOptions = {}
  ): Promise<ContentGenerationResponse> {
    return this.makeRequest('/generate/specialized', {
      type: 'product_description',
      prompt: productName,
      context: `Features: ${features.join(', ')}. Target audience: ${targetAudience}`,
      options: {
        maxTokens: 1000,
        temperature: 0.7,
        tone: 'persuasive',
        style: 'marketing',
        ...options,
      },
    });
  }

  // Generate image description for AI image generation
  async createImagePrompt(description: string, style: string = 'realistic'): Promise<ContentGenerationResponse> {
    return this.makeRequest('/generate/image-prompt', {
      type: 'image_prompt',
      prompt: description,
      context: `Style: ${style}`,
      options: {
        maxTokens: 500,
        temperature: 0.8,
      },
    });
  }

  // Generate video script
  async createVideoScript(
    topic: string,
    duration: 'short' | 'medium' | 'long' = 'medium',
    style: 'educational' | 'entertaining' | 'promotional' = 'educational'
  ): Promise<ContentGenerationResponse> {
    return this.makeRequest('/generate/specialized', {
      type: 'video_script',
      prompt: topic,
      context: `Duration: ${duration}, Style: ${style}`,
      options: {
        maxTokens: 2000,
        temperature: 0.7,
        tone: style === 'educational' ? 'professional' : 'conversational',
        style,
      },
    });
  }

  // Generate audio script (podcast, voiceover)
  async createAudioScript(
    topic: string,
    type: 'podcast' | 'voiceover' | 'audio-book' = 'podcast',
    duration: number = 5
  ): Promise<ContentGenerationResponse> {
    return this.makeRequest('/generate/specialized', {
      type: 'audio_script',
      prompt: topic,
      context: `Type: ${type}, Duration: ${duration} minutes`,
      options: {
        maxTokens: 1500,
        temperature: 0.7,
        tone: type === 'podcast' ? 'conversational' : 'professional',
        style: 'storytelling',
      },
    });
  }

  // Improve existing content
  async improveContent(
    content: string,
    improvement: 'grammar' | 'style' | 'tone' | 'expand' | 'summarize'
  ): Promise<ContentGenerationResponse> {
    return this.makeRequest('/improve/content', {
      type: 'content_improvement',
      prompt: content,
      context: `Improvement type: ${improvement}`,
      options: {
        maxTokens: 2000,
        temperature: 0.6,
      },
    });
  }

  // Translate content
  async translateContent(
    content: string,
    targetLanguage: string,
    preserveTone: boolean = true
  ): Promise<ContentGenerationResponse> {
    return this.makeRequest('/translate/content', {
      type: 'translation',
      prompt: content,
      context: `Target language: ${targetLanguage}, Preserve tone: ${preserveTone}`,
      options: {
        maxTokens: 2000,
        temperature: 0.3,
      },
    });
  }

  // Get content suggestions
  async getContentSuggestions(topic: string, contentType: string): Promise<ContentGenerationResponse> {
    return this.makeRequest('/suggest/content', {
      type: 'content_suggestions',
      prompt: topic,
      context: `Content type: ${contentType}`,
      options: {
        maxTokens: 1000,
        temperature: 0.8,
      },
    });
  }

  // Save content to user's library
  async saveContent(contentData: {
    title: string;
    content: string;
    type: string;
    category: string;
    tags: string[];
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/content/save`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(contentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, id: result.id };
    } catch (error) {
      apiLogger.error('Save content failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Get user's content library
  async getContentLibrary(filters?: {
    type?: string;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      const response = await fetch(`${this.baseURL}/content/library?${queryParams}`, {
        method: 'GET',
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result.data };
    } catch (error) {
      apiLogger.error('Get content library failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

// Create and export a singleton instance
const contentCreatorAPI = new ContentCreatorAPI();
export default contentCreatorAPI; 