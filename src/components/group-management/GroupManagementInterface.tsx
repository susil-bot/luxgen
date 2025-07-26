import React, { useState, useEffect } from 'react';
import { useGroupManagement } from '../../contexts/GroupManagementContext';
import { Group, LivePresentation, GroupReport } from '../../types';
import GroupList from './GroupList';
import GroupDetails from './GroupDetails';
import GroupChart from './GroupChart';
import PerformanceDashboard from './PerformanceDashboard';
import GroupTemplates from './GroupTemplates';
import CreateGroupModal from './CreateGroupModal';
import CreatePresentationModal from './CreatePresentationModal';

type ViewMode = 'groups' | 'charts' | 'performance' | 'templates';

const GroupManagementInterface: React.FC = () => {
  const { state, createGroup, createPresentation } = useGroupManagement();
  const [viewMode, setViewMode] = useState<ViewMode>('groups');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedPresentation, setSelectedPresentation] = useState<LivePresentation | null>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showCreatePresentationModal, setShowCreatePresentationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = state.groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.category && group.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activePresentations = state.presentations.filter(p => p.status === 'live');
  const totalMembers = state.groups.reduce((sum, group) => sum + group.members.length, 0);
  const averagePerformance = state.groups.length > 0 
    ? state.groups.reduce((sum, group) => sum + group.performanceMetrics.averageScore, 0) / state.groups.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Group Management
              </h1>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {state.groups.length} Groups
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {totalMembers} Members
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {activePresentations.length} Live
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateGroupModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Group
              </button>
              
              <button
                onClick={() => setShowCreatePresentationModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                New Presentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'groups', label: 'Groups', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { id: 'charts', label: 'Group Charts', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { id: 'performance', label: 'Performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { id: 'templates', label: 'Templates', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === tab.id
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search groups, members, or presentations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'groups' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GroupList
                groups={filteredGroups}
                onSelectGroup={setSelectedGroup}
                selectedGroup={selectedGroup}
              />
            </div>
            <div className="lg:col-span-1">
              {selectedGroup ? (
                <GroupDetails
                  group={selectedGroup}
                  onUpdate={() => {
                    // Refresh group data
                    setSelectedGroup(state.groups.find(g => g.id === selectedGroup.id) || null);
                  }}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No group selected</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Select a group from the list to view details and manage members.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'charts' && (
          <GroupChart
            groups={state.groups}
            userPerformances={state.userPerformances}
          />
        )}

        {viewMode === 'performance' && (
          <PerformanceDashboard
            groups={state.groups}
            userPerformances={state.userPerformances}
            averagePerformance={averagePerformance}
          />
        )}

        {viewMode === 'templates' && (
          <GroupTemplates
            templates={state.templates}
            onUseTemplate={(templateId: string, groupData: Partial<Group>) => {
              // Handle template usage
              console.log('Using template:', templateId, groupData);
            }}
          />
        )}
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onCreateGroup={async (groupData: Partial<Group>) => {
          await createGroup(groupData);
          setShowCreateGroupModal(false);
        }}
      />

      <CreatePresentationModal
        isOpen={showCreatePresentationModal}
        onClose={() => setShowCreatePresentationModal(false)}
        onCreatePresentation={async (presentationData: Partial<LivePresentation>) => {
          await createPresentation(presentationData);
          setShowCreatePresentationModal(false);
        }}
        groups={state.groups}
      />
    </div>
  );
};

export default GroupManagementInterface; 