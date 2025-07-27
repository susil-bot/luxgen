import apiServices from '../services/apiServices';
import { securityConfig } from '../config/security';

export const testApiConnection = async () => {
  console.log('🧪 Testing API Connection to:', securityConfig.apiBaseUrl);
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await apiServices.getHealth();
    console.log('✅ Health Response:', healthResponse);
    
    if (healthResponse.success) {
      console.log('🎉 API Connection Successful!');
      return {
        success: true,
        message: 'API connection is working properly',
        health: healthResponse
      };
    } else {
      console.log('❌ Health check failed');
      return {
        success: false,
        message: 'Health check failed',
        error: healthResponse.message
      };
    }
    
  } catch (error) {
    console.error('❌ API Connection Failed:', error);
    return {
      success: false,
      message: 'Failed to connect to API',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const testRegistrationFlow = async () => {
  console.log('🧪 Testing Registration Flow...');
  
  try {
    const testUserData = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      company: 'Test Company',
      role: 'user',
      marketingConsent: true
    };
    
    console.log('2. Testing registration endpoint...');
    const registrationResponse = await apiServices.register(testUserData);
    console.log('✅ Registration Response:', registrationResponse);
    
    return {
      success: registrationResponse.success,
      message: registrationResponse.success ? 'Registration test successful' : 'Registration test failed',
      data: registrationResponse
    };
    
  } catch (error) {
    console.error('❌ Registration Test Failed:', error);
    return {
      success: false,
      message: 'Registration test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Function to run all tests
export const runAllApiTests = async () => {
  console.log('🚀 Running All API Tests...');
  
  const connectionTest = await testApiConnection();
  if (!connectionTest.success) {
    console.log('❌ Connection test failed, skipping other tests');
    return connectionTest;
  }
  
  const registrationTest = await testRegistrationFlow();
  
  return {
    connection: connectionTest,
    registration: registrationTest,
    overallSuccess: connectionTest.success && registrationTest.success
  };
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testApiConnection = testApiConnection;
  (window as any).testRegistrationFlow = testRegistrationFlow;
  (window as any).runAllApiTests = runAllApiTests;
} 