import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, FileText, Clock, CheckCircle, XCircle, Eye, 
  ChevronRight, Calendar, MapPin, Building2, DollarSign, Star,
  AlertCircle, CheckCircle2, XCircle as XCircleIcon, Clock as ClockIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiServices } from '../../core/api/ApiService';
import { toast } from 'react-hot-toast';

interface JobApplication {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    company: {
      name: string;
    };
    location: {
      city: string;
      state: string;
      country: string;
    };
    salary: {
      min: number;
      max: number;
      currency: string;
    };
  };
  status: string;
  appliedAt: string;
  candidateProfile: {
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  };
  atsData: {
    score: number;
    ranking: number;
    priority: string;
  };
}

interface ApplicationFilters {
  status: string;
  dateRange: string;
  search: string;
}

const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [filters, setFilters] = useState<ApplicationFilters>({
    status: '',
    dateRange: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [applications, filters]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await apiServices.getApplications();
      if (response.success) {
        setApplications(response.data);
      } else {
        toast.error(response.message || 'Failed to load applications');
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('An unexpected error occurred while loading applications');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let tempApplications = [...applications];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      tempApplications = tempApplications.filter(app =>
        app.jobId.title.toLowerCase().includes(searchTerm) ||
        app.jobId.company.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status) {
      tempApplications = tempApplications.filter(app => app.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
      
      tempApplications = tempApplications.filter(app => 
        new Date(app.appliedAt) >= cutoffDate
      );
    }

    setFilteredApplications(tempApplications);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      dateRange: '',
      search: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied':
        return <ClockIcon className="w-4 h-4 text-blue-500" />;
      case 'under-review':
        return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'shortlisted':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'interview-scheduled':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'interviewed':
        return <CheckCircle className="w-4 h-4 text-indigo-500" />;
      case 'offer-extended':
        return <Star className="w-4 h-4 text-orange-500" />;
      case 'offer-accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'withdrawn':
        return <XCircleIcon className="w-4 h-4 text-gray-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'interview-scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'interviewed':
        return 'bg-indigo-100 text-indigo-800';
      case 'offer-extended':
        return 'bg-orange-100 text-orange-800';
      case 'offer-accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'under-review':
        return 'Under Review';
      case 'shortlisted':
        return 'Shortlisted';
      case 'interview-scheduled':
        return 'Interview Scheduled';
      case 'interviewed':
        return 'Interviewed';
      case 'offer-extended':
        return 'Offer Extended';
      case 'offer-accepted':
        return 'Offer Accepted';
      case 'rejected':
        return 'Rejected';
      case 'withdrawn':
        return 'Withdrawn';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track your job applications and their status</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            name="search"
            placeholder="Search by job title or company..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <Filter size={20} className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        <button
          onClick={handleClearFilters}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
        >
          Clear Filters
        </button>
      </div>

      {/* Collapsible Filter Section */}
      {showFilters && (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              id="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="under-review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview-scheduled">Interview Scheduled</option>
              <option value="interviewed">Interviewed</option>
              <option value="offer-extended">Offer Extended</option>
              <option value="offer-accepted">Offer Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              name="dateRange"
              id="dateRange"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={filters.dateRange}
              onChange={handleFilterChange}
            >
              <option value="">All Time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-6">
        {filteredApplications.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6">
              {applications.length === 0 
                ? "You haven't applied to any jobs yet. Start by browsing the job board!"
                : "No applications match your current filters. Try adjusting your search criteria."
              }
            </p>
            {applications.length === 0 && (
              <a
                href="/app/jobs"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Browse Jobs
                <ChevronRight className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div
              key={application._id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedApplication(application)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{application.jobId.title}</h3>
                  <p className="text-primary-600 font-semibold">{application.jobId.company.name}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-2">{getStatusLabel(application.status)}</span>
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-sm mb-4 space-x-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {application.jobId.location.city}, {application.jobId.location.state}
                </span>
                {application.jobId.salary && (
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {application.jobId.salary.currency} {application.jobId.salary.min.toLocaleString()} - {application.jobId.salary.max.toLocaleString()}
                  </span>
                )}
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Applied {formatDate(application.appliedAt)}
                </span>
              </div>

              {application.atsData && (
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Score: {application.atsData.score}/100</span>
                  <span>Ranking: #{application.atsData.ranking}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    application.atsData.priority === 'high' ? 'bg-red-100 text-red-800' :
                    application.atsData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {application.atsData.priority} priority
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedApplication.jobId.title}</h3>
                  <p className="text-primary-600 font-semibold">{selectedApplication.jobId.company.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusIcon(selectedApplication.status)}
                      <span className="ml-2">{getStatusLabel(selectedApplication.status)}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
                    <p className="text-gray-900">{formatDate(selectedApplication.appliedAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900">{selectedApplication.jobId.location.city}, {selectedApplication.jobId.location.state}</p>
                  </div>
                  {selectedApplication.jobId.salary && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                      <p className="text-gray-900">
                        {selectedApplication.jobId.salary.currency} {selectedApplication.jobId.salary.min.toLocaleString()} - {selectedApplication.jobId.salary.max.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {selectedApplication.atsData && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">ATS Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                        <p className="text-2xl font-bold text-primary-600">{selectedApplication.atsData.score}/100</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ranking</label>
                        <p className="text-2xl font-bold text-gray-900">#{selectedApplication.atsData.ranking}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedApplication.atsData.priority === 'high' ? 'bg-red-100 text-red-800' :
                          selectedApplication.atsData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedApplication.atsData.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
