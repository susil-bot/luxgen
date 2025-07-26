import React, { useState } from 'react';
import {
  SearchModal,
  BasicModal,
  ScrollableModal,
  CookiesModal,
  SuccessModal,
  DangerModal,
  InfoModal,
  WarningModal,
  SendFeedbackModal,
  NewsletterModal,
  AnnouncementModal,
  IntegrationModal,
  WhatsNewModal,
  ChangePlanModal,
  QuickFindModal
} from '../modals';
import useModal from '../../hooks/useModal';

const ModalExamples: React.FC = () => {
  // Using the custom hook for cleaner state management
  const searchModal = useModal();
  const basicModal = useModal();
  const scrollableModal = useModal();
  const cookiesModal = useModal();
  const successModal = useModal();
  const dangerModal = useModal();
  const infoModal = useModal();
  const warningModal = useModal();
  const feedbackModal = useModal();
  const newsletterModal = useModal();
  const announcementModal = useModal();
  const integrationModal = useModal();
  const whatsNewModal = useModal();
  const changePlanModal = useModal();
  const quickFindModal = useModal();

  // Example data
  const [userPlan, setUserPlan] = useState('Basic');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Event handlers
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
    // In a real app, you would make an API call here
  };

  const handleFeedback = (feedback: any) => {
    console.log('Feedback submitted:', feedback);
    // In a real app, you would send this to your backend
    successModal.open();
  };

  const handleNewsletter = (email: string, preferences: string[]) => {
    console.log('Newsletter subscription:', { email, preferences });
    // In a real app, you would add to your mailing list
    successModal.open();
  };

  const handleIntegration = (integration: string) => {
    console.log('Connecting integration:', integration);
    // In a real app, you would initiate OAuth flow
    successModal.open();
  };

  const handlePlanChange = (plan: string) => {
    console.log('Plan changed to:', plan);
    setUserPlan(plan);
    // In a real app, you would update the user's subscription
    successModal.open();
  };

  const handleQuickFind = (item: any) => {
    console.log('Quick find selected:', item);
    // In a real app, you would navigate to the selected item
  };

  const handleDeleteUser = () => {
    console.log('User deleted');
    // In a real app, you would make an API call to delete the user
    successModal.open();
  };

  const handleAcceptCookies = () => {
    console.log('Cookies accepted');
    // In a real app, you would set cookies and update user preferences
    successModal.open();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Modal Usage Examples</h1>
        <p className="text-gray-600">
          Real-world examples of how to use each modal component in your application.
        </p>
      </div>

      {/* Search Example */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Functionality</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={searchModal.open}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Open Search
          </button>
          {searchHistory.length > 0 && (
            <div className="text-sm text-gray-600">
              Recent searches: {searchHistory.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* User Management Examples */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={basicModal.open}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit User
          </button>
          <button
            onClick={dangerModal.open}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete User
          </button>
          <button
            onClick={infoModal.open}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            User Info
          </button>
          <button
            onClick={warningModal.open}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Suspend User
          </button>
        </div>
      </div>

      {/* Training Management Examples */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Training Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={scrollableModal.open}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            View Training Details
          </button>
          <button
            onClick={quickFindModal.open}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Quick Find Trainee
          </button>
        </div>
      </div>

      {/* Settings and Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings & Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={cookiesModal.open}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cookie Preferences
          </button>
          <button
            onClick={integrationModal.open}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Connect Integrations
          </button>
          <button
            onClick={changePlanModal.open}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Change Plan (Current: {userPlan})
          </button>
          <button
            onClick={whatsNewModal.open}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            What's New
          </button>
        </div>
      </div>

      {/* User Engagement */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Engagement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={feedbackModal.open}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Feedback
          </button>
          <button
            onClick={newsletterModal.open}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Subscribe to Newsletter
          </button>
          <button
            onClick={announcementModal.open}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            View Announcement
          </button>
        </div>
      </div>

      {/* All Modals */}
      <SearchModal
        isOpen={searchModal.isOpen}
        onClose={searchModal.close}
        onSearch={handleSearch}
      />

      <BasicModal
        isOpen={basicModal.isOpen}
        onClose={basicModal.close}
        title="Edit User"
        content="This modal would contain a form to edit user information."
        confirmText="Save Changes"
        cancelText="Cancel"
        onConfirm={() => {
          console.log('User updated');
          basicModal.close();
          successModal.open();
        }}
      />

      <ScrollableModal
        isOpen={scrollableModal.isOpen}
        onClose={scrollableModal.close}
        title="Training Program Details"
        content="This modal shows detailed information about a training program with scrollable content."
        onConfirm={() => {
          console.log('Training details viewed');
          scrollableModal.close();
        }}
      />

      <CookiesModal
        isOpen={cookiesModal.isOpen}
        onClose={cookiesModal.close}
        onAcceptAll={handleAcceptCookies}
        onAcceptNecessary={handleAcceptCookies}
        onCustomize={() => {
          console.log('Customize cookies');
          cookiesModal.close();
        }}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={successModal.close}
        title="Success!"
        message="Your action has been completed successfully."
        onConfirm={() => {
          console.log('Success confirmed');
          successModal.close();
        }}
      />

      <DangerModal
        isOpen={dangerModal.isOpen}
        onClose={dangerModal.close}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete User"
        onConfirm={handleDeleteUser}
      />

      <InfoModal
        isOpen={infoModal.isOpen}
        onClose={infoModal.close}
        title="User Information"
        message="This user has been active for 2 years and has completed 15 training programs."
        onConfirm={() => {
          console.log('Info confirmed');
          infoModal.close();
        }}
      />

      <WarningModal
        isOpen={warningModal.isOpen}
        onClose={warningModal.close}
        title="Suspend User"
        message="Suspending a user will prevent them from accessing the platform. They can be reactivated later."
        confirmText="Suspend User"
        onConfirm={() => {
          console.log('User suspended');
          warningModal.close();
          successModal.open();
        }}
      />

      <SendFeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={feedbackModal.close}
        onSubmit={handleFeedback}
      />

      <NewsletterModal
        isOpen={newsletterModal.isOpen}
        onClose={newsletterModal.close}
        onSubscribe={handleNewsletter}
      />

      <AnnouncementModal
        isOpen={announcementModal.isOpen}
        onClose={announcementModal.close}
        title="New Feature Available"
        message="We've just released a new AI-powered training recommendation system. Try it out!"
        type="success"
      />

      <IntegrationModal
        isOpen={integrationModal.isOpen}
        onClose={integrationModal.close}
        onConnect={handleIntegration}
      />

      <WhatsNewModal
        isOpen={whatsNewModal.isOpen}
        onClose={whatsNewModal.close}
        version="v2.2.0"
        features={[
          { title: "Enhanced Analytics", description: "New dashboard with advanced metrics", type: 'new' as const },
          { title: "Mobile App", description: "Native mobile app for iOS and Android", type: 'new' as const },
          { title: "Performance", description: "50% faster loading times", type: 'improved' as const },
          { title: "Bug Fixes", description: "Fixed login issues and UI glitches", type: 'fixed' as const }
        ]}
      />

      <ChangePlanModal
        isOpen={changePlanModal.isOpen}
        onClose={changePlanModal.close}
        currentPlan={userPlan}
        onUpgrade={handlePlanChange}
      />

      <QuickFindModal
        isOpen={quickFindModal.isOpen}
        onClose={quickFindModal.close}
        onSelect={handleQuickFind}
      />
    </div>
  );
};

export default ModalExamples; 