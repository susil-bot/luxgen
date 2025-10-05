import React from 'react';
import { SubdomainTester } from '../components/tenant/SubdomainTester';
import { getCurrentTenant } from '../config/subdomainMapping';

const SubdomainTestPage: React.FC = () => {
  const currentTenant = getCurrentTenant();

  return (
    <div className="subdomain-test-page" style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--background-color)',
      color: 'var(--text-color)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px' 
      }}>
        <header style={{ 
          marginBottom: '30px', 
          textAlign: 'center',
          padding: '20px',
          backgroundColor: 'var(--background-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px'
        }}>
          <h1 style={{ 
            color: 'var(--primary-color)', 
            marginBottom: '10px' 
          }}>
            🌐 Multi-Tenancy Subdomain Testing
          </h1>
          <p style={{ 
            color: 'var(--text-color)', 
            opacity: 0.8 
          }}>
            Test subdomain-based tenant switching with LuxGen, Demo, and Test tenants
          </p>
          {currentTenant && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              borderRadius: '4px',
              display: 'inline-block'
            }}>
              Current Tenant: <strong>{currentTenant.name}</strong>
            </div>
          )}
        </header>

        <main>
          <SubdomainTester />
        </main>

        <footer style={{ 
          marginTop: '40px', 
          textAlign: 'center', 
          padding: '20px',
          borderTop: '1px solid var(--border-color)',
          color: 'var(--text-color)',
          opacity: 0.7
        }}>
          <p>LuxGen Multi-Tenancy Platform - Subdomain Testing Environment</p>
        </footer>
      </div>
    </div>
  );
};

export default SubdomainTestPage;
