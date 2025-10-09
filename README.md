# Finance Tracker - MERN Stack Application

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Install dependencies:**

   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration:**

   ```bash
   # Create .env file in server directory
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/finance-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. **Start MongoDB:**

   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas (update MONGO_URI in .env)
   ```

4. **Start the server:**
   ```bash
   npm run dev
   # Server will run on http://localhost:5000
   ```

### Frontend Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Configuration:**

   ```bash
   # Create .env.local file in root directory
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # Frontend will run on http://localhost:5173 (or next available port)
   ```

### Full Stack Development

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev:fullstack
```

## 📁 Project Structure

```
Finance_Tracker/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── contexts/          # React contexts (Auth, Transactions)
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── server/                # Backend Express app
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Server entry point
└── README.md
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions

- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats/summary` - Get transaction statistics

### Health Check

- `GET /api/health` - API health status

## 🛠️ Technologies Used

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Formik + Yup** - Form handling and validation

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🔐 Environment Variables

### Backend (.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:5000/api
```

## 📊 Features

- ✅ User authentication (register/login)
- ✅ Transaction management (CRUD)
- ✅ Multi-currency support (VND/USD)
- ✅ Transaction categories
- ✅ Data visualization with charts
- ✅ Budget goals tracking
- ✅ Data export functionality
- ✅ Responsive design
- ✅ Real-time data updates

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB Atlas or use cloud MongoDB service
2. Update environment variables for production
3. Deploy to platforms like Heroku, Railway, or Vercel

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.
