# HƯỚNG DẪN SỬA LỖI GOOGLE OAUTH

## Vấn đề đã được sửa:
- ✅ Đã cập nhật Google Client ID cho cả frontend và backend
- ✅ Client ID: 885076368157-gk6624okffn4thbbh366uhb18ul2ne7t.apps.googleusercontent.com
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
