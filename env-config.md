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

### SMTP cho gửi email (Forgot/Reset Password)

Chọn 1 trong 2 cách bên dưới. Nếu KHÔNG cấu hình, email sẽ được in ra console (dev), không gửi thật.

1) SendGrid SMTP (khuyến nghị)
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=YOUR_SENDGRID_API_KEY
MAIL_FROM="Finance Tracker <verified_sender@example.com>"  # phải là email đã Verify trong SendGrid
```

2) Gmail SMTP (dùng App Password)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your.gmail@gmail.com
SMTP_PASS=your-gmail-app-password
MAIL_FROM="Finance Tracker <your.gmail@gmail.com>"
```

## Lưu ý:

1. Thay `your-super-secret-jwt-key-here` bằng một chuỗi bí mật mạnh
2. Thay `GOCSPX-your-client-secret-here` bằng Client Secret từ Google Cloud Console
3. Đảm bảo MongoDB đang chạy trên localhost:27017
4. Với SendGrid: đảm bảo `MAIL_FROM` trùng email đã Verify (Single Sender hoặc Domain Authentication)
