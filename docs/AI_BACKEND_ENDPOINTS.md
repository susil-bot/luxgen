# AI Backend Endpoints Documentation

This document outlines all the AI-related endpoints required from the backend to support the trainer platform's AI functionality.

## 🚀 Base URL Structure

```
Base URL: {API_BASE_URL}/ai
Authentication: Bearer Token (JWT)
Content-Type: application/json
```

## 📋 Core AI Endpoints

### 1. Content Generation

#### `POST /ai/generate/content`
Generate general content based on type and prompt.

**Request Body:**
```json
{
  "type": "text|image|video|audio",
  "prompt": "string",
  "context": "string (optional)",
  "options": {
    "maxTokens": 2000,
    "temperature": 0.7,
    "tone": "professional|casual|formal|friendly",
    "length": "short|medium|long",
    "style": "informative|persuasive|narrative|technical",
    "language": "english|spanish|french|german"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Generated content...",
    "metadata": {
      "tokens": 150,
      "processingTime": 2.5,
      "model": "gpt-4"
    }
  }
}
```

#### `POST /ai/generate/training-material`
Generate training materials for specific topics.

**Request Body:**
```json
{
  "topic": "string",
  "context": "string (optional)",
  "options": {
    "type": "course|module|lesson|assessment",
    "difficulty": "beginner|intermediate|advanced",
    "duration": "number (minutes)",
    "format": "video|document|interactive"
  }
}
```

#### `POST /ai/generate/assessment-questions`
Generate assessment questions for training topics.

**Request Body:**
```json
{
  "topic": "string",
  "questionCount": 10,
  "options": {
    "types": ["multiple_choice", "true_false", "short_answer"],
    "difficulty": "beginner|intermediate|advanced",
    "timeLimit": "number (minutes)"
  }
}
```

#### `POST /ai/generate/presentation-outline`
Generate presentation outlines and slides.

**Request Body:**
```json
{
  "topic": "string",
  "options": {
    "duration": "short|medium|long",
    "style": "educational|persuasive|informative",
    "slideCount": 10
  }
}
```

### 2. Content Improvement

#### `POST /ai/improve/content`
Improve existing content based on specified criteria.

**Request Body:**
```json
{
  "content": "string",
  "improvement": "grammar|style|tone|expand|summarize",
  "options": {
    "targetLength": "number (optional)",
    "tone": "professional|casual|formal",
    "style": "academic|business|creative"
  }
}
```

#### `POST /ai/translate/content`
Translate content to different languages.

**Request Body:**
```json
{
  "content": "string",
  "targetLanguage": "string",
  "preserveTone": true,
  "options": {
    "formality": "formal|informal",
    "context": "business|academic|casual"
  }
}
```

### 3. Specialized Content Generation

#### `POST /ai/generate/blog-post`
Generate blog posts and articles.

**Request Body:**
```json
{
  "topic": "string",
  "options": {
    "length": "short|medium|long",
    "tone": "professional|casual|academic",
    "targetAudience": "string",
    "keywords": ["string"]
  }
}
```

#### `POST /ai/generate/social-media`
Generate social media content for different platforms.

**Request Body:**
```json
{
  "platform": "twitter|linkedin|instagram|facebook",
  "topic": "string",
  "options": {
    "tone": "professional|casual|engaging",
    "includeHashtags": true,
    "callToAction": "string"
  }
}
```

#### `POST /ai/generate/email`
Generate email content for different purposes.

**Request Body:**
```json
{
  "type": "newsletter|marketing|announcement|follow-up",
  "topic": "string",
  "options": {
    "recipientType": "client|colleague|prospect",
    "tone": "professional|friendly|formal",
    "includeCallToAction": true
  }
}
```

#### `POST /ai/generate/product-description`
Generate product descriptions and marketing copy.

**Request Body:**
```json
{
  "productName": "string",
  "features": ["string"],
  "targetAudience": "string",
  "options": {
    "style": "technical|marketing|casual",
    "length": "short|medium|long"
  }
}
```

### 4. Media Content Generation

#### `POST /ai/generate/image-prompt`
Generate prompts for image generation.

**Request Body:**
```json
{
  "description": "string",
  "style": "realistic|artistic|cartoon|photographic",
  "options": {
    "aspectRatio": "16:9|1:1|4:3",
    "mood": "professional|casual|dramatic"
  }
}
```

#### `POST /ai/generate/video-script`
Generate video scripts and storyboards.

**Request Body:**
```json
{
  "topic": "string",
  "duration": "short|medium|long",
  "style": "educational|entertaining|promotional",
  "options": {
    "includeVisuals": true,
    "targetAudience": "string"
  }
}
```

#### `POST /ai/generate/audio-script`
Generate audio content scripts.

**Request Body:**
```json
{
  "topic": "string",
  "type": "podcast|voiceover|audio-book",
  "duration": 5,
  "options": {
    "tone": "professional|casual|dramatic",
    "includeMusic": true
  }
}
```

## 🤖 AI Chatbot Endpoints

### 1. Conversation Management

#### `POST /ai/chat/conversations`
Create a new conversation.

**Request Body:**
```json
{
  "niche": "string",
  "title": "string (optional)",
  "initialMessage": "string (optional)"
}
```

#### `GET /ai/chat/conversations`
Get user's conversations.

**Query Parameters:**
- `page`: number
- `limit`: number
- `niche`: string (filter by niche)

#### `GET /ai/chat/conversations/{conversationId}`
Get specific conversation with messages.

#### `DELETE /ai/chat/conversations/{conversationId}`
Delete a conversation.

#### `POST /ai/chat/conversations/{conversationId}/messages`
Send a message in a conversation.

**Request Body:**
```json
{
  "content": "string",
  "type": "text|content|followup|social",
  "metadata": {
    "niche": "string",
    "contentType": "string",
    "platform": "string",
    "clientId": "string"
  }
}
```

### 2. AI Response Generation

#### `POST /ai/chat/generate-response`
Generate AI response for chat messages.

**Request Body:**
```json
{
  "message": "string",
  "conversationId": "string",
  "context": {
    "niche": "string",
    "previousMessages": ["string"],
    "userPreferences": {
      "tone": "string",
      "style": "string"
    }
  }
}
```

## 📊 Analytics & Insights

### 1. Content Performance

#### `GET /ai/analytics/content-performance`
Get analytics for generated content.

**Query Parameters:**
- `contentId`: string
- `dateRange`: string
- `metrics`: string[]

**Response:**
```json
{
  "success": true,
  "data": {
    "engagement": {
      "views": 1500,
      "likes": 120,
      "shares": 45,
      "comments": 23
    },
    "performance": {
      "ctr": 0.08,
      "conversionRate": 0.12,
      "bounceRate": 0.35
    },
    "audience": {
      "demographics": {},
      "interests": [],
      "behavior": {}
    }
  }
}
```

#### `GET /ai/analytics/conversation-insights`
Get insights from AI conversations.

**Query Parameters:**
- `conversationId`: string
- `dateRange`: string

### 2. Usage Analytics

#### `GET /ai/analytics/usage`
Get AI usage statistics.

**Query Parameters:**
- `userId`: string
- `dateRange`: string
- `type`: string

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRequests": 150,
    "contentGenerated": 45,
    "conversations": 12,
    "popularFeatures": [
      "content-generation",
      "chat-assistant",
      "translation"
    ],
    "usageByType": {
      "text": 60,
      "image": 25,
      "video": 15
    }
  }
}
```

## 🎯 Training-Specific AI Endpoints

### 1. Training Content Generation

#### `POST /ai/training/generate-module`
Generate complete training modules.

**Request Body:**
```json
{
  "topic": "string",
  "options": {
    "duration": "number (hours)",
    "difficulty": "beginner|intermediate|advanced",
    "format": "video|interactive|document",
    "includeAssessment": true,
    "learningObjectives": ["string"]
  }
}
```

#### `POST /ai/training/generate-exercises`
Generate practical exercises and activities.

**Request Body:**
```json
{
  "topic": "string",
  "options": {
    "type": "individual|group|hands-on",
    "duration": "number (minutes)",
    "difficulty": "beginner|intermediate|advanced",
    "materials": ["string"]
  }
}
```

#### `POST /ai/training/generate-case-studies`
Generate case studies and scenarios.

**Request Body:**
```json
{
  "topic": "string",
  "options": {
    "industry": "string",
    "complexity": "simple|moderate|complex",
    "includeSolutions": true,
    "learningOutcomes": ["string"]
  }
}
```

### 2. Assessment Generation

#### `POST /ai/training/generate-quiz`
Generate quizzes and assessments.

**Request Body:**
```json
{
  "topic": "string",
  "options": {
    "questionCount": 10,
    "types": ["multiple_choice", "true_false", "short_answer"],
    "difficulty": "beginner|intermediate|advanced",
    "timeLimit": "number (minutes)",
    "passingScore": 70
  }
}
```

#### `POST /ai/training/generate-scenarios`
Generate scenario-based assessments.

**Request Body:**
```json
{
  "topic": "string",
  "options": {
    "scenarioCount": 5,
    "complexity": "simple|moderate|complex",
    "includeMultipleChoice": true,
    "includeEssay": true
  }
}
```

## 🔧 Content Management

### 1. Content Library

#### `POST /ai/content/save`
Save generated content to library.

**Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "type": "string",
  "category": "string",
  "tags": ["string"],
  "metadata": {
    "generatedBy": "string",
    "prompt": "string",
    "options": {}
  }
}
```

#### `GET /ai/content/library`
Get saved content from library.

**Query Parameters:**
- `type`: string
- `category`: string
- `status`: string
- `search`: string
- `page`: number
- `limit`: number

#### `PUT /ai/content/{contentId}`
Update saved content.

#### `DELETE /ai/content/{contentId}`
Delete content from library.

### 2. Content Templates

#### `GET /ai/templates`
Get available content templates.

#### `POST /ai/templates`
Create custom content template.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "type": "social|followup|training|assessment",
  "platform": "string",
  "prompt": "string",
  "variables": ["string"]
}
```

## 🎨 Personalization & Preferences

### 1. User Preferences

#### `GET /ai/preferences`
Get user's AI preferences.

#### `PUT /ai/preferences`
Update AI preferences.

**Request Body:**
```json
{
  "defaultTone": "professional|casual|formal",
  "preferredLanguage": "string",
  "contentStyle": "informative|persuasive|narrative",
  "autoSave": true,
  "notifications": {
    "contentReady": true,
    "insights": true
  }
}
```

### 2. Niche Management

#### `GET /ai/niches`
Get available niches and suggestions.

#### `POST /ai/niches`
Set user's primary niche.

**Request Body:**
```json
{
  "niche": "string",
  "description": "string",
  "keywords": ["string"]
}
```

## 📈 Performance & Monitoring

### 1. System Health

#### `GET /ai/health`
Check AI service health.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "models": {
      "gpt-4": "available",
      "dall-e": "available",
      "whisper": "available"
    },
    "responseTime": 2.5,
    "uptime": 99.9
  }
}
```

### 2. Rate Limiting

#### `GET /ai/rate-limits`
Get current rate limit status.

**Response:**
```json
{
  "success": true,
  "data": {
    "requestsPerMinute": 60,
    "requestsPerHour": 1000,
    "currentUsage": {
      "minute": 15,
      "hour": 250
    },
    "resetTime": "2024-01-15T10:30:00Z"
  }
}
```

## 🔐 Security & Authentication

### Required Headers
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
X-Request-ID: {unique_request_id}
```

### Rate Limiting
- **Standard Users**: 60 requests/minute, 1000 requests/hour
- **Premium Users**: 120 requests/minute, 2000 requests/hour
- **Enterprise Users**: 300 requests/minute, 5000 requests/hour

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "retryAfter": 60
  }
}
```

## 📝 Implementation Notes

### 1. Response Format
All endpoints should return responses in the following format:
```json
{
  "success": boolean,
  "data": any,
  "message": "string (optional)",
  "error": "string (optional)",
  "status": number,
  "timestamp": "ISO string"
}
```

### 2. Error Handling
- **400**: Bad Request (invalid parameters)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error
- **503**: Service Unavailable (AI service down)

### 3. Caching
- Cache generated content for 24 hours
- Cache user preferences indefinitely
- Cache templates for 1 hour

### 4. Logging
- Log all AI requests for analytics
- Log errors with full context
- Track usage patterns for optimization

## 🚀 Deployment Considerations

### 1. Environment Variables
```env
AI_SERVICE_URL=https://api.openai.com/v1
AI_API_KEY=your_GRAG_api_key
AI_MODEL=gpt-4
AI_MAX_TOKENS=4000
AI_TEMPERATURE=0.7
AI_RATE_LIMIT_PER_MINUTE=60
AI_RATE_LIMIT_PER_HOUR=1000
```

### 2. Monitoring
- Monitor API response times
- Track error rates
- Monitor token usage
- Alert on service downtime

### 3. Scaling
- Use load balancers for high traffic
- Implement request queuing
- Cache frequently requested content
- Use CDN for static assets

This comprehensive endpoint documentation ensures the backend can fully support all AI functionality in the trainer platform. 