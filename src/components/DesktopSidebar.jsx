import { useState } from "react";
import {
  DollarSign,
  Wallet,
  List,
  Settings,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function DesktopSidebar({ activeTab, onTabChange }) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: "budget",
      label: "Ngân sách",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      id: "wallet",
      label: "Ví",
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "transactions",
      label: "Giao dịch",
      icon: List,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  const quickStats = [
    {
      label: "Thu nhập tháng này",
      value: "222.222₫",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Chi tiêu tháng này",
      value: "124.444.455₫",
      icon: TrendingDown,
      color: "text-red-600",
    },
  ];

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Finance Tracker
                </h1>
                <p className="text-xs text-gray-500">Quản lý tài chính</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-4 h-4 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-400"></div>
              <div className="w-full h-0.5 bg-gray-400"></div>
              <div className="w-full h-0.5 bg-gray-400"></div>
            </div>
          </button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.name || "Người dùng"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
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
                    isActive
                      ? `${item.bgColor} ${item.color}`
                      : "text-gray-600 hover:bg-gray-50"
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

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Thống kê nhanh
          </h3>
          <div className="space-y-3">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">
                      {stat.label}
                    </p>
                    <p
                      className={`text-sm font-semibold ${stat.color} truncate`}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-center">
            <p className="text-xs text-gray-400">© 2025 Finance Tracker</p>
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
}
