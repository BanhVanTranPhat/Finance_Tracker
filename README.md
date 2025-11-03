<p align="center">
  <img src="https://github.com/user-attachments/assets/22ac371f-badb-44ab-a7cc-535fc8bfe3ca" alt="Finance Tracker Logo" width="280"/>
</p>

# 💰 Finance Tracker - Ứng dụng Quản lý Tài chính Cá nhân Thông minh

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.4-06B6D4?logo=tailwindcss&logoColor=white" />
</p>

---

## 📸 Ảnh màn hình

### 🏠 Trang chủ - Dashboard

<!-- Screenshot: Dashboard -->

![Dashboard - PLACEHOLDER](PUT_YOUR_DASHBOARD_IMAGE_URL_HERE)
_Tổng quan tài chính với biểu đồ thu chi và thống kê_

---

### 📊 Phân tích tài chính

![Analytics](https://github.com/user-attachments/assets/767bad29-297d-44fe-ac06-ea0a20919f3d)  
_Biểu đồ phân tích chi tiết theo tháng và danh mục_

---

### 💳 Quản lý giao dịch

![Transactions](https://github.com/user-attachments/assets/f0fbdbd7-e8b2-4635-b79b-e88111ec6b33)  
_Danh sách và quản lý các giao dịch thu chi_

---

### 🎯 Mục tiêu ngân sách

![Budget Goals](https://github.com/user-attachments/assets/d3ba53fa-31bd-4c01-85f0-88ec334a6cbe)  
_Thiết lập và theo dõi mục tiêu ngân sách_

---

### 🔐 Đăng nhập / Đăng ký

<!-- Screenshot: Login / Register -->

![Login - PLACEHOLDER](PUT_YOUR_LOGIN_IMAGE_URL_HERE)
![Register - PLACEHOLDER](PUT_YOUR_REGISTER_IMAGE_URL_HERE)  
_Hệ thống xác thực với Google OAuth và tài khoản local_

### 🔁 Quên/Đặt lại mật khẩu

<!-- Screenshot: Settings - Reset password (Desktop) -->

![Settings - Reset password (Desktop) - PLACEHOLDER](PUT_YOUR_SETTINGS_DESKTOP_RESET_IMAGE_URL_HERE)

<!-- Screenshot: Settings - Reset password (Mobile) -->

![Settings - Reset password (Mobile) - PLACEHOLDER](PUT_YOUR_SETTINGS_MOBILE_RESET_IMAGE_URL_HERE)
_Gửi mã 6 số về email và đặt lại mật khẩu trực tiếp trong Cài đặt_

---

## 🚀 Cài đặt và Chạy Project

### 📋 Yêu cầu hệ thống

- **Node.js** ≥ 16
- **MongoDB** (local hoặc MongoDB Atlas)
- **npm** hoặc **yarn**
- **Git**

---

### 🔧 Bước 1: Clone Repository

```bash
git clone https://github.com/BanhVanTranPhat/Finance_Tracker.git
cd Finance_Tracker
```

---

### 📦 Bước 2: Cài đặt Dependencies

#### ✅ Cách 1: Cài đặt tự động (Khuyến nghị)

```bash
npm run install:all
```

Lưu ý: dự án dùng thư viện hướng dẫn `react-joyride`. Nếu bạn cài đặt thủ công, hãy đảm bảo chạy `npm install` ở thư mục root để cài đúng phiên bản mới nhất.

#### 🧩 Cách 2: Cài đặt thủ công

```bash
# Cài đặt frontend
npm install

# Cài đặt backend
cd server
npm install
cd ..
```

---

### ⚙️ Bước 3: Cấu hình Environment Variables

#### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

#### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# SMTP - gửi email quên mật khẩu
# Lựa chọn A) SendGrid SMTP (khuyến nghị, không đổi code)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=YOUR_SENDGRID_API_KEY
MAIL_FROM="Finance Tracker <verified_sender@example.com>"  # email đã Verify trong SendGrid

# Lựa chọn B) Gmail SMTP
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=465
# SMTP_SECURE=true
# SMTP_USER=your.gmail@gmail.com
# SMTP_PASS=your-gmail-app-password
# MAIL_FROM="Finance Tracker <your.gmail@gmail.com>"
```

> Nếu KHÔNG cấu hình SMTP, hệ thống tự động log nội dung email ra console (dev) và không gửi mail thật.

---

### 🗄️ Bước 4: Khởi động MongoDB

**Windows**

```bash
net start MongoDB
# hoặc
mongod
```

**macOS / Linux**

```bash
sudo systemctl start mongod
# hoặc
mongod
```

---

### 🚀 Bước 5: Chạy Ứng dụng

#### ✅ Cách 1: Script Tự động

```bash
start.bat
```

#### 🧩 Cách 2: Chạy thủ công

**Terminal 1 - Backend**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**

```bash
npm run dev
```

---

### 🌐 Truy cập Ứng dụng

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Cấu hình Google OAuth (Tùy chọn)

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Kích hoạt **Google+ API**
4. Tạo **OAuth 2.0 Client ID** → Loại _Web application_
5. Thêm URI hợp lệ:

   ```
   http://localhost:3000
   http://localhost:5173
   http://127.0.0.1:5173
   ```

6. Sao chép Client ID vào `.env` và `server/.env`

---

## ✨ Chức năng chính

### 🔐 Xác thực & Bảo mật

- ✅ Đăng ký / Đăng nhập
- ✅ Google OAuth
- ✅ JWT Authentication
- ✅ Password Hashing
- ✅ Session Management

### 💰 Quản lý Giao dịch

- ✅ CRUD giao dịch
- ✅ Phân loại danh mục
- ✅ Tìm kiếm / Lọc
- ✅ Xuất CSV
- ✅ Ghi chú giao dịch

### 📊 Phân tích & Báo cáo

- ✅ Dashboard tổng quan
- ✅ Biểu đồ thu chi / danh mục / xu hướng
- ✅ Thống kê ngày / tuần / tháng

### 🎯 Ngân sách & Mục tiêu

- ✅ Thiết lập mục tiêu
- ✅ Theo dõi tiến độ
- ✅ Cảnh báo vượt ngân sách

### 📱 Giao diện & Trải nghiệm

- ✅ Responsive Design
- ✅ Dark / Light Mode
- ✅ Onboarding Flow (tour tự chạy cho người dùng mới)
- ✅ Loading & Error Handling

#### Onboarding & Trợ giúp cho người mới

- Người dùng mới đăng ký/đăng nhập lần đầu sẽ tự động thấy tour ngắn hướng dẫn các điểm chính: Quản lý nhóm danh mục, Chỉnh sửa ngân sách, Cập nhật số dư ví, Thêm giao dịch.
- Một số gợi ý ngữ cảnh (Context Tip) hiển thị một lần ở: Quản lý nhóm danh mục và Cập nhật số dư ví.
- Có thể mở lại hướng dẫn bất kỳ lúc nào ở: Cài đặt → Hướng dẫn sử dụng → “Bắt đầu lại hướng dẫn”. Mục này không làm đăng xuất tài khoản.

---

## 🛠️ Công nghệ sử dụng

### 🖥️ Frontend

| Công nghệ                  | Mô tả             |
| -------------------------- | ----------------- |
| ⚛️ **React 18.3.1**        | UI Framework      |
| 🟦 **TypeScript 5.2.2**    | Type Safety       |
| ⚡ **Vite 5.3.1**          | Build Tool        |
| 🎨 **Tailwind CSS 3.4.4**  | Styling           |
| 🧩 **Radix UI**            | Component Library |
| 📊 **Chart.js / Recharts** | Biểu đồ           |
| 📝 **Formik + Yup**        | Form Handling     |
| 🌐 **Axios**               | HTTP Client       |

### ⚙️ Backend

| Công nghệ                  | Mô tả          |
| -------------------------- | -------------- |
| 🟩 **Node.js + Express**   | Web Server     |
| 🍃 **MongoDB + Mongoose**  | Database       |
| 🔐 **JWT + bcryptjs**      | Authentication |
| 🚫 **CORS**                | Bảo mật        |
| 🔑 **Google Auth Library** | OAuth          |

---

## 📁 Cấu trúc Dự án

```
Finance_Tracker/
├── src/                  # Frontend
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── server/               # Backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── start.bat
├── package.json
└── README.md
```

---

## 🔧 API Endpoints

### Authentication

| Method | Endpoint             | Mô tả                       |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Đăng ký                     |
| POST   | `/api/auth/login`    | Đăng nhập                   |
| POST   | `/api/auth/google`   | Google OAuth                |
| GET    | `/api/auth/me`       | Lấy thông tin user          |
| POST   | `/api/auth/forgot`   | Gửi mã quên mật khẩu (6 số) |
| POST   | `/api/auth/reset`    | Đặt lại mật khẩu bằng mã    |

### Quên/Đặt lại mật khẩu (Flow)

- Từ trang Cài đặt bấm “Đặt lại mật khẩu” (VI) / “Reset password” (EN)
- Gửi mã → Backend tạo mã 6 số (hết hạn 10 phút) và gửi qua email
- Nhập mã + mật khẩu mới → Xác nhận đặt lại

Lưu ý: Backend chống brute-force bằng rate limit và giới hạn số lần nhập mã; dev đã nới hạn mức để không bị 429 khi thử nghiệm.

### Transactions

| Method | Endpoint                          | Mô tả               |
| ------ | --------------------------------- | ------------------- |
| GET    | `/api/transactions`               | Danh sách giao dịch |
| POST   | `/api/transactions`               | Tạo giao dịch       |
| PUT    | `/api/transactions/:id`           | Cập nhật            |
| DELETE | `/api/transactions/:id`           | Xóa                 |
| GET    | `/api/transactions/stats/summary` | Thống kê            |

---

## 🚀 Triển khai (Deployment)

### Backend

- Dùng **MongoDB Atlas**
- Deploy lên **Railway**, **Render**, hoặc **Vercel**

### Frontend

```bash
npm run build
```

Deploy lên **Vercel**, **Netlify**, hoặc **GitHub Pages**

---

## 🐛 Troubleshooting

**MongoDB không chạy**

```bash
mongosh
net start MongoDB        # Windows
sudo systemctl start mongod  # Linux
```

**Port bị chiếm**

```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Lỗi Dependencies**

```bash
rm -rf node_modules server/node_modules
npm run install:all
```

**Không thấy tour hướng dẫn**

- Hãy vào Dashboard sau khi đăng nhập (tab Ngân sách).
- Với tài khoản mới, tour sẽ tự bật. Nếu không, vào Cài đặt → Hướng dẫn sử dụng → “Bắt đầu lại hướng dẫn”.
- Có thể xoá các khóa localStorage: `tour_dismissed`, `tour_seen_once_<userId>` rồi reload.

---

## 📝 Scripts có sẵn

```bash
# Frontend
npm run dev
npm run build
npm run preview
npm run lint

# Backend
cd server
npm run dev
npm start

# Cả hai
npm run install:all
```

---

## 🤝 Contributing

1. Fork repo
2. Tạo nhánh: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m "Add some AmazingFeature"`
4. Push: `git push origin feature/AmazingFeature`
5. Tạo Pull Request

---

## 📄 License

Phân phối theo giấy phép **MIT**.
Xem file `LICENSE` để biết thêm chi tiết.

---

## 👨‍💻 Tác giả

**BanhVanTranPhat**

- 🌐 GitHub: [@BanhVanTranPhat](https://github.com/BanhVanTranPhat)
- ✉️ Email: [phatbanh2@gmail.com](mailto:phatbanh2@gmail.com)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [Google OAuth](https://developers.google.com/identity)

---

⭐ **Nếu project này hữu ích, hãy cho một star nhé!** ⭐

```

```
