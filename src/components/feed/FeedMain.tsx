import React, { useState, useEffect } from 'react';
import { 
  User, Globe, Image, Video, FileText, 
  MoreHorizontal, X, ThumbsUp, MessageCircle, Share2, Send,
  ChevronDown, Smile, MapPin, Calendar
} from 'lucide-react';
import FeedPost from './FeedPost';
import apiServices from '../../services/apiServices';
import { FeedPost as FeedPostType } from '../../types/feed';

interface FeedMainProps {}

const FeedMain: React.FC<FeedMainProps> = () => {
  const [postContent, setPostContent] = useState('');
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [posts, setPosts] = useState<FeedPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Load feed posts
  useEffect(() => {
    loadFeedPosts();
  }, []);

  const loadFeedPosts = async () => {
    try {
      setLoading(true);
      const response = await apiServices.getFeedPosts({ page: 1, limit: 10 });
      if (response.success) {
        setPosts(response.data || []);
      }
    } catch (error) {
      console.error('Error loading feed posts:', error);
    } finally {
      setLoading(false);
    }
  };

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
          // Reload posts to show the new one
          await loadFeedPosts();
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
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Start a post"
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
              className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </div>
        )}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          Load more posts
        </button>
      </div>
    </div>
  );
};

export default FeedMain;
