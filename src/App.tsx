import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Core Providers
import { TenantProvider } from './core/tenancy/TenantProvider';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './components/common/NotificationSystem';

// Error Boundary
import ErrorBoundary from './components/common/ErrorBoundary';

// Loading Components
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorFallback from './components/common/ErrorFallback';

// Lazy-loaded pages
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TenantManagementPage = lazy(() => import('./pages/TenantManagementPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Lazy-loaded components
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'));
const TenantRoute = lazy(() => import('./components/tenant/TenantRoute'));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

// Main App Component
const App: React.FC = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <NotificationProvider>
            <AuthProvider>
              <TenantProvider autoDetect={true}>
              <div className="min-h-screen bg-gray-50">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    
                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <TenantRoute>
                            <DashboardPage />
                          </TenantRoute>
                        </ProtectedRoute>
                      }
                    />
                    
                    <Route
                      path="/tenants"
                      element={
                        <ProtectedRoute>
                          <TenantRoute requiredPermissions={['admin', 'tenant:manage']}>
                            <TenantManagementPage />
                          </TenantRoute>
                        </ProtectedRoute>
                      }
                    />
                    
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <TenantRoute>
                            <ProfilePage />
                          </TenantRoute>
                        </ProtectedRoute>
                      }
                    />
                    
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <TenantRoute>
                            <SettingsPage />
                          </TenantRoute>
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Suspense>
                
                {/* Toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#4ade80',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
              </TenantProvider>
            </AuthProvider>
          </NotificationProvider>
        </Router>
        
        {/* React Query DevTools (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
