import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SubdomainTenantRouter } from './components/tenant/SubdomainTenantRouter';
import { SubdomainTester } from './components/tenant/SubdomainTester';
import { getCurrentProductionTenant } from './config/productionSubdomainMapping';
import AppRoutes from './AppRoutes';
import './App.css';

const App: React.FC = () => {
  // Detect production tenant from subdomain
  const currentTenant = getCurrentProductionTenant();
  
  // Apply tenant-specific data attribute for CSS theming
  React.useEffect(() => {
    if (currentTenant) {
      document.documentElement.setAttribute('data-tenant', currentTenant.slug);
    }
  }, [currentTenant]);

  return (
    <Router>
      <div className="App">
        <SubdomainTenantRouter>
          <Routes>
            <Route path="/test-multi-tenancy" element={<SubdomainTester />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </SubdomainTenantRouter>
      </div>
    </Router>
  );
};

export default App;
