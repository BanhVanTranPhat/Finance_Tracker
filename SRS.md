# Tài liệu SRS – Finance Tracker

Phiên bản: 1.0

Ngày: 2025-10-29

## 1. Giới thiệu

- Mục tiêu: Ứng dụng theo dõi tài chính cá nhân giúp ghi chép giao dịch, quản lý ví, danh mục chi tiêu, lập ngân sách theo tháng và phân tích.
- Phạm vi: Web app SPA (Vite + React, Tailwind) và backend REST (Node.js/Express + MongoDB/Mongoose).
- Đối tượng: Người dùng cá nhân, quản trị hệ thống.
- Tài liệu tham chiếu: Mã nguồn thư mục `src/` và `server/`, `README.md`.

## 2. Thuật ngữ

- Ví (Wallet): Tài khoản chứa số dư hiện tại của người dùng.
- Danh mục (Category): Nhóm chi/thu, có ngân sách dự kiến trong tháng.
- Giao dịch (Transaction): Khoản thu/chi, ảnh hưởng số dư ví.
- ZBB: Zero-Based Budgeting – phân bổ toàn bộ số tiền hiện có cho các hạng mục.

## 3. Phạm vi hệ thống và tác nhân

- Người dùng (User): Đăng ký/đăng nhập (local/Google), tạo ví, danh mục, giao dịch, phân bổ ngân sách, xem phân tích.
- Hệ thống: Lưu trữ và xử lý dữ liệu; tính tổng thu/chi, số dư, báo cáo tháng.

## 4. Tính năng cấp cao

- Quản lý xác thực: đăng ký, đăng nhập, đăng nhập Google, lấy thông tin người dùng hiện tại.
- Quản lý ví: tạo/sửa/xóa, xem danh sách, tự động cập nhật số dư khi có giao dịch.
- Quản lý danh mục: tạo/sửa/xóa, khởi tạo mẫu, cập nhật hạn mức ngân sách, thống kê số tiền đã tiêu trong tháng.
- Giao dịch: lọc/phan trang, tạo/sửa/xóa, tự động điều chỉnh số dư ví (hoàn tác khi sửa/xóa).
- Ngân sách/ZBB: tổng hợp thu nhập, số dư toàn bộ ví, tổng đã chi, còn lại để phân bổ; cập nhật phân bổ theo danh mục.
- Phân tích: biểu đồ thu/chi theo tháng, theo danh mục, xu hướng 6 tháng gần nhất.

## 5. Yêu cầu chức năng chi tiết

### 5.1 Xác thực

- FR-AUTH-1: Đăng ký với `name`, `email`, `password` (>=6 ký tự).
- FR-AUTH-2: Đăng nhập email/password.
- FR-AUTH-3: Đăng nhập Google OAuth; cấp JWT 7 ngày.
- FR-AUTH-4: Lấy người dùng hiện tại qua token hợp lệ.

### 5.2 Ví

- FR-WAL-1: Xem danh sách ví của chính mình.
- FR-WAL-2: Tạo ví mới: `name`, `balance`, `icon`, `color`, `isDefault`.
- FR-WAL-3: Sửa thuộc tính ví; chỉ chỉnh được ví của chính mình.
- FR-WAL-4: Xóa 1 ví hoặc xóa tất cả ví của mình.

### 5.3 Danh mục

- FR-CAT-1: Xem danh mục; trả thêm trường `spent` của tháng hiện tại.
- FR-CAT-2: Tạo danh mục: `name`, `type`, `group`, `budgeted_amount`, `isDefault`.
- FR-CAT-3: Sửa danh mục; cập nhật chọn lọc các trường.
- FR-CAT-4: Xóa 1 hoặc tất cả danh mục của mình.
- FR-CAT-5: Khởi tạo danh mục mẫu hàng loạt.
- FR-CAT-6: Cập nhật hạn mức ngân sách 1 danh mục.
- FR-CAT-7: Phân bổ ngân sách hàng loạt theo tháng/năm.

### 5.4 Giao dịch

- FR-TRX-1: Lọc giao dịch, phân trang; tham số: `page, limit, type, category, startDate, endDate, min, max, sortBy, sortOrder, search, currency`.
- FR-TRX-2: Tạo giao dịch; cập nhật số dư ví theo loại thu/chi.
- FR-TRX-3: Sửa giao dịch; hoàn tác ảnh hưởng cũ rồi áp dụng ảnh hưởng mới lên ví.
- FR-TRX-4: Xóa giao dịch; hoàn tác ảnh hưởng lên số dư ví.
- FR-TRX-5: Thống kê tổng thu/chi/balance và số lượng theo khoảng ngày.

### 5.5 Ngân sách và tổng quan tháng

- FR-BUD-1: Lấy tổng quan ngân sách: `totalIncome`, `totalWalletBalance`, `totalBudgeted`, `totalSpent`, `remainingToBudget`, `savings`, `savingsPercentage` theo tháng/năm.

### 5.6 Giao diện

- FR-UI-1: Onboarding (giới thiệu, chọn danh mục mẫu nếu chưa có dữ liệu).
- FR-UI-2: Dashboard: thẻ số liệu, biểu đồ cột/đường/bánh.
- FR-UI-3: Màn ngân sách: modal phân bổ với nút +/− cho từng danh mục.
- FR-UI-4: Quản lý ví, giao dịch, cài đặt; responsive.
- FR-UI-5: Nút “+” trung tâm ở bottom nav là hành động duy nhất để tạo mới:
  - Nếu CHƯA có ví → hiển thị WalletPromptModal → mở WalletManagementModal để tạo ví.
  - Nếu ĐÃ có ví → mở TransactionModal để thêm giao dịch.
  - Các nút “+ Thu nhập/Chi tiêu/Thêm giao dịch” ở trang ngân sách đã được loại bỏ để tránh trùng lặp.

## 6. Yêu cầu phi chức năng

- NFR-SEC-1: JWT trong header `Authorization: Bearer`.
- NFR-SEC-2: CORS whitelist theo `server/server.js`.
- NFR-PERF-1: Phân trang 1–200 mục/trang.
- NFR-REL-1: Nhất quán số dư ví khi sửa/xóa giao dịch.
- NFR-USAB-1: UI Tailwind, trạng thái loading rõ ràng, hỗ trợ mobile.
- NFR-I18N-1: Tiền tệ VND; định dạng qua `CurrencyContext`/`utils/currency.js`.

## 7. Ràng buộc & giả định

- Backend hiện hỗ trợ VND; có thể mở rộng đa tiền tệ.
- Yêu cầu env: `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- Tính theo thời gian server khi xác định tháng hiện tại.

## 8. Mô hình dữ liệu (Mongoose)

- User(name, email unique, password hash, googleId, authProvider).
- Wallet(name, balance, icon, color, isDefault, user).
- Category(name, type, group, budgeted_amount, icon, isDefault, user; JSON thêm `budgetLimit`).
- Transaction(user, type, amount, currency VND, date, category, wallet, note; index phục vụ truy vấn).

## 9. API REST (Base `/api`)

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/google`.
- Wallets: `GET /wallets`, `POST /wallets`, `PUT /wallets/:id`, `DELETE /wallets/:id`, `DELETE /wallets/all`.
- Categories: `GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`, `DELETE /categories/all`, `POST /categories/initialize`, `PUT /categories/:id/budget`, `POST /categories/allocate-budgets`, `GET /categories/budget-summary`.
- Transactions: `GET /transactions`, `GET /transactions/:id`, `POST /transactions`, `PUT /transactions/:id`, `DELETE /transactions/:id`, `DELETE /transactions/all`, `GET /transactions/stats/summary`.

## 10. Luồng UI

- Đăng nhập/Đăng ký → Dashboard.
- Nếu chưa có danh mục: Onboarding → khởi tạo danh mục mẫu → về Dashboard.
- Ngân sách: mở `BudgetAllocationModal` → nhập phân bổ → lưu.
- Giao dịch: thêm/sửa/xóa → số dư ví cập nhật → biểu đồ/tổng quan tự làm mới.
- Nút “+” trung tâm: nếu chưa có ví thì hiển thị `WalletPromptModal` → `WalletManagementModal`; nếu đã có ví thì mở `TransactionModal`.

## 11. Kiểm thử chấp nhận (mẫu)

- Tạo giao dịch thu +100k vào ví A → số dư ví A tăng 100k.
- Sửa giao dịch chi 50k thành 80k → số dư ví giảm thêm 30k.
- Danh mục X có giao dịch chi trong tháng → `GET /categories` trả `spent` tăng tương ứng.
- `remainingToBudget` = tổng số dư ví − tổng chi thực tế.

## 12. Triển khai & cấu hình

- Frontend: chạy ở thư mục gốc, `npm run dev`.
- Backend: thư mục `server/`, `npm install` + `npm start`; set `.env` theo mục 7.
- CORS: theo `server/server.js`.

## 13. Bảo trì & mở rộng

- Mở rộng đa tiền tệ; thêm quy đổi.
- Thêm role quản trị nếu cần.

---

Tài liệu phản ánh trạng thái mã nguồn hiện tại; cần cập nhật khi tính năng thay đổi.

## 14. UML Diagrams

Các sơ đồ UML chi tiết (Use Case, Activity, Sequence, Class, Component, Deployment, State, ERD, Data Flow) được tách riêng trong file **[UML.md](./UML.md)** để dễ quản lý và theo dõi.

File `UML.md` bao gồm:

- Use Case Diagram – Quản lý tài chính cá nhân
- Activity Diagram – Thêm giao dịch và cập nhật số dư ví
- Sequence Diagram – Tạo giao dịch
- Class Diagram – Mô hình dữ liệu chính
- Component Diagram – Kiến trúc tổng thể
- Deployment Diagram – Kiến trúc triển khai
- State Diagram – Onboarding Flow
- ERD – Entity Relationship Diagram
- Data Flow Diagram – Luồng dữ liệu phân bổ ngân sách

Tất cả các sơ đồ sử dụng định dạng Mermaid và có thể xem trực tiếp trên GitHub, VS Code với extension hỗ trợ, hoặc tại https://mermaid.live/.
