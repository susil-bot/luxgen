/**
 * LUXGEN WORKFLOW EXAMPLE
 * Demonstrates how to use the workflow system
 */

import React, { useState } from 'react';
import { useAuth, useTenant, useDataFlow } from '../hooks';

export function WorkflowExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('luxgen');

  // Authentication hook
  const { 
    login, 
    register, 
    logout, 
    loading: authLoading, 
    error: authError, 
    user, 
    isAuthenticated 
  } = useAuth();

  // Tenant management hook
  const { 
    currentTenant, 
    availableTenants, 
    switchTenant, 
    loading: tenantLoading, 
    error: tenantError 
  } = useTenant();

  // Data flow hook
  const { 
    syncData, 
    broadcastData, 
    loading: dataLoading, 
    error: dataError, 
    lastSync 
  } = useDataFlow();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, selectedTenant);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        firstName: 'John',
        lastName: 'Doe',
        email,
        password,
        role: 'user',
        department: 'Engineering'
      }, selectedTenant);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleTenantSwitch = async (tenantId: string) => {
    try {
      await switchTenant(tenantId);
    } catch (error) {
      console.error('Tenant switch failed:', error);
    }
  };

  const handleDataSync = async () => {
    try {
      await syncData('example-component', 'target-component', {
        message: 'Hello from workflow example!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Data sync failed:', error);
    }
  };

  const handleDataBroadcast = async () => {
    try {
      await broadcastData('example-component', {
        message: 'Broadcasting to all components!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Data broadcast failed:', error);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">LuxGen Workflow System Example</h1>
        
        {/* User Info */}
        <div className="bg-green-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user.firstName}!</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Tenant: {user.tenantName}</p>
          <button 
            onClick={handleLogout}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Tenant Information */}
        {currentTenant && (
          <div className="bg-blue-100 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2">Current Tenant</h3>
            <p>Name: {currentTenant.name}</p>
            <p>Features: {currentTenant.features.join(', ')}</p>
            <p>Primary Color: {currentTenant.branding.primaryColor}</p>
          </div>
        )}

        {/* Tenant Switcher */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Switch Tenant</h3>
          <select 
            value={selectedTenant} 
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="mr-2 p-2 border rounded"
          >
            {availableTenants.map(tenant => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
          <button 
            onClick={() => handleTenantSwitch(selectedTenant)}
            disabled={tenantLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {tenantLoading ? 'Switching...' : 'Switch Tenant'}
          </button>
          {tenantError && <p className="text-red-500 mt-2">{tenantError}</p>}
        </div>

        {/* Data Flow Examples */}
        <div className="bg-yellow-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Data Flow Operations</h3>
          <div className="space-x-2">
            <button 
              onClick={handleDataSync}
              disabled={dataLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {dataLoading ? 'Syncing...' : 'Sync Data'}
            </button>
            <button 
              onClick={handleDataBroadcast}
              disabled={dataLoading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {dataLoading ? 'Broadcasting...' : 'Broadcast Data'}
            </button>
          </div>
          {lastSync && <p className="text-sm text-gray-600 mt-2">Last sync: {lastSync}</p>}
          {dataError && <p className="text-red-500 mt-2">{dataError}</p>}
        </div>

        {/* Loading States */}
        {(authLoading || tenantLoading || dataLoading) && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <p>Loading...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">LuxGen Workflow System Example</h1>
      
      {/* Login Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tenant</label>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="luxgen">LuxGen Technologies</option>
              <option value="demo">Demo Organization</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {authLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {authError && <p className="text-red-500 mt-2">{authError}</p>}
      </div>

      {/* Register Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {authLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
