import { useState } from "react";
import {
  Settings,
  ChevronDown,
  Edit3,
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Folder,
} from "lucide-react";
import TransactionModal from "./TransactionModal.jsx";
import CategoryDisplay from "./CategoryDisplay.jsx";
import ZeroBasedBudgetingGuideCompact from "./ZeroBasedBudgetingGuideCompact.jsx";
import InfoTooltip from "./InfoTooltip.jsx";
import DatePicker from "./DatePicker.jsx";
import FinancialGoals from "./FinancialGoals.jsx";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { formatDateForTransaction } from "../utils/dateFormatter.js";

export default function BudgetScreen() {
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
    <div className="min-h-screen bg-emerald-600 pb-20">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <Settings className="w-6 h-6 text-white" />
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <Edit3 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white text-center">
          Ngân sách tháng
        </h1>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-6">
        {/* Budget Summary Card */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <span>Tiền đã có việc</span>
                <InfoTooltip
                  title="Tiền đã có việc"
                  content="Tiền đã được bạn phân vào một mục đích cụ thể"
                  position="right"
                  className="ml-2"
                />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-4">
                {allocatedMoney.toLocaleString()}₫
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <span>Tiền chưa có việc</span>
                <InfoTooltip
                  title="Tiền chưa có việc"
                  content="Tiền còn lại bạn chưa quyết định sẽ dùng làm gì, đang 'thất nghiệp' và chờ bạn phân bổ"
                  position="right"
                  className="ml-2"
                />
              </div>
              <div className="text-3xl font-bold text-red-500">
                {unallocatedMoney.toLocaleString()}₫
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 bg-amber-400 rounded-full" />
              </div>
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-500 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-white text-sm mb-1">Thu nhập</div>
            <div className="text-white font-bold">
              {totalIncome.toLocaleString()}₫
            </div>
          </div>
          <div className="bg-emerald-500 rounded-xl p-4 text-center">
            <TrendingDown className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-white text-sm mb-1">Chi tiêu</div>
            <div className="text-white font-bold">
              {totalExpense.toLocaleString()}₫
            </div>
          </div>
          <div className="bg-emerald-500 rounded-xl p-4 text-center">
            <Wallet className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-white text-sm mb-1">Tiết kiệm</div>
            <div className="text-white font-bold">{savingsPercentage}%</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleAddIncome}
            className="bg-yellow-400 text-white font-medium py-4 rounded-xl flex items-center justify-center hover:bg-yellow-500 transition-colors"
          >
            <span>Thêm thu nhập</span>
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center ml-2">
              <span className="text-yellow-400 text-xs">$</span>
            </div>
          </button>
          <button
            onClick={handleAddExpense}
            className="bg-white text-emerald-600 font-medium py-4 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span>Thêm chi tiêu</span>
            <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center ml-2">
              <span className="text-white text-xs">₫</span>
            </div>
          </button>
        </div>

        {/* Financial Goals */}
        <FinancialGoals />

        {/* Recent Transactions Card */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-emerald-800">
              Giao dịch gần đây
            </h3>
            <button className="text-gray-500 text-sm">Xem tất cả →</button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">Chưa có giao dịch nào</div>
              <div className="text-gray-300 text-xs mt-1">
                Thêm giao dịch để xem lịch sử
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center space-x-3"
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

      {/* Zero-Based Budgeting Guide */}
      <div className="px-4 mb-6">
        <ZeroBasedBudgetingGuideCompact />
      </div>

      {/* Categories Display */}
      <div className="px-4 mb-6">
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
