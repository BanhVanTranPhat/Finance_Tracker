import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { transactionAPI } from "../services/api";

export type Currency = "VND";

export interface Transaction {
  _id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  currency: Currency;
  date: string;
  category: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  total?: number;
  currentPage?: number;
  totalPages?: number;
  addTransaction: (
    transaction: Omit<Transaction, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateTransaction: (
    id: string,
    transaction: Partial<
      Omit<Transaction, "_id" | "userId" | "createdAt" | "updatedAt">
    >
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  isLoading: boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  refreshTransactions: () => Promise<void>;
  // filters
  filters: {
    page: number;
    limit: number;
    type?: "income" | "expense" | "all";
    category?: string;
    startDate?: string;
    endDate?: string;
    min?: number;
    max?: number;
    sortBy: "date" | "amount" | "category" | "createdAt";
    sortOrder: "asc" | "desc";
    search?: string;
  };
  setFilters: (f: Partial<TransactionContextType["filters"]>) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>("VND");

  // Currency fixed to VND; no persistence needed

  const [filters, setFiltersState] = useState({
    page: 1,
    limit: 50,
    type: "all" as "income" | "expense" | "all",
    category: undefined as string | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    min: undefined as number | undefined,
    max: undefined as number | undefined,
    sortBy: "date" as "date" | "amount" | "category" | "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    search: undefined as string | undefined,
  });

  const setFilters = (f: Partial<typeof filters>) => {
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
      const params: any = {
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

  const addTransaction = async (
    transaction: Omit<Transaction, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    if (!user) return;

    try {
      const response = await transactionAPI.createTransaction(transaction);
      setTransactions((prev) => [response.transaction, ...prev]);
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (
    id: string,
    transaction: Partial<
      Omit<Transaction, "_id" | "userId" | "createdAt" | "updatedAt">
    >
  ) => {
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

  const deleteTransaction = async (id: string) => {
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
