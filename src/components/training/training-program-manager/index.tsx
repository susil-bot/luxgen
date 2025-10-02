/**
 * Training Program Manager - Main Component
 * React component for managing training programs
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Search, Filter, Download, Upload, RefreshCw, 
  Edit, Trash2, Eye, Star, Users, Clock, DollarSign,
  ChevronDown, ChevronUp, MoreHorizontal
} from 'lucide-react';
import { TrainingProgramManagerHelper } from './helpers';
import { TrainingProgramManagerFetcher } from './fetchers';
import { TrainingProgramManagerTransformer } from './transformers';
import { TrainingProgram, TrainingProgramFilters, TrainingProgramFormData } from './types';

interface TrainingProgramManagerProps {
  onProgramSelect?: (program: TrainingProgram) => void;
  onProgramCreate?: (program: TrainingProgram) => void;
  onProgramUpdate?: (program: TrainingProgram) => void;
  onProgramDelete?: (programId: string) => void;
  initialFilters?: TrainingProgramFilters;
  showCreateButton?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  showStats?: boolean;
  viewMode?: 'table' | 'cards' | 'list';
  pageSize?: number;
}

const TrainingProgramManager: React.FC<TrainingProgramManagerProps> = ({
  onProgramSelect,
  onProgramCreate,
  onProgramUpdate,
  onProgramDelete,
  initialFilters = {},
  showCreateButton = true,
  showFilters = true,
  showSearch = true,
  showStats = true,
  viewMode = 'cards',
  pageSize = 12
}) => {
  // State management
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TrainingProgramFilters>(initialFilters);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Load programs on component mount
  useEffect(() => {
    loadPrograms();
  }, []);

  // Apply filters and search when they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [programs, filters, searchTerm, sortBy, sortOrder]);

  // Load programs from API
  const loadPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await TrainingProgramManagerFetcher.getTrainingPrograms(filters);
      setPrograms(response.programs);
      
      // Load statistics if enabled
      if (showStats) {
        const statsResponse = await TrainingProgramManagerFetcher.getTrainingProgramStats();
        setStats(statsResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load programs');
      console.error('Error loading programs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, showStats]);

  // Apply filters and search
  const applyFiltersAndSearch = useCallback(() => {
    let filtered = [...programs];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchFilters = { ...filters, search: searchTerm };
      filtered = TrainingProgramManagerHelper.filterPrograms(programs, searchFilters);
    } else {
      filtered = TrainingProgramManagerHelper.filterPrograms(programs, filters);
    }

    // Apply sorting
    filtered = TrainingProgramManagerHelper.sortPrograms(filtered, sortBy, sortOrder);

    setFilteredPrograms(filtered);
  }, [programs, filters, searchTerm, sortBy, sortOrder]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<TrainingProgramFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  // Handle sort changes
  const handleSortChange = useCallback((newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  }, [sortBy]);

  // Handle program selection
  const handleProgramSelect = useCallback((program: TrainingProgram) => {
    setSelectedProgram(program);
    onProgramSelect?.(program);
  }, [onProgramSelect]);

  // Handle program creation
  const handleProgramCreate = useCallback(async (formData: TrainingProgramFormData) => {
    try {
      const newProgram = await TrainingProgramManagerFetcher.createTrainingProgram(formData);
      setPrograms(prev => [newProgram, ...prev]);
      onProgramCreate?.(newProgram);
      setShowCreateModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create program');
    }
  }, [onProgramCreate]);

  // Handle program update
  const handleProgramUpdate = useCallback(async (programId: string, formData: TrainingProgramFormData) => {
    try {
      const updatedProgram = await TrainingProgramManagerFetcher.updateTrainingProgram(programId, formData);
      setPrograms(prev => prev.map(p => p.id === programId ? updatedProgram : p));
      onProgramUpdate?.(updatedProgram);
      setShowEditModal(false);
      setSelectedProgram(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update program');
    }
  }, [onProgramUpdate]);

  // Handle program deletion
  const handleProgramDelete = useCallback(async (programId: string) => {
    try {
      await TrainingProgramManagerFetcher.deleteTrainingProgram(programId);
      setPrograms(prev => prev.filter(p => p.id !== programId));
      onProgramDelete?.(programId);
      setShowDeleteModal(false);
      setProgramToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete program');
    }
  }, [onProgramDelete]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadPrograms();
  }, [loadPrograms]);

  // Handle export
  const handleExport = useCallback(() => {
    const csvContent = TrainingProgramManagerHelper.exportProgramsToCSV(filteredPrograms);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training-programs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredPrograms]);

  // Pagination
  const paginatedPrograms = TrainingProgramManagerHelper.paginatePrograms(
    filteredPrograms, 
    currentPage, 
    pageSize
  );

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading programs...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-600">Error: {error}</div>
          <button
            onClick={handleRefresh}
            className="ml-4 text-blue-600 hover:text-blue-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="training-program-manager">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Training Programs</h2>
          <p className="text-gray-600">
            {filteredPrograms.length} of {programs.length} programs
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {showCreateButton && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Program
            </button>
          )}
          
          <button
            onClick={handleRefresh}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          
          <button
            onClick={handleExport}
            className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {showSearch && (
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search programs..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            {showFilters && (
              <div className="flex items-center space-x-2">
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange({ status: e.target.value as any || undefined })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="design">Design</option>
                </select>
                
                <select
                  value={filters.level || ''}
                  onChange={(e) => handleFilterChange({ level: e.target.value as any || undefined })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics */}
      {showStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Programs List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {paginatedPrograms.data.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
            <p className="text-gray-600">
              {searchTerm || Object.keys(filters).length > 0 
                ? 'Try adjusting your search or filters'
                : 'Create your first training program to get started'
              }
            </p>
          </div>
        ) : (
          <div className="p-6">
            {/* Render based on view mode */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPrograms.data.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    onSelect={handleProgramSelect}
                    onEdit={() => {
                      setSelectedProgram(program);
                      setShowEditModal(true);
                    }}
                    onDelete={() => {
                      setProgramToDelete(program.id);
                      setShowDeleteModal(true);
                    }}
                  />
                ))}
              </div>
            )}
            
            {viewMode === 'table' && (
              <ProgramTable
                programs={paginatedPrograms.data}
                onSelect={handleProgramSelect}
                onEdit={(program) => {
                  setSelectedProgram(program);
                  setShowEditModal(true);
                }}
                onDelete={(programId) => {
                  setProgramToDelete(programId);
                  setShowDeleteModal(true);
                }}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSortChange}
              />
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {paginatedPrograms.pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredPrograms.length)} of {filteredPrograms.length} programs
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!paginatedPrograms.pagination.hasPrev}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {paginatedPrograms.pagination.pages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(paginatedPrograms.pagination.pages, prev + 1))}
              disabled={!paginatedPrograms.pagination.hasNext}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals would be implemented here */}
      {/* Create Program Modal */}
      {/* Edit Program Modal */}
      {/* Delete Confirmation Modal */}
    </div>
  );
};

// Program Card Component
const ProgramCard: React.FC<{
  program: TrainingProgram;
  onSelect: (program: TrainingProgram) => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ program, onSelect, onEdit, onDelete }) => {
  const transformedProgram = TrainingProgramManagerTransformer.transformProgramForDisplay(program);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{transformedProgram.displayDescription}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {transformedProgram.displayDuration}
            </span>
            <span className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              {transformedProgram.displayPrice}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {program.currentEnrollments}/{program.maxEnrollments}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onSelect(program)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            program.status === 'published' ? 'bg-green-100 text-green-800' :
            program.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {transformedProgram.displayStatus}
          </span>
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            {transformedProgram.displayLevel}
          </span>
        </div>
        
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm text-gray-600">{program.analytics.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

// Program Table Component
const ProgramTable: React.FC<{
  programs: TrainingProgram[];
  onSelect: (program: TrainingProgram) => void;
  onEdit: (program: TrainingProgram) => void;
  onDelete: (programId: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (sortBy: string) => void;
}> = ({ programs, onSelect, onEdit, onDelete, sortBy, sortOrder, onSort }) => {
  const transformedPrograms = TrainingProgramManagerTransformer.transformProgramsForTable(programs);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              { key: 'title', label: 'Title' },
              { key: 'category', label: 'Category' },
              { key: 'level', label: 'Level' },
              { key: 'status', label: 'Status' },
              { key: 'duration', label: 'Duration' },
              { key: 'price', label: 'Price' },
              { key: 'enrollments', label: 'Enrollments' },
              { key: 'rating', label: 'Rating' },
              { key: 'actions', label: 'Actions' }
            ].map(({ key, label }) => (
              <th
                key={key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  key !== 'actions' ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={key !== 'actions' ? () => onSort(key) : undefined}
              >
                <div className="flex items-center">
                  {label}
                  {key !== 'actions' && (
                    <div className="ml-1">
                      {sortBy === key ? (
                        sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transformedPrograms.map((program) => (
            <tr key={program.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{program.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{program.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{program.level}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  program.status === 'Published' ? 'bg-green-100 text-green-800' :
                  program.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {program.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{program.duration}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{program.price}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{program.enrollments}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-900">{program.rating}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSelect(programs.find(p => p.id === program.id)!)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(programs.find(p => p.id === program.id)!)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(program.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainingProgramManager;
