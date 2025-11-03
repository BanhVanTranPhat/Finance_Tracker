# 📚 Finance Tracker - Tổng quan Project

## 🎯 Giới thiệu

**Finance Tracker** là một ứng dụng quản lý tài chính cá nhân thông minh được xây dựng với MERN stack (MongoDB, Express, React, Node.js). Ứng dụng giúp người dùng theo dõi thu chi, quản lý ngân sách theo danh mục, phân tích xu hướng tài chính và đạt được mục tiêu tài chính.

### 🛠️ Tech Stack

**Frontend:**

- **React 18** - UI Framework
- **Vite** - Build tool & Dev server
- **TailwindCSS** - Styling
- **Formik + Yup** - Form validation
- **Chart.js & Recharts** - Data visualization
- **Lucide React & React Icons** - Icons
- **React Joyride** - Onboarding tour

**Backend:**

- **Node.js + Express** - API server
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Google OAuth 2.0** - Social login

---

## 📁 Cấu trúc Thư mục

```
Finance_Tracker/
│
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ui/                   # UI components (empty - có thể xóa)
│   │   ├── AddTransactionModal.jsx
│   │   ├── Analytics*.jsx        # Analytics screens
│   │   ├── Budget*.jsx           # Budget management
│   │   ├── Category*.jsx         # Category management
│   │   ├── Wallet*.jsx           # Wallet management
│   │   ├── Transaction*.jsx      # Transaction components
│   │   ├── ResponsiveLayout.jsx  # Main layout (mobile/desktop)
│   │   └── ...
│   │
│   ├── contexts/                 # React Context Providers
│   │   ├── AuthContext.jsx      # User authentication state
│   │   ├── TransactionContext.jsx # Transactions state
│   │   ├── FinanceContext.jsx   # Categories & budgets state
│   │   ├── CurrencyContext.jsx  # Currency settings
│   │   ├── LanguageContext.jsx  # i18n (Vietnamese/English)
│   │   └── CategoryContext.jsx  # Category selection (onboarding)
│   │
│   ├── pages/                    # Page components
│   │   ├── LandingPage.jsx      # Homepage (chưa login)
│   │   ├── Login.jsx            # Login page
│   │   ├── Register.jsx          # Registration page
│   │   ├── GoogleCallback.jsx   # Google OAuth callback
│   │   ├── OnboardingFlow.jsx  # New user onboarding
│   │   ├── TransactionsPage.jsx # Transactions list page
│   │   └── ...
│   │
│   ├── services/                  # API services
│   │   └── api.js               # Axios instance & API methods
│   │
│   ├── utils/                    # Utility functions
│   │   ├── currency.js          # Currency formatting
│   │   ├── dateFormatter.js     # Date formatting
│   │   ├── translateCategoryName.js # Category translation
│   │   └── getLocalizedCategoryTemplates.js
│   │
│   ├── data/                     # Static data
│   │   └── categoryTemplates.js # Predefined category templates
│   │
│   ├── App.jsx                   # Root component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
│
├── server/                       # Backend API
│   ├── models/                   # MongoDB models
│   │   ├── User.js              # User schema
│   │   ├── Transaction.js       # Transaction schema
│   │   ├── Category.js          # Category schema
│   │   └── Wallet.js            # Wallet schema
│   │
│   ├── routes/                   # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── transactions.js      # Transaction routes
│   │   ├── categories.js        # Category routes
│   │   └── wallets.js           # Wallet routes
│   │
│   ├── middleware/               # Express middleware
│   │   └── auth.js              # JWT authentication middleware
│   │
│   └── server.js                 # Express server entry point
│
├── public/                       # Static assets
├── dist/                         # Build output
└── package.json                  # Frontend dependencies
```

---

## 🔄 Application Flow

### 1. **Authentication Flow**

```
┌─────────────────┐
│  Landing Page   │ → User chọn Login hoặc Register
└────────┬────────┘
         │
    ┌────▼────┐
    │  Login  │ → Email/Password hoặc Google OAuth
    └────┬────┘
         │
    ┌────▼──────────┐
    │ AuthContext   │ → Validate & Store token
    └────┬──────────┘
         │
    ┌────▼──────────┐
    │ Check Onboard │ → Kiểm tra onboarding_completed
    └────┬──────────┘
         │
    ┌────▼──────────┐
    │ Dashboard     │ → Main app
    └───────────────┘
```

**Chi tiết:**

1. User vào **LandingPage** → có thể xem giới thiệu, features
2. Click **Login/Register** → hiển thị form hoặc Google Sign-In button
3. Sau khi authenticate thành công:
   - `AuthContext` lưu token và user vào localStorage
   - Kiểm tra `onboarding_completed` flag
   - Nếu `false` → hiển thị **OnboardingFlow**
   - Nếu `true` → chuyển đến **Dashboard**

### 2. **Onboarding Flow (New User)**

```
┌──────────────────┐
│  IntroScreen     │ → Giới thiệu app, phương pháp Zero-Based Budgeting
└────────┬─────────┘
         │
┌────────▼──────────┐
│ CategorySelection │ → User chọn categories từ templates
└────────┬──────────┘
         │
┌────────▼──────────┐
│ Initialize Data   │ → Tạo categories, default wallet
└────────┬───────────┘
         │
┌────────▼──────────┐
│ Set completed=true│ → Lưu vào localStorage
└────────┬───────────┘
         │
┌────────▼──────────┐
│   Dashboard       │ → Hiển thị tour hướng dẫn
└───────────────────┘
```

**Chi tiết:**

1. **IntroScreen** - Giới thiệu app, giải thích Zero-Based Budgeting
2. **CategorySelectionScreen** - Chọn expense categories từ templates:
   - Template 1: Finance Tracker Style
   - Template 2: 50/30/20 Rule
3. **Initialize Categories** - Gửi selected categories lên backend
4. **Set Flag** - `onboarding_completed = true`
5. **Show Dashboard** - Hiển thị với tour guide tự động

### 3. **Main Application Flow**

```
┌──────────────────┐
│   App.jsx         │ → Root component
│   ┌────────────┐ │
│   │ Providers  │ │ → AuthContext, TransactionContext, FinanceContext...
│   └─────┬──────┘ │
└─────────┼─────────┘
          │
    ┌─────▼─────────┐
    │ Responsive    │ → Detect mobile/desktop
    │ Layout        │
    └─────┬─────────┘
          │
    ┌─────▼──────────────────┐
    │ ┌────────┐ ┌─────────┐ │
    │ │Desktop │ │ Mobile  │ │
    │ │Sidebar │ │ Bottom  │ │
    │ │        │ │  Nav    │ │
    │ └────────┘ └─────────┘ │
    └─────────────────────────┘
          │
    ┌─────▼──────────────────┐
    │ ┌────────────────────┐ │
    │ │  Budget Screen     │ │ → Quản lý ngân sách
    │ │  Wallet Screen     │ │ → Quản lý ví
    │ │  Analytics Screen  │ │ → Phân tích thu chi
    │ │  Transactions Page │ │ → Danh sách giao dịch
    │ └────────────────────┘ │
    └─────────────────────────┘
```

---

## 🧩 Components Chính

### **Layout Components**

#### `ResponsiveLayout.jsx`

- **Vai trò:** Container chính, detect mobile/desktop
- **Features:**
  - Hiển thị `DesktopSidebar` (desktop) hoặc `BottomNav` (mobile)
  - Quản lý active tab state
  - Xử lý routing giữa các screens

#### `DesktopSidebar.jsx` / `BottomNav.jsx`

- **Vai trò:** Navigation menu
- **Tabs:** Budget, Wallet, Analytics, Transactions, Settings

### **Budget Management**

#### `BudgetScreen.jsx` / `BudgetScreenDesktop.jsx`

- **Vai trò:** Màn hình quản lý ngân sách chính
- **Features:**
  - Hiển thị categories với progress bars
  - Phân bổ ngân sách theo tháng
  - Quick actions (add transaction, update balance)

#### `BudgetAllocationModal.jsx`

- **Vai trò:** Modal phân bổ ngân sách vào categories
- **Features:**
  - Drag & drop allocation
  - Real-time validation (không vượt quá balance)

#### `BudgetCategoryList.jsx`

- **Vai trò:** Danh sách categories với budget info
- **Features:**
  - Hiển thị spent/allocated/remaining
  - Edit budget limit
  - Category management actions

### **Wallet Management**

#### `WalletScreen.jsx` / `WalletScreenDesktop.jsx`

- **Vai trò:** Màn hình quản lý ví
- **Features:**
  - Hiển thị tất cả wallets
  - Quick update balance
  - Transfer giữa wallets
  - Create/Edit/Delete wallet

#### `WalletManagementModal.jsx`

- **Vai trò:** Modal create/edit wallet
- **Features:**
  - Chọn wallet type (Cash, Bank, E-wallet)
  - Set default wallet
  - Icon selection

#### `UpdateBalanceModal.jsx`

- **Vai trò:** Quick update wallet balance
- **Features:**
  - Input với số keypad
  - Real-time calculation

#### `TransferMoneyModal.jsx`

- **Vai trò:** Transfer giữa wallets
- **Features:**
  - Select source & destination
  - Add description
  - Validation (không thể transfer đến cùng wallet)

### **Transaction Management**

#### `TransactionModal.jsx`

- **Vai trò:** Modal create/edit transaction
- **Features:**
  - Form với validation (Formik + Yup)
  - Select wallet, category, type (income/expense)
  - Date picker
  - Notes field

#### `TransactionListCRUD.jsx`

- **Vai trò:** Danh sách transactions với CRUD
- **Features:**
  - Filter by date, category, type
  - Sort & search
  - Edit & Delete actions

#### `TransactionsPage.jsx`

- **Vai trò:** Full page transactions list
- **Features:**
  - Analytics sidebar
  - Advanced filtering

### **Analytics**

#### `AnalyticsScreen.jsx`

- **Vai trò:** Màn hình phân tích
- **Features:**
  - Charts (line, bar, pie)
  - Filter by date range
  - Category breakdown

#### `AnalyticsChartScreen.jsx`

- **Vai trò:** Chart components wrapper
- **Libraries:** Recharts

#### `Dashboard.jsx`

- **Vai trò:** Dashboard với summary charts
- **Libraries:** Chart.js, react-chartjs-2

### **Category Management**

#### `CategoryGroupManager.jsx`

- **Vai trò:** Quản lý category groups
- **Features:**
  - Create/edit groups
  - Add categories từ templates
  - Sort categories

#### `CreateCategoryModal.jsx`

- **Vai trò:** Tạo category mới
- **Features:**
  - Select group
  - Set icon & color

#### `CategoryTemplateSelector.jsx`

- **Vai trò:** Chọn template trong onboarding
- **Templates:**
  - Finance Tracker Style
  - 50/30/20 Rule

### **Onboarding**

#### `OnboardingFlow.jsx`

- **Vai trò:** Main onboarding container
- **Flow:** IntroScreen → CategorySelection → Complete

#### `OnboardingTourProvider.jsx`

- **Vai trò:** React Joyride tour guide
- **Features:**
  - Auto-run sau khi onboarding complete
  - Highlight các features chính

### **Settings**

#### `SettingsScreen.jsx` / `SettingsScreenDesktop.jsx`

- **Vai trò:** Settings page
- **Sections:**
  - Profile (edit name, email)
  - Language (VI/EN)
  - Currency
  - Data & Backup (export/delete)
  - Help Center

---

## 🔌 Context Providers

### **AuthContext.jsx**

- **Vai trò:** Quản lý authentication state
- **State:**
  - `user` - Current user object
  - `isLoading` - Loading state
- **Methods:**
  - `login(email, password)` - Local login
  - `register(email, password, name)` - Register
  - `logout()` - Clear session
  - `updateUserProfile(data)` - Update profile
- **Features:**
  - Auto-verify token on mount
  - Handle Google OAuth success
  - Persist session (localStorage)

### **TransactionContext.jsx**

- **Vai trò:** Quản lý transactions state
- **State:**
  - `transactions` - Array of transactions
  - `loading` - Loading state
- **Methods:**
  - `fetchTransactions()` - Load từ API
  - `addTransaction()` - Create new
  - `updateTransaction()` - Update existing
  - `deleteTransaction()` - Delete

### **FinanceContext.jsx**

- **Vai trò:** Quản lý categories & budgets
- **State:**
  - `categories` - Array of categories
  - `wallets` - Array of wallets
  - `budgetSummary` - Budget data
  - `loading` - Loading state
- **Methods:**
  - `fetchCategories()` - Load categories
  - `fetchWallets()` - Load wallets
  - `updateBudget()` - Update budget limits
  - `allocateBudgets()` - Allocate budget to categories

### **CurrencyContext.jsx**

- **Vai trò:** Quản lý currency settings
- **State:**
  - `currency` - Current currency (VND, USD, EUR...)
  - `exchangeRate` - Exchange rate
- **Methods:**
  - `setCurrency()` - Change currency
  - `formatCurrency()` - Format amount

### **LanguageContext.jsx**

- **Vai trò:** Quản lý i18n (internationalization)
- **State:**
  - `language` - Current language ("vi" | "en")
- **Methods:**
  - `setLanguage()` - Change language
  - `t(key)` - Translate function
- **Features:**
  - 700+ translation keys
  - Persist language preference

### **CategoryContext.jsx**

- **Vai trò:** Quản lý category selection trong onboarding
- **State:**
  - `selectedTemplate` - Current template
  - `selectedCategories` - Selected categories array
- **Methods:**
  - `toggleCategory()` - Select/deselect category
  - `setTemplate()` - Set template

---

## 🌐 API Structure (Backend)

### **Authentication Routes** (`server/routes/auth.js`)

```
POST   /api/auth/register      # Đăng ký
POST   /api/auth/login         # Đăng nhập
POST   /api/auth/google        # Google OAuth
GET    /api/auth/me            # Get current user (protected)
PUT    /api/auth/profile       # Update profile (protected)
POST   /api/auth/forgot        # Gửi mã quên mật khẩu (6 số)
POST   /api/auth/reset         # Đặt lại mật khẩu bằng mã
```

### **Transaction Routes** (`server/routes/transactions.js`)

```
GET    /api/transactions                    # Get all (filtered)
GET    /api/transactions/:id               # Get one
POST   /api/transactions                   # Create
PUT    /api/transactions/:id               # Update
DELETE /api/transactions/:id               # Delete
DELETE /api/transactions/all               # Delete all
GET    /api/transactions/stats/summary     # Get statistics
```

### **Category Routes** (`server/routes/categories.js`)

```
GET    /api/categories                     # Get all
POST   /api/categories                    # Create
PUT    /api/categories/:id                # Update
DELETE /api/categories/:id                # Delete
DELETE /api/categories/all                # Delete all
POST   /api/categories/initialize         # Initialize from template
GET    /api/categories/budget-summary     # Get budget summary
PUT    /api/categories/:id/budget         # Update budget limit
POST   /api/categories/allocate-budgets   # Allocate budgets
```

### **Wallet Routes** (`server/routes/wallets.js`)

```
GET    /api/wallets                       # Get all
POST   /api/wallets                       # Create
PUT    /api/wallets/:id                   # Update
DELETE /api/wallets/:id                   # Delete
DELETE /api/wallets/all                   # Delete all
```

### **Authentication Middleware** (`server/middleware/auth.js`)

- Verify JWT token từ `Authorization: Bearer <token>` header
- Attach `userId` vào `req.userId`
- Return 401 nếu token invalid/expired

---

## 💾 Database Models

### **User Model** (`server/models/User.js`)

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  createdAt: Date
}
```

### **Transaction Model** (`server/models/Transaction.js`)

```javascript
{
  userId: ObjectId (ref: User),
  type: String ("income" | "expense"),
  amount: Number,
  category: String,
  wallet: String,
  date: Date,
  description: String,
  createdAt: Date
}
```

### **Category Model** (`server/models/Category.js`)

```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  group: String,
  icon: String,
  color: String,
  budgetLimit: Number,
  allocations: [{
    year: Number,
    month: Number,
    amount: Number
  }]
}
```

### **Wallet Model** (`server/models/Wallet.js`)

```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  type: String ("cash" | "bank" | "ewallet"),
  balance: Number,
  icon: String,
  isDefault: Boolean,
  createdAt: Date
}
```

---

## 🚀 Build & Deployment

### **Development**

```bash
# Frontend only
npm run dev                    # Start Vite dev server (port 5173)

# Backend only
cd server && npm run dev       # Start Express với nodemon (port 5000)

# Fullstack (cả 2)
npm run dev:fullstack         # Dùng concurrently
```

### **Build**

```bash
npm run build                  # Build frontend → dist/
```

### **Environment Variables**

**Frontend** (`.env`):

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-client-id
```

**Backend** (`server/.env`):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## 📝 Key Features

### ✅ Đã implement

1. **Authentication**

   - Email/Password login & register
   - Google OAuth 2.0
   - JWT token management
   - Session persistence

2. **Onboarding**

   - Intro screens với animations
   - Category template selection
   - Auto tour guide

3. **Budget Management**

   - Zero-based budgeting method
   - Category-based budget allocation
   - Monthly budget tracking
   - Budget vs Spent visualization

4. **Transaction Management**

   - CRUD operations
   - Filter & search
   - Date range filtering
   - Category/Type filtering

5. **Wallet Management**

   - Multiple wallets (Cash, Bank, E-wallet)
   - Balance tracking
   - Transfer between wallets
   - Default wallet setting

6. **Analytics**

   - Income/Expense charts
   - Category breakdown
   - Trend analysis (6 months)
   - Savings rate calculation

7. **Settings**

   - Profile management
   - Language switching (VI/EN)
   - Currency selection
   - Data export (CSV)
   - Delete all data

8. **Responsive Design**
   - Mobile-first approach
   - Desktop sidebar
   - Mobile bottom navigation
   - Adaptive layouts

### 🔄 Data Flow Example

**Add Transaction Flow:**

```
User clicks "Add Transaction"
  ↓
TransactionModal opens
  ↓
User fills form (amount, category, wallet, date...)
  ↓
Formik validates (Yup schema)
  ↓
Submit → transactionAPI.createTransaction()
  ↓
Axios sends POST /api/transactions
  ↓
Backend validates & saves to MongoDB
  ↓
Response → TransactionContext.addTransaction()
  ↓
UI updates (BudgetScreen, AnalyticsScreen refresh)
```

---

## 🎨 Design Patterns

1. **Context API** - State management (không dùng Redux)
2. **Provider Pattern** - Wrap app với multiple contexts
3. **Component Composition** - Reusable components
4. **Custom Hooks** - `useAuth()`, `useFinance()`, etc.
5. **API Service Layer** - Centralized API calls (`services/api.js`)

---

## 📚 Additional Files

- `README.md` - Hướng dẫn setup & usage
- `SRS.md` - Software Requirements Specification
- `UML.md` - UML diagrams
- `env-config.md` - Environment variables guide

---

## 🐛 Known Issues / Future Improvements

1. **Thư mục trống:** `src/components/ui/`, `src/lib/` - có thể xóa nếu không dùng
2. **Google OAuth:** Cần configure redirect URI trong Google Console
3. **MongoDB:** Cần setup MongoDB Atlas hoặc local MongoDB
4. **Deployment:** Chưa có CI/CD, cần setup manually

---

## 📞 Support

Xem `README.md` để biết cách setup và troubleshoot.

---

**Last Updated:** 2024
**Version:** 1.0.0
