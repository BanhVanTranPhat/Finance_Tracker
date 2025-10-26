import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Folder,
  Plus,
  Target,
  Calendar,
  DollarSign,
} from "lucide-react";
import TransactionModal from "./TransactionModal.jsx";
import CategoryDisplay from "./CategoryDisplay.jsx";
import InfoTooltip from "./InfoTooltip.jsx";
import DatePicker from "./DatePicker.jsx";
import FinancialGoals from "./FinancialGoals.jsx";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { formatDateForTransaction } from "../utils/dateFormatter.js";

export default function BudgetScreenDesktop() {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");

  let totalIncome = 0;
  let totalExpense = 0;
  let savingsPercentage = 0;
  let recentTransactions = [];
  let addTransaction = async (_data) => {};
  let selectedDate = new Date();
  let setSelectedDate = () => {};

  try {
    const finance = useFinance();
    totalIncome = finance.totalIncome || 0;
    totalExpense = finance.totalExpense || 0;
    savingsPercentage = finance.savingsPercentage || 0;
    recentTransactions = finance.recentTransactions || [];
    addTransaction = finance.addTransaction || (async (_data) => {});
    selectedDate = finance.selectedDate || new Date();
    setSelectedDate = finance.setSelectedDate || (() => {});
  } catch (error) {
    console.error("Error accessing FinanceContext in BudgetScreen:", error);
  }

  // Computed values
  const allocatedMoney = totalIncome; // Tiền đã có việc
  const unallocatedMoney = totalExpense; // Tiền chưa có việc

  const handleAddIncome = () => {
    setTransactionType("income");
    setShowTransactionModal(true);
  };

  const handleAddExpense = () => {
    setTransactionType("expense");
    setShowTransactionModal(true);
  };

  const handleSaveTransaction = async (transactionData) => {
    console.log("Saving transaction:", transactionData);
    await addTransaction(transactionData);
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Picker */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Ngân sách tháng
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tài chính theo phương pháp Zero-Based Budgeting
            </p>
          </div>
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Budget Overview - Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Budget Summary */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tổng quan ngân sách
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Tiền đã có việc</span>
                    <InfoTooltip
                      title="Tiền đã có việc"
                      content="Tiền đã được bạn phân vào một mục đích cụ thể"
                      position="top"
                    />
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">
                    {allocatedMoney.toLocaleString()}₫
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Tiền chưa có việc</span>
                    <InfoTooltip
                      title="Tiền chưa có việc"
                      content="Tiền còn lại bạn chưa quyết định sẽ dùng làm gì, đang 'thất nghiệp' và chờ bạn phân bổ"
                      position="top"
                    />
                  </div>
                  <span className="text-2xl font-bold text-red-500">
                    {unallocatedMoney.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddIncome}
                className="bg-yellow-400 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center hover:bg-yellow-500 transition-colors"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Thêm thu nhập
              </button>
              <button
                onClick={handleAddExpense}
                className="bg-white text-emerald-600 font-medium py-3 px-4 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors border border-emerald-200"
              >
                <span className="text-emerald-600 mr-2">₫</span>
                Thêm chi tiêu
              </button>
            </div>
          </div>

          {/* Right Column - Financial Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Thống kê tài chính
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-emerald-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6" />
                    <div>
                      <div className="text-sm opacity-90">Thu nhập</div>
                      <div className="text-xl font-bold">
                        {totalIncome.toLocaleString()}₫
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-red-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="w-6 h-6" />
                    <div>
                      <div className="text-sm opacity-90">Chi tiêu</div>
                      <div className="text-xl font-bold">
                        {totalExpense.toLocaleString()}₫
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-6 h-6" />
                    <div>
                      <div className="text-sm opacity-90">Tiết kiệm</div>
                      <div className="text-xl font-bold">
                        {savingsPercentage}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column - Financial Goals */}
        <div>
          <FinancialGoals />
        </div>

        {/* Right Column - Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Giao dịch gần đây
            </h3>
            <button className="text-emerald-600 text-sm hover:text-emerald-700">
              Xem tất cả →
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-gray-500 mb-2">Chưa có giao dịch nào</div>
              <div className="text-sm text-gray-400">
                Thêm giao dịch để xem lịch sử
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDateForTransaction(transaction.date)}
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount.toLocaleString()}₫
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <CategoryDisplay />
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          onSave={handleSaveTransaction}
          initialType={transactionType}
          mode="add"
        />
      )}
    </div>
  );
}
