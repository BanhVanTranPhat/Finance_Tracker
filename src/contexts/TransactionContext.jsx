import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import { transactionAPI } from "../services/api.js";

const TransactionContext = createContext(undefined);

export const TransactionProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(undefined);
  const [totalPages, setTotalPages] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState("VND"); // Currency fixed to VND; no persistence needed
  const [filters, setFiltersState] = useState({
    page: 1,
    limit: 20,
    type: "all",
    category: "",
    startDate: "",
    endDate: "",
    min: undefined,
    max: undefined,
    sortBy: "date",
    sortOrder: "desc",
    search: "",
  });

  const setFilters = (f) => {
    setFiltersState((prev) => ({ ...prev, ...f }));
  };

  const loadTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const params = {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.type && filters.type !== "all") params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.min !== undefined) params.min = filters.min;
      if (filters.max !== undefined) params.max = filters.max;
      if (filters.search) params.search = filters.search;

      const response = await transactionAPI.getTransactions(params);
      setTransactions(response.transactions);
      setTotal(response.total);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filters]);

  const addTransaction = async (transaction) => {
    if (!user) return;

    try {
      const response = await transactionAPI.createTransaction(transaction);
      setTransactions((prev) => [response.transaction, ...prev]);
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (id, transaction) => {
    if (!user) return;

    try {
      const response = await transactionAPI.updateTransaction(id, transaction);
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? response.transaction : t))
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    if (!user) return;

    try {
      await transactionAPI.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };

  const refreshTransactions = async () => {
    await loadTransactions();
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        total,
        currentPage,
        totalPages,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isLoading,
        currency,
        setCurrency,
        refreshTransactions,
        filters,
        setFilters,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};
