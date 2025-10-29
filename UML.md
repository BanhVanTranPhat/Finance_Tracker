# UML Diagrams – Finance Tracker

Phiên bản: 1.0  
Ngày: 2025-10-29

Tài liệu này chứa các sơ đồ UML cho hệ thống Finance Tracker, sử dụng định dạng Mermaid.

> **Lưu ý**: Các sơ đồ dưới đây dùng Mermaid syntax, xem tốt nhất trên GitHub, VS Code với extension Markdown Preview Enhanced, hoặc các công cụ hỗ trợ Mermaid khác.

## 1. Use Case Diagram – Quản lý tài chính cá nhân

Biểu đồ use case mô tả các chức năng chính mà người dùng có thể thực hiện với hệ thống.

```mermaid
usecaseDiagram
    actor User as "Người dùng"
    rectangle "Finance Tracker" {
        (Đăng ký/Đăng nhập)
        (Đăng nhập Google)
        (Quản lý ví)
        (Quản lý danh mục)
        (Ghi chép giao dịch)
        (Phân bổ ngân sách)
        (Xem phân tích)
    }
    User -->(Đăng ký/Đăng nhập)
    User -->(Đăng nhập Google)
    User -->(Quản lý ví)
    User -->(Quản lý danh mục)
    User -->(Ghi chép giao dịch)
    User -->(Phân bổ ngân sách)
    User -->(Xem phân tích)
```

## 2. Activity Diagram – Thêm giao dịch và cập nhật số dư ví

Sơ đồ hoạt động mô tả luồng xử lý khi người dùng thêm một giao dịch mới và hệ thống tự động cập nhật số dư ví.

```mermaid
flowchart TD
    A[Người dùng nhập giao dịch] --> B{Dữ liệu hợp lệ?}
    B -->|Không| E[Hiển thị lỗi]
    B -->|Có| C[POST /api/transactions]
    C --> D{Loại giao dịch}
    D -->|income| F[Tăng số dư ví]
    D -->|expense| G[Giảm số dư ví]
    F --> H[Lưu Transaction + Wallet]
    G --> H
    H --> I[Trả về giao dịch mới]
    I --> J[Cập nhật UI và biểu đồ]
```

## 3. Sequence Diagram – Tạo giao dịch

Biểu đồ trình tự mô tả tương tác giữa các thành phần khi tạo một giao dịch mới.

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend (React)
    participant API as Backend (Express)
    participant DB as MongoDB

    U->>FE: Nhập thông tin giao dịch
    FE->>API: POST /api/transactions<br/>{type, amount, date, category, wallet}
    API->>DB: Tìm ví theo tên (user, wallet)
    DB-->>API: Wallet document
    API->>DB: Cập nhật số dư ví<br/>(balance += amount nếu income,<br/>balance -= amount nếu expense)
    DB-->>API: Wallet (đã cập nhật)
    API->>DB: Lưu Transaction mới
    DB-->>API: Transaction document
    API-->>FE: 201 Created + Transaction
    FE-->>U: Hiển thị kết quả và làm mới số liệu
```

## 4. Class Diagram – Mô hình dữ liệu chính

Biểu đồ lớp mô tả cấu trúc dữ liệu và quan hệ giữa các entity trong hệ thống.

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String password
        +String googleId
        +String authProvider
        +comparePassword(candidatePassword)
    }

    class Wallet {
        +String id
        +String name
        +Number balance
        +String icon
        +String color
        +Boolean isDefault
        +Date createdAt
        +Date updatedAt
    }

    class Category {
        +String id
        +String name
        +String type
        +String group
        +Number budgeted_amount
        +String icon
        +Boolean isDefault
        +Date createdAt
        +Date updatedAt
    }

    class Transaction {
        +String id
        +String type
        +Number amount
        +String currency
        +Date date
        +String category
        +String wallet
        +String note
        +Date createdAt
        +Date updatedAt
    }

    User "1" --> "*" Wallet : owns
    User "1" --> "*" Category : owns
    User "1" --> "*" Transaction : owns
    Transaction --> Wallet : references
    Transaction --> Category : references
```

## 5. Component Diagram – Kiến trúc tổng thể

Sơ đồ thành phần mô tả cấu trúc tổng thể của hệ thống, phân chia các module chính.

```mermaid
flowchart LR
    subgraph Client["Client Layer"]
        FE["React SPA<br/>Contexts + Components"]
    end

    subgraph Server["Backend Layer"]
        Auth["Authentication<br/>Middleware"]
        Routes["API Routes<br/>auth, wallets, categories, transactions"]
        Models["Mongoose Models<br/>User, Wallet, Category, Transaction"]
    end

    subgraph Data["Data Layer"]
        DB[("MongoDB<br/>Database")]
    end

    FE <-->|HTTP/REST| Routes
    Routes --> Auth
    Routes --> Models
    Models <--> DB
```

## 6. Deployment Diagram – Kiến trúc triển khai

Biểu đồ triển khai mô tả cách hệ thống được triển khai trên các môi trường.

```mermaid
flowchart TB
    User[("End User<br/>Browser")]

    subgraph CDN["Static Hosting"]
        Build["Vite Build<br/>dist/"]
    end

    subgraph Server["Backend Server"]
        API["Node.js/Express<br/>Port 5000"]
        Env[".env<br/>MONGO_URI, JWT_SECRET, etc."]
    end

    subgraph Database["Database"]
        DB[("MongoDB<br/>Atlas/Local:27017")]
    end

    User -->|HTTPS| CDN
    User -->|API Calls| API
    CDN -->|Static Assets| User
    API -->|Mongoose| DB
    API --> Env
```

## 7. State Diagram – Onboarding Flow

Biểu đồ trạng thái mô tả các trạng thái trong quy trình onboarding của người dùng mới.

```mermaid
stateDiagram-v2
    [*] --> Intro: User đăng nhập lần đầu
    Intro --> CategorySelection: Click "Tiếp theo"
    CategorySelection --> CategorySelection: Chọn/bỏ chọn danh mục mẫu
    CategorySelection --> Completed: Click "Hoàn thành" và lưu
    Completed --> [*]: Chuyển đến Dashboard

    note right of Intro
        Màn hình giới thiệu
        tính năng chính
    end note

    note right of CategorySelection
        Người dùng chọn
        các danh mục mẫu
        từ template
    end note

    note right of Completed
        Gọi API initialize
        categories và
        lưu vào database
    end note
```

## 8. ERD (Entity Relationship Diagram) – Quan hệ dữ liệu

Sơ đồ quan hệ thực thể mô tả chi tiết các bảng và mối quan hệ trong database.

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string googleId
        string authProvider
        datetime createdAt
        datetime updatedAt
    }

    WALLET {
        ObjectId _id PK
        string name
        number balance
        string icon
        string color
        boolean isDefault
        ObjectId user FK
        datetime createdAt
        datetime updatedAt
    }

    CATEGORY {
        ObjectId _id PK
        string name
        string type
        string group
        number budgeted_amount
        string icon
        boolean isDefault
        ObjectId user FK
        datetime createdAt
        datetime updatedAt
    }

    TRANSACTION {
        ObjectId _id PK
        string type
        number amount
        string currency
        date date
        string category
        string wallet
        string note
        ObjectId user FK
        datetime createdAt
        datetime updatedAt
    }

    USER ||--o{ WALLET : "owns"
    USER ||--o{ CATEGORY : "owns"
    USER ||--o{ TRANSACTION : "owns"
    WALLET ||--o{ TRANSACTION : "referenced_by"
    CATEGORY ||--o{ TRANSACTION : "referenced_by"
```

### 8.1 ERD Chuẩn hóa (Đề xuất – tham chiếu bằng ObjectId)

Phiên bản đề xuất giúp đảm bảo toàn vẹn tham chiếu (Transaction trỏ đến `walletId`, `categoryId` thay vì tên chuỗi).

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string googleId
        string authProvider
        datetime createdAt
        datetime updatedAt
    }

    WALLET {
        ObjectId _id PK
        string name
        number balance
        string icon
        string color
        boolean isDefault
        ObjectId user FK
        datetime createdAt
        datetime updatedAt
    }

    CATEGORY {
        ObjectId _id PK
        string name
        string type
        string group
        number budgeted_amount
        string icon
        boolean isDefault
        ObjectId user FK
        datetime createdAt
        datetime updatedAt
    }

    TRANSACTION {
        ObjectId _id PK
        string type
        number amount
        string currency
        date date
        ObjectId walletId FK
        ObjectId categoryId FK
        string note
        ObjectId user FK
        datetime createdAt
        datetime updatedAt
    }

    USER ||--o{ WALLET : owns
    USER ||--o{ CATEGORY : owns
    USER ||--o{ TRANSACTION : owns
    WALLET ||--o{ TRANSACTION : wallet
    CATEGORY ||--o{ TRANSACTION : category
```

### 8.2 ERD Star Schema (Báo cáo/Phân tích)

Mô hình ngôi sao đề xuất cho nhu cầu phân tích: một fact tổng hợp tham chiếu các dimension.

```mermaid
erDiagram
    DIM_DATE {
        int year
        int month
        int day
        date dateKey PK
    }
    DIM_CATEGORY {
        ObjectId id PK
        string name
        string group
        string type
    }
    DIM_WALLET {
        ObjectId id PK
        string name
        string color
        string icon
    }
    FACT_TRANSACTION_SUMMARY {
        date dateKey FK
        ObjectId categoryId FK
        ObjectId walletId FK
        number totalIncome
        number totalExpense
        int countTransactions
    }

    DIM_DATE ||--o{ FACT_TRANSACTION_SUMMARY : date
    DIM_CATEGORY ||--o{ FACT_TRANSACTION_SUMMARY : category
    DIM_WALLET ||--o{ FACT_TRANSACTION_SUMMARY : wallet
```

### 8.3 Gợi ý chỉ mục (Indexes) cho hiệu năng

- TRANSACTION: `(user, date DESC)`, `(user, type)`, `(user, category, date DESC)`
- CATEGORY: `(user, name)`
- WALLET: `(user, name)`

## 9. Data Flow Diagram – Luồng dữ liệu phân bổ ngân sách

Sơ đồ luồng dữ liệu mô tả quy trình phân bổ ngân sách theo phương pháp Zero-Based Budgeting.

```mermaid
flowchart TD
    A[User mở Budget Allocation Modal] --> B[Lấy tổng số dư tất cả ví]
    B --> C[Lấy danh sách categories]
    C --> D[Lấy số tiền đã chi trong tháng]
    D --> E[Tính remainingToBudget<br/>= totalWalletBalance - totalSpent]
    E --> F[User điều chỉnh phân bổ cho từng category]
    F --> G{remainingToBudget >= 0?}
    G -->|Không| H[Hiển thị cảnh báo<br/>và disable nút Lưu]
    G -->|Có| I[POST /categories/allocate-budgets]
    I --> J[Cập nhật budgeted_amount<br/>cho từng category]
    J --> K[Làm mới budget summary]
    K --> L[Hiển thị số liệu mới trên UI]
```

## 10. Central “+” Action – Wallet check then Add Transaction

Mô tả hành vi nút hành động trung tâm ở bottom navigation.

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend (React)
    participant C as FinanceContext
    participant WM as WalletManagementModal
    participant TM as TransactionModal

    U->>FE: Nhấn nút “+”
    FE->>C: Kiểm tra wallets (length)
    alt Không có ví
        FE-->>U: Hiện WalletPromptModal
        U->>FE: Chọn "Tạo ví ngay"
        FE->>WM: Mở modal tạo ví
        WM-->>FE: Ví mới được tạo
    else Đã có ví
        FE->>TM: Mở TransactionModal
        U->>TM: Nhập giao dịch và lưu
        TM-->>FE: Trả giao dịch mới
    end
```

## Ghi chú

- Tất cả các sơ đồ sử dụng định dạng Mermaid và có thể render trực tiếp trên các platform hỗ trợ.
- Các sơ đồ này phản ánh trạng thái hiện tại của hệ thống và có thể cần cập nhật khi có thay đổi về kiến trúc hoặc tính năng.
- Để xem các sơ đồ này:
  - Trên GitHub: tự động render khi xem file `.md`
  - VS Code: cài extension "Markdown Preview Enhanced" hoặc "Markdown Preview Mermaid Support"
  - Online: https://mermaid.live/
