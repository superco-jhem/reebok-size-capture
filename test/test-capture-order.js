const axios = require('axios');

// Test configuration
const BASE_URL = process.env.VERCEL_URL || 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_ORDER_ID = '1001';
const TEST_VARIANT_ID = '123456789';

/**
 * Test the capture-order endpoint
 */
async function testCaptureOrder() {
  console.log('🧪 Testing capture-order endpoint...');

  try {
    const response = await axios.post(`${BASE_URL}/api/capture-order`, {
      email: TEST_EMAIL,
      orderId: TEST_ORDER_ID,
      variantId: TEST_VARIANT_ID
    });

    console.log('✅ Success:', response.data);
    return true;
  } catch (error) {
    if (error.response) {
      console.error('❌ Error Response:', error.response.status, error.response.data);
    } else {
      console.error('❌ Network Error:', error.message);
    }
    return false;
  }
}

/**
 * Test the health endpoint
 */
async function testHealth() {
  console.log('🏥 Testing health endpoint...');

  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health Check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return false;
  }
}

/**
 * Test with invalid data
 */
async function testInvalidData() {
  console.log('🚫 Testing invalid data handling...');

  try {
    const response = await axios.post(`${BASE_URL}/api/capture-order`, {
      email: 'invalid-email',
      orderId: '',
      variantId: null
    });

    console.log('❌ Should have failed but got:', response.data);
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected invalid data:', error.response.data);
      return true;
    } else {
      console.error('❌ Unexpected error:', error.message);
      return false;
    }
  }
}

/**
 * Test with missing fields
 */
async function testMissingFields() {
  console.log('🔍 Testing missing fields handling...');

  try {
    const response = await axios.post(`${BASE_URL}/api/capture-order`, {
      email: TEST_EMAIL
      // Missing orderId and variantId
    });

    console.log('❌ Should have failed but got:', response.data);
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected missing fields:', error.response.data);
      return true;
    } else {
      console.error('❌ Unexpected error:', error.message);
      return false;
    }
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting API tests...\n');

  const tests = [
    { name: 'Health Check', fn: testHealth },
    { name: 'Invalid Data', fn: testInvalidData },
    { name: 'Missing Fields', fn: testMissingFields },
    { name: 'Capture Order', fn: testCaptureOrder }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    const result = await test.fn();
    if (result) passed++;

    // Add delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testCaptureOrder,
  testHealth,
  testInvalidData,
  testMissingFields,
  runTests
};