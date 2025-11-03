import {
  DollarSign,
  Wallet,
  Plus,
  BarChart3,
  List,
  Settings,
} from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function BottomNav({
  activeTab,
  onTabChange,
  onCreateWallet,
  onCentralAction,
}) {
  const { wallets } = useFinance();
  const { t } = useLanguage();
  const hasWallets = wallets && wallets.length > 0;
  const navItems = [
    { id: "budget", icon: DollarSign, label: t("budget") },
    { id: "wallet", icon: Wallet, label: t("wallet") },
    { id: "transactions", icon: BarChart3, label: t("analysis") },
    { id: "settings", icon: Settings, label: t("settings") },
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
              aria-label={t("navigateTo") + " " + item.label}
              title={t("navigateTo") + " " + item.label}
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

        {/* Central Action Button - Create Wallet or open Quick Action */}
        <button
          onClick={hasWallets ? onCentralAction : onCreateWallet}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
          data-tour="add-transaction-btn"
          aria-label={hasWallets ? t("addTransaction") : t("createNewWallet")}
          title={hasWallets ? t("addTransaction") : t("createNewWallet")}
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
