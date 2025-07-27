import React from 'react';
import ProfilePage from './ProfilePage';

const ProfileDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Design Demo</h1>
          <p className="text-gray-600">
            This is a demonstration of the profile page design matching the reference image.
            The design includes a cover image, profile picture, user information, and navigation tabs.
          </p>
        </div>
        
        <ProfilePage />
      </div>
    </div>
  );
};

export default ProfileDemo; 