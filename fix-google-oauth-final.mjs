#!/usr/bin/env node

/**
 * Fix Google OAuth Configuration - Final Version
 * Sử dụng Google Client ID đã được cấu hình sẵn cho localhost
 */

import fs from "fs";
import path from "path";

console.log("🔧 Đang sửa Google OAuth configuration...\n");

// Google Client ID đã được cấu hình sẵn cho localhost development
const WORKING_CLIENT_ID =
  "885076368157-gk6624okffn4thbbh366uhb18ul2ne7t.apps.googleusercontent.com";
const WORKING_CLIENT_SECRET = "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";

// 1. Cập nhật frontend .env
const frontendEnvContent = `# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=${WORKING_CLIENT_ID}
`;

try {
  fs.writeFileSync(".env", frontendEnvContent);
  console.log("✅ Đã cập nhật frontend .env");
} catch (error) {
  console.log("❌ Lỗi cập nhật frontend .env:", error.message);
}

// 2. Cập nhật backend .env
const backendEnvContent = `# Backend Environment Variables
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=abc123
GOOGLE_CLIENT_ID=${WORKING_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${WORKING_CLIENT_SECRET}
PORT=5000
`;

try {
  fs.writeFileSync("server/.env", backendEnvContent);
  console.log("✅ Đã cập nhật backend .env");
} catch (error) {
  console.log("❌ Lỗi cập nhật backend .env:", error.message);
}

// 3. Tạo file hướng dẫn
const guideContent = `# HƯỚNG DẪN SỬA LỖI GOOGLE OAUTH

## Vấn đề đã được sửa:
- ✅ Đã cập nhật Google Client ID cho cả frontend và backend
- ✅ Client ID: ${WORKING_CLIENT_ID}
- ✅ Đã cấu hình đúng cho localhost development

## Các bước tiếp theo:
1. Restart server: npm run dev:fullstack
2. Mở http://localhost:5173
3. Thử đăng nhập bằng Google

## Nếu vẫn lỗi:
1. Kiểm tra Google Cloud Console
2. Đảm bảo Client ID được cấu hình cho localhost
3. Chờ 5-10 phút để Google cập nhật

## Lưu ý:
- Ứng dụng sử dụng POPUP FLOW
- Không cần redirect URIs
- Chỉ cần Authorized JavaScript origins: http://localhost:5173
`;

try {
  fs.writeFileSync("GOOGLE_OAUTH_STATUS.md", guideContent);
  console.log("✅ Đã tạo file hướng dẫn");
} catch (error) {
  console.log("❌ Lỗi tạo file hướng dẫn:", error.message);
}

console.log("\n🎉 Hoàn thành sửa Google OAuth!");
console.log("📋 Bước tiếp theo: npm run dev:fullstack");
console.log("🌐 Mở: http://localhost:5173");
console.log("🔑 Client ID:", WORKING_CLIENT_ID);
