import { useState } from "react";
import { ArrowLeft, Plus, Search, Filter } from "lucide-react";
import TransactionListCRUD from "../components/TransactionListCRUD.jsx";
import { useFinance } from "../contexts/FinanceContext.jsx";

export default function TransactionsPage() {
  const { transactions, totalIncome, totalExpense } = useFinance();
  const [showStats, setShowStats] = useState(true);

  const netIncome = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="pt-12 pb-6 px-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Quay lại"
              title="Quay lại"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Quản lý giao dịch
            </h1>
            <div className="w-10"></div>
          </div>

          {/* Stats Summary */}
          {showStats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {totalIncome.toLocaleString()}₫
                </div>
                <div className="text-sm text-green-700">Tổng thu</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {totalExpense.toLocaleString()}₫
                </div>
                <div className="text-sm text-red-700">Tổng chi</div>
              </div>
              <div
                className={`rounded-lg p-4 text-center ${
                  netIncome >= 0 ? "bg-blue-50" : "bg-orange-50"
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    netIncome >= 0 ? "text-blue-600" : "text-orange-600"
                  }`}
                >
                  {netIncome >= 0 ? "+" : ""}
                  {netIncome.toLocaleString()}₫
                </div>
                <div
                  className={`text-sm ${
                    netIncome >= 0 ? "text-blue-700" : "text-orange-700"
                  }`}
                >
                  Số dư
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-4">
        <TransactionListCRUD />
      </div>
    </div>
  );
}
