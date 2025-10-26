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
  register: async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
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
  getTransactions: async (params) => {
    const response = await api.get("/transactions", { params });
    return response.data;
  },

  getTransaction: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (transaction) => {
    const response = await api.post("/transactions", transaction);
    return response.data;
  },

  updateTransaction: async (id, transaction) => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getStats: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get("/transactions/stats/summary", { params });
    return response.data;
  },
};

// Category API
export const categoryAPI = {
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  createCategory: async (category) => {
    const response = await api.post("/categories", category);
    return response.data;
  },

  updateCategory: async (id, category) => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  initializeCategories: async (categories) => {
    const response = await api.post("/categories/initialize", { categories });
    return response.data;
  },

  deleteAllCategories: async () => {
    const response = await api.delete("/categories/all");
    return response.data;
  },

  getBudgetSummary: async (year, month) => {
    const params = {};
    if (year !== undefined) params.year = year;
    if (month !== undefined) params.month = month;
    const response = await api.get("/categories/budget-summary", { params });
    return response.data;
  },
};

// Wallet API
export const walletAPI = {
  getWallets: async () => {
    const response = await api.get("/wallets");
    return response.data;
  },

  createWallet: async (wallet) => {
    const response = await api.post("/wallets", wallet);
    return response.data;
  },

  updateWallet: async (id, wallet) => {
    const response = await api.put(`/wallets/${id}`, wallet);
    return response.data;
  },

  deleteWallet: async (id) => {
    const response = await api.delete(`/wallets/${id}`);
    return response.data;
  },

  deleteAllWallets: async () => {
    const response = await api.delete("/wallets/all");
    return response.data;
  },
};

// Data Management API
export const dataAPI = {
  deleteAllData: async () => {
    try {
      // Delete all categories, wallets, and transactions
      await Promise.all([
        api.delete("/categories/all").catch(() => {}),
        api.delete("/wallets/all").catch(() => {}),
        api.delete("/transactions/all").catch(() => {}),
      ]);
      return { success: true };
    } catch (error) {
      console.error("Error deleting all data:", error);
      return { success: false, error };
    }
  },
};

export default api;
