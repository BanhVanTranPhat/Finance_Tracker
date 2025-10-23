import { useState } from "react";
import { TrendingUp, TrendingDown, Folder, Calendar } from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import TransactionModal from "./TransactionModal.jsx";

export default function AnalyticsScreen() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const { totalIncome, totalExpense, addTransaction } = useFinance();

  // Computed values
  const totalSavings = totalIncome - totalExpense;

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "income", label: "Thu nhập" },
    { id: "expense", label: "Chi tiêu" },
  ];

  const handleAddTransaction = () => {
    setTransactionType("expense");
    setShowTransactionModal(true);
  };

  const handleSaveTransaction = async (transactionData) => {
    console.log("Saving transaction:", transactionData);
    await addTransaction(transactionData);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Phân tích</h1>
          <button
            onClick={handleAddTransaction}
            className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            + Thêm
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-600 text-sm">Thu nhập</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              +{totalIncome.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-600 text-sm">Chi tiêu</span>
            </div>
            <div className="text-2xl font-bold text-red-500">
              -{totalExpense.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="bg-emerald-500 rounded-xl p-4">
          <div className="text-white text-sm mb-2">Tiết kiệm được</div>
          <div className="text-2xl font-bold text-white">
            {totalSavings.toLocaleString()}VNĐ
          </div>
        </div>
      </div>

      {/* Spending Trend Chart */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Xu hướng 5 tháng
        </h3>
        <div className="bg-white rounded-xl p-4">
          {totalExpense === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">Chưa có dữ liệu</div>
              <div className="text-gray-300 text-xs mt-1">
                Thêm giao dịch để xem biểu đồ
              </div>
            </div>
          ) : (
            <>
              <div className="h-32 flex items-end justify-between">
                {/* Chart bars */}
                <div className="flex items-end space-x-2 w-full">
                  {["T6", "T7", "T8", "T9", "T10"].map((month, index) => (
                    <div
                      key={month}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className={`w-full ${
                          index === 4 ? "bg-red-500 h-20" : "bg-gray-200 h-0"
                        } rounded-t`}
                      />
                      <span className="text-xs text-gray-500 mt-2">
                        {month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Y-axis labels */}
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0M</span>
                <span>0.0035M</span>
                <span>0.007M</span>
                <span>0.0105M</span>
                <span>0.014M</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Spending by Category */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Chi tiêu theo danh mục
        </h3>
        {totalExpense === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">Chưa có chi tiêu nào</div>
            <div className="text-gray-300 text-xs mt-1">
              Thêm giao dịch để xem phân tích
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  Chi tiêu bất ngờ
                </div>
                <div className="text-sm text-gray-500">
                  {totalExpense.toLocaleString()}VNĐ
                </div>
                <div className="text-xs text-gray-400">100.0%</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-emerald-500 h-2 rounded-full w-full" />
            </div>
          </div>
        )}
      </div>

      {/* Transaction History Filters */}
      <div className="px-4 mb-4">
        <div className="flex space-x-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.id
                  ? "bg-white text-gray-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-4">
        {totalIncome === 0 && totalExpense === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">Chưa có giao dịch nào</div>
            <div className="text-gray-300 text-xs mt-1">
              Thêm giao dịch để xem lịch sử
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">16/10/2025</span>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    Chi tiêu bất ngờ
                  </div>
                  <div className="text-sm text-gray-500">ia</div>
                </div>
                <div className="text-red-500 font-bold">
                  -{totalExpense.toLocaleString()}
                </div>
              </div>
            </div>
          </>
        )}
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
