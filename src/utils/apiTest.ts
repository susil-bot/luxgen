import apiServices from '../services/apiServices';

export const testApiConnection = async () => {
  console.log('🧪 Testing API Connection...');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await apiServices.getHealth();
    console.log('Health Response:', healthResponse);
    
    // Test registration endpoint
    console.log('2. Testing registration endpoint...');
    const testUserData = {
      email: 'test@example.com',
      password: 'test123456',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      company: 'Test Company',
      role: 'user',
      marketingConsent: true
    };
    
    const registrationResponse = await apiServices.register(testUserData);
    console.log('Registration Response:', registrationResponse);
    
    // Test login endpoint
    console.log('3. Testing login endpoint...');
    const loginResponse = await apiServices.login({
      email: 'test@example.com',
      password: 'test123456'
    });
    console.log('Login Response:', loginResponse);
    
    return {
      success: true,
      health: healthResponse,
      registration: registrationResponse,
      login: loginResponse
    };
    
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const testHealthOnly = async () => {
  try {
    const response = await apiServices.getHealth();
    console.log('Health Check Response:', response);
    return response;
  } catch (error) {
    console.error('Health Check Failed:', error);
    throw error;
  }
}; 