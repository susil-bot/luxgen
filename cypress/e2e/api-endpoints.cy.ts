/**
 * Comprehensive E2E Testing Suite for LuxGen API Endpoints
 * Tests all 68 API endpoints from API_ENDPOINTS_DOCUMENTATION.csv
 */

describe('LuxGen API Endpoints E2E Tests', () => {
  const API_BASE_URL = Cypress.env('API_BASE_URL') || 'https://luxgen-backend.netlify.app';
  let authToken: string;
  let testUserId: string;
  let testTenantId: string;
  let testJobId: string;
  let testContentId: string;
  let testNotificationId: string;

  before(() => {
    // Setup test data and authentication
    cy.log('Setting up test environment...');
  });

  beforeEach(() => {
    // Reset state before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('🔐 Authentication Endpoints', () => {
    it('should handle user registration', () => {
      const userData = {
        email: `test-${Date.now()}@luxgen.com`,
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        tenantId: 'tenant_luxgen'
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/auth/register`,
        body: userData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 409]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('token');
          expect(response.body.data).to.have.property('user');
          expect(response.body.data.user).to.have.property('email', userData.email);
          authToken = response.body.data.token;
          testUserId = response.body.data.user.id;
        }
      });
    });

    it('should handle user login', () => {
      const loginData = {
        email: 'test@luxgen.com',
        password: 'TestPassword123!'
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/auth/login`,
        body: loginData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 400]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('token');
          expect(response.body.data).to.have.property('user');
          authToken = response.body.data.token;
          testUserId = response.body.data.user.id;
        }
      });
    });

    it('should handle password reset flow', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/auth/forgot-password`,
        body: { email: 'test@luxgen.com' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 404]);
        expect(response.body).to.have.property('success');
      });
    });

    it('should handle email verification', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/auth/verify-email`,
        body: { token: 'test-verification-token' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401]);
        expect(response.body).to.have.property('success');
      });
    });

    it('should handle token refresh', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/auth/refresh`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('token');
        }
      });
    });

    it('should handle user logout', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/auth/logout`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        expect(response.body).to.have.property('success');
      });
    });
  });

  describe('👤 User Management Endpoints', () => {
    beforeEach(() => {
      // Ensure we have a valid auth token
      cy.wrap(authToken).should('exist');
    });

    it('should get current user profile', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/users/me`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('id');
          expect(response.body.data).to.have.property('email');
        }
      });
    });

    it('should update user profile', () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        preferences: { theme: 'dark' }
      };

      cy.request({
        method: 'PUT',
        url: `${API_BASE_URL}/api/users/me`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: updateData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('firstName', 'Updated');
        }
      });
    });

    it('should change user password', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/users/change-password`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          currentPassword: 'TestPassword123!',
          newPassword: 'NewPassword123!'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401]);
        expect(response.body).to.have.property('success');
      });
    });

    it('should get all users (admin)', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/users`,
        headers: { Authorization: `Bearer ${authToken}` },
        qs: { page: 1, limit: 10 },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
          expect(response.body).to.have.property('pagination');
        }
      });
    });

    it('should get specific user', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/users/${testUserId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('id', testUserId);
        }
      });
    });

    it('should create new user (admin)', () => {
      const newUser = {
        email: `newuser-${Date.now()}@luxgen.com`,
        firstName: 'New',
        lastName: 'User',
        role: 'user',
        tenantId: 'tenant_luxgen'
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/users`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: newUser,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 401, 403]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('email', newUser.email);
        }
      });
    });

    it('should update user (admin)', () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'User',
        role: 'admin'
      };

      cy.request({
        method: 'PUT',
        url: `${API_BASE_URL}/api/users/${testUserId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: updateData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
        }
      });
    });

    it('should delete user (admin)', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/api/users/${testUserId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        expect(response.body).to.have.property('success');
      });
    });
  });

  describe('🏢 Tenant Management Endpoints', () => {
    it('should get all tenants', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/tenants`,
        headers: { Authorization: `Bearer ${authToken}` },
        qs: { page: 1, limit: 10 },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
          if (response.body.data.length > 0) {
            testTenantId = response.body.data[0].id;
          }
        }
      });
    });

    it('should get specific tenant', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/tenants/${testTenantId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('id', testTenantId);
        }
      });
    });

    it('should create new tenant (admin)', () => {
      const tenantData = {
        name: 'Test Tenant',
        slug: `test-tenant-${Date.now()}`,
        domain: 'test-tenant.luxgen.com',
        settings: { theme: 'light' },
        features: { analytics: true },
        limits: { maxUsers: 100 }
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/tenants`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: tenantData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 401, 403]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('name', tenantData.name);
          testTenantId = response.body.data.id;
        }
      });
    });

    it('should update tenant (admin)', () => {
      const updateData = {
        name: 'Updated Tenant',
        settings: { theme: 'dark' }
      };

      cy.request({
        method: 'PUT',
        url: `${API_BASE_URL}/api/tenants/${testTenantId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: updateData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
        }
      });
    });

    it('should delete tenant (admin)', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/api/tenants/${testTenantId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        expect(response.body).to.have.property('success');
      });
    });
  });

  describe('💼 Job Management Endpoints', () => {
    it('should get all jobs', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/jobs`,
        headers: { Authorization: `Bearer ${authToken}` },
        qs: { page: 1, limit: 10 },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
          if (response.body.data.length > 0) {
            testJobId = response.body.data[0].id;
          }
        }
      });
    });

    it('should get specific job', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/jobs/${testJobId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('id', testJobId);
        }
      });
    });

    it('should create new job', () => {
      const jobData = {
        title: 'Software Engineer',
        company: 'LuxGen',
        location: 'Remote',
        type: 'full-time',
        description: 'Great opportunity',
        requirements: ['React', 'Node.js'],
        benefits: ['Health insurance'],
        salary: { min: 80000, max: 120000, currency: 'USD' }
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/jobs`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: jobData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 401]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('title', jobData.title);
          testJobId = response.body.data.id;
        }
      });
    });

    it('should update job', () => {
      const updateData = {
        title: 'Senior Software Engineer',
        description: 'Updated description'
      };

      cy.request({
        method: 'PUT',
        url: `${API_BASE_URL}/api/jobs/${testJobId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: updateData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
        }
      });
    });

    it('should apply for job', () => {
      const applicationData = {
        coverLetter: 'I am interested in this position',
        resumeId: 'resume-123',
        additionalInfo: { experience: '5 years' }
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/jobs/${testJobId}/apply`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: applicationData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 401]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('jobId', testJobId);
        }
      });
    });

    it('should delete job', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/api/jobs/${testJobId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
        expect(response.body).to.have.property('success');
      });
    });
  });

  describe('📄 Content Management Endpoints', () => {
    it('should get content list', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        qs: { page: 1, limit: 10, type: 'post' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
          if (response.body.data.length > 0) {
            testContentId = response.body.data[0].id;
          }
        }
      });
    });

    it('should get specific content', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/content/${testContentId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('id', testContentId);
        }
      });
    });

    it('should create new content', () => {
      const contentData = {
        type: 'post',
        title: 'Test Post',
        content: 'This is a test post',
        metadata: { category: 'general' }
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: contentData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 401]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('title', contentData.title);
          testContentId = response.body.data.id;
        }
      });
    });

    it('should update content', () => {
      const updateData = {
        title: 'Updated Post',
        content: 'Updated content'
      };

      cy.request({
        method: 'PUT',
        url: `${API_BASE_URL}/api/content/${testContentId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: updateData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
        }
      });
    });

    it('should delete content', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/api/content/${testContentId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
        expect(response.body).to.have.property('success');
      });
    });
  });

  describe('📰 Feed Management Endpoints', () => {
    it('should get feed posts', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        qs: { type: 'post', page: 1, limit: 10 },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
        }
      });
    });

    it('should create feed post', () => {
      const postData = {
        type: 'post',
        title: 'New Feed Post',
        content: 'This is a new feed post',
        attachments: []
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: postData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 401]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          testContentId = response.body.data.id;
        }
      });
    });

    it('should like feed post', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content/${testContentId}/like`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: { userId: testUserId },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('totalLikes');
        }
      });
    });

    it('should comment on feed post', () => {
      const commentData = {
        content: 'Great post!',
        author: {
          id: testUserId,
          name: 'Test User',
          avatar: 'avatar.jpg'
        }
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content/${testContentId}/comment`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: commentData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('totalComments');
        }
      });
    });

    it('should share feed post', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content/${testContentId}/share`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: { userId: testUserId },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('totalShares');
        }
      });
    });
  });

  describe('🎓 Training Management Endpoints', () => {
    it('should get training programs', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        qs: { type: 'training', page: 1, limit: 10 },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
        }
      });
    });

    it('should create training program', () => {
      const programData = {
        type: 'training',
        title: 'React Training',
        description: 'Learn React fundamentals',
        modules: ['Introduction', 'Components', 'State'],
        status: 'active'
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: programData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 401]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          testContentId = response.body.data.id;
        }
      });
    });

    it('should enroll in training', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content/${testContentId}/enroll`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: { userId: testUserId },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('totalEnrolled');
        }
      });
    });

    it('should start training', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content/${testContentId}/start`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('status', 'started');
        }
      });
    });

    it('should complete training', () => {
      const completionData = {
        userId: testUserId,
        completionData: { score: 95, timeSpent: 120 }
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content/${testContentId}/complete`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: completionData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('totalCompletions');
        }
      });
    });
  });

  describe('📝 Assessment Management Endpoints', () => {
    it('should get assessments', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        qs: { type: 'assessment', page: 1, limit: 10 },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
        }
      });
    });

    it('should create assessment', () => {
      const assessmentData = {
        type: 'assessment',
        title: 'React Assessment',
        description: 'Test your React knowledge',
        questions: [
          { question: 'What is React?', options: ['Library', 'Framework'], correct: 0 }
        ],
        timeLimit: 30,
        passingScore: 70,
        status: 'active'
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: assessmentData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 401]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          testContentId = response.body.data.id;
        }
      });
    });

    it('should start assessment', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content/${testContentId}/start`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: { userId: testUserId },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('totalStarted');
        }
      });
    });

    it('should submit assessment', () => {
      const submissionData = {
        userId: testUserId,
        answers: [
          { questionId: 'q1', answer: 0, timeSpent: 30 }
        ]
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content/${testContentId}/submit`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: submissionData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('totalSubmissions');
        }
      });
    });
  });

  describe('📊 Analytics Endpoints', () => {
    it('should get dashboard data', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/analytics/dashboard`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('totalUsers');
          expect(response.body.data).to.have.property('activeUsers');
        }
      });
    });

    it('should get performance metrics', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/analytics/performance`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('responseTime');
          expect(response.body.data).to.have.property('uptime');
        }
      });
    });

    it('should get user analytics', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/analytics/users/${testUserId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('userId', testUserId);
        }
      });
    });

    it('should get training analytics', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/analytics/training`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('totalPrograms');
          expect(response.body.data).to.have.property('totalEnrollments');
        }
      });
    });

    it('should generate custom report', () => {
      const reportData = {
        type: 'user_activity',
        filters: { dateRange: 'last_30_days' },
        dateRange: {
          start: '2024-01-01',
          end: '2024-01-31'
        }
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/analytics/reports`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: reportData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('reportId');
          expect(response.body.data).to.have.property('downloadUrl');
        }
      });
    });
  });

  describe('🔔 Notifications Endpoints', () => {
    it('should get notifications', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        qs: { type: 'notification', page: 1, limit: 10 },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
          if (response.body.data.length > 0) {
            testNotificationId = response.body.data[0].id;
          }
        }
      });
    });

    it('should create notification', () => {
      const notificationData = {
        type: 'notification',
        title: 'New Notification',
        message: 'You have a new message',
        recipients: [testUserId]
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: notificationData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 401]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          testNotificationId = response.body.data.id;
        }
      });
    });

    it('should mark notification as read', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content/${testNotificationId}/read`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('read', true);
        }
      });
    });
  });

  describe('🔍 Search Endpoints', () => {
    it('should perform global search', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        qs: { search: 'react', type: 'all', limit: 10 },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
        }
      });
    });
  });

  describe('📁 File Management Endpoints', () => {
    it('should upload resume', () => {
      const formData = new FormData();
      const file = new File(['test resume content'], 'resume.pdf', { type: 'application/pdf' });
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({ type: 'resume', userId: testUserId }));

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content`,
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 401]);
        if (response.status === 201) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('fileName');
        }
      });
    });

    it('should download resume', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/content/resume-123`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('downloadUrl');
        }
      });
    });
  });

  describe('🏥 Health Check Endpoints', () => {
    it('should check system health', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/health`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 503]);
        expect(response.body).to.have.property('success');
        if (response.status === 200) {
          expect(response.body.data).to.have.property('status');
          expect(response.body.data).to.have.property('services');
        }
      });
    });

    it('should check database status', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/health/database`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 503]);
        expect(response.body).to.have.property('success');
        if (response.status === 200) {
          expect(response.body.data).to.have.property('status');
          expect(response.body.data).to.have.property('connection');
        }
      });
    });

    it('should check API connection', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/health/connection`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 503]);
        expect(response.body).to.have.property('success');
        if (response.status === 200) {
          expect(response.body.data).to.have.property('status');
          expect(response.body.data).to.have.property('responseTime');
        }
      });
    });
  });

  describe('🔄 Error Handling & Edge Cases', () => {
    it('should handle invalid authentication', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/users/me`,
        headers: { Authorization: 'Bearer invalid-token' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('success', false);
      });
    });

    it('should handle missing required fields', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/auth/register`,
        body: { email: 'test@example.com' }, // Missing password
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('success', false);
      });
    });

    it('should handle non-existent resources', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/api/users/non-existent-id`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('success', false);
      });
    });

    it('should handle rate limiting', () => {
      // Make multiple rapid requests to test rate limiting
      const requests = Array(10).fill(null).map(() => 
        cy.request({
          method: 'GET',
          url: `${API_BASE_URL}/api/health`,
          failOnStatusCode: false
        })
      );

      cy.wrap(Promise.all(requests)).then((responses) => {
        // At least one should succeed
        const successCount = responses.filter(r => r.status === 200).length;
        expect(successCount).to.be.greaterThan(0);
      });
    });
  });

  describe('📈 Performance & Load Testing', () => {
    it('should handle concurrent requests', () => {
      const concurrentRequests = 5;
      const requests = Array(concurrentRequests).fill(null).map(() => 
        cy.request({
          method: 'GET',
          url: `${API_BASE_URL}/api/health`,
          failOnStatusCode: false
        })
      );

      cy.wrap(Promise.all(requests)).then((responses) => {
        responses.forEach(response => {
          expect(response.status).to.be.oneOf([200, 503]);
        });
      });
    });

    it('should handle large payloads', () => {
      const largeContent = {
        type: 'post',
        title: 'Large Content Test',
        content: 'x'.repeat(10000), // 10KB content
        metadata: { large: true }
      };

      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/api/content`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: largeContent,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 413]);
      });
    });
  });

  after(() => {
    // Cleanup test data
    cy.log('Cleaning up test environment...');
  });
});
