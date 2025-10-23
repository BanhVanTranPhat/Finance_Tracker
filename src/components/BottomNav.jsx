import {
  DollarSign,
  Wallet,
  Plus,
  BarChart3,
  List,
  Settings,
} from "lucide-react";

export default function BottomNav({ activeTab, onTabChange, onCreateWallet }) {
  const navItems = [
    { id: "budget", icon: DollarSign, label: "Ngân sách" },
    { id: "wallet", icon: Wallet, label: "Ví" },
    { id: "transactions", icon: List, label: "Giao dịch" },
    { id: "settings", icon: Settings, label: "Cài đặt" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label={`Chuyển đến ${item.label}`}
              title={`Chuyển đến ${item.label}`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-emerald-600" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs mt-1 ${
                  isActive ? "text-emerald-600 font-medium" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Central Create Wallet Button */}
        <button
          onClick={onCreateWallet}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
          aria-label="Tạo ví mới"
          title="Tạo ví mới"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
