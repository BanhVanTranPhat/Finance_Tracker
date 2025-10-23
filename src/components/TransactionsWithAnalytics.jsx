import { useState } from "react";
import TransactionsPage from "../pages/TransactionsPage.jsx";
import AnalyticsScreen from "./AnalyticsScreen.jsx";
import { List, BarChart3 } from "lucide-react";

export default function TransactionsWithAnalytics() {
  const [subTab, setSubTab] = useState("transactions"); // "transactions" or "analytics"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sub Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSubTab("transactions")}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
              subTab === "transactions"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <List className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Giao dịch</span>
          </button>
          <button
            onClick={() => setSubTab("analytics")}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
              subTab === "analytics"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Phân tích</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {subTab === "transactions" && <TransactionsPage />}
        {subTab === "analytics" && <AnalyticsScreen />}
      </div>
    </div>
  );
}
