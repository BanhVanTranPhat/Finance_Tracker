import { useState, useMemo } from "react";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  User,
  Edit,
  Settings,
} from "lucide-react";
import {
  PieChart as RechartsP,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";
import TransactionListCRUD from "./TransactionListCRUD.jsx";
import DatePicker from "./DatePicker.jsx";
import BudgetAllocationModal from "./BudgetAllocationModal.jsx";
import EditCategoryBudgetModal from "./EditCategoryBudgetModal.jsx";
import BudgetCategoryList from "./BudgetCategoryList.jsx";
import CategoryGroupManager from "./CategoryGroupManager.jsx";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useCurrency } from "../contexts/CurrencyContext.jsx";

const COLORS = [
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export default function BudgetScreen() {
  const [showCharts, setShowCharts] = useState(false);
  const [showBudgetAllocation, setShowBudgetAllocation] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();

  let budgetSummary = {
    totalIncome: 0,
    totalWalletBalance: 0,
    totalBudgeted: 0,
    totalSpent: 0,
    remainingToBudget: 0,
    savingsPercentage: 0,
  };
  let transactions = [];
  let categories = [];
  let addTransaction = async (_data) => {};
  let selectedDate = new Date();
  let setSelectedDate = () => {};
  let updateCategoryBudget = async (_id, _budget) => {};
  let allocateBudgets = async (_allocations) => {};

  try {
    const finance = useFinance();
    budgetSummary = finance.budgetSummary || budgetSummary;
    transactions = finance.transactions || [];
    categories = finance.categories || [];
    addTransaction = finance.addTransaction || (async (_data) => {});
    selectedDate = finance.selectedDate || new Date();
    setSelectedDate = finance.setSelectedDate || (() => {});
    updateCategoryBudget =
      finance.updateCategoryBudget || (async (_id, _budget) => {});
    allocateBudgets = finance.allocateBudgets || (async (_allocations) => {});
  } catch (error) {
    console.error("Error accessing FinanceContext in BudgetScreen:", error);
  }

  const totalIncome = budgetSummary.totalIncome;
  const totalSpent = budgetSummary.totalSpent;
  const savingsPercentage = budgetSummary.savingsPercentage;
  const totalSavings = totalIncome - totalSpent;

  // Prepare chart data for expenses by category
  const expensesByCategoryData = useMemo(() => {
    const expenseCategories = categories.filter((c) => c.type === "expense");
    const categoryTotals = expenseCategories
      .map((cat) => {
        const total = transactions
          .filter((t) => t.type === "expense" && t.category === cat.name)
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          name: cat.name,
          value: total,
        };
      })
      .filter((item) => item.value > 0);

    return categoryTotals;
  }, [transactions, categories]);

  // Prepare chart data for income vs expenses (last 6 months)
  const incomeVsExpensesData = useMemo(() => {
    const monthsData = [];
    const currentDate = new Date(selectedDate);

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleDateString(
        language === "vi" ? "vi-VN" : "en-US",
        {
          month: "short",
          year: "numeric",
        }
      );

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return (
          tDate.getMonth() === date.getMonth() &&
          tDate.getFullYear() === date.getFullYear()
        );
      });

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      monthsData.push({
        month: monthName,
        [t("income")]: income,
        [t("expense")]: expense,
      });
    }

    return monthsData;
  }, [transactions, selectedDate, t, language]);

  const handleSaveBudgetAllocation = async (allocations) => {
    try {
      await allocateBudgets(allocations);
      alert(t("budgetAllocationSuccess"));
    } catch (error) {
      console.error("Error saving budget allocation:", error);
      alert(t("budgetAllocationError"));
    }
  };

  const handleSaveCategoryBudget = async (categoryId, budgetLimit) => {
    try {
      await updateCategoryBudget(categoryId, budgetLimit);
      alert(t("updateBudgetSuccess"));
    } catch (error) {
      console.error("Error saving category budget:", error);
      alert(t("updateBudgetError"));
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditBudget(true);
  };

  // Get current month budget allocations
  const currentAllocations = categories.reduce((acc, cat) => {
    const catId = cat.id || cat._id;
    acc[catId] = cat.budgetLimit || 0;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-blue-500 pb-20">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        {/* Top Bar with Date Picker and Edit Button */}
        <div className="relative flex items-center justify-between mb-6">
          {/* User Name - Left */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <User className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-medium truncate">
              {(() => {
                const fullName = user?.name || "User";
                const nameParts = fullName.trim().split(/\s+/);
                // If name has more than 2 parts, show only last 2 words
                if (nameParts.length > 2) {
                  return nameParts.slice(-2).join(" ");
                }
                return fullName;
              })()}
            </span>
          </div>

          {/* Date Picker - Center (Absolute positioning for perfect centering) */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          {/* Edit Budget Button - Right */}
          <button
            onClick={() => setShowBudgetAllocation(true)}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm flex-shrink-0"
            title={t("editBudgetAllocation")}
          >
            <Edit className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Title Section */}
        <div className="text-center mb-1">
          <h1 className="text-3xl font-bold text-white">{t("expenseManagement")}</h1>
          <p className="text-white/80 text-sm mt-2">{t("trackPersonalIncomeExpenses")}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-4">
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-gray-600 text-xs mb-1 text-center">
              {t("income")}
            </div>
            <div className="text-emerald-600 font-bold text-sm text-center">
              {formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <TrendingDown className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-gray-600 text-xs mb-1 text-center">
              {t("expense")}
            </div>
            <div className="text-red-500 font-bold text-sm text-center">
              {formatCurrency(totalSpent)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <Wallet className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-gray-600 text-xs mb-1 text-center">
              {t("savings")}
            </div>
            <div className="text-blue-500 font-bold text-sm text-center">
              {formatCurrency(totalSavings)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <BarChart3 className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
            <div className="text-gray-600 text-xs mb-1 text-center">
              {t("savingsRate")}
            </div>
            <div className="text-indigo-600 font-bold text-sm text-center">
              {savingsPercentage}%
            </div>
          </div>
        </div>

        {/* End of old Savings Summary - replaced by percentage card above */}

        {/* Charts Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
              {t("statisticalChart")}
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                showCharts ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCharts && (
            <div className="space-y-6 mt-4">
              {/* Pie Chart - Expenses by Category */}
              {expensesByCategoryData.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    {t("expensesByCategory")}
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsP>
                      <Pie
                        data={expensesByCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {expensesByCategoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "12px" }}
                        formatter={(value) => value}
                      />
                    </RechartsP>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Bar Chart - Income vs Expenses */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  {t("incomeAndExpensesLast6Months")}
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={incomeVsExpensesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" style={{ fontSize: "10px" }} />
                    <YAxis style={{ fontSize: "10px" }} />
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(value)}
                    />
                    <RechartsLegend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey={t("income")} fill="#1ABC9C" />
                    <Bar dataKey={t("expense")} fill="#F2745A" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Transaction List - CRUD */}
        <TransactionListCRUD />
      </div>

      {/* Budget Category List */}
      <div className="px-4 mt-6 mb-6">
        <div className="mb-4">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
            data-tour="manage-groups-btn"
          >
            <Settings className="w-5 h-5" />
            {t("manageCategoryGroups")}
          </button>
        </div>
        <BudgetCategoryList onEditCategory={handleEditCategory} />
      </div>

      {/* Budget Allocation Modal */}
      <BudgetAllocationModal
        isOpen={showBudgetAllocation}
        onClose={() => setShowBudgetAllocation(false)}
        categories={categories.filter((c) => c.type === "expense")}
        onSave={handleSaveBudgetAllocation}
        currentAllocations={currentAllocations}
        availableBalance={budgetSummary.totalWalletBalance || 0}
      />

      {/* Edit Category Budget Modal */}
      <EditCategoryBudgetModal
        isOpen={showEditBudget}
        onClose={() => setShowEditBudget(false)}
        category={selectedCategory}
        onSave={handleSaveCategoryBudget}
      />

      {/* Category Group Manager */}
      <CategoryGroupManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
    </div>
  );
}
