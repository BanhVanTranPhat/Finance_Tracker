# HƯỚNG DẪN SỬA LỖI GOOGLE OAUTH

## Vấn đề hiện tại:

- Lỗi: "Wrong recipient, payload audience != requiredAudience"
- Nguyên nhân: Google Client ID chưa được cấu hình đúng cho localhost

## Giải pháp tạm thời:

### Bước 1: Tạo Google Client ID mới

1. Vào https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project hiện có
3. Vào APIs & Services → Credentials
4. Tạo OAuth 2.0 Client ID mới:
   - Application type: Web application
   - Name: Finance Tracker Local
   - Authorized JavaScript origins:
     - http://localhost:5173
     - http://127.0.0.1:5173
   - Authorized redirect URIs: (ĐỂ TRỐNG - không cần)

### Bước 2: Cập nhật file .env

Thay thế Google Client ID trong cả 2 file .env bằng ID mới:

**Frontend (.env):**

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID_HERE
```

**Backend (server/.env):**

```
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=abc123
GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_NEW_CLIENT_SECRET_HERE
PORT=5000
```

### Bước 3: Restart server

```bash
npm run dev:fullstack
```

## Lưu ý quan trọng:

- Ứng dụng sử dụng POPUP FLOW, không cần redirect URIs
- Có redirect URIs sẽ gây lỗi 404
- Chờ 5-10 phút sau khi cấu hình để Google cập nhật
