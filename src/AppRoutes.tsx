import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import FeedPage from './pages/FeedPage';
// Removed SubdomainTestPage import

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/feed" element={<FeedPage />} />
      {/* Removed SubdomainTestPage route */}
    </Routes>
  );
};

export default AppRoutes;
