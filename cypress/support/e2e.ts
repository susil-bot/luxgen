// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  // that are not related to the application
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});

// Global before hook
before(() => {
  cy.log('🚀 Starting LuxGen API E2E Tests');
});

// Global after hook
after(() => {
  cy.log('✅ LuxGen API E2E Tests Completed');
});

// Custom commands for API testing
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to authenticate user
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to get auth token
       * @example cy.getAuthToken()
       */
      getAuthToken(): Chainable<string>;
      
      /**
       * Custom command to make authenticated API request
       * @example cy.apiRequest('GET', '/api/users/me')
       */
      apiRequest(method: string, endpoint: string, body?: any): Chainable<any>;
      
      /**
       * Custom command to wait for API response
       * @example cy.waitForApiResponse()
       */
      waitForApiResponse(): Chainable<void>;
    }
  }
}
