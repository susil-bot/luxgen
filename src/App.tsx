import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AppComposer } from './composers/AppComposer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import EmailVerification from './components/auth/EmailVerification';
import AuthPage from './pages/AuthPage';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import LandingPage from './components/pages/LandingPage';
import ModalShowcase from './components/pages/ModalShowcase';
import SettingsLayout from './components/settings/SettingsLayout';
import AccountSettings from './components/settings/AccountSettings';
import NotificationSettings from './components/settings/NotificationSettings';
import ConnectedApps from './components/settings/ConnectedApps';
import Plans from './components/settings/Plans';
import Billing from './components/settings/Billing';
import Feedback from './components/settings/Feedback';

import AIChatbotInterface from './components/ai-chatbot/AIChatbotInterface';
import AIContentCreationInterface from './components/ai-content/AIContentCreationInterface';
import GroupManagementInterface from './components/group-management/GroupManagementInterface';
import PresentationManagementInterface from './components/presentation-management/PresentationManagementInterface';
import NotificationFeedbackInterface from './components/notification-feedback/NotificationFeedbackInterface';
import TenantManagementInterface from './components/tenant-management/TenantManagementInterface';
import UserManagementInterface from './components/user-management/UserManagementInterface';
import TrainerDashboard from './components/trainer/TrainerDashboard';
import ParticipantDashboard from './components/participant/ParticipantDashboard';
import MyTrainingInterface from './components/training/MyTrainingInterface';
import MyTrainingPrograms from './components/training/MyTrainingPrograms';
import JobBoard from './components/job-board/JobBoard';
import ATSDashboard from './components/ats/ATSDashboard';
import MyApplications from './components/career/MyApplications';
import CandidateProfile from './components/career/CandidateProfile';
import ResumeUpload from './components/career/ResumeUpload';
import JobPostingAdmin from './components/admin/JobPostingAdmin';
import FeedPage from './components/feed/FeedPage';
import NichePollsPage from './pages/NichePollsPage';
import ProfilePage from './components/profile/ProfilePage';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Login Route component (redirects to dashboard if already authenticated)
const LoginRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if login is in progress to prevent automatic redirects
  const isLoginInProgress = localStorage.getItem('loginInProgress') === 'true';

  // Only redirect if user is already authenticated and not in the middle of a login process
  if (isAuthenticated && !isLoginInProgress) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Placeholder components for different routes

const TrainingPage: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Training Management</h1>
    <p className="text-gray-600">Training program management functionality will be implemented here.</p>
  </div>
);

const ReportsPage: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h1>
    <p className="text-gray-600">Reports and analytics functionality will be implemented here.</p>
  </div>
);

const SettingsPage: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
    <p className="text-gray-600">Settings functionality will be implemented here.</p>
  </div>
);

const TenantsPage: React.FC = () => <TenantManagementInterface />;
const UsersPage: React.FC = () => <UserManagementInterface />;
const TrainerPage: React.FC = () => <TrainerDashboard />;
const ParticipantPage: React.FC = () => <ParticipantDashboard />;

const MyTrainingPage: React.FC = () => <MyTrainingInterface />;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />

      <Route 
        path="/login" 
        element={
          <LoginRoute>
            <LoginForm />
          </LoginRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <LoginRoute>
            <RegisterForm />
          </LoginRoute>
        } 
      />
      <Route 
        path="/verify-email" 
        element={<EmailVerification />} 
      />
      <Route 
        path="/auth" 
        element={
          <LoginRoute>
            <AuthPage />
          </LoginRoute>
        } 
      />

      {/* Protected routes */}
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Admin routes */}
        <Route path="users/*" element={<UsersPage />} />
        <Route path="tenants" element={<TenantsPage />} />
        
        {/* Training routes */}
        <Route path="training/*" element={<TrainingPage />} />
                <Route path="my-training" element={<MyTrainingPage />} />
                <Route path="my-training/programs" element={<MyTrainingPrograms />} />
                <Route path="jobs" element={<JobBoard />} />
                <Route path="ats" element={<ATSDashboard />} />
                <Route path="my-applications" element={<MyApplications />} />
                <Route path="candidate-profile" element={<CandidateProfile />} />
                <Route path="resume-upload" element={<ResumeUpload />} />
                <Route path="admin/job-posting" element={<JobPostingAdmin />} />
        <Route path="trainer" element={<TrainerPage />} />
        <Route path="participant" element={<ParticipantPage />} />
        
        {/* Group Management */}
        <Route path="groups" element={<GroupManagementInterface />} />
        
        {/* Notification & Feedback Management */}
        <Route path="notifications/*" element={<NotificationFeedbackInterface />} />
        <Route path="notifications/polls" element={<NichePollsPage />} />
        
        {/* Presentation Management */}
        <Route path="presentations/*" element={<PresentationManagementInterface />} />
        
        {/* Reports */}
        <Route path="reports/*" element={<ReportsPage />} />
        
        {/* Components */}
        <Route path="components" element={<ModalShowcase />} />
        
        {/* AI Chatbot */}
        <Route path="ai-assistant" element={<AIChatbotInterface />} />
        
        {/* AI Content Creation */}
        <Route path="ai-content" element={<AIContentCreationInterface />} />
        
        {/* Settings and Profile */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="/app/settings/account" replace />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="notifications" element={<NotificationSettings />} />
          <Route path="connected-apps" element={<ConnectedApps />} />
          <Route path="plans" element={<Plans />} />
          <Route path="billing" element={<Billing />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>
        <Route path="system-settings" element={<SettingsPage />} />
      </Route>

      {/* Standalone Feed Route - Independent from MainLayout */}
      <Route 
        path="/feed" 
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        } 
      />

      {/* Redirect legacy dashboard route */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * ULTRA-MODULAR APP STRUCTURE - RULE #1: NO NESTING
 * Single AppComposer handles everything with maximum modularity
 */
const App: React.FC = () => {
  return (
    <AppComposer>
      <AppRoutes />
    </AppComposer>
  );
};

export default App;