import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  MapPin, Calendar, Users, Building2, Clock, 
  Heart, MessageCircle, Share2, Bookmark, 
  ExternalLink, ChevronDown, Filter, Search,
  Briefcase, DollarSign, Star
} from 'lucide-react';
import { JobsFeedHelper } from './jobsFeedHelper';
import { JobsFeedFetcher } from './fetcher';
import { JobsFeedTransformer } from './transformer';
import { JobsFeedProps, JobsFeedState, JobPostItem } from './Types.types';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const JobsFeed: React.FC<JobsFeedProps> = ({ 
  className = '',
  onError,
  onSuccess 
}) => {
  const [state, setState] = useState<JobsFeedState>({
    loading: false,
    error: null,
    filters: {
      search: '',
      location: '',
      jobType: '',
      experience: '',
      salary: ''
    },
    showFilters: false
  });

  const handleError = useCallback((error: Error) => {
    setState(prev => ({ ...prev, error: error.message }));
    onError?.(error);
  }, [onError]);

  const handleSuccess = useCallback((message: string) => {
    onSuccess?.(message);
  }, [onSuccess]);

  // Infinite scroll for jobs using proper fetcher
  const {
    data: jobs,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    loadingRef
  } = useInfiniteScroll<JobPostItem>(
    async (page, limit) => {
      try {
        const result = await JobsFeedFetcher.getJobs({
          page,
          limit,
          filters: state.filters
        });
        return result;
      } catch (error) {
        handleError(error as Error);
        return {
          success: false,
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
          error: (error as Error).message
        };
      }
    },
    { enabled: true }
  );

  const handleFilterChange = useCallback((key: string, value: string) => {
    setState(prev => ({ 
      ...prev, 
      filters: { ...prev.filters, [key]: value }
    }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    refresh();
    setState(prev => ({ ...prev, showFilters: false }));
  }, [refresh]);

  const handleClearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {
        search: '',
        location: '',
        jobType: '',
        experience: '',
        salary: ''
      }
    }));
    refresh();
  }, [refresh]);

  const memoizedJobs = useMemo(() => {
    return JobsFeedTransformer.transformJobs(jobs);
  }, [jobs]);

  const formatSalary = useCallback((salary: any) => {
    return JobsFeedHelper.formatSalary(salary);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return JobsFeedHelper.formatDate(dateString);
  }, []);

  if (loading && jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading jobs...</p>
      </div>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Error loading jobs: {error}</p>
        <button 
          onClick={loadMore}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={`jobs-feed ${className}`}>
      {/* Jobs Feed Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Professional Career Opportunities</h2>
            <p className="text-gray-600 text-sm">Discover your next career move</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setState(prev => ({ ...prev, showFilters: !prev.showFilters }))}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${state.showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs, companies, or keywords..."
            value={state.filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters Panel */}
        {state.showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="City, State"
                  value={state.filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={state.filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <select
                  value={state.filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <select
                  value={state.filters.salary}
                  onChange={(e) => handleFilterChange('salary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Salary</option>
                  <option value="0-50000">$0 - $50k</option>
                  <option value="50000-100000">$50k - $100k</option>
                  <option value="100000-150000">$100k - $150k</option>
                  <option value="150000+">$150k+</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-4">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {memoizedJobs.length > 0 ? (
          <>
            {memoizedJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 font-medium">{job.company?.name || 'Company Name'}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location?.city || 'Location'}, {job.location?.country || 'Country'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span className="capitalize">{job.jobType || 'Full-time'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Bookmark className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Share2 className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                    </button>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-4">
                  <p className="text-gray-700 line-clamp-3">
                    {job.description}
                  </p>
                </div>

                {/* Job Details */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {job.salary && (
                      <div className="flex items-center space-x-1 text-green-600 font-medium">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                    )}
                    {job.experienceLevel && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Star className="w-4 h-4" />
                        <span className="capitalize">{job.experienceLevel}</span>
                      </div>
                    )}
                    {job.requirements?.skills && job.requirements.skills.length > 0 && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{job.requirements.skills.length} skills required</span>
                      </div>
                    )}
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <span>Apply</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Skills Tags */}
                {job.requirements?.skills && job.requirements.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requirements.skills.length > 5 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        +{job.requirements.skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {/* Engagement Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">Save</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {job.analytics?.views || 0} views
                  </div>
                </div>
              </div>
            ))}
            
            {/* Infinite Scroll Loading Indicator */}
            <div ref={loadingRef} className="text-center py-8">
              {loading && jobs.length > 0 && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-500">Loading more jobs...</span>
                </div>
              )}
              
              {!hasMore && jobs.length > 0 && (
                <p className="text-gray-500">You've reached the end of the jobs feed</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No jobs found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { JobsFeed };
export default JobsFeed;
