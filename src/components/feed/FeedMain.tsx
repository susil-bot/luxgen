import React, { useState, useEffect } from 'react';
import { 
  User, Globe, Image, Video, FileText, 
  MoreHorizontal, X, ThumbsUp, MessageCircle, Share2, Send,
  ChevronDown, Smile, MapPin, Calendar, Briefcase
} from 'lucide-react';
import FeedPost from './FeedPost';
import { JobPost } from '../jobpost';
import JobsFeed from '../jobsfeed';
import { apiServices } from '../../core/api/ApiService';
import { FeedPost as FeedPostType } from '../../types/feed';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface FeedMainProps {}

const FeedMain: React.FC<FeedMainProps> = () => {
  const [postContent, setPostContent] = useState('');
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Mock user data - in real app, this would come from context
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@luxgen.com',
    avatar: '',
    role: 'admin' as const,
    department: 'Engineering',
    position: 'Senior Developer',
    isActive: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Infinite scroll for feed posts
  const {
    data: posts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    loadingRef
  } = useInfiniteScroll<FeedPostType>(
    async (page, limit) => {
      const response = await apiServices.getFeedPosts({ page, limit });
      return response;
    },
    { enabled: true }
  );

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim() && !creating) {
      try {
        setCreating(true);
        const response = await apiServices.createFeedPost({
          content: { text: postContent },
          visibility: { type: 'public' }
        });
        
        if (response.success) {
          setPostContent('');
          // Refresh the feed to show the new post
          await refresh();
        }
      } catch (error) {
        console.error('Error creating post:', error);
      } finally {
        setCreating(false);
      }
    }
  };


  return (
    <div className="space-y-6">
      {/* Start a Post Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <form onSubmit={handlePostSubmit}>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your thoughts with the LuxGen community..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* Post Options */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
              >
                <Image className="w-5 h-5" />
                <span className="text-sm">Photo</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
              >
                <Video className="w-5 h-5" />
                <span className="text-sm">Video</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm">Write article</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={creating || !postContent.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {creating ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {loading && posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <FeedPost key={post.id} post={post} />
            ))}
            
            {/* Infinite Scroll Loading Indicator */}
            <div ref={loadingRef} className="text-center py-8">
              {loading && posts.length > 0 && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-500">Loading more posts...</span>
                </div>
              )}
              
              {!hasMore && posts.length > 0 && (
                <p className="text-gray-500">You've reached the end of the feed</p>
              )}
              
              {error && (
                <div className="text-center">
                  <p className="text-red-500 mb-2">Error loading posts: {error}</p>
                  <button 
                    onClick={loadMore}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </div>
        )}
      </div>

      {/* Jobs Feed Section */}
      <JobsFeed
        onError={(error: any) => console.error('JobsFeed Error:', error)}
        onSuccess={(message: any) => console.log('JobsFeed Success:', message)}
      />
    </div>
  );
};

export default FeedMain;
