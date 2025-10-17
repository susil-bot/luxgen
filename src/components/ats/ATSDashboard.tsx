/**
 * ATS Dashboard Component
 * Applicant Tracking System dashboard for trainers/recruiters
 */

import React, { useState, useEffect } from 'react';
import {
  Users, Briefcase, TrendingUp, Eye, Star, Filter, Search,
  Calendar, Clock, Award, Target, Zap, Heart, MessageCircle,
  ChevronDown, ChevronUp, X, Plus, Grid, List, SortAsc, SortDesc,
  Download, Share2, Bookmark, MoreVertical, Edit, Trash2,
  CheckCircle, XCircle, AlertCircle, Info, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiServices } from '../../core/api/ApiService';
import { toast } from 'react-hot-toast';

interface Candidate {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
  };
  professionalSummary: {
    headline: string;
    summary: string;
    currentStatus: string;
    openToWork: boolean;
  };
  experience: Array<{
    company: {
      name: string;
    };
    position: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
  }>;
  skills: {
    technical: Array<{
      name: string;
      level: string;
      years: number;
    }>;
  };
  analytics: {
    profileViews: number;
    lastActive: string;
    profileCompleteness: number;
  };
  atsData: {
    overallScore: number;
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    aiInsights: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
    quality: string;
  };
  status: string;
  createdAt: string;
}

interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    company: {
      name: string;
    };
  };
  candidateId: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  process: {
    appliedAt: string;
    reviewedAt?: string;
    shortlistedAt?: string;
    interviewedAt?: string;
  };
  atsData: {
    score: number;
    ranking: number;
    screening: {
      passed: boolean;
      score: number;
    };
    aiAnalysis: {
      skillsMatch: number;
      experienceMatch: number;
      overallFit: number;
    };
    priority: string;
  };
  createdAt: string;
}

interface DashboardStats {
  applications: {
    total: number;
    byStatus: Array<{
      _id: string;
      count: number;
    }>;
  };
  candidates: {
    total: number;
    active: number;
  };
  recentActivity: Application[];
  topSkills: Array<{
    _id: string;
    count: number;
  }>;
}

const ATSDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'applications'>('overview');
  
  // Filters
  const [candidateFilters, setCandidateFilters] = useState({
    search: '',
    skills: '',
    experience: '',
    location: '',
    status: 'active'
  });
  const [applicationFilters, setApplicationFilters] = useState({
    status: '',
    jobId: '',
    candidateId: ''
  });

  // Pagination
  const [candidatePagination, setCandidatePagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [applicationPagination, setApplicationPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Load dashboard stats
  const loadStats = async () => {
    try {
      const response = await apiServices.getATSDashboard();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  // Load candidates
  const loadCandidates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (candidateFilters.search) params.append('search', candidateFilters.search);
      if (candidateFilters.skills) params.append('skills', candidateFilters.skills);
      if (candidateFilters.experience) params.append('experience', candidateFilters.experience);
      if (candidateFilters.location) params.append('location', candidateFilters.location);
      if (candidateFilters.status) params.append('status', candidateFilters.status);
      
      params.append('page', candidatePagination.page.toString());
      params.append('limit', candidatePagination.limit.toString());

      const response = await apiServices.getCandidates(params);
      
      if (response.success) {
        setCandidates(response.data);
        if (response.pagination) {
          setCandidatePagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to load candidates:', error);
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  // Load applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (applicationFilters.status) params.append('status', applicationFilters.status);
      if (applicationFilters.jobId) params.append('jobId', applicationFilters.jobId);
      if (applicationFilters.candidateId) params.append('candidateId', applicationFilters.candidateId);
      
      params.append('page', applicationPagination.page.toString());
      params.append('limit', applicationPagination.limit.toString());

      const response = await apiServices.getApplications(params);
      
      if (response.success) {
        setApplications(response.data);
        if (response.pagination) {
          setApplicationPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Request access to candidate information
  const requestCandidateAccess = async (candidateId: string, reason: string) => {
    try {
      const response = await apiServices.requestCandidateAccess(candidateId, reason);
      
      if (response.success) {
        toast.success('Access request submitted successfully');
      }
    } catch (error) {
      console.error('Failed to request candidate access:', error);
      toast.error('Failed to request candidate access');
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    try {
      const response = await apiServices.updateApplicationStatus(applicationId, status, notes);
      
      if (response.success) {
        toast.success('Application status updated successfully');
        loadApplications();
      }
    } catch (error) {
      console.error('Failed to update application status:', error);
      toast.error('Failed to update application status');
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      'applied': 'bg-blue-100 text-blue-800',
      'under-review': 'bg-yellow-100 text-yellow-800',
      'shortlisted': 'bg-green-100 text-green-800',
      'interview-scheduled': 'bg-purple-100 text-purple-800',
      'interviewed': 'bg-indigo-100 text-indigo-800',
      'assessment': 'bg-orange-100 text-orange-800',
      'reference-check': 'bg-pink-100 text-pink-800',
      'offer-extended': 'bg-emerald-100 text-emerald-800',
      'offer-accepted': 'bg-green-100 text-green-800',
      'offer-declined': 'bg-red-100 text-red-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Get quality color
  const getQualityColor = (quality: string) => {
    const colors = {
      'low': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-green-100 text-green-800',
      'excellent': 'bg-blue-100 text-blue-800'
    };
    return colors[quality as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'candidates') {
      loadCandidates();
    } else if (activeTab === 'applications') {
      loadApplications();
    }
  }, [activeTab, candidateFilters, applicationFilters, candidatePagination.page, applicationPagination.page]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ATS Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage candidates and applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <Plus className="h-4 w-4 inline mr-2" />
                New Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: TrendingUp },
                { id: 'candidates', name: 'Candidates', icon: Users },
                { id: 'applications', name: 'Applications', icon: Briefcase }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.applications.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Candidates</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.candidates.active}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.applications.byStatus.find(s => s._id === 'shortlisted')?.count || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.candidates.total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-4">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.candidateId.name} applied for {activity.jobId.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.jobId.company.name} • {new Date(activity.process.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Skills */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Top Skills</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {stats.topSkills.map((skill, index) => (
                    <div key={skill._id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{skill._id}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${(skill.count / stats.topSkills[0].count) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{skill.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={candidateFilters.search}
                      onChange={(e) => setCandidateFilters(prev => ({ ...prev, search: e.target.value }))}
                      placeholder="Name, email, skills..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <input
                    type="text"
                    value={candidateFilters.skills}
                    onChange={(e) => setCandidateFilters(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="JavaScript, React..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input
                    type="number"
                    value={candidateFilters.experience}
                    onChange={(e) => setCandidateFilters(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="Years"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={candidateFilters.location}
                    onChange={(e) => setCandidateFilters(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, state..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Candidates List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Candidates</h3>
                  <span className="text-sm text-gray-600">
                    {candidatePagination.total} candidates found
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-6">
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  candidates.map((candidate) => (
                    <div key={candidate._id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {candidate.personalInfo.firstName[0]}{candidate.personalInfo.lastName[0]}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {candidate.personalInfo.firstName} {candidate.personalInfo.lastName}
                            </h4>
                            <p className="text-gray-600">{candidate.professionalSummary.headline}</p>
                            <p className="text-sm text-gray-500">
                              {candidate.personalInfo.location.city}, {candidate.personalInfo.location.state}
                            </p>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="text-sm text-gray-600">
                                {candidate.experience.length} experience entries
                              </span>
                              <span className="text-sm text-gray-600">
                                {candidate.skills.technical.length} skills
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQualityColor(candidate.atsData.quality)}`}>
                                {candidate.atsData.quality}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              Score: {candidate.atsData.overallScore}/100
                            </p>
                            <p className="text-xs text-gray-500">
                              {candidate.analytics.profileCompleteness}% complete
                            </p>
                          </div>
                          <button
                            onClick={() => requestCandidateAccess(candidate._id, 'Reviewing candidate for potential opportunities')}
                            className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                          >
                            Request Access
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={applicationFilters.status}
                    onChange={(e) => setApplicationFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="applied">Applied</option>
                    <option value="under-review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview-scheduled">Interview Scheduled</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job</label>
                  <input
                    type="text"
                    value={applicationFilters.jobId}
                    onChange={(e) => setApplicationFilters(prev => ({ ...prev, jobId: e.target.value }))}
                    placeholder="Job title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Candidate</label>
                  <input
                    type="text"
                    value={applicationFilters.candidateId}
                    onChange={(e) => setApplicationFilters(prev => ({ ...prev, candidateId: e.target.value }))}
                    placeholder="Candidate name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-6">
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  applications.map((application) => (
                    <div key={application._id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {application.candidateId.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {application.candidateId.name}
                            </h4>
                            <p className="text-gray-600">{application.jobId.title}</p>
                            <p className="text-sm text-gray-500">{application.jobId.company.name}</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="text-sm text-gray-600">
                                Applied {new Date(application.process.appliedAt).toLocaleDateString()}
                              </span>
                              <span className="text-sm text-gray-600">
                                Score: {application.atsData.score}/100
                              </span>
                              <span className="text-sm text-gray-600">
                                Rank: #{application.atsData.ranking}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {application.status.replace('-', ' ')}
                          </span>
                          <div className="flex items-center space-x-1">
                            <select
                              value={application.status}
                              onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="applied">Applied</option>
                              <option value="under-review">Under Review</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="interview-scheduled">Interview Scheduled</option>
                              <option value="interviewed">Interviewed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSDashboard;
