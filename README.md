<p align="center">
  <img src="./d38da7c0-9611-4e33-bcdb-d518efcd415b.png" alt="Finance Tracker Logo" width="280"/>
</p>

<h1 align="center">💰 MoneyFlow - Ứng dụng Quản lý Tài chính Cá nhân Thông Minh</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white" alt="React Badge"/>
  <img src="https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript&logoColor=white" alt="TypeScript Badge"/>
  <img src="https://img.shields.io/badge/Node.js-Express-43853D?logo=node.js&logoColor=white" alt="Node.js Badge"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" alt="MongoDB Badge"/>
</p>

---
# 💰 MoneyFlow - Ứng dụng Quản lý Tài chính Cá nhân Thông minh

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
![Dashboard](https://github.com/user-attachments/assets/16c3c181-f17d-4b36-8c53-25752c930413)  
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
![Login](https://github.com/user-attachments/assets/7758c36e-be71-4965-8470-686987e0735c)
![Register](https://github.com/user-attachments/assets/a8e12e93-41bf-4d55-be01-7b114a9104dc)  
_Hệ thống xác thực với Google OAuth và tài khoản local_

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
````

---

### 📦 Bước 2: Cài đặt Dependencies

#### ✅ Cách 1: Cài đặt tự động (Khuyến nghị)

```bash
npm run install:all
```

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
```

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

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
* **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Cấu hình Google OAuth (Tùy chọn)

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Kích hoạt **Google+ API**
4. Tạo **OAuth 2.0 Client ID** → Loại *Web application*
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

* ✅ Đăng ký / Đăng nhập
* ✅ Google OAuth
* ✅ JWT Authentication
* ✅ Password Hashing
* ✅ Session Management

### 💰 Quản lý Giao dịch

* ✅ CRUD giao dịch
* ✅ Phân loại danh mục
* ✅ Tìm kiếm / Lọc
* ✅ Xuất CSV
* ✅ Ghi chú giao dịch

### 📊 Phân tích & Báo cáo

* ✅ Dashboard tổng quan
* ✅ Biểu đồ thu chi / danh mục / xu hướng
* ✅ Thống kê ngày / tuần / tháng

### 🎯 Ngân sách & Mục tiêu

* ✅ Thiết lập mục tiêu
* ✅ Theo dõi tiến độ
* ✅ Cảnh báo vượt ngân sách

### 📱 Giao diện & Trải nghiệm

* ✅ Responsive Design
* ✅ Dark / Light Mode
* ✅ Onboarding Flow
* ✅ Loading & Error Handling

---

## 🛠️ Công nghệ sử dụng

### 🖥️ Frontend

| Công nghệ                  | Mô tả             |
| -------------------------- | ----------------- |
| ⚛️ **React 18.3.1**        | UI Framework      |
| 🟦 **TypeScript 5.2.2**    | Type Safety       |
| ⚡ **Vite 5.3.1**           | Build Tool        |
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

| Method | Endpoint             | Mô tả              |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | Đăng ký            |
| POST   | `/api/auth/login`    | Đăng nhập          |
| POST   | `/api/auth/google`   | Google OAuth       |
| GET    | `/api/auth/me`       | Lấy thông tin user |

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

* Dùng **MongoDB Atlas**
* Deploy lên **Railway**, **Render**, hoặc **Vercel**

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

* 🌐 GitHub: [@BanhVanTranPhat](https://github.com/BanhVanTranPhat)
* ✉️ Email: [phatbanh2@gmail.com](mailto:phatbanh2@gmail.com)

---

## 🙏 Acknowledgments

* [React](https://reactjs.org/)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Chart.js](https://www.chartjs.org/)
* [Google OAuth](https://developers.google.com/identity)

---

⭐ **Nếu project này hữu ích, hãy cho một star nhé!** ⭐

```

---

Bạn có muốn mình **thêm banner logo “MoneyFlow” ở đầu file** (ảnh dạng hero như GitHub project chuyên nghiệp) không?  
Nếu bạn gửi ảnh banner hoặc mô tả phong cách (ví dụ: “màu xanh lá, có icon tiền + biểu đồ”), mình sẽ tạo giúp 1 banner PNG đẹp chuẩn GitHub header.
```
