// Test script để kiểm tra Google OAuth Client ID
// Chạy script này trong browser console để test

const CLIENT_ID =
  "885076368157-r57fjplqfcpc4l741tstu2otv22en2vd.apps.googleusercontent.com";

console.log("🔍 Testing Google OAuth Client ID...");
console.log("Client ID:", CLIENT_ID);

// Test 1: Kiểm tra Client ID có tồn tại không
async function testClientId() {
  try {
    const response = await fetch(
      `https://accounts.google.com/gsi/button?client_id=${CLIENT_ID}`
    );
    console.log("✅ Client ID test response:", response.status);

    if (response.status === 200) {
      console.log("✅ Client ID tồn tại và hoạt động");
    } else if (response.status === 404) {
      console.log("❌ Client ID không tồn tại (404)");
    } else if (response.status === 403) {
      console.log("❌ Client ID bị cấm truy cập (403)");
    } else {
      console.log("⚠️ Client ID có vấn đề:", response.status);
    }
  } catch (error) {
    console.log("❌ Lỗi khi test Client ID:", error);
  }
}

// Test 2: Kiểm tra Google Identity Services
function testGoogleIdentityServices() {
  if (window.google && window.google.accounts) {
    console.log("✅ Google Identity Services đã load");

    if (window.google.accounts.id) {
      console.log("✅ Google Identity Services ID API có sẵn");
    } else {
      console.log("❌ Google Identity Services ID API không có sẵn");
    }
  } else {
    console.log("❌ Google Identity Services chưa load");
  }
}

// Test 3: Kiểm tra callback function
function testCallbackFunction() {
  if (window.handleGoogleCredential) {
    console.log("✅ Callback function đã được định nghĩa");
  } else {
    console.log("❌ Callback function chưa được định nghĩa");
  }
}

// Chạy tất cả tests
console.log("🚀 Bắt đầu test...");
testClientId();
testGoogleIdentityServices();
testCallbackFunction();

console.log("📋 Kết quả test:");
console.log("1. Nếu Client ID test trả về 404 → Client ID không tồn tại");
console.log(
  "2. Nếu Client ID test trả về 403 → Client ID bị cấm hoặc project chưa publish"
);
console.log(
  "3. Nếu Client ID test trả về 200 → Client ID hoạt động bình thường"
);
console.log(
  "4. Nếu Google Identity Services chưa load → Kiểm tra script tag trong HTML"
);
console.log(
  "5. Nếu Callback function chưa định nghĩa → Kiểm tra script trong HTML"
);

// Hướng dẫn tiếp theo
console.log("🔧 Nếu Client ID không hoạt động:");
console.log("1. Vào Google Cloud Console");
console.log("2. Kiểm tra project status");
console.log("3. Kiểm tra OAuth consent screen");
console.log("4. Tạo Client ID mới nếu cần");
console.log("5. Cập nhật code với Client ID mới");
