# HƯỚNG DẪN CẤU HÌNH GOOGLE CLOUD CONSOLE

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
