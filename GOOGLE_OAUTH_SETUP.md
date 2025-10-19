# Hướng dẫn cấu hình Google OAuth

## Bước 1: Tạo Google OAuth Client ID

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Google+ API
4. Vào "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Chọn "Web application"
6. Thêm các URI được phép:
   - `http://localhost:3000`
   - `http://localhost:4173`
   - `http://localhost:5173`
   - `http://127.0.0.1:3000`
   - `http://127.0.0.1:4173`
   - `http://127.0.0.1:5173`

## Bước 2: Tạo file cấu hình môi trường

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### Backend (server/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-client-id-here
```

## Bước 3: Khởi động ứng dụng

1. Cài đặt dependencies:

   ```bash
   npm run install:all
   ```

2. Khởi động server:

   ```bash
   cd server
   npm run dev
   ```

3. Khởi động frontend:
   ```bash
   npm run dev
   ```

## Lưu ý

- Đảm bảo MongoDB đang chạy
- Kiểm tra console để xem lỗi chi tiết
- Google Client ID phải giống nhau ở frontend và backend


