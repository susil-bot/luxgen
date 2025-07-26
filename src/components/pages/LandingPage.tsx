import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, BookOpen, BarChart3, Shield } from 'lucide-react';
import Header from '../header/Header';

const LandingPage: React.FC = () => {
  // Custom navigation for landing page
  const landingNavigation = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header 
        navigationItems={landingNavigation}
        logoProps={{ showText: true }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Empower Your Team with
              <span className="text-teal-600"> Professional Training</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              A comprehensive multi-tenant platform designed for leadership trainers and organizations 
              to manage training programs, track progress, and deliver exceptional learning experiences.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/login"
                className="rounded-md bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to manage training
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features designed for modern training organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Multi-Tenant Architecture
              </h3>
              <p className="text-gray-600">
                Complete data isolation for each organization with tenant-specific branding and settings.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Role-Based Access Control
              </h3>
              <p className="text-gray-600">
                Four distinct user roles: Super Admin, Admin, Trainer, and User with appropriate permissions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Training Management
              </h3>
              <p className="text-gray-600">
                Create, schedule, and manage training programs with session tracking and resource management.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analytics & Reporting
              </h3>
              <p className="text-gray-600">
                Comprehensive reporting with attendance tracking, completion rates, and performance analytics.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Assessment System
              </h3>
              <p className="text-gray-600">
                Create and manage assessments with multiple question types and automated scoring.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Experience
              </h3>
              <p className="text-gray-600">
                Modern, responsive design with role-specific dashboards and intuitive navigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Try it now with demo credentials
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience different user roles and their capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                role: 'Super Admin', 
                email: 'superadmin@trainer.com', 
                description: 'Full system access, tenant management',
                color: 'bg-purple-100 text-purple-800'
              },
              { 
                role: 'Admin', 
                email: 'admin@trainer.com', 
                description: 'Organization management, user oversight',
                color: 'bg-blue-100 text-blue-800'
              },
              { 
                role: 'Trainer', 
                email: 'trainer@trainer.com', 
                description: 'Content creation, session management',
                color: 'bg-green-100 text-green-800'
              },
              { 
                role: 'User', 
                email: 'user@trainer.com', 
                description: 'Learning consumption, progress tracking',
                color: 'bg-orange-100 text-orange-800'
              },
            ].map((demo, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${demo.color}`}>
                  {demo.role}
                </div>
                <p className="font-mono text-sm text-gray-900 mb-2">{demo.email}</p>
                <p className="font-mono text-sm text-gray-600 mb-4">password123</p>
                <p className="text-xs text-gray-500">{demo.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500"
            >
              Start Testing Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
                          <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <p className="text-gray-400 mb-6">
              Built with ❤️ for the training and development community
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 