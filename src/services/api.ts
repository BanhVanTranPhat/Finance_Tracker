import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Transaction API
export const transactionAPI = {
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    min?: number;
    max?: number;
    sortBy?: "date" | "amount" | "category" | "createdAt";
    sortOrder?: "asc" | "desc";
    search?: string;
    currency?: "VND" | "USD";
  }) => {
    const response = await api.get("/transactions", { params });
    return response.data;
  },

  getTransaction: async (id: string) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (transaction: {
    type: "income" | "expense";
    amount: number;
    currency?: "VND" | "USD";
    date: string;
    category: string;
    note?: string;
  }) => {
    const response = await api.post("/transactions", transaction);
    return response.data;
  },

  updateTransaction: async (
    id: string,
    transaction: Partial<{
      type: "income" | "expense";
      amount: number;
      currency: "VND" | "USD";
      date: string;
      category: string;
      note: string;
    }>
  ) => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  deleteTransaction: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getStats: async (startDate?: string, endDate?: string) => {
    const params: { startDate?: string; endDate?: string } = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get("/transactions/stats/summary", { params });
    return response.data;
  },
};

export default api;
