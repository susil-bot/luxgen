/// <reference types="cypress" />

// Custom commands for LuxGen API testing

/**
 * Login command to authenticate user
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  const API_BASE_URL = Cypress.env('API_BASE_URL') || 'https://luxgen-core-production.up.railway.app';
  
  cy.request({
    method: 'POST',
    url: `${API_BASE_URL}/api/auth/login`,
    body: { email, password },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200) {
      const token = response.body.data.token;
      cy.wrap(token).as('authToken');
      cy.setCookie('authToken', token);
      cy.log(`✅ User ${email} logged in successfully`);
    } else {
      cy.log(`❌ Login failed for ${email}: ${response.body.message}`);
    }
  });
});

/**
 * Get authentication token
 */
Cypress.Commands.add('getAuthToken', () => {
  return cy.getCookie('authToken').then((cookie) => {
    if (cookie) {
      return cy.wrap(cookie.value);
    } else {
      cy.log('⚠️ No auth token found');
      return cy.wrap(null);
    }
  });
});

/**
 * Make authenticated API request
 */
Cypress.Commands.add('apiRequest', (method: string, endpoint: string, body?: any) => {
  const API_BASE_URL = Cypress.env('API_BASE_URL') || 'https://luxgen-core-production.up.railway.app';
  
  return cy.getAuthToken().then((token) => {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return cy.request({
      method: method.toUpperCase(),
      url: `${API_BASE_URL}${endpoint}`,
      headers,
      body,
      failOnStatusCode: false
    });
  });
});

/**
 * Wait for API response with retry logic
 */
Cypress.Commands.add('waitForApiResponse', () => {
  cy.wait(1000); // Wait for any pending requests
});

/**
 * Custom command to test API endpoint with comprehensive validation
 */
Cypress.Commands.add('testApiEndpoint', (config: {
  method: string;
  endpoint: string;
  body?: any;
  expectedStatus: number | number[];
  expectedFields?: string[];
  description: string;
}) => {
  cy.log(`🧪 Testing: ${config.description}`);
  
  cy.apiRequest(config.method, config.endpoint, config.body).then((response) => {
    // Check status code
    if (Array.isArray(config.expectedStatus)) {
      expect(response.status).to.be.oneOf(config.expectedStatus);
    } else {
      expect(response.status).to.equal(config.expectedStatus);
    }
    
    // Check response structure
    expect(response.body).to.have.property('success');
    expect(response.body).to.have.property('timestamp');
    
    // Check expected fields
    if (config.expectedFields) {
      config.expectedFields.forEach(field => {
        expect(response.body).to.have.property(field);
      });
    }
    
    cy.log(`✅ ${config.description} - Status: ${response.status}`);
  });
});

/**
 * Custom command to test pagination
 */
Cypress.Commands.add('testPagination', (endpoint: string, page: number = 1, limit: number = 10) => {
  cy.apiRequest('GET', `${endpoint}?page=${page}&limit=${limit}`).then((response) => {
    if (response.status === 200) {
      expect(response.body).to.have.property('pagination');
      expect(response.body.pagination).to.have.property('page', page);
      expect(response.body.pagination).to.have.property('limit', limit);
      expect(response.body.pagination).to.have.property('total');
      expect(response.body.pagination).to.have.property('pages');
    }
  });
});

/**
 * Custom command to test error handling
 */
Cypress.Commands.add('testErrorHandling', (config: {
  method: string;
  endpoint: string;
  body?: any;
  expectedErrorStatus: number;
  description: string;
}) => {
  cy.log(`🚨 Testing Error: ${config.description}`);
  
  cy.apiRequest(config.method, config.endpoint, config.body).then((response) => {
    expect(response.status).to.equal(config.expectedErrorStatus);
    expect(response.body).to.have.property('success', false);
    expect(response.body).to.have.property('error');
    
    cy.log(`✅ Error handling verified - Status: ${response.status}`);
  });
});

/**
 * Custom command to test authentication
 */
Cypress.Commands.add('testAuthentication', (endpoint: string) => {
  cy.log('🔐 Testing authentication requirements');
  
  // Test without token
  cy.request({
    method: 'GET',
    url: `${Cypress.env('API_BASE_URL')}${endpoint}`,
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('success', false);
  });
  
  // Test with invalid token
  cy.request({
    method: 'GET',
    url: `${Cypress.env('API_BASE_URL')}${endpoint}`,
    headers: { Authorization: 'Bearer invalid-token' },
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('success', false);
  });
  
  cy.log('✅ Authentication requirements verified');
});

/**
 * Custom command to test rate limiting
 */
Cypress.Commands.add('testRateLimiting', (endpoint: string, maxRequests: number = 10) => {
  cy.log(`⚡ Testing rate limiting for ${endpoint}`);
  
  const requests = Array(maxRequests).fill(null).map(() => 
    cy.request({
      method: 'GET',
      url: `${Cypress.env('API_BASE_URL')}${endpoint}`,
      failOnStatusCode: false
    })
  );
  
  cy.wrap(Promise.all(requests)).then((responses) => {
    const successCount = responses.filter(r => r.status === 200).length;
    const rateLimitedCount = responses.filter(r => r.status === 429).length;
    
    cy.log(`📊 Rate limiting test: ${successCount} successful, ${rateLimitedCount} rate limited`);
    
    // At least some requests should succeed
    expect(successCount).to.be.greaterThan(0);
  });
});

/**
 * Custom command to test data validation
 */
Cypress.Commands.add('testDataValidation', (config: {
  method: string;
  endpoint: string;
  invalidData: any[];
  description: string;
}) => {
  cy.log(`🔍 Testing data validation: ${config.description}`);
  
  config.invalidData.forEach((data, index) => {
    cy.apiRequest(config.method, config.endpoint, data).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error');
      
      cy.log(`✅ Validation test ${index + 1} passed`);
    });
  });
});

// Extend Cypress namespace for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      testApiEndpoint(config: {
        method: string;
        endpoint: string;
        body?: any;
        expectedStatus: number | number[];
        expectedFields?: string[];
        description: string;
      }): Chainable<void>;
      
      testPagination(endpoint: string, page?: number, limit?: number): Chainable<void>;
      
      testErrorHandling(config: {
        method: string;
        endpoint: string;
        body?: any;
        expectedErrorStatus: number;
        description: string;
      }): Chainable<void>;
      
      testAuthentication(endpoint: string): Chainable<void>;
      
      testRateLimiting(endpoint: string, maxRequests?: number): Chainable<void>;
      
      testDataValidation(config: {
        method: string;
        endpoint: string;
        invalidData: any[];
        description: string;
      }): Chainable<void>;
    }
  }
}
