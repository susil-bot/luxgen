import React, { useState, useCallback } from 'react';
import { 
  Plus, Edit, Trash2, Heart, MessageCircle, Share2, Bookmark, 
  Briefcase, MapPin, Clock, Users, Calendar, Tag,
  AlertCircle, Loader2, Filter, Search, Star,
  Building, GraduationCap, DollarSign
} from 'lucide-react';
import { JobPostHelper } from './jobPostHelper';
import { JobPostFetcher } from './fetcher';
import { JobPostTransformer } from './transformer';
import { JobPostProps, JobPostItem, CreateJobPostData } from './Types.types';
import { JOB_POST_CONSTANTS } from './CONSTANTS';
import { Button } from '../common/SimpleThemeComponents';
import JobPostForm from './JobPostForm';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

/**
 * JobPost Component - Standardized Structure
 * Follows LuxGen rules: Clean, modular, well-structured
 */
const JobPost: React.FC<JobPostProps> = ({ 
  className = '',
  onError,
  user,
  isAdmin = false,
  isSuperAdmin = false,
  isTrainer = false,
  ...props 
}) => {
  // State management
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    location: 'all',
    type: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJobPost, setSelectedJobPost] = useState<JobPostItem | null>(null);

  // Infinite scroll for job posts
  const {
    data: jobPosts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    loadingRef
  } = useInfiniteScroll<JobPostItem>(
    async (page: number, limit: number) => {
      const response = await JobPostFetcher.getJobPosts({ 
        page, 
        limit, 
        filters,
        search: searchQuery 
      });
      return {
        success: response.success,
        data: response.data?.jobPosts || [],
        total: response.data?.total || 0,
        error: response.error
      };
    }
  );

  // Error handling
  const handleError = useCallback((error: Error) => {
    console.error('JobPost Error:', error);
    onError?.(error);
  }, [onError]);

  // Job post operations
  const handleCreateJobPost = useCallback(async (jobPostData: CreateJobPostData) => {
    try {
      console.log('Creating job post with data:', jobPostData);
      const result = await JobPostFetcher.createJobPost(jobPostData);
      
      if (result.success && result.data) {
        setShowCreateModal(false);
        await refresh();
      } else {
        throw new Error(result.error || 'Failed to create job post');
      }
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError, refresh]);

  const handleUpdateJobPost = useCallback(async (id: string, jobPostData: Partial<CreateJobPostData>) => {
    try {
      const transformedData = JobPostTransformer.transformFormDataToBackend(jobPostData);
      const result = await JobPostFetcher.updateJobPost(id, transformedData);
      
      if (result.success && result.data) {
        setShowEditModal(false);
        setSelectedJobPost(null);
        await refresh();
      } else {
        throw new Error(result.error || 'Failed to update job post');
      }
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError, refresh]);

  const handleDeleteJobPost = useCallback(async (id: string) => {
    try {
      const result = await JobPostFetcher.deleteJobPost(id);
      
      if (result.success) {
        await refresh();
      } else {
        throw new Error(result.error || 'Failed to delete job post');
      }
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError, refresh]);

  const handleLikeJobPost = useCallback(async (id: string) => {
    try {
      await JobPostFetcher.likeJobPost(id);
      await refresh();
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError, refresh]);

  const handleCommentJobPost = useCallback(async (id: string, comment: string) => {
    try {
      await JobPostFetcher.commentJobPost(id, comment);
      await refresh();
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError, refresh]);

  const handleShareJobPost = useCallback(async (id: string) => {
    try {
      await JobPostFetcher.shareJobPost(id);
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError]);

  // Filter handlers
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Check if user can manage job posts
  const canManageJobPosts = isAdmin || isSuperAdmin || isTrainer;

  // Render loading state
  if (loading && !jobPosts?.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading job posts...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-600">Error loading job posts: {error}</span>
      </div>
    );
  }

  return (
    <div className={`job-post-component ${className}`}>
      {/* Admin Header - Only show for admins/trainers */}
      {canManageJobPosts && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Professional Career Opportunities</h2>
              <p className="text-sm text-gray-600">Admin Access - Post New Job</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search job posts..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Button
            onClick={() => setFilters({ status: 'all', department: 'all', location: 'all', type: 'all' })}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        <div className="flex gap-4">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Job Posts List */}
      <div className="space-y-4">
        {jobPosts?.map((jobPost) => (
          <div key={jobPost._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{jobPost.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{jobPost.company.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{jobPost.location.city}, {jobPost.location.country}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{jobPost.jobType}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{jobPost.description}</p>
              </div>
              
              {canManageJobPosts && (
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => {
                      setSelectedJobPost(jobPost);
                      setShowEditModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteJobPost(jobPost._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Button
                  onClick={() => handleLikeJobPost(jobPost._id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-600"
                >
                  <Heart className="h-4 w-4" />
                  <span>0</span>
                </Button>
                <Button
                  onClick={() => handleCommentJobPost(jobPost._id, 'Great opportunity!')}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>0</span>
                </Button>
                <Button
                  onClick={() => handleShareJobPost(jobPost._id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                <Button className="flex items-center gap-1 text-gray-600 hover:text-yellow-600">
                  <Bookmark className="h-4 w-4" />
                  <span>Save</span>
                </Button>
              </div>
              
              <div className="text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                {new Date(jobPost.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Infinite Scroll Loading */}
      {loading && jobPosts?.length > 0 && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading more...</span>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={loadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Load More Jobs
          </Button>
        </div>
      )}

      {/* Create Job Post Modal */}
      {showCreateModal && (
        <JobPostForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateJobPost}
        />
      )}

      {/* Edit Job Post Modal */}
      {showEditModal && selectedJobPost && (
        <JobPostForm
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedJobPost(null);
          }}
          onSubmit={(data) => handleUpdateJobPost(selectedJobPost._id, data)}
          editingJobPost={selectedJobPost}
        />
      )}
    </div>
  );
};

export { JobPost };
export default JobPost;