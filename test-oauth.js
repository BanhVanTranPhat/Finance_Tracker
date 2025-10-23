#!/usr/bin/env node

/**
 * Test Google OAuth Configuration
 */

const https = require('https');

console.log('🧪 Đang test Google OAuth configuration...\n');

// Test 1: Kiểm tra Google OAuth endpoint
const testGoogleOAuth = () => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'accounts.google.com',
      port: 443,
      path: '/.well-known/openid_configuration',
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const config = JSON.parse(data);
          console.log('✅ Google OAuth endpoint hoạt động');
          console.log('   Authorization endpoint:', config.authorization_endpoint);
          resolve(true);
        } catch (error) {
          console.log('❌ Không thể parse Google OAuth config');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Lỗi kết nối Google OAuth:', error.message);
      resolve(false);
    });

    req.end();
  });
};

// Test 2: Kiểm tra backend
const testBackend = () => {
  return new Promise((resolve) => {
    const http = require('http');
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Backend đang chạy trên port 5000');
          resolve(true);
        } else {
          console.log('❌ Backend không phản hồi đúng:', res.statusCode);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Backend không chạy:', error.message);
      console.log('   Hãy chạy: cd server && npm start');
      resolve(false);
    });

    req.end();
  });
};

// Chạy tests
const runTests = async () => {
  console.log('1. Testing Google OAuth endpoint...');
  await testGoogleOAuth();
  
  console.log('\n2. Testing backend...');
  await testBackend();
  
  console.log('\n🎯 Nếu cả 2 test đều pass, Google OAuth sẽ hoạt động!');
  console.log('   Nếu vẫn lỗi, hãy làm theo hướng dẫn trong GOOGLE_CONSOLE_SETUP.md');
};

runTests();
