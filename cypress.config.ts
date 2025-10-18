import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    env: {
      API_BASE_URL: 'https://luxgen-backend.netlify.app',
      TEST_USER_EMAIL: 'test@luxgen.com',
      TEST_USER_PASSWORD: 'TestPassword123!',
      ADMIN_EMAIL: 'admin@luxgen.com',
      ADMIN_PASSWORD: 'AdminPassword123!'
    },
    setupNodeEvents(on, config) {
      // Add custom tasks here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        }
      });
    }
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack'
    }
  }
});
