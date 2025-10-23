# Luồng Onboarding Hoàn Chỉnh

## Tổng quan

Ứng dụng MoneyFlow giờ đây có một luồng onboarding hoàn chỉnh với 3 bước chính:

1. **Bước 1: Đăng ký/Đăng nhập** - Xác thực người dùng
2. **Bước 2: Giới thiệu Zero-Based Budgeting** - Giải thích triết lý
3. **Bước 3: Chọn Mẫu Danh Mục** - Thiết lập danh mục chi tiêu

## Chi tiết các bước

### Bước 1: Đăng ký/Đăng nhập

- Người dùng có thể đăng ký bằng email/mật khẩu hoặc Google OAuth
- Sau khi đăng nhập thành công, hệ thống kiểm tra trạng thái onboarding

### Bước 2: Giới thiệu Zero-Based Budgeting

**File:** `src/pages/IntroScreen.tsx`

Màn hình giới thiệu bao gồm:

- Logo và tên ứng dụng
- Giải thích về Zero-Based Budgeting
- Các lợi ích chính:
  - Kiểm soát chi tiêu tốt hơn
  - Tiết kiệm nhiều hơn
  - Đạt được mục tiêu tài chính
  - Giảm stress về tiền bạc

### Bước 3: Chọn Mẫu Danh Mục

**File:** `src/pages/CategorySelectionScreen.tsx`

Đây là bước quan trọng nhất, bao gồm:

#### 3.1. Chọn Template

- **Mẫu 1: MoneyFlow Style** - Phong cách linh hoạt
- **Mẫu 2: 50/30/20** - Phương pháp phân bổ cổ điển

#### 3.2. Cấu trúc Template

**Mẫu 1: MoneyFlow Style**

- Chi phí bắt buộc
- Chi phí không thường xuyên
- Niềm vui của tôi
- Đầu tư dài hạn

**Mẫu 2: 50/30/20**

- Nhu cầu thiết yếu (50%)
- Mong muốn (30%)
- Tiết kiệm & Đầu tư (20%)

#### 3.3. Tùy chỉnh danh mục

- Người dùng có thể chọn/bỏ chọn từng danh mục con
- Có nút "Tất cả" và "Bỏ chọn" cho từng nhóm
- Hiển thị số lượng danh mục đã chọn
- Nút "TIẾP TỤC" chỉ kích hoạt khi có ít nhất 1 danh mục được chọn

## Cấu trúc Code

### Data Layer

- `src/data/categoryTemplates.ts` - Định nghĩa các template danh mục
- `src/contexts/CategoryContext.tsx` - Quản lý trạng thái chọn danh mục
- `src/contexts/FinanceContext.tsx` - Quản lý danh mục trong ứng dụng

### UI Components

- `src/pages/IntroScreen.tsx` - Màn hình giới thiệu
- `src/pages/CategorySelectionScreen.tsx` - Màn hình chọn danh mục
- `src/pages/OnboardingFlow.tsx` - Quản lý luồng onboarding
- `src/components/CategoryDisplay.tsx` - Hiển thị danh mục đã chọn

### Integration

- `src/App.tsx` - Tích hợp luồng onboarding vào ứng dụng chính
- `src/components/BudgetScreen.tsx` - Hiển thị danh mục trong dashboard

## Cách sử dụng

### Để test luồng onboarding:

1. Xóa `onboarding_completed` khỏi localStorage
2. Refresh trang
3. Đăng nhập với tài khoản bất kỳ
4. Luồng onboarding sẽ tự động bắt đầu

### Để reset onboarding:

```javascript
localStorage.removeItem("onboarding_completed");
localStorage.removeItem("onboarding_categories");
window.location.reload();
```

## Tính năng chính

### 1. Responsive Design

- Tối ưu cho mobile
- Giao diện thân thiện với ngón tay
- Màu sắc nhất quán (vàng/cam)

### 2. User Experience

- Navigation rõ ràng (nút Back/Next)
- Feedback trực quan (số lượng đã chọn)
- Validation (không cho phép tiếp tục nếu chưa chọn danh mục)

### 3. Data Persistence

- Lưu trạng thái onboarding vào localStorage
- Tích hợp với FinanceContext để quản lý danh mục
- Đồng bộ giữa các màn hình

### 4. Extensibility

- Dễ dàng thêm template mới
- Cấu trúc linh hoạt cho danh mục
- Tách biệt logic và UI

## Lưu ý kỹ thuật

### State Management

- CategoryContext quản lý trạng thái chọn danh mục trong onboarding
- FinanceContext quản lý danh mục trong ứng dụng chính
- LocalStorage lưu trạng thái onboarding

### Type Safety

- Tất cả interfaces được định nghĩa rõ ràng
- TypeScript đảm bảo type safety
- Props được validate tại compile time

### Performance

- Lazy loading cho các component
- Memoization cho computed values
- Efficient re-rendering

## Tương lai

### Có thể mở rộng:

1. Thêm template tùy chỉnh
2. Import/export cấu hình danh mục
3. Gợi ý danh mục dựa trên thu nhập
4. Onboarding cho người dùng cũ
5. A/B testing cho các template
