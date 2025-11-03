import { createContext, useContext, useState, useEffect } from "react";
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
    totalWalletBalance: 0,
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

        // Debug logging removed for cleaner console

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
          categoriesData = (categoriesResult || []).map((cat) => {
            const name = (cat.name || "").toLowerCase();
            const id = (cat.id || cat._id || cat.slug || "").toString();
            // Prefer mapping by stable id when available, then by Vietnamese name
            const idMap = {
              // expense ids from templates
              rent: "home",
              bills: "receipt",
              food: "utensils",
              transportation: "bus",
              children: "baby",
              pets: "paw-print",
              debt: "credit-card",
              healthcare: "pill",
              insurance: "shield-check",
              "car-maintenance": "car",
              gifts: "gift",
              education: "graduation-cap",
              shopping: "shopping-bag",
              massage: "sparkles",
              spa: "sparkles",
              "home-decoration": "sofa",
              "short-trips": "plane",
              "buy-house": "house",
              "buy-car": "car",
              "home-repair": "wrench",
              "equipment-upgrade": "wrench",
              // income ids
              salary: "dollar-sign",
              bonus: "gift",
              investment: "line-chart",
              "other-income": "coins",
            };
            const nameMap = {
              "tiền nhà": "home",
              "nhà ở": "home",
              "mua nhà": "house",
              "mua xe": "car",
              "sửa nhà": "wrench",
              "nâng cấp thiết bị": "toolbox",
              "ăn uống": "utensils",
              "ăn uống hằng ngày": "utensils",
              "đi lại": "bus",
              "khám bệnh/thuốc men": "pill",
              "bảo hiểm": "shield-check",
              "bảo hiểm nhân thọ": "shield-check",
              "quà tặng": "gift",
              "học phí": "graduation-cap",
              shopping: "shopping-bag",
              spa: "sparkles",
              massage: "sparkles",
              "du lịch": "plane",
              "trả nợ": "credit-card",
              lương: "dollar-sign",
              thưởng: "gift",
              "đầu tư": "line-chart",
              "thu nhập khác": "coins",
            };
            const resolved = cat.icon || idMap[id] || nameMap[name] || "folder";
            return { ...cat, icon: resolved };
          });
          transactionsData =
            transactionsResult.transactions || transactionsResult || [];
        } catch {
          // API not available; fall back if applicable

          // Only use sample data for existing users, not new users
          if (!isNewUser) {
            // Using sample data for existing user
            // Note: This is fallback sample data, should not be used in production
            // Real wallets come from API and should have translated names
            walletsData = [
              {
                id: "sample-wallet-1",
                name: "Main Wallet", // Using English as default for sample data
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
            // New user - starting with empty data
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

  // Process recurring transactions saved in localStorage
  useEffect(() => {
    const processRecurring = async () => {
      try {
        const rules = JSON.parse(
          localStorage.getItem("recurring_transactions") || "[]"
        );
        if (!Array.isArray(rules) || rules.length === 0) return;
        const now = new Date();
        let changed = false;
        const updated = [];
        for (const rule of rules) {
          let nextDate = new Date(rule.nextDate);
          while (!isNaN(nextDate) && nextDate <= now) {
            await addTransaction({
              type: rule.type,
              amount: rule.amount,
              date: nextDate.toISOString(),
              category: rule.category,
              wallet: rule.wallet,
              description: rule.description,
            });
            changed = true;
            // advance
            const nd = new Date(nextDate.getTime());
            if (rule.frequency === "daily") nd.setDate(nd.getDate() + 1);
            else if (rule.frequency === "weekly") nd.setDate(nd.getDate() + 7);
            else if (rule.frequency === "monthly")
              nd.setMonth(nd.getMonth() + 1);
            else if (rule.frequency === "yearly")
              nd.setFullYear(nd.getFullYear() + 1);
            nextDate = nd;
          }
          updated.push({ ...rule, nextDate: nextDate.toISOString() });
        }
        if (changed || updated.length === rules.length) {
          localStorage.setItem(
            "recurring_transactions",
            JSON.stringify(updated)
          );
        }
      } catch (e) {
        console.error("Recurring processing error", e);
      }
    };

    processRecurring();
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
          totalWalletBalance: 0,
          totalBudgeted: 0,
          totalSpent: 0,
          remainingToBudget: 0,
          savings: 0,
          savingsPercentage: 0,
        });
      }
    };

    loadBudgetSummary();
  }, [selectedDate, transactions, categories, wallets]); // Reload when date, transactions, categories, or wallets change

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
      // Remove from state - handle both id and _id formats
      setCategories((prev) =>
        prev.filter((category) => {
          const catId = category.id || category._id;
          return String(catId) !== String(id);
        })
      );

      // Reload from API to ensure consistency with backend
      const updatedCategories = await categoryAPI.getCategories();
      setCategories(updatedCategories || []);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  };

  // Merge-import categories (does NOT wipe existing categories)
  const importCategories = async (categoriesToImport) => {
    try {
      const existingNames = new Set(
        (categories || []).map((c) =>
          (c.name || "").toString().trim().toLowerCase()
        )
      );
      const toCreate = (categoriesToImport || []).filter((c) => {
        const name = (c.name || "").toString().trim().toLowerCase();
        return name && !existingNames.has(name);
      });

      if (toCreate.length === 0) return [];

      // Create sequentially to keep API simple; could be batched in API later
      const created = [];
      for (const cat of toCreate) {
        const newCat = await categoryAPI.createCategory(cat);
        created.push(newCat);
      }
      setCategories((prev) => [...prev, ...created]);
      return created;
    } catch (error) {
      console.error("Error importing categories:", error);
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

      // Reload categories to refresh monthly "spent" amounts
      const updatedCategories = await categoryAPI.getCategories();
      setCategories(updatedCategories || []);
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
          (transaction._id || transaction.id) === id
            ? updatedTransaction
            : transaction
        )
      );

      // Reload wallets to get updated balance
      const updatedWallets = await walletAPI.getWallets();
      setWallets(updatedWallets || []);

      // Reload categories to refresh monthly "spent" amounts
      const updatedCategories = await categoryAPI.getCategories();
      setCategories(updatedCategories || []);
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionAPI.deleteTransaction(id);
      setTransactions((prev) =>
        prev.filter((transaction) => (transaction._id || transaction.id) !== id)
      );

      // Reload wallets to get updated balance
      const updatedWallets = await walletAPI.getWallets();
      setWallets(updatedWallets || []);

      // Reload categories to refresh monthly "spent" amounts
      const updatedCategories = await categoryAPI.getCategories();
      setCategories(updatedCategories || []);
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
  const recentTransactions = filteredTransactions.slice(0, 50);

  // Budget allocation functions
  const updateCategoryBudget = async (categoryId, budgetLimit) => {
    try {
      const updated = await categoryAPI.updateBudgetLimit(
        categoryId,
        budgetLimit
      );
      setCategories((prev) =>
        prev.map((cat) =>
          (cat.id || cat._id) === categoryId ? { ...cat, budgetLimit } : cat
        )
      );
      return updated;
    } catch (error) {
      console.error("Error updating category budget:", error);
      throw error;
    }
  };

  const allocateBudgets = async (allocations) => {
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      await categoryAPI.allocateBudgets(allocations, year, month);

      // Update local state
      setCategories((prev) =>
        prev.map((cat) => {
          const categoryId = cat.id || cat._id;
          if (allocations[categoryId] !== undefined) {
            return { ...cat, budgetLimit: allocations[categoryId] };
          }
          return cat;
        })
      );
    } catch (error) {
      console.error("Error allocating budgets:", error);
      throw error;
    }
  };

  const value = {
    loading,
    wallets,
    addWallet,
    updateWallet,
    deleteWallet,
    categories,
    addCategory,
    importCategories,
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
    updateCategoryBudget,
    allocateBudgets,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};
