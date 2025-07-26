import React, { useState } from 'react';
import { Group, GroupMember } from '../../types';
import { useGroupManagement } from '../../contexts/GroupManagementContext';

interface GroupDetailsProps {
  group: Group;
  onUpdate: () => void;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ group, onUpdate }) => {
  const { updateGroup, addMemberToGroup, removeMemberFromGroup } = useGroupManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: group.name,
    description: group.description || '',
    category: group.category || '',
    maxSize: group.maxSize || 20
  });

  const handleSave = async () => {
    try {
      await updateGroup(group.id, editForm);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update group:', error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: group.name,
      description: group.description || '',
      category: group.category || '',
      maxSize: group.maxSize || 20
    });
    setIsEditing(false);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRoleColor = (role: GroupMember['role']) => {
    switch (role) {
      case 'leader': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'member': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'observer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: GroupMember['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Group Details</h2>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Group Information */}
      <div className="px-6 py-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <input
                type="text"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Size</label>
              <input
                type="number"
                value={editForm.maxSize}
                onChange={(e) => setEditForm({ ...editForm, maxSize: parseInt(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{group.name}</h3>
              {group.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{group.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</span>
                <p className="text-sm text-gray-900 dark:text-white">{group.category || 'General'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Size</span>
                <p className="text-sm text-gray-900 dark:text-white">{group.maxSize || 'Unlimited'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</span>
                <p className="text-sm text-gray-900 dark:text-white">{new Date(group.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  group.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {group.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Tags */}
            {group.tags.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {group.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Performance Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(group.performanceMetrics.averageScore)}`}>
              {group.performanceMetrics.averageScore.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {group.performanceMetrics.completionRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {group.performanceMetrics.participationRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Participation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {group.performanceMetrics.totalSessions}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Sessions</div>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Members ({group.members.length})</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {group.members.filter(m => m.status === 'active').length} active
          </span>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {group.members.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No members yet</p>
          ) : (
            group.members.map((member) => (
              <div key={member.userId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {member.userId.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      User {member.userId.slice(-4)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                  {member.performanceScore !== undefined && (
                    <div className={`text-xs font-medium ${getPerformanceColor(member.performanceScore)}`}>
                      {member.performanceScore.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetails; 