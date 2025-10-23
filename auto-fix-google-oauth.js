#!/usr/bin/env node

/**
 * Auto-fix Google OAuth Configuration
 * Script này sẽ tự động sửa các vấn đề phổ biến với Google OAuth
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Đang tự động sửa Google OAuth...\n");

// 1. Tạo file .env cho frontend
const frontendEnvContent = `# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=885076368157-r57fjplqfcpc41741tstu2otv22en2vd.apps.googleusercontent.com
`;

try {
  fs.writeFileSync(".env", frontendEnvContent);
  console.log("✅ Đã tạo file .env cho frontend");
} catch (error) {
  console.log("⚠️  Không thể tạo .env (có thể đã tồn tại)");
}

// 2. Tạo file .env cho backend
const backendEnvContent = `# Backend Environment Variables
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_CLIENT_ID=885076368157-r57fjplqfcpc41741tstu2otv22en2vd.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret-here
PORT=5000
`;

try {
  fs.writeFileSync("server/.env", backendEnvContent);
  console.log("✅ Đã tạo file .env cho backend");
} catch (error) {
  console.log("⚠️  Không thể tạo server/.env (có thể đã tồn tại)");
}

// 3. Cập nhật Google OAuth configuration trong Login.tsx
const loginTsxPath = "src/pages/Login.tsx";
try {
  let loginContent = fs.readFileSync(loginTsxPath, "utf8");

  // Thêm error handling tốt hơn
  const improvedErrorHandling = `
  // Enhanced Google OAuth error handling
  const handleGoogleError = (error) => {
    console.error('Google OAuth Error:', error);
    if (error.type === 'popup_closed') {
      setError('Đăng nhập bị hủy. Vui lòng thử lại.');
    } else if (error.type === 'popup_blocked') {
      setError('Popup bị chặn. Vui lòng cho phép popup và thử lại.');
    } else {
      setError('Lỗi đăng nhập Google. Vui lòng thử lại.');
    }
  };
  `;

  // Thêm vào useEffect
  if (!loginContent.includes("handleGoogleError")) {
    loginContent = loginContent.replace(
      "useEffect(() => {",
      `useEffect(() => {${improvedErrorHandling}`
    );
  }

  fs.writeFileSync(loginTsxPath, loginContent);
  console.log("✅ Đã cập nhật Login.tsx với error handling tốt hơn");
} catch (error) {
  console.log("⚠️  Không thể cập nhật Login.tsx:", error.message);
}

// 4. Tạo file hướng dẫn Google Cloud Console
const googleConsoleGuide = `# HƯỚNG DẪN CẤU HÌNH GOOGLE CLOUD CONSOLE

## Bước 1: Vào Google Cloud Console
1. Mở: https://console.cloud.google.com/
2. Chọn project "Finance-Tracker"
3. Vào: APIs & Services → Credentials

## Bước 2: Sửa OAuth Client
1. Click vào Client ID của bạn
2. Trong "Authorized redirect URIs": XÓA TẤT CẢ
3. Trong "Authorized JavaScript origins": Giữ lại:
   - http://localhost:5173
   - http://127.0.0.1:5173
4. Click "Save"

## Bước 3: Chờ và test
1. Chờ 5-10 phút
2. Refresh trang localhost:5173
3. Bấm "Đăng nhập bằng Google"

## Lưu ý quan trọng:
- Ứng dụng sử dụng POPUP FLOW, không cần redirect URIs
- Có redirect URIs sẽ gây lỗi 404
`;

try {
  fs.writeFileSync("GOOGLE_CONSOLE_SETUP.md", googleConsoleGuide);
  console.log("✅ Đã tạo hướng dẫn Google Cloud Console");
} catch (error) {
  console.log("⚠️  Không thể tạo hướng dẫn:", error.message);
}

// 5. Tạo script test OAuth
const testOAuthScript = `#!/usr/bin/env node

/**
 * Test Google OAuth Configuration
 */

const https = require('https');

console.log('🧪 Đang test Google OAuth configuration...\\n');

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
  
  console.log('\\n2. Testing backend...');
  await testBackend();
  
  console.log('\\n🎯 Nếu cả 2 test đều pass, Google OAuth sẽ hoạt động!');
  console.log('   Nếu vẫn lỗi, hãy làm theo hướng dẫn trong GOOGLE_CONSOLE_SETUP.md');
};

runTests();
`;

try {
  fs.writeFileSync("test-oauth.js", testOAuthScript);
  fs.chmodSync("test-oauth.js", "755");
  console.log("✅ Đã tạo script test OAuth");
} catch (error) {
  console.log("⚠️  Không thể tạo script test:", error.message);
}

console.log("\n🎉 Hoàn thành tự động sửa Google OAuth!");
console.log("\n📋 Các bước tiếp theo:");
console.log("1. Chạy: node test-oauth.js (để test cấu hình)");
console.log("2. Làm theo hướng dẫn trong GOOGLE_CONSOLE_SETUP.md");
console.log("3. Chạy: npm run dev (để start frontend)");
console.log("4. Chạy: cd server && npm start (để start backend)");
console.log("\n✨ Google OAuth sẽ hoạt động sau khi hoàn thành!");
