# FeedPost Module

## Overview
The FeedPost module provides comprehensive functionality for managing social feed posts, including creation, editing, engagement, and analytics. It follows a structured approach with separate files for helpers, fetchers, transformers, and tests.

## Files
- `FeedPost.tsx` - Main component for displaying individual posts
- `FeedPostHelper.js` - Utility functions, validation, and formatting
- `FeedPostFetcher.js` - API calls and data fetching
- `FeedPostTransformer.js` - Data transformation and business logic
- `FeedPost.spec.js` - Unit tests for all module functions

## Usage

### Basic Post Display
```jsx
import FeedPost from './FeedPost';

<FeedPost 
  post={postData}
  onLike={handleLike}
  onComment={handleComment}
  onShare={handleShare}
/>
```

### Post Creation
```javascript
import { fetchers } from './FeedPostFetcher';
import { mappers } from './FeedPostTransformer';

const postData = {
  content: 'Hello world! #react #javascript',
  visibility: 'public',
  images: [],
  videos: [],
  links: []
};

const mappedData = mappers.mapPostForCreate(postData);
const result = await fetchers.createPost(mappedData);
```

### Post Engagement
```javascript
import { fetchers } from './FeedPostFetcher';

// Like a post
await fetchers.togglePostLike(postId, 'like');

// Add a comment
await fetchers.addPostComment(postId, {
  content: 'Great post!'
});

// Share a post
await fetchers.sharePost(postId, {
  message: 'Check this out!'
});
```

## Props

### FeedPost Component
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| post | object | Yes | Post data object |
| onLike | function | No | Callback for like action |
| onComment | function | No | Callback for comment action |
| onShare | function | No | Callback for share action |
| onEdit | function | No | Callback for edit action |
| onDelete | function | No | Callback for delete action |
| showActions | boolean | No | Show action buttons (default: true) |
| showComments | boolean | No | Show comments section (default: false) |

### Post Data Structure
```javascript
{
  id: string,
  author: {
    userId: string,
    name: string,
    title: string,
    avatar: string,
    verified: boolean
  },
  content: {
    text: string,
    images: string[],
    videos: string[],
    links: object[]
  },
  engagement: {
    likes: number,
    comments: number,
    shares: number,
    views: number
  },
  visibility: {
    type: 'public' | 'connections' | 'private',
    audience: string[]
  },
  hashtags: string[],
  mentions: string[],
  status: 'published' | 'draft' | 'archived' | 'deleted',
  createdAt: string,
  updatedAt: string
}
```

## Methods

### Helper Functions
| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| validate.postContent | (content) | {isValid, error} | Validate post content |
| validate.commentContent | (content) | {isValid, error} | Validate comment content |
| validate.hashtags | (hashtags) | {isValid, error} | Validate hashtags array |
| validate.mentions | (mentions) | {isValid, error} | Validate mentions array |
| utils.extractHashtags | (text) | string[] | Extract hashtags from text |
| utils.extractMentions | (text) | string[] | Extract mentions from text |
| utils.formatEngagementCount | (count) | string | Format engagement count |
| utils.calculateEngagementRate | (likes, comments, shares, views) | string | Calculate engagement rate |
| formatters.formatPostDate | (dateString) | string | Format post date |
| formatters.formatPostContent | (content) | string | Format post content with links |

### Fetcher Functions
| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| fetchers.getPosts | (params) | {success, data, pagination} | Get all posts |
| fetchers.getPost | (postId) | {success, data} | Get single post |
| fetchers.createPost | (postData) | {success, data} | Create new post |
| fetchers.updatePost | (postId, postData) | {success, data} | Update post |
| fetchers.deletePost | (postId) | {success, data} | Delete post |
| fetchers.togglePostLike | (postId, reactionType) | {success, data} | Like/unlike post |
| fetchers.getPostComments | (postId, params) | {success, data, pagination} | Get post comments |
| fetchers.addPostComment | (postId, commentData) | {success, data} | Add comment to post |
| fetchers.sharePost | (postId, shareData) | {success, data} | Share post |
| fetchers.togglePostSave | (postId) | {success, data} | Save/unsave post |

### Transformer Functions
| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| transformers.transformPost | (apiPost) | object | Transform API post to component format |
| transformers.transformPosts | (apiPosts) | object[] | Transform multiple posts |
| transformers.transformComment | (apiComment) | object | Transform API comment to component format |
| businessLogic.canUserInteract | (post, userId, userRole) | boolean | Check if user can interact with post |
| businessLogic.canUserEdit | (post, userId, userRole) | boolean | Check if user can edit post |
| businessLogic.canUserDelete | (post, userId, userRole) | boolean | Check if user can delete post |
| businessLogic.calculateEngagementScore | (post) | object | Calculate post engagement score |
| mappers.mapPostForFeed | (post) | object | Map post for feed view |
| mappers.mapPostForDetail | (post) | object | Map post for detail view |
| mappers.mapPostForProfile | (post) | object | Map post for profile view |

## Examples

### Creating a Post
```javascript
import { fetchers } from './FeedPostFetcher';
import { mappers } from './FeedPostTransformer';
import { validate } from './FeedPostHelper';

const createPost = async (formData) => {
  // Validate content
  const validation = validate.postContent(formData.content);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Map data for API
  const mappedData = mappers.mapPostForCreate(formData);
  
  // Create post
  const result = await fetchers.createPost(mappedData);
  
  if (result.success) {
    console.log('Post created successfully:', result.data);
  } else {
    console.error('Failed to create post:', result.error);
  }
};
```

### Liking a Post
```javascript
import { fetchers } from './FeedPostFetcher';

const likePost = async (postId, isLiked) => {
  const result = await fetchers.togglePostLike(postId, 'like');
  
  if (result.success) {
    console.log('Post liked:', result.data);
  } else {
    console.error('Failed to like post:', result.error);
  }
};
```

### Adding a Comment
```javascript
import { fetchers } from './FeedPostFetcher';
import { validate } from './FeedPostHelper';

const addComment = async (postId, commentText) => {
  // Validate comment
  const validation = validate.commentContent(commentText);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const result = await fetchers.addPostComment(postId, {
    content: commentText
  });
  
  if (result.success) {
    console.log('Comment added:', result.data);
  } else {
    console.error('Failed to add comment:', result.error);
  }
};
```

### Filtering Posts
```javascript
import { filters } from './FeedPostHelper';
import { transformers } from './FeedPostTransformer';

const filterPosts = (posts, userId, userRole) => {
  // Transform posts
  const transformedPosts = transformers.transformPosts(posts);
  
  // Filter by user permissions
  const filteredPosts = filters.filterPostsByVisibility(transformedPosts, userRole, userId);
  
  // Sort by engagement
  const sortedPosts = filters.sortPostsByEngagement(filteredPosts);
  
  return sortedPosts;
};
```

### Calculating Analytics
```javascript
import { analytics } from './FeedPostTransformer';

const calculatePostAnalytics = (post) => {
  const metrics = analytics.calculatePostMetrics(post);
  
  console.log('Engagement Score:', metrics.engagementScore);
  console.log('Hours Since Post:', metrics.hoursSincePost);
  console.log('Engagement Per Hour:', metrics.engagementPerHour);
  console.log('Is Trending:', metrics.isTrending);
  console.log('Is Viral:', metrics.isViral);
  
  return metrics;
};
```

## API

### Endpoints
- `GET /api/feed` - Get all posts
- `GET /api/feed/:id` - Get single post
- `POST /api/feed` - Create new post
- `PUT /api/feed/:id` - Update post
- `DELETE /api/feed/:id` - Delete post
- `POST /api/feed/:id/like` - Like/unlike post
- `GET /api/feed/:id/comments` - Get post comments
- `POST /api/feed/:id/comments` - Add comment to post
- `POST /api/feed/:id/share` - Share post
- `POST /api/feed/:id/save` - Save/unsave post

### Request/Response Examples

#### Create Post
```javascript
// Request
POST /api/feed
{
  "content": {
    "text": "Hello world! #react #javascript",
    "images": [],
    "videos": [],
    "links": []
  },
  "visibility": {
    "type": "public",
    "audience": []
  },
  "hashtags": ["react", "javascript"],
  "mentions": [],
  "status": "published"
}

// Response
{
  "success": true,
  "data": {
    "id": "post-123",
    "author": { ... },
    "content": { ... },
    "engagement": { ... },
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Like Post
```javascript
// Request
POST /api/feed/post-123/like
{
  "reactionType": "like"
}

// Response
{
  "success": true,
  "data": {
    "liked": true,
    "likes": 101,
    "reactionType": "like"
  }
}
```

## Testing

### Running Tests
```bash
npm test FeedPost.spec.js
```

### Test Coverage
- Helper function validation
- Fetcher function API calls
- Transformer function data mapping
- Error handling scenarios
- Edge cases and boundary conditions

### Test Examples
```javascript
import { validate, utils, formatters } from './FeedPostHelper';

describe('FeedPost Helper', () => {
  it('should validate post content', () => {
    const result = validate.postContent('Valid content');
    expect(result.isValid).toBe(true);
  });

  it('should format engagement count', () => {
    expect(utils.formatEngagementCount(1000)).toBe('1.0K');
  });

  it('should format post date', () => {
    const date = new Date(Date.now() - 60 * 60 * 1000);
    expect(formatters.formatPostDate(date.toISOString())).toBe('1h');
  });
});
```

## Error Handling

### Common Errors
- **Validation Errors**: Invalid content, hashtags, or mentions
- **Network Errors**: API connection issues
- **Authentication Errors**: User not logged in
- **Permission Errors**: User not authorized to perform action

### Error Response Format
```javascript
{
  "success": false,
  "data": null,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Performance Considerations

### Optimization Tips
- Use pagination for large post lists
- Implement caching for frequently accessed posts
- Use batch operations for multiple actions
- Optimize image loading and processing
- Implement lazy loading for comments

### Caching Strategy
```javascript
import { cache } from './FeedPostFetcher';

// Cache posts for 5 minutes
cache.set('posts-page-1', postsData, 300000);

// Retrieve cached data
const cachedPosts = cache.get('posts-page-1');
```

## Security

### Content Validation
- Maximum post length: 2000 characters
- Maximum comment length: 500 characters
- Maximum hashtags: 10
- Maximum mentions: 5
- HTML sanitization for user content

### Permission Checks
- User can only edit/delete their own posts
- Super admin can edit/delete any post
- Visibility rules enforced for post access
- Rate limiting for API calls

## Troubleshooting

### Common Issues

#### Posts Not Loading
- Check API endpoint configuration
- Verify authentication status
- Check network connectivity
- Review error logs

#### Validation Errors
- Ensure content meets length requirements
- Check hashtag and mention formats
- Verify required fields are present

#### Performance Issues
- Implement pagination
- Use caching strategies
- Optimize database queries
- Monitor API response times

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'FeedPost:*');

// Check cache status
console.log('Cache status:', cache.postsCache.size);
```

## Contributing

### Adding New Features
1. Update helper functions in `FeedPostHelper.js`
2. Add API calls in `FeedPostFetcher.js`
3. Implement transformations in `FeedPostTransformer.js`
4. Write tests in `FeedPost.spec.js`
5. Update documentation in `README.md`

### Code Style
- Use consistent naming conventions
- Add JSDoc comments for functions
- Write comprehensive tests
- Follow error handling patterns
- Document API changes

## Changelog

### Version 1.0.0
- Initial implementation
- Basic post CRUD operations
- Engagement features (like, comment, share)
- Content validation and formatting
- Comprehensive testing suite
- Full documentation
