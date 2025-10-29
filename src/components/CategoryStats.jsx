import { useFinance } from "../contexts/FinanceContext.jsx";
import { BarChart3, TrendingUp, Target } from "lucide-react";
import CategoryProgressBar from "./CategoryProgressBar.jsx";

export default function CategoryStats() {
  const { categories, transactions } = useFinance();

  // Tính toán thống kê theo danh mục
  const categoryStats = categories
    .map((category) => {
      const categoryTransactions = transactions.filter(
        (t) => t.category === category.name
      );
      const totalAmount = categoryTransactions.reduce(
        (sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount),
        0
      );
      const transactionCount = categoryTransactions.length;

      return {
        ...category,
        totalAmount,
        transactionCount,
        income: categoryTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0),
        expense: categoryTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0),
      };
    })
    .sort((a, b) => Math.abs(b.totalAmount) - Math.abs(a.totalAmount));

  const totalTransactions = transactions.length;
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  if (categories.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Thống kê theo danh mục
        </h3>
      </div>

      {/* Tổng quan - Desktop: 3 cột, Mobile: 2 cột */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {categories.length}
          </div>
          <div className="text-xs sm:text-sm text-blue-700">Danh mục</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {totalTransactions}
          </div>
          <div className="text-xs sm:text-sm text-green-700">Giao dịch</div>
        </div>
        {/* Desktop: Tổng thu trong grid */}
        <div className="hidden sm:block text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {totalIncome.toLocaleString()}₫
          </div>
          <div className="text-sm text-purple-700">Tổng thu</div>
        </div>
      </div>

      {/* Mobile: Tổng thu riêng biệt - full width */}
      <div className="block sm:hidden mb-4">
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {totalIncome.toLocaleString()}₫
          </div>
          <div className="text-sm text-purple-700 font-medium mt-1">
            Tổng thu
          </div>
        </div>
      </div>

      {/* Danh sách danh mục với thống kê */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800 mb-3">
          Chi tiết theo danh mục
        </h4>
        {categoryStats.map((category) => (
          <div key={category.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-800">{category.name}</h5>
              <p className="text-sm text-gray-500">{category.group}</p>
            </div>
            <div className="text-right">
              <div
                className={`text-lg font-bold ${
                  category.totalAmount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {category.totalAmount.toLocaleString()}₫
              </div>
              <div className="text-sm text-gray-500">
                {category.transactionCount} giao dịch
              </div>
            </div>

            {/* Thanh tiến trình */}
            <CategoryProgressBar
              value={category.totalAmount}
              maxValue={Math.max(
                ...categoryStats.map((c) => Math.abs(c.totalAmount))
              )}
              isPositive={category.totalAmount >= 0}
              className="mb-2"
            />

            {/* Chi tiết thu/chi */}
            <div className="flex justify-between text-sm">
              <div className="text-green-600">
                Thu: {category.income.toLocaleString()}₫
              </div>
              <div className="text-red-600">
                Chi: {category.expense.toLocaleString()}₫
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lưu ý */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-700">
          <strong>💡 Mẹo:</strong> Danh mục có số dư dương (màu xanh) là những
          danh mục bạn đang tiết kiệm, danh mục có số dư âm (màu đỏ) là những
          danh mục bạn đang chi tiêu nhiều hơn thu nhập.
        </p>
      </div>
    </div>
  );
}
