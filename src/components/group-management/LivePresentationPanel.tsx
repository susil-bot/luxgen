import React, { useState } from 'react';
import { LivePresentation, Group } from '../../types';
import { useGroupManagement } from '../../contexts/GroupManagementContext';
import LivePollingInterface from './LivePollingInterface';

interface LivePresentationPanelProps {
  presentations: LivePresentation[];
  onSelectPresentation: (presentation: LivePresentation) => void;
  selectedPresentation: LivePresentation | null;
}

const LivePresentationPanel: React.FC<LivePresentationPanelProps> = ({
  presentations,
  onSelectPresentation,
  selectedPresentation
}) => {
  const { startPresentation, endPresentation } = useGroupManagement();
  const [filter, setFilter] = useState<'all' | 'live' | 'preparing' | 'ended'>('all');

  const filteredPresentations = presentations.filter(presentation => {
    if (filter === 'all') return true;
    return presentation.status === filter;
  });

  const getStatusColor = (status: LivePresentation['status']) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'paused': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'ended': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: LivePresentation['status']) => {
    switch (status) {
      case 'live':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span>Live</span>
          </div>
        );
      case 'preparing':
        return (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Preparing</span>
          </div>
        );
      case 'paused':
        return (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Paused</span>
          </div>
        );
      case 'ended':
        return (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Ended</span>
          </div>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const handleStartPresentation = async (presentationId: string) => {
    try {
      await startPresentation(presentationId);
    } catch (error) {
      console.error('Failed to start presentation:', error);
    }
  };

  const handleEndPresentation = async (presentationId: string) => {
    try {
      await endPresentation(presentationId);
    } catch (error) {
      console.error('Failed to end presentation:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Live Presentations</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage and conduct interactive presentations with real-time polling
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Presentations</option>
              <option value="live">Live</option>
              <option value="preparing">Preparing</option>
              <option value="ended">Ended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Presentations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Presentations List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Presentations</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPresentations.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No presentations found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {filter === 'all' ? 'Create a new presentation to get started.' : 'No presentations match the current filter.'}
                </p>
              </div>
            ) : (
              filteredPresentations.map((presentation) => (
                <div
                  key={presentation.id}
                  onClick={() => onSelectPresentation(presentation)}
                  className={`px-6 py-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedPresentation?.id === presentation.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-r-2 border-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {presentation.title}
                            </h4>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(presentation.status)}`}>
                              {getStatusIcon(presentation.status)}
                            </span>
                          </div>
                          {presentation.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {presentation.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {presentation.participants.length} participants
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {presentation.polls.length} polls
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Slide {presentation.currentSlide}/{presentation.totalSlides}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {presentation.status === 'preparing' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartPresentation(presentation.id);
                          }}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          Start
                        </button>
                      )}
                      {presentation.status === 'live' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEndPresentation(presentation.id);
                          }}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          End
                        </button>
                      )}
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Presentation Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {selectedPresentation ? (
            <div>
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Presentation Details</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(selectedPresentation.status)}`}>
                    {getStatusIcon(selectedPresentation.status)}
                  </span>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">{selectedPresentation.title}</h4>
                    {selectedPresentation.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedPresentation.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedPresentation.status}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Participants</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedPresentation.participants.length}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Polls</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedPresentation.polls.length}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Slide</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedPresentation.currentSlide}/{selectedPresentation.totalSlides}</p>
                    </div>
                  </div>

                  {selectedPresentation.startedAt && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Started</span>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(selectedPresentation.startedAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {selectedPresentation.endedAt && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ended</span>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(selectedPresentation.endedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Polling Interface */}
              {selectedPresentation.status === 'live' && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <LivePollingInterface presentation={selectedPresentation} />
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No presentation selected</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a presentation from the list to view details and manage polling.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePresentationPanel; 