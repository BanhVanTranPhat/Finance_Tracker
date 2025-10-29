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
        <div className="pt-8 pb-6 px-4">
          {/* Stats Summary */}
          {showStats && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center border-2 border-green-200">
                <div className="text-lg font-bold text-green-700 truncate">
                  +{totalIncome.toLocaleString()}₫
                </div>
                <div className="text-xs text-green-600 font-medium mt-0.5">
                  Tổng thu
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 text-center border-2 border-red-200">
                <div className="text-lg font-bold text-red-700 truncate">
                  -{totalExpense.toLocaleString()}₫
                </div>
                <div className="text-xs text-red-600 font-medium mt-0.5">
                  Tổng chi
                </div>
              </div>
              <div
                className={`rounded-xl p-3 text-center border-2 ${
                  netIncome >= 0
                    ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                    : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
                }`}
              >
                <div
                  className={`text-lg font-bold truncate ${
                    netIncome >= 0 ? "text-blue-700" : "text-orange-700"
                  }`}
                >
                  {netIncome >= 0 ? "+" : ""}
                  {netIncome.toLocaleString()}₫
                </div>
                <div
                  className={`text-xs font-medium mt-0.5 ${
                    netIncome >= 0 ? "text-blue-600" : "text-orange-600"
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
