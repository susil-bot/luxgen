/**
 * FeedPost Unit Tests
 * Test cases for FeedPost module
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { CONSTANTS, validate, utils, formatters, contentProcessors, filters } from './feedPostHelper';
import { fetchers, errorHandlers, fallbackData, retryLogic, cache, batchOperations } from './feedPostFetcher';
import { transformers, businessLogic, mappers, analytics } from './feedPostTransformer';

// Mock API services
jest.mock('../../services/apiServices', () => ({
  getFeedPosts: jest.fn(),
  getFeedPost: jest.fn(),
  createFeedPost: jest.fn(),
  updateFeedPost: jest.fn(),
  deleteFeedPost: jest.fn(),
  likeFeedPost: jest.fn(),
  getFeedPostComments: jest.fn(),
  addFeedPostComment: jest.fn()
}));

describe('FeedPost Module', () => {
  describe('Helper Functions', () => {
    describe('validate', () => {
      it('should validate post content correctly', () => {
        const validContent = 'This is a valid post content.';
        const result = validate.postContent(validContent);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should reject empty post content', () => {
        const result = validate.postContent('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Content is required');
      });

      it('should reject post content exceeding max length', () => {
        const longContent = 'a'.repeat(CONSTANTS.MAX_POST_LENGTH + 1);
        const result = validate.postContent(longContent);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(`Content exceeds ${CONSTANTS.MAX_POST_LENGTH} characters`);
      });

      it('should validate comment content correctly', () => {
        const validComment = 'This is a valid comment.';
        const result = validate.commentContent(validComment);
        expect(result.isValid).toBe(true);
      });

      it('should validate hashtags correctly', () => {
        const validHashtags = ['react', 'javascript', 'webdev'];
        const result = validate.hashtags(validHashtags);
        expect(result.isValid).toBe(true);
      });

      it('should reject too many hashtags', () => {
        const tooManyHashtags = Array(CONSTANTS.MAX_HASHTAGS + 1).fill('tag');
        const result = validate.hashtags(tooManyHashtags);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(`Maximum ${CONSTANTS.MAX_HASHTAGS} hashtags allowed`);
      });

      it('should validate reaction types correctly', () => {
        CONSTANTS.REACTION_TYPES.forEach(reaction => {
          const result = validate.reactionType(reaction);
          expect(result.isValid).toBe(true);
        });
      });

      it('should reject invalid reaction types', () => {
        const result = validate.reactionType('invalid');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid reaction type');
      });
    });

    describe('utils', () => {
      it('should extract hashtags from text', () => {
        const text = 'This is a post about #react and #javascript #webdev';
        const hashtags = utils.extractHashtags(text);
        expect(hashtags).toEqual(['react', 'javascript', 'webdev']);
      });

      it('should extract mentions from text', () => {
        const text = 'Hey @john and @jane, check this out!';
        const mentions = utils.extractMentions(text);
        expect(mentions).toEqual(['john', 'jane']);
      });

      it('should format engagement count correctly', () => {
        expect(utils.formatEngagementCount(1000)).toBe('1.0K');
        expect(utils.formatEngagementCount(1000000)).toBe('1.0M');
        expect(utils.formatEngagementCount(500)).toBe('500');
      });

      it('should calculate engagement rate correctly', () => {
        const rate = utils.calculateEngagementRate(100, 50, 25, 1000);
        expect(rate).toBe('17.5');
      });

      it('should check if post is liked by user', () => {
        const post = {
          likes: [
            { userId: 'user1' },
            { userId: 'user2' }
          ]
        };
        expect(utils.isPostLiked(post, 'user1')).toBe(true);
        expect(utils.isPostLiked(post, 'user3')).toBe(false);
      });

      it('should check if post is saved by user', () => {
        const post = {
          savedBy: ['user1', 'user2']
        };
        expect(utils.isPostSaved(post, 'user1')).toBe(true);
        expect(utils.isPostSaved(post, 'user3')).toBe(false);
      });

      it('should check if user can edit post', () => {
        const post = { author: { userId: 'user1' } };
        expect(utils.canEditPost(post, 'user1')).toBe(true);
        expect(utils.canEditPost(post, 'user2')).toBe(false);
      });

      it('should check if user can delete post', () => {
        const post = { author: { userId: 'user1' } };
        expect(utils.canDeletePost(post, 'user1', 'user')).toBe(true);
        expect(utils.canDeletePost(post, 'user2', 'user')).toBe(false);
        expect(utils.canDeletePost(post, 'user2', 'super_admin')).toBe(true);
      });
    });

    describe('formatters', () => {
      it('should format post date correctly', () => {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const formatted = formatters.formatPostDate(oneHourAgo.toISOString());
        expect(formatted).toBe('1h');
      });

      it('should format post content with hashtags and mentions', () => {
        const content = 'Check out #react and @john!';
        const formatted = formatters.formatPostContent(content);
        expect(formatted).toContain('<span class="hashtag">#react</span>');
        expect(formatted).toContain('<span class="mention">@john</span>');
      });

      it('should format engagement stats correctly', () => {
        const post = {
          engagement: {
            likes: 1000,
            comments: 500,
            shares: 250,
            views: 10000
          }
        };
        const stats = formatters.formatEngagementStats(post);
        expect(stats.totalEngagement).toBe(1750);
        expect(stats.engagementRate).toBe('17.5%');
        expect(stats.formattedLikes).toBe('1.0K');
      });
    });

    describe('contentProcessors', () => {
      it('should process post content correctly', () => {
        const content = 'This is a post about #react and @john!';
        const processed = contentProcessors.processPostContent(content);
        expect(processed.originalContent).toBe(content);
        expect(processed.hashtags).toEqual(['react']);
        expect(processed.mentions).toEqual(['john']);
        expect(processed.wordCount).toBe(8);
        expect(processed.characterCount).toBe(content.length);
      });

      it('should process images correctly', () => {
        const images = ['image1.jpg', 'image2.jpg'];
        const processed = contentProcessors.processImageContent(images);
        expect(processed).toHaveLength(2);
        expect(processed[0].url).toBe('image1.jpg');
        expect(processed[0].alt).toBe('Post image 1');
      });

      it('should process links correctly', () => {
        const links = [
          { url: 'https://example.com', title: 'Example' }
        ];
        const processed = contentProcessors.processLinkContent(links);
        expect(processed).toHaveLength(1);
        expect(processed[0].url).toBe('https://example.com');
        expect(processed[0].title).toBe('Example');
      });
    });

    describe('filters', () => {
      const mockPosts = [
        {
          id: '1',
          visibility: { type: 'public' },
          hashtags: ['react'],
          author: { userId: 'user1' },
          engagement: { likes: 100, comments: 50, shares: 25 }
        },
        {
          id: '2',
          visibility: { type: 'private' },
          hashtags: ['javascript'],
          author: { userId: 'user2' },
          engagement: { likes: 200, comments: 100, shares: 50 }
        }
      ];

      it('should filter posts by visibility', () => {
        const filtered = filters.filterPostsByVisibility(mockPosts, 'user', 'user1');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('1');
      });

      it('should filter posts by hashtag', () => {
        const filtered = filters.filterPostsByHashtag(mockPosts, 'react');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('1');
      });

      it('should filter posts by user', () => {
        const filtered = filters.filterPostsByUser(mockPosts, 'user1');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('1');
      });

      it('should sort posts by engagement', () => {
        const sorted = filters.sortPostsByEngagement(mockPosts);
        expect(sorted[0].id).toBe('2'); // Higher engagement
        expect(sorted[1].id).toBe('1');
      });
    });
  });

  describe('Fetcher Functions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('fetchers', () => {
      it('should fetch posts successfully', async () => {
        const mockResponse = {
          success: true,
          data: [{ id: '1', content: 'Test post' }],
          pagination: { page: 1, total: 1 }
        };
        
        const { getFeedPosts } = require('../../services/apiServices');
        getFeedPosts.mockResolvedValue(mockResponse);

        const result = await fetchers.getPosts();
        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(1);
        expect(result.pagination).toBeDefined();
      });

      it('should handle fetch errors gracefully', async () => {
        const { getFeedPosts } = require('../../services/apiServices');
        getFeedPosts.mockRejectedValue(new Error('Network error'));

        const result = await fetchers.getPosts();
        expect(result.success).toBe(false);
        expect(result.data).toEqual(fallbackData.posts);
        expect(result.error).toBe('Network error');
      });

      it('should create post successfully', async () => {
        const mockResponse = {
          success: true,
          data: { id: '1', content: 'New post' }
        };
        
        const { createFeedPost } = require('../../services/apiServices');
        createFeedPost.mockResolvedValue(mockResponse);

        const result = await fetchers.createPost({ content: 'New post' });
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
      });

      it('should toggle post like successfully', async () => {
        const mockResponse = {
          success: true,
          data: { liked: true, likes: 101 }
        };
        
        const { likeFeedPost } = require('../../services/apiServices');
        likeFeedPost.mockResolvedValue(mockResponse);

        const result = await fetchers.togglePostLike('1', 'like');
        expect(result.success).toBe(true);
        expect(result.data.liked).toBe(true);
      });
    });

    describe('errorHandlers', () => {
      it('should handle fetch errors', () => {
        const error = new Error('Fetch failed');
        const result = errorHandlers.handleFetchError(error, fallbackData.posts);
        expect(result.success).toBe(false);
        expect(result.data).toEqual(fallbackData.posts);
        expect(result.error).toBe('Fetch failed');
      });

      it('should handle network errors', () => {
        const error = new Error('Network error');
        const result = errorHandlers.handleNetworkError(error);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Network error. Please check your connection.');
      });

      it('should handle auth errors', () => {
        const error = new Error('Unauthorized');
        const result = errorHandlers.handleAuthError(error);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Authentication required. Please log in.');
      });
    });

    describe('retryLogic', () => {
      it('should retry on network error', async () => {
        let attemptCount = 0;
        const mockFn = jest.fn().mockImplementation(() => {
          attemptCount++;
          if (attemptCount < 3) {
            throw new Error('Network error');
          }
          return 'success';
        });

        const result = await retryLogic.retryOnNetworkError(mockFn);
        expect(result).toBe('success');
        expect(mockFn).toHaveBeenCalledTimes(3);
      });

      it('should fail after max retries', async () => {
        const mockFn = jest.fn().mockRejectedValue(new Error('Persistent error'));
        
        await expect(retryLogic.retryOnNetworkError(mockFn)).rejects.toThrow('Persistent error');
        expect(mockFn).toHaveBeenCalledTimes(3);
      });
    });

    describe('cache', () => {
      beforeEach(() => {
        cache.clear();
      });

      it('should set and get cached data', () => {
        const data = { posts: [] };
        cache.set('test-key', data);
        const retrieved = cache.get('test-key');
        expect(retrieved).toEqual(data);
      });

      it('should return null for expired cache', () => {
        const data = { posts: [] };
        cache.set('test-key', data, 1); // 1ms TTL
        
        // Wait for expiration
        setTimeout(() => {
          const retrieved = cache.get('test-key');
          expect(retrieved).toBeNull();
        }, 10);
      });
    });

    describe('batchOperations', () => {
      it('should batch like posts', async () => {
        const { likeFeedPost } = require('../../services/apiServices');
        likeFeedPost.mockResolvedValue({ success: true });

        const results = await batchOperations.batchLikePosts(['1', '2', '3']);
        expect(results).toHaveLength(3);
        expect(likeFeedPost).toHaveBeenCalledTimes(3);
      });

      it('should batch delete posts', async () => {
        const { deleteFeedPost } = require('../../services/apiServices');
        deleteFeedPost.mockResolvedValue({ success: true });

        const results = await batchOperations.batchDeletePosts(['1', '2']);
        expect(results).toHaveLength(2);
        expect(deleteFeedPost).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Transformer Functions', () => {
    describe('transformers', () => {
      it('should transform post data correctly', () => {
        const apiPost = {
          id: '1',
          author: { userId: 'user1', name: 'John Doe', title: 'Developer' },
          content: { text: 'Hello world' },
          engagement: { likes: 10, comments: 5, shares: 2, views: 100 },
          visibility: { type: 'public' },
          hashtags: ['react'],
          mentions: ['user2'],
          status: 'published',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        };

        const transformed = transformers.transformPost(apiPost);
        expect(transformed).not.toBeNull();
        expect(transformed!.id).toBe('1');
        expect(transformed!.author.name).toBe('John Doe');
        expect(transformed!.content.text).toBe('Hello world');
        expect(transformed!.engagement.likes).toBe(10);
        expect(transformed!.hashtags).toEqual(['react']);
        expect(transformed!.formattedDate).toBeDefined();
      });

      it('should transform multiple posts correctly', () => {
        const apiPosts = [
          { id: '1', author: { userId: 'user1' }, content: { text: 'Post 1' } },
          { id: '2', author: { userId: 'user2' }, content: { text: 'Post 2' } }
        ];

        const transformed = transformers.transformPosts(apiPosts);
        expect(transformed).not.toBeNull();
        expect(transformed).toHaveLength(2);
        if (transformed) {
          expect(transformed[0].id).toBe('1');
          expect(transformed[1].id).toBe('2');
        }
      });

      it('should transform comment data correctly', () => {
        const apiComment = {
          id: '1',
          postId: 'post1',
          author: { userId: 'user1', name: 'John' },
          content: 'Great post!',
          engagement: { likes: 5, replies: 2 },
          createdAt: '2023-01-01T00:00:00Z'
        };

        const transformed = transformers.transformComment(apiComment);
        expect(transformed.id).toBe('1');
        expect(transformed.postId).toBe('post1');
        expect(transformed.content).toBe('Great post!');
        expect(transformed.engagement.likes).toBe(5);
      });
    });

    describe('businessLogic', () => {
      const mockPost = {
        author: { userId: 'user1' },
        visibility: { type: 'public' }
      };

      it('should determine user interaction permissions', () => {
        expect(businessLogic.canUserInteract(mockPost, 'user1', 'user')).toBe(true);
        expect(businessLogic.canUserInteract(mockPost, 'user2', 'user')).toBe(true);
        expect(businessLogic.canUserInteract(mockPost, 'user2', 'guest')).toBe(false);
      });

      it('should calculate engagement score correctly', () => {
        const post = {
          engagement: { likes: 100, comments: 50, shares: 25, views: 1000 }
        };
        const score = businessLogic.calculateEngagementScore(post);
        expect(score.totalEngagement).toBe(175);
        expect(score.engagementRate).toBe(17.5);
        expect(score.weightedScore).toBe(200); // 100 + 50*2 + 25*3
      });

      it('should calculate post priority correctly', () => {
        const post = {
          createdAt: new Date().toISOString(),
          engagement: { likes: 100, comments: 50, shares: 25, views: 1000 },
          hashtags: ['react']
        };
        const userPreferences = { interests: ['react'] };
        
        const priority = businessLogic.calculatePostPriority(post, userPreferences);
        expect(priority).toBeGreaterThan(0);
      });
    });

    describe('mappers', () => {
      const mockPost = {
        id: '1',
        content: { text: 'Test post' },
        engagement: { likes: 10 }
      };

      it('should map post for feed view', () => {
        const mapped = mappers.mapPostForFeed(mockPost);
        expect(mapped.displayType).toBe('feed');
        expect(mapped.showFullContent).toBe(true);
        expect(mapped.showEngagement).toBe(true);
      });

      it('should map post for detail view', () => {
        const mapped = mappers.mapPostForDetail(mockPost);
        expect(mapped.displayType).toBe('detail');
        expect(mapped.showComments).toBe(true);
      });

      it('should map post for profile view', () => {
        const mapped = mappers.mapPostForProfile(mockPost);
        expect(mapped.displayType).toBe('profile');
        expect(mapped.showActions).toBe(false);
      });

      it('should map post for editing', () => {
        const mapped = mappers.mapPostForEdit(mockPost);
        expect(mapped.id).toBe('1');
        expect(mapped.content).toBe('Test post');
      });

      it('should map post for creation', () => {
        const formData = {
          content: 'New post about #react',
          visibility: 'public',
          images: [],
          videos: [],
          links: []
        };
        
        const mapped = mappers.mapPostForCreate(formData);
        expect(mapped.content.text).toBe('New post about #react');
        expect(mapped.visibility.type).toBe('public');
        expect(mapped.hashtags).toContain('react');
      });
    });

    describe('analytics', () => {
      it('should calculate post metrics correctly', () => {
        const post = {
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          engagement: { likes: 100, comments: 50, shares: 25, views: 1000 }
        };
        
        const metrics = analytics.calculatePostMetrics(post);
        expect(metrics.engagementScore.totalEngagement).toBe(175);
        expect(metrics.hoursSincePost).toBeCloseTo(2, 1);
        expect(metrics.engagementPerHour).toBeCloseTo(87.5, 1);
      });

      it('should calculate user engagement metrics', () => {
        const posts = [
          { engagement: { likes: 100, comments: 50, shares: 25, views: 1000 } },
          { engagement: { likes: 200, comments: 100, shares: 50, views: 2000 } }
        ];
        
        const metrics = analytics.calculateUserEngagement(posts);
        expect(metrics.totalPosts).toBe(2);
        expect(metrics.totalEngagement).toBe(525); // 175 + 350
        expect(metrics.avgEngagement).toBe(262.5);
      });
    });
  });
});
