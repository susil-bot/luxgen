/**
 * Job Board Component
 * LinkedIn-style job board for viewing and applying to jobs
 */

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, MapPin, Clock, DollarSign, Building, Users,
  Star, Bookmark, Share2, Eye, Calendar, Briefcase, GraduationCap,
  Award, TrendingUp, Target, Zap, Heart, MessageCircle, Send,
  ChevronDown, ChevronUp, X, Plus, Grid, List, SortAsc, SortDesc
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiServices from '../../services/apiServices';
import { toast } from 'react-hot-toast';

interface Job {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
    size?: string;
    industry?: string;
    location: {
      city: string;
      state: string;
      country: string;
      remote: boolean;
    };
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
    remote: boolean;
    hybrid: boolean;
  };
  requirements: {
    skills: string[];
    education: {
      level: string;
      field?: string;
    };
    experience: {
      years: number;
      description: string;
    };
  };
  benefits: string[];
  perks: string[];
  tags: string[];
  featured: boolean;
  urgent: boolean;
  analytics: {
    views: number;
    applications: number;
  };
  postedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  publishedAt: string;
  expiresAt?: string;
}

interface JobFilters {
  search: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  remote: boolean;
  salaryMin: string;
  salaryMax: string;
  company: string;
  skills: string;
}

const JobBoard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    remote: false,
    salaryMin: '',
    salaryMax: '',
    company: '',
    skills: ''
  });
  const [sortBy, setSortBy] = useState<'createdAt' | 'salary' | 'title' | 'company'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Load jobs
  const loadJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('jobType', filters.jobType);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
      if (filters.remote) params.append('remote', 'true');
      if (filters.salaryMin) params.append('salaryMin', filters.salaryMin);
      if (filters.salaryMax) params.append('salaryMax', filters.salaryMax);
      if (filters.company) params.append('company', filters.company);
      if (filters.skills) params.append('skills', filters.skills);
      
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await apiServices.getJobs(params);
      
      if (response.success) {
        setJobs(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Apply for job
  const applyForJob = async (jobId: string, coverLetter?: string) => {
    try {
      const response = await apiServices.applyForJob(jobId, {
        coverLetter
      });
      
      if (response.success) {
        toast.success('Application submitted successfully!');
        setShowJobModal(false);
        setSelectedJob(null);
      }
    } catch (error) {
      console.error('Failed to apply for job:', error);
      toast.error('Failed to apply for job');
    }
  };

  // Bookmark job
  const bookmarkJob = async (jobId: string) => {
    try {
      // TODO: Implement bookmark functionality
      toast.success('Job bookmarked!');
    } catch (error) {
      console.error('Failed to bookmark job:', error);
      toast.error('Failed to bookmark job');
    }
  };

  // Share job
  const shareJob = async (job: Job) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: job.shortDescription || job.description,
          url: window.location.href
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Job link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share job:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof JobFilters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      remote: false,
      salaryMin: '',
      salaryMax: '',
      company: '',
      skills: ''
    });
  };

  // Get job type color
  const getJobTypeColor = (jobType: string) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-yellow-100 text-yellow-800',
      'freelance': 'bg-orange-100 text-orange-800'
    };
    return colors[jobType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Get experience level color
  const getExperienceColor = (level: string) => {
    const colors = {
      'entry': 'bg-green-100 text-green-800',
      'junior': 'bg-blue-100 text-blue-800',
      'mid': 'bg-yellow-100 text-yellow-800',
      'senior': 'bg-orange-100 text-orange-800',
      'lead': 'bg-red-100 text-red-800',
      'executive': 'bg-purple-100 text-purple-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    loadJobs();
  }, [filters, sortBy, sortOrder, pagination.page]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
              <p className="text-gray-600 mt-1">Find your next career opportunity</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear all
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Job title, company, keywords..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="City, state, country..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              {/* Remote Work */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remote Work</span>
                </label>
              </div>

              {/* Salary Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.salaryMin}
                    onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="number"
                    value={filters.salaryMax}
                    onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:w-3/4">
            {/* Sort and View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {pagination.total} jobs found
                </span>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="createdAt">Date Posted</option>
                    <option value="salary">Salary</option>
                    <option value="title">Job Title</option>
                    <option value="company">Company</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Jobs Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
                      viewMode === 'list' ? 'p-6' : 'p-6'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {job.title}
                          </h3>
                          {job.featured && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Featured
                            </span>
                          )}
                          {job.urgent && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building className="h-4 w-4 mr-1" />
                          <span className="text-sm">{job.company.name}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {job.location.city}, {job.location.state} {job.location.country}
                            {job.location.remote && ' • Remote'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => bookmarkJob(job._id)}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                          <Bookmark className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => shareJob(job)}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {job.shortDescription || job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobTypeColor(job.jobType)}`}>
                        {job.jobType.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExperienceColor(job.experienceLevel)}`}>
                        {job.experienceLevel}
                      </span>
                      {job.salary && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{job.analytics.views} views</span>
                        <span className="mx-2">•</span>
                        <Users className="h-4 w-4 mr-1" />
                        <span>{job.analytics.applications} applications</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowJobModal(true);
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedJob.title}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building className="h-5 w-5 mr-2" />
                    <span>{selectedJob.company.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>
                      {selectedJob.location.city}, {selectedJob.location.state} {selectedJob.location.country}
                      {selectedJob.location.remote && ' • Remote'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedJob.description}
                      </p>
                    </div>
                  </div>

                  {selectedJob.requirements && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                      <div className="space-y-3">
                        {selectedJob.requirements.skills && selectedJob.requirements.skills.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedJob.requirements.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedJob.requirements.experience && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                            <p className="text-gray-700">
                              {selectedJob.requirements.experience.years} years: {selectedJob.requirements.experience.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedJob.benefits.map((benefit, index) => (
                          <li key={index} className="text-gray-700">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">
                          {selectedJob.jobType.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">
                          {selectedJob.experienceLevel} level
                        </span>
                      </div>
                      {selectedJob.salary && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">
                            ${selectedJob.salary.min.toLocaleString()} - ${selectedJob.salary.max.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">
                          Posted {new Date(selectedJob.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => applyForJob(selectedJob._id)}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => bookmarkJob(selectedJob._id)}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Bookmark className="h-4 w-4 inline mr-2" />
                      Bookmark
                    </button>
                    <button
                      onClick={() => shareJob(selectedJob)}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4 inline mr-2" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
