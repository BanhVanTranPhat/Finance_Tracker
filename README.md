# 💰 MoneyFlow - Ứng dụng Quản lý Tài chính Cá nhân Thông minh

![React](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

MoneyFlow là một ứng dụng MERN stack (MongoDB, Express, React, Node.js) toàn diện, giúp bạn theo dõi thu chi, phân tích tài chính và đạt được các mục tiêu ngân sách một cách trực quan và hiệu quả.

---

## 📖 Mục lục

- [Ảnh màn hình](#-ảnh-màn-hình)
- [Chức năng chính](#-chức-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt và Chạy Project](#-cài-đặt-và-chạy-project)
- [Cấu hình Google OAuth (Tùy chọn)](#-cấu-hình-google-oauth-tùy-chọn)
- [Cấu trúc Project](#-cấu-trúc-project)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)
- [Scripts có sẵn](#-scripts-có-sẵn)
- [Contributing](#-contributing)
- [Tác giả](#-tác-giả)

---

## 📸 Ảnh màn hình

<details>
<summary>Nhấn để xem ảnh chụp màn hình ứng dụng</summary>

### 🏠 Trang chủ - Dashboard

<img width="800" alt="Dashboard" src="https://github.com/user-attachments/assets/16c3c181-f17d-4b36-8c53-25752c930413">
<em>Tổng quan tài chính với biểu đồ thu chi và thống kê</em>

### 📊 Phân tích tài chính

<img width="800" alt="Analytics" src="https://github.com/user-attachments/assets/767bad29-297d-44fe-ac06-ea0a20919f3d">
<em>Biểu đồ phân tích chi tiết theo tháng và danh mục</em>

### 💳 Quản lý giao dịch

<img width="800" alt="Transactions" src="https://github.com/user-attachments/assets/f0fbdbd7-e8b2-4635-b79b-e88111ec6b33">
<em>Danh sách và quản lý các giao dịch thu chi</em>

### 🎯 Mục tiêu ngân sách

<img width="800" alt="Budget Goals" src="https://github.com/user-attachments/assets/d3ba53fa-31bd-4c01-85f0-88ec334a6cbe">
<em>Thiết lập và theo dõi mục tiêu ngân sách</em>

### 🔐 Đăng nhập/Đăng ký

<img width="400" alt="Authentication 1" src="https://github.com/user-attachments/assets/7758c36e-be71-4965-8470-686987e0735c">
<img width="400" alt="Authentication 2" src="https://github.com/user-attachments/assets/a8e12e93-41bf-4d55-be01-7b114a9104dc">
<em>Hệ thống xác thực với Google OAuth và tài khoản local</em>

</details>

---

## ✨ Chức năng chính

### 🔐 Xác thực và Bảo mật
- ✅ **Đăng ký/Đăng nhập** với email và mật khẩu
- ✅ **Google OAuth** - Đăng nhập nhanh bằng Google
- ✅ **JWT Authentication** - Bảo mật API
- ✅ **Password Hashing** - Mã hóa mật khẩu an toàn
- ✅ **Session Management** - Quản lý phiên đăng nhập

### 💰 Quản lý Giao dịch
- ✅ **Thêm/Sửa/Xóa** giao dịch thu chi
- ✅ **Phân loại giao dịch** theo danh mục
- ✅ **Tìm kiếm và lọc** giao dịch
- ✅ **Xuất dữ liệu CSV** để backup
- ✅ **Import/Export** dữ liệu
- ✅ **Ghi chú chi tiết** cho mỗi giao dịch

### 📊 Phân tích và Báo cáo
- ✅ **Dashboard tổng quan** với thống kê chính
- ✅ **Biểu đồ thu chi** theo tháng
- ✅ **Phân tích theo danh mục** với biểu đồ tròn
- ✅ **So sánh thu chi** theo thời gian
- ✅ **Xu hướng tài chính** với biểu đồ đường
- ✅ **Thống kê chi tiết** theo ngày/tuần/tháng

### 🎯 Mục tiêu và Ngân sách
- ✅ **Thiết lập mục tiêu** ngân sách hàng tháng
- ✅ **Theo dõi tiến độ** đạt mục tiêu
- ✅ **Cảnh báo vượt ngân sách**
- ✅ **Phân tích hiệu quả** chi tiêu
- ✅ **Đề xuất điều chỉnh** ngân sách

### 📱 Giao diện và Trải nghiệm
- ✅ **Responsive Design** - Tối ưu cho mọi thiết bị
- ✅ **Dark/Light Mode** - Chế độ sáng/tối
- ✅ **Mobile Navigation** - Điều hướng dễ dàng trên mobile
- ✅ **Onboarding Flow** - Hướng dẫn người dùng mới
- ✅ **Loading States** - Trạng thái tải mượt mà
- ✅ **Error Handling** - Xử lý lỗi thân thiện

### 🔧 Tính năng Kỹ thuật
- ✅ **Real-time Updates** - Cập nhật dữ liệu thời gian thực
- ✅ **Data Validation** - Kiểm tra dữ liệu đầu vào
- ✅ **API Rate Limiting** - Giới hạn tần suất gọi API
- ✅ **CORS Configuration** - Cấu hình bảo mật
- ✅ **TypeScript** - Type safety và IntelliSense
- ✅ **ESLint** - Kiểm tra code quality

---

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18.3.1** - UI Framework
- **TypeScript 5.2.2** - Type Safety
- **Vite 5.3.1** - Build Tool
- **Tailwind CSS 3.4.4** - Styling
- **Radix UI** - Component Library
- **Chart.js 4.5.0** - Data Visualization
- **Recharts 3.3.0** - Advanced Charts
- **Formik + Yup** - Form Handling
- **Axios 1.6.0** - HTTP Client

### Backend
- **Node.js** - Runtime Environment
- **Express.js 5.1.0** - Web Framework
- **MongoDB 8.19.1** - Database
- **Mongoose 8.19.1** - ODM
- **JWT 9.0.2** - Authentication
- **bcryptjs 2.4.3** - Password Hashing
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **Google Auth Library 10.4.0** - Google OAuth

---

## 🚀 Cài đặt và Chạy Project

### 📋 Yêu cầu hệ thống

- **Node.js** (phiên bản 16 trở lên)
- **MongoDB** (local hoặc MongoDB Atlas)
- **npm** hoặc **yarn**
- **Git**

### 🔧 Bước 1: Clone Repository

```bash
git clone [https://github.com/BanhVanTranPhat/Finance_Tracker.git](https://github.com/BanhVanTranPhat/Finance_Tracker.git)
cd Finance_Tracker
