# API Testing Guide

## Vấn đề đã sửa

Dữ liệu không được lưu vào database mà chỉ lưu trong localStorage, nên khi refresh trang (F5) thì mất hết.

## Giải pháp đã triển khai

1. **Tạo Models mới**:

   - `Category.js` - Lưu danh mục chi tiêu
   - `Wallet.js` - Lưu thông tin ví

2. **Tạo API Routes mới**:

   - `/api/categories` - CRUD operations cho categories
   - `/api/wallets` - CRUD operations cho wallets
   - Cập nhật `/api/transactions` để sử dụng `user` thay vì `userId`

3. **Cập nhật Frontend**:
   - `FinanceContext` giờ sử dụng API thay vì chỉ localStorage
   - Tất cả functions đều async và lưu vào database
   - Load dữ liệu từ API khi component mount

## Cách test

1. **Khởi động server**:

   ```bash
   cd server
   npm run dev
   ```

2. **Khởi động frontend**:

   ```bash
   npm run dev
   ```

3. **Test API endpoints**:

   ```bash
   node test-api.js
   ```

4. **Test trong browser**:
   - Đăng nhập/đăng ký
   - Chọn danh mục từ mẫu có sẵn
   - Thêm giao dịch thu/chi
   - Refresh trang (F5) - dữ liệu sẽ vẫn còn

## Các thay đổi chính

### Backend

- ✅ Tạo `Category` và `Wallet` models
- ✅ Tạo API routes cho categories và wallets
- ✅ Cập nhật transaction model để sử dụng `user` field
- ✅ Cập nhật auth middleware để sử dụng `req.user.id`

### Frontend

- ✅ Cập nhật `FinanceContext` để sử dụng API
- ✅ Tất cả functions đều async
- ✅ Load dữ liệu từ API khi mount
- ✅ Cập nhật các components để handle async functions

## Kết quả

Bây giờ dữ liệu sẽ được lưu vào MongoDB và không bị mất khi refresh trang!
