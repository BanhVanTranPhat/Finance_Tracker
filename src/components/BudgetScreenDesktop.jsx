import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  PieChart as PieChartIcon,
  Edit,
  Settings,
} from "lucide-react";
import {
  PieChart,
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

export default function BudgetScreenDesktop() {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [showBudgetAllocation, setShowBudgetAllocation] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

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
      alert("Phân bổ ngân sách thành công!");
    } catch (error) {
      console.error("Error saving budget allocation:", error);
      alert("Có lỗi xảy ra khi lưu phân bổ ngân sách");
    }
  };

  const handleSaveCategoryBudget = async (categoryId, budgetLimit) => {
    try {
      await updateCategoryBudget(categoryId, budgetLimit);
      alert("Cập nhật ngân sách thành công!");
    } catch (error) {
      console.error("Error saving category budget:", error);
      alert("Có lỗi xảy ra khi cập nhật ngân sách");
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
    <div className="space-y-6">
      {/* Header with Date Picker */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t("personalSpendingManagement")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("trackAndAnalyzeMonthly")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            <button
              onClick={() => setShowBudgetAllocation(true)}
              className="w-11 h-11 bg-emerald-100 hover:bg-emerald-200 rounded-xl flex items-center justify-center transition-colors"
              title="Chỉnh sửa phân bổ ngân sách"
            >
              <Edit className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Financial Overview - white cards with colored accents */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E6E8EB] rounded-[14px] p-6 shadow-[0_6px_18px_rgba(10,37,64,0.08)]">
          <div className="text-sm text-[#6B7785]">{t("income")}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-3xl font-bold text-[#1B2733]">{formatCurrency(totalIncome)}</div>
            <TrendingUp className="w-6 h-6 text-[#1ABC9C]" />
          </div>
        </div>

        <div className="bg-white border border-[#E6E8EB] rounded-[14px] p-6 shadow-[0_6px_18px_rgba(10,37,64,0.08)]">
          <div className="text-sm text-[#6B7785]">{t("expense")}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-3xl font-bold text-[#1B2733]">{formatCurrency(totalSpent)}</div>
            <TrendingDown className="w-6 h-6 text-[#F2745A]" />
          </div>
        </div>

        <div className="bg-white border border-[#E6E8EB] rounded-[14px] p-6 shadow-[0_6px_18px_rgba(10,37,64,0.08)]">
          <div className="text-sm text-[#6B7785]">{t("savings")}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-3xl font-bold text-[#1B2733]">{formatCurrency(totalSavings)}</div>
            <Wallet className="w-6 h-6 text-[#5DADE2]" />
          </div>
        </div>

        <div className="bg-white border border-[#E6E8EB] rounded-[14px] p-6 shadow-[0_6px_18px_rgba(10,37,64,0.08)]">
          <div className="text-sm text-[#6B7785]">{t("savingsRate")}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-3xl font-bold text-[#1B2733]">{budgetSummary.savingsPercentage}%</div>
            <BarChart3 className="w-6 h-6 text-[#5DADE2]" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pie Chart - Expenses by Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-emerald-600" />
            {t("expensesByCategory")}
          </h3>
          {expensesByCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {expensesByCategoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              {t("noExpenseData")}
            </div>
          )}
        </div>

        {/* Bar Chart - Income vs Expenses */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
            {t("incomeAndExpensesLast6Months")}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeVsExpensesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip
                formatter={(value) => formatCurrency(value)}
              />
              <RechartsLegend />
              <Bar dataKey={t("income")} fill="#1ABC9C" radius={[8, 8, 0, 0]} />
              <Bar dataKey={t("expense")} fill="#F2745A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction List - CRUD */}
      <div>
        <TransactionListCRUD />
      </div>

      {/* Budget Category List */}
      <div>
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
