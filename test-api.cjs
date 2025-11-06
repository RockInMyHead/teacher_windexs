#!/usr/bin/env node

/**
 * Test API endpoints for single-port setup
 */

require('dotenv').config();

const API_BASE = process.env.SINGLE_PORT_MODE === 'true'
  ? 'http://localhost:1031'
  : 'http://localhost:1038';

console.log('🧪 Testing API endpoints...');
console.log(`📍 API Base: ${API_BASE}`);
console.log('');

async function testEndpoint(endpoint, description) {
  try {
    console.log(`🔍 Testing ${description}...`);
    const response = await fetch(`${API_BASE}${endpoint}`);
    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${description}: ${response.status}`);
      return true;
    } else {
      console.log(`❌ ${description}: ${response.status} - ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}: Error - ${error.message}`);
    return false;
  }
}

async function runTests() {
  const tests = [
    ['/health', 'Health Check'],
    ['/api/models', 'Models API'],
  ];

  let passed = 0;
  let total = tests.length;

  for (const [endpoint, description] of tests) {
    const success = await testEndpoint(endpoint, description);
    if (success) passed++;
    console.log('');
  }

  console.log('📊 Results:');
  console.log(`   ✅ Passed: ${passed}/${total}`);
  console.log(`   ❌ Failed: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check configuration.');
  }
}

runTests().catch(console.error);
