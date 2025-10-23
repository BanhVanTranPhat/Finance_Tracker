# 💰 MoneyFlow - Ứng dụng Quản lý Tài chính Cá nhân Thông minh

![MoneyFlow](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## 📸 Ảnh màn hình

### 🏠 Trang chủ - Dashboard

![Dashboard](https://via.placeholder.com/800x400/10b981/ffffff?text=Dashboard+Overview)
_Tổng quan tài chính với biểu đồ thu chi và thống kê_

### 📊 Phân tích tài chính

![Analytics](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Analytics+Charts)
_Biểu đồ phân tích chi tiết theo tháng và danh mục_

### 💳 Quản lý giao dịch

![Transactions](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=Transaction+Management)
_Danh sách và quản lý các giao dịch thu chi_

### 🎯 Mục tiêu ngân sách

![Budget Goals](https://via.placeholder.com/800x400/f59e0b/ffffff?text=Budget+Goals)
_Thiết lập và theo dõi mục tiêu ngân sách_

### 🔐 Đăng nhập/Đăng ký

![Authentication](https://via.placeholder.com/800x400/ef4444/ffffff?text=Login+Register)
_Hệ thống xác thực với Google OAuth và tài khoản local_

## 🚀 Cài đặt và Chạy Project

### 📋 Yêu cầu hệ thống

- **Node.js** (phiên bản 16 trở lên)
- **MongoDB** (local hoặc MongoDB Atlas)
- **npm** hoặc **yarn**
- **Git**

### 🔧 Bước 1: Clone Repository

```bash
git clone https://github.com/BanhVanTranPhat/Finance_Tracker.git
cd Finance_Tracker
```

### 📦 Bước 2: Cài đặt Dependencies

#### Cách 1: Cài đặt tự động (Khuyến nghị)

```bash
npm run install:all
```

#### Cách 2: Cài đặt thủ công

```bash
# Cài đặt frontend dependencies
npm install

# Cài đặt backend dependencies
cd server
npm install
cd ..
```

### ⚙️ Bước 3: Cấu hình Environment Variables

#### Frontend (.env)

Tạo file `.env` trong thư mục gốc:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

#### Backend (server/.env)

Tạo file `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 🗄️ Bước 4: Khởi động MongoDB

#### Windows:

```bash
# Khởi động MongoDB service
net start MongoDB

# Hoặc chạy trực tiếp
mongod
```

#### macOS/Linux:

```bash
# Khởi động MongoDB
sudo systemctl start mongod
# hoặc
mongod
```

### 🚀 Bước 5: Chạy Ứng dụng

#### Cách 1: Sử dụng Script Tự động (Khuyến nghị)

```bash
# Chạy file start.bat (Windows)
start.bat
```

#### Cách 2: Chạy Thủ công

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

### 🌐 Truy cập Ứng dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 🔐 Cấu hình Google OAuth (Tùy chọn)

### 1. Tạo Google OAuth Client ID

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Google+ API
4. Vào **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Chọn **Web application**
6. Thêm các URI được phép:
   - `http://localhost:3000`
   - `http://localhost:4173`
   - `http://localhost:5173`
   - `http://127.0.0.1:3000`
   - `http://127.0.0.1:4173`
   - `http://127.0.0.1:5173`

### 2. Cập nhật Environment Variables

Sao chép Client ID vào file `.env` và `server/.env`:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_ID=your-google-client-id-here
```

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

## 📁 Cấu trúc Project

```
Finance_Tracker/
├── 📁 src/                    # Frontend React app
│   ├── 📁 components/         # React components
│   │   ├── Analytics.tsx      # Biểu đồ phân tích
│   │   ├── BudgetGoals.tsx    # Mục tiêu ngân sách
│   │   ├── Dashboard.tsx      # Trang chủ
│   │   ├── TransactionForm.tsx # Form giao dịch
│   │   └── TransactionList.tsx # Danh sách giao dịch
│   ├── 📁 contexts/          # React contexts
│   │   ├── AuthContext.tsx    # Context xác thực
│   │   └── TransactionContext.tsx # Context giao dịch
│   ├── 📁 pages/             # Page components
│   │   ├── Login.tsx          # Trang đăng nhập
│   │   ├── Register.tsx       # Trang đăng ký
│   │   └── Onboarding.tsx     # Trang hướng dẫn
│   ├── 📁 services/          # API services
│   │   └── api.ts            # API client
│   ├── 📁 utils/             # Utility functions
│   │   └── currency.ts       # Xử lý tiền tệ
│   ├── App.tsx               # Main App component
│   └── main.tsx              # Entry point
├── 📁 server/                # Backend Express app
│   ├── 📁 models/            # MongoDB models
│   │   └── User.js           # User model
│   ├── 📁 routes/            # API routes
│   │   ├── auth.js           # Authentication routes
│   │   └── transactions.js   # Transaction routes
│   ├── 📁 middleware/        # Custom middleware
│   │   └── auth.js           # Auth middleware
│   ├── server.js             # Server entry point
│   └── package.json          # Backend dependencies
├── 📄 package.json           # Frontend dependencies
├── 📄 start.bat              # Auto start script
├── 📄 GOOGLE_OAUTH_SETUP.md  # Google OAuth guide
└── 📄 README.md              # This file
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/google` - Đăng nhập Google OAuth
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Transactions

- `GET /api/transactions` - Lấy danh sách giao dịch
- `POST /api/transactions` - Tạo giao dịch mới
- `PUT /api/transactions/:id` - Cập nhật giao dịch
- `DELETE /api/transactions/:id` - Xóa giao dịch
- `GET /api/transactions/stats/summary` - Thống kê giao dịch

### Health Check

- `GET /api/health` - Kiểm tra trạng thái API

## 🚀 Deployment

### Backend Deployment

1. Thiết lập MongoDB Atlas hoặc cloud MongoDB service
2. Cập nhật environment variables cho production
3. Deploy lên Heroku, Railway, hoặc Vercel

### Frontend Deployment

1. Build project: `npm run build`
2. Deploy lên Vercel, Netlify, hoặc GitHub Pages

## 🐛 Troubleshooting

### Lỗi MongoDB

```bash
# Kiểm tra MongoDB có chạy không
mongosh

# Khởi động lại MongoDB
net start MongoDB  # Windows
sudo systemctl start mongod  # Linux
```

### Lỗi Port đã được sử dụng

```bash
# Tìm process đang sử dụng port
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Lỗi Dependencies

```bash
# Xóa node_modules và cài lại
rm -rf node_modules server/node_modules
npm run install:all
```

### Lỗi Google OAuth

1. Kiểm tra `VITE_GOOGLE_CLIENT_ID` trong `.env`
2. Xác nhận URI được thêm vào Google Cloud Console
3. Kiểm tra CORS configuration

## 📝 Scripts có sẵn

```bash
# Frontend
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Kiểm tra code quality

# Backend
cd server
npm run dev          # Chạy với nodemon
npm start            # Chạy production

# Cả hai
npm run install:all  # Cài đặt tất cả dependencies
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**BanhVanTranPhat**

- GitHub: [@BanhVanTranPhat](https://github.com/BanhVanTranPhat)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Express.js](https://expressjs.com/) - Backend Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Chart.js](https://www.chartjs.org/) - Data Visualization
- [Google OAuth](https://developers.google.com/identity) - Authentication

---

⭐ **Nếu project này hữu ích, hãy cho một star!** ⭐
