import React, { useState, useEffect } from 'react';
import { LivePresentation, LivePoll } from '../../types';
import { useGroupManagement } from '../../contexts/GroupManagementContext';

interface LivePollingInterfaceProps {
  presentation: LivePresentation;
}

const LivePollingInterface: React.FC<LivePollingInterfaceProps> = ({ presentation }) => {
  const { addPoll, activatePoll, deactivatePoll, submitPollResponse } = useGroupManagement();
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    type: 'multiple_choice' as LivePoll['type'],
    options: ['', '', '', ''],
    timeLimit: 60
  });

  const activePolls = presentation.polls.filter(poll => poll.isActive);
  const inactivePolls = presentation.polls.filter(poll => !poll.isActive);

  const handleCreatePoll = async () => {
    try {
      await addPoll(presentation.id, {
        question: newPoll.question,
        type: newPoll.type,
        options: newPoll.type === 'multiple_choice' ? newPoll.options.filter(opt => opt.trim()) : undefined,
        timeLimit: newPoll.timeLimit
      });
      setNewPoll({
        question: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        timeLimit: 60
      });
      setShowCreatePoll(false);
    } catch (error) {
      console.error('Failed to create poll:', error);
    }
  };

  const handleActivatePoll = async (pollId: string) => {
    try {
      await activatePoll(presentation.id, pollId);
    } catch (error) {
      console.error('Failed to activate poll:', error);
    }
  };

  const handleDeactivatePoll = async (pollId: string) => {
    try {
      await deactivatePoll(presentation.id, pollId);
    } catch (error) {
      console.error('Failed to deactivate poll:', error);
    }
  };

  const getPollTypeIcon = (type: LivePoll['type']) => {
    switch (type) {
      case 'multiple_choice':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'true_false':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rating':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'open_ended':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'word_cloud':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderPollResults = (poll: LivePoll) => {
    if (poll.results.totalResponses === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">No responses yet</p>
        </div>
      );
    }

    switch (poll.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {poll.results.answers.map((answer, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{answer.answer}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${answer.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                    {answer.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'true_false':
        return (
          <div className="grid grid-cols-2 gap-4">
            {poll.results.answers.map((answer, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-medium text-gray-900 dark:text-white">{answer.answer}</div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{answer.count}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{answer.percentage}%</div>
              </div>
            ))}
          </div>
        );
      
      case 'rating':
        return (
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {(poll.results.answers.reduce((sum, ans) => sum + (Number(ans.answer) * ans.count), 0) / poll.results.totalResponses).toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Average Rating</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {poll.results.totalResponses} responses
            </div>
          </div>
        );
      
      case 'open_ended':
        return (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {poll.results.answers.slice(0, 5).map((answer, index) => (
              <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                "{answer.answer}"
              </div>
            ))}
            {poll.results.answers.length > 5 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                +{poll.results.answers.length - 5} more responses
              </div>
            )}
          </div>
        );
      
      case 'word_cloud':
        return (
          <div className="flex flex-wrap gap-2">
            {poll.results.wordCloud?.slice(0, 10).map((word, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded text-xs"
                style={{ fontSize: `${Math.max(12, 12 + word.value * 2)}px` }}
              >
                {word.text}
              </span>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Live Polling</h3>
        <button
          onClick={() => setShowCreatePoll(true)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Poll
        </button>
      </div>

      {/* Active Polls */}
      {activePolls.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Active Polls</h4>
          <div className="space-y-3">
            {activePolls.map((poll) => (
              <div key={poll.id} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">LIVE</span>
                  </div>
                  <button
                    onClick={() => handleDeactivatePoll(poll.id)}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                  >
                    End Poll
                  </button>
                </div>
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{poll.question}</h5>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {poll.results.totalResponses} responses • {poll.type.replace('_', ' ')}
                </div>
                {renderPollResults(poll)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Polls */}
      {inactivePolls.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Previous Polls</h4>
          <div className="space-y-3">
            {inactivePolls.map((poll) => (
              <div key={poll.id} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getPollTypeIcon(poll.type)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">{poll.type.replace('_', ' ')}</span>
                  </div>
                  <button
                    onClick={() => handleActivatePoll(poll.id)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                  >
                    Reactivate
                  </button>
                </div>
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{poll.question}</h5>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {poll.results.totalResponses} responses • {poll.results.participationRate.toFixed(1)}% participation
                </div>
                {renderPollResults(poll)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Poll Modal */}
      {showCreatePoll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Poll</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question</label>
                <input
                  type="text"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your question..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={newPoll.type}
                  onChange={(e) => setNewPoll({ ...newPoll, type: e.target.value as LivePoll['type'] })}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="rating">Rating</option>
                  <option value="open_ended">Open Ended</option>
                  <option value="word_cloud">Word Cloud</option>
                </select>
              </div>
              
              {newPoll.type === 'multiple_choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                  <div className="space-y-2 mt-1">
                    {newPoll.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newPoll.options];
                          newOptions[index] = e.target.value;
                          setNewPoll({ ...newPoll, options: newOptions });
                        }}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Limit (seconds)</label>
                <input
                  type="number"
                  value={newPoll.timeLimit}
                  onChange={(e) => setNewPoll({ ...newPoll, timeLimit: parseInt(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="10"
                  max="300"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreatePoll(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePoll}
                disabled={!newPoll.question.trim()}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Poll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePollingInterface; 