# Cấu hình Environment Variables

## Frontend (.env)

Tạo file `.env` trong thư mục `Finance_Tracker/` với nội dung:

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=885076368157-gk6624okffn4thbbh366uhb18ul2ne7t.apps.googleusercontent.com
```

## Backend (.env)

Tạo file `.env` trong thư mục `Finance_Tracker/server/` với nội dung:

```
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=885076368157-gk6624okffn4thbbh366uhb18ul2ne7t.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret-here
PORT=5000
```

## Lưu ý:

1. Thay `your-super-secret-jwt-key-here` bằng một chuỗi bí mật mạnh
2. Thay `GOCSPX-your-client-secret-here` bằng Client Secret từ Google Cloud Console
3. Đảm bảo MongoDB đang chạy trên localhost:27017
