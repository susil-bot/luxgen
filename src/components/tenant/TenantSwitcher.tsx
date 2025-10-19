import React, { useState } from 'react';
import { getAllTenants, getCurrentTenant, TenantConfig } from '../../config/subdomainMapping';

export const TenantSwitcher: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState<TenantConfig | null>(getCurrentTenant());
  const tenants = getAllTenants();

  const handleTenantSwitch = (tenant: TenantConfig) => {
    setSelectedTenant(tenant);
    
    // Get current URL components
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // For localhost, we'll use URL parameters to simulate subdomain
      const newUrl = `${protocol}//${hostname}${port}${window.location.pathname}?tenant=${tenant.slug}`;
      window.history.pushState({}, '', newUrl);
    } else {
      // For production, redirect to actual subdomain
      const newUrl = `${protocol}//${tenant.subdomain}.${hostname.split('.').slice(1).join('.')}${port}${window.location.pathname}`;
      window.location.href = newUrl;
    }
    
    // Apply theme immediately
    applyTenantTheme(tenant);
  };

  const applyTenantTheme = (tenant: TenantConfig) => {
    document.documentElement.style.setProperty('--primary-color', tenant.theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', tenant.theme.secondaryColor);
    document.title = `${tenant.name} - LuxGen Platform`;
  };

  const getCurrentTenantFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tenantSlug = urlParams.get('tenant');
    return tenantSlug ? tenants.find(t => t.slug === tenantSlug) : getCurrentTenant();
  };

  const currentTenant = getCurrentTenantFromUrl() || selectedTenant;

  return (
    <div className="subdomain-tester" style={{ 
      padding: '20px', 
      border: '2px solid #e5e7eb', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9fafb'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#374151' }}>
        🌐 Subdomain Multi-Tenancy Tester
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px', color: '#6b7280' }}>Current Tenant:</h3>
        {currentTenant ? (
          <div style={{ 
            padding: '10px', 
            backgroundColor: 'white', 
            borderRadius: '4px',
            border: `2px solid ${currentTenant.theme.primaryColor}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: currentTenant.theme.primaryColor,
                  borderRadius: '50%'
                }}
              />
              <strong>{currentTenant.name}</strong>
              <span style={{ color: '#6b7280' }}>({currentTenant.slug})</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
              <div>Domain: {currentTenant.domain}</div>
              <div>Subdomain: {currentTenant.subdomain}</div>
              <div>API URL: {currentTenant.apiUrl}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#ef4444' }}>No tenant identified</div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px', color: '#6b7280' }}>Switch Tenant:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {tenants.map((tenant) => (
            <button
              key={tenant.slug}
              onClick={() => handleTenantSwitch(tenant)}
              style={{
                padding: '8px 16px',
                border: `2px solid ${tenant.theme.primaryColor}`,
                backgroundColor: currentTenant?.slug === tenant.slug ? tenant.theme.primaryColor : 'white',
                color: currentTenant?.slug === tenant.slug ? 'white' : tenant.theme.primaryColor,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (currentTenant?.slug !== tenant.slug) {
                  e.currentTarget.style.backgroundColor = tenant.theme.primaryColor;
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                if (currentTenant?.slug !== tenant.slug) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = tenant.theme.primaryColor;
                }
              }}
            >
              {tenant.name}
            </button>
          ))}
        </div>
      </div>

      {currentTenant && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px', color: '#6b7280' }}>Tenant Features:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {Object.entries(currentTenant.features).map(([feature, enabled]) => (
              <div 
                key={feature}
                style={{ 
                  padding: '8px', 
                  backgroundColor: 'white', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ color: enabled ? '#059669' : '#ef4444' }}>
                  {enabled ? '✅' : '❌'}
                </span>
                <span style={{ textTransform: 'capitalize' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentTenant && (
        <div>
          <h3 style={{ marginBottom: '10px', color: '#6b7280' }}>Tenant Limits:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Max Users</div>
              <div style={{ fontWeight: 'bold' }}>{currentTenant.limits.maxUsers.toLocaleString()}</div>
            </div>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Max Storage</div>
              <div style={{ fontWeight: 'bold' }}>{currentTenant.limits.maxStorage.toLocaleString()} MB</div>
            </div>
            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Max API Calls</div>
              <div style={{ fontWeight: 'bold' }}>{currentTenant.limits.maxApiCalls.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          <strong>Testing URLs:</strong>
          <br />
          • luxgen: <code>http://localhost:3003?tenant=luxgen</code>
          <br />
          • demo: <code>http://localhost:3003?tenant=demo</code>
          <br />
          • test: <code>http://localhost:3003?tenant=test</code>
        </div>
      </div>
    </div>
  );
};

export default TenantSwitcher;
