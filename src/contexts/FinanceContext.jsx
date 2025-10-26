import React, { createContext, useContext, useState, useEffect } from "react";
import { categoryAPI, walletAPI, transactionAPI } from "../services/api.js";

const FinanceContext = createContext(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [budgetSummary, setBudgetSummary] = useState({
    totalIncome: 0,
    totalBudgeted: 0,
    totalSpent: 0,
    remainingToBudget: 0,
    savings: 0,
    savingsPercentage: 0,
  });

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Check if this is a new user (onboarding not completed) or data was manually cleared
        const onboardingCompleted =
          localStorage.getItem("onboarding_completed") === "true";
        const dataManuallyCleared =
          localStorage.getItem("data_manually_cleared") === "true";
        const isNewUser = !onboardingCompleted || dataManuallyCleared;

        console.log(
          "🔍 FinanceContext - isNewUser:",
          isNewUser,
          "onboardingCompleted:",
          onboardingCompleted,
          "dataManuallyCleared:",
          dataManuallyCleared
        );

        // Try to load from API, fallback to sample data only for existing users
        let walletsData = [];
        let categoriesData = [];
        let transactionsData = [];

        try {
          const [walletsResult, categoriesResult, transactionsResult] =
            await Promise.all([
              walletAPI.getWallets(),
              categoryAPI.getCategories(),
              transactionAPI.getTransactions(),
            ]);

          walletsData = walletsResult || [];
          categoriesData = categoriesResult || [];
          transactionsData =
            transactionsResult.transactions || transactionsResult || [];
        } catch (apiError) {
          console.warn("API not available:", apiError);

          // Only use sample data for existing users, not new users
          if (!isNewUser) {
            console.log("📊 Using sample data for existing user");
            walletsData = [
              {
                id: "sample-wallet-1",
                name: "Ví chính",
                balance: 0,
                icon: "wallet",
                color: "bg-blue-500",
                isDefault: true,
              },
            ];

            categoriesData = [
              {
                id: "sample-category-1",
                name: "Ăn uống",
                group: "Chi phí hàng ngày",
                isDefault: true,
              },
              {
                id: "sample-category-2",
                name: "Tiền nhà",
                group: "Chi phí bắt buộc",
                isDefault: true,
              },
            ];

            transactionsData = [];
          } else {
            console.log("🆕 New user - starting with empty data");
            walletsData = [];
            categoriesData = [];
            transactionsData = [];
          }
        }

        setWallets(walletsData);
        setCategories(categoriesData);
        setTransactions(transactionsData);

        // Clear the manually cleared flag after loading data
        if (dataManuallyCleared) {
          localStorage.removeItem("data_manually_cleared");
          console.log("🧹 Cleared data_manually_cleared flag");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Set empty arrays
        setWallets([]);
        setCategories([]);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load budget summary when selectedDate changes
  useEffect(() => {
    const loadBudgetSummary = async () => {
      try {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        
        const summary = await categoryAPI.getBudgetSummary(year, month);
        setBudgetSummary(summary);
      } catch (error) {
        console.error("Error loading budget summary:", error);
        // Set default values on error
        setBudgetSummary({
          totalIncome: 0,
          totalBudgeted: 0,
          totalSpent: 0,
          remainingToBudget: 0,
          savings: 0,
          savingsPercentage: 0,
        });
      }
    };

    loadBudgetSummary();
  }, [selectedDate, transactions, categories]); // Reload when date, transactions, or categories change

  // Wallet functions
  const addWallet = async (walletData) => {
    try {
      const newWallet = await walletAPI.createWallet(walletData);
      setWallets((prev) => [...prev, newWallet]);
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  };

  const updateWallet = async (id, walletData) => {
    try {
      const updatedWallet = await walletAPI.updateWallet(id, walletData);
      setWallets((prev) =>
        prev.map((wallet) => (wallet.id === id ? updatedWallet : wallet))
      );
    } catch (error) {
      console.error("Error updating wallet:", error);
      throw error;
    }
  };

  const deleteWallet = async (id) => {
    try {
      await walletAPI.deleteWallet(id);
      setWallets((prev) => prev.filter((wallet) => wallet.id !== id));
    } catch (error) {
      console.error("Error deleting wallet:", error);
      throw error;
    }
  };

  // Category functions
  const addCategory = async (categoryData) => {
    try {
      const newCategory = await categoryAPI.createCategory(categoryData);
      setCategories((prev) => [...prev, newCategory]);
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const updatedCategory = await categoryAPI.updateCategory(
        id,
        categoryData
      );
      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? updatedCategory : category
        )
      );
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryAPI.deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  };

  const initializeCategories = async (newCategories) => {
    try {
      const createdCategories = await categoryAPI.initializeCategories(
        newCategories
      );
      setCategories(createdCategories);
    } catch (error) {
      console.error("Error initializing categories:", error);
      throw error;
    }
  };

  // Transaction functions
  const addTransaction = async (transactionData) => {
    try {
      const response = await transactionAPI.createTransaction({
        type: transactionData.type,
        amount: transactionData.amount,
        date: transactionData.date,
        category: transactionData.category,
        wallet: transactionData.wallet,
        note: transactionData.description,
      });

      const newTransaction = response.transaction || response;
      setTransactions((prev) => [newTransaction, ...prev]);

      // Reload wallets to get updated balance
      const updatedWallets = await walletAPI.getWallets();
      setWallets(updatedWallets || []);
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      const updatedTransaction = await transactionAPI.updateTransaction(id, {
        type: transactionData.type,
        amount: transactionData.amount,
        date: transactionData.date,
        category: transactionData.category,
        wallet: transactionData.wallet,
        note: transactionData.description,
      });

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? updatedTransaction : transaction
        )
      );

      // Reload wallets to get updated balance
      const updatedWallets = await walletAPI.getWallets();
      setWallets(updatedWallets || []);
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionAPI.deleteTransaction(id);
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );

      // Reload wallets to get updated balance
      const updatedWallets = await walletAPI.getWallets();
      setWallets(updatedWallets || []);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };

  // Helper function to filter transactions by month/year
  const filterTransactionsByDate = (transactions, targetDate) => {
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getFullYear() === targetYear &&
        transactionDate.getMonth() === targetMonth
      );
    });
  };

  // Computed values - filtered by selected date
  const filteredTransactions = filterTransactionsByDate(
    transactions,
    selectedDate
  );
  const totalAssets = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const savingsPercentage =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;
  const recentTransactions = filteredTransactions.slice(0, 5);

  const value = {
    loading,
    wallets,
    addWallet,
    updateWallet,
    deleteWallet,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    initializeCategories,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalAssets,
    totalIncome,
    totalExpense,
    savingsPercentage,
    recentTransactions,
    selectedDate,
    setSelectedDate,
    filteredTransactions,
    budgetSummary,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};
