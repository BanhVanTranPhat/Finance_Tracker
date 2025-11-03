import { useState } from "react";
import { DollarSign, Wallet, BarChart3, Settings, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function DesktopSidebar({ activeTab, onTabChange, onAddTransaction }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: "budget",
      label: t("budget"),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      id: "wallet",
      label: t("wallet"),
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "transactions",
      label: t("analysis"),
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "settings",
      label: t("settings"),
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <div
      className={`bg-[#0A2540] text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white/90" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Finance Tracker
                </h1>
                <p className="text-xs text-white/70">
                  {t("personalSpendingManagement")}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div className="w-4 h-4 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white/70"></div>
              <div className="w-full h-0.5 bg-white/70"></div>
              <div className="w-full h-0.5 bg-white/70"></div>
            </div>
          </button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white/90" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || t("user")}
              </p>
              <p className="text-xs text-white/70 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
          {/* Add Transaction Button */}
          <button
            onClick={onAddTransaction}
            className="mt-4 w-full bg-[#1ABC9C] hover:bg-[#149D86] text-white text-sm font-semibold py-2.5 rounded-lg shadow"
            data-tour="add-transaction-btn"
          >
            + {t("addTransaction")}
          </button>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {!isCollapsed && (
          <div className="text-center">
            <p className="text-xs text-white/50">© 2025 Finance Tracker</p>
            <p className="text-xs text-white/50">v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
}
