import { useState, useEffect } from "react";
import {
  X,
  Building2,
  CreditCard,
  Banknote,
  Coins,
  Target,
  Calendar,
} from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useCurrency } from "../contexts/CurrencyContext.jsx";

const walletIcons = [
  { id: "money-bag", icon: Banknote, color: "bg-yellow-500" },
  { id: "credit-card", icon: CreditCard, color: "bg-blue-500" },
  { id: "bank", icon: Building2, color: "bg-purple-500" },
  { id: "coins", icon: Coins, color: "bg-yellow-600" },
  { id: "target", icon: Target, color: "bg-red-500" },
  { id: "calendar", icon: Calendar, color: "bg-green-500" },
];

export default function WalletManagementModal({
  isOpen,
  onClose,
  onSave,
  editWallet = null,
  mode = "create", // "create" or "edit"
}) {
  const { addWallet, updateWallet } = useFinance();
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [selectedIcon, setSelectedIcon] = useState("money-bag");

  // Default wallet names by icon with translations
  const defaultNameByIcon = {
    "money-bag": t("cash"),
    "credit-card": t("creditCard"),
    "bank": t("bank"),
    "coins": t("coins"),
    "target": t("target"),
    "calendar": t("calendar"),
  };
  const [walletName, setWalletName] = useState("");
  const [balance, setBalance] = useState("");
  const [displayBalance, setDisplayBalance] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Format số tiền với dấu chấm phân cách
  const formatNumber = (value) => {
    // Loại bỏ tất cả ký tự không phải số
    const number = value.replace(/\D/g, "");
    // Thêm dấu chấm phân cách hàng nghìn
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Load wallet data when editing
  useEffect(() => {
    if (mode === "edit" && editWallet) {
      setWalletName(editWallet.name);
      setSelectedIcon(editWallet.icon || "money-bag");
      setIsDefault(editWallet.isDefault || false);

      // Format balance
      const balanceStr = editWallet.balance.toString();
      setBalance(balanceStr);
      setDisplayBalance(formatNumber(balanceStr));
    } else {
      // Reset form for create mode
      setWalletName("");
      setBalance("");
      setDisplayBalance("");
      setIsDefault(false);
      setSelectedIcon("money-bag");
    }
  }, [mode, editWallet]);

  // Xử lý thay đổi số tiền
  const handleBalanceChange = (e) => {
    const inputValue = e.target.value;
    // Loại bỏ tất cả dấu chấm
    const numericValue = inputValue.replace(/\./g, "");
    // Lưu giá trị số thuần
    setBalance(numericValue);
    // Hiển thị với format
    setDisplayBalance(formatNumber(numericValue));
  };

  const handleSave = async () => {
    // Nếu không nhập tên, dùng default name làm mặc định
    const finalWalletName = walletName.trim() || defaultNameByIcon[selectedIcon] || t("cash");

    const walletData = {
      name: finalWalletName,
      balance: parseFloat(balance) || 0,
      icon: selectedIcon,
      color:
        walletIcons.find((icon) => icon.id === selectedIcon)?.color ||
        "bg-yellow-500",
      isDefault,
    };

    try {
      if (mode === "edit" && editWallet) {
        // Update existing wallet
        await updateWallet(editWallet.id, walletData);
      } else {
        // Create new wallet
        await addWallet(walletData);
      }

      onSave(walletData);
      onClose();

      // Reset form
      setWalletName("");
      setBalance("");
      setDisplayBalance("");
      setIsDefault(false);
      setSelectedIcon("money-bag");
    } catch (error) {
      console.error("Error saving wallet:", error);
      alert(t("saveWalletError"));
    }
  };

  if (!isOpen) return null;

  const selectedIconData = walletIcons.find((icon) => icon.id === selectedIcon);
  const SelectedIconComponent = selectedIconData?.icon || Banknote;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:w-[600px] sm:max-w-[90vw] h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-800">
            {mode === "edit" ? t("updateWalletBalance") : t("createPaymentWallet")}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            aria-label={t("close")}
            title={t("close")}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        {/* Icon Selection */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center mx-auto mb-4">
            <SelectedIconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-emerald-800 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
            {t("changeIcon")}
          </button>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {walletIcons.map((iconData) => {
            const IconComponent = iconData.icon;
            const isSelected = selectedIcon === iconData.id;
            return (
              <button
                key={iconData.id}
                onClick={() => {
                  const prev = selectedIcon;
                  setSelectedIcon(iconData.id);
                  // Auto-fill name if empty or matching the previous default
                  const currentName = walletName.trim();
                  const prevDefault = defaultNameByIcon[prev] || "";
                  if (currentName === "" || currentName === prevDefault) {
                    setWalletName(defaultNameByIcon[iconData.id] || "");
                  }
                }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-200 scale-105"
                    : `${iconData.color} bg-opacity-20 hover:bg-opacity-30 hover:scale-105`
                }`}
                aria-label={t("selectIcon") + " " + iconData.id}
                title={t("selectIcon") + " " + iconData.id}
              >
                <IconComponent
                  className={`w-6 h-6 ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Wallet Name Input */}
        <div className="mb-5 sm:mb-6">
          <label className="block text-emerald-800 font-semibold mb-2 text-sm sm:text-base">
            {t("walletName")}
          </label>
          <input
            type="text"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            placeholder={defaultNameByIcon[selectedIcon] || t("cash")}
            className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base"
          />
        </div>

        {/* Balance Input */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-emerald-800 font-semibold mb-2 text-sm sm:text-base">
            {t("currentBalanceInWallet")}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-base sm:text-lg">
              {formatCurrency(0).replace(/[\d.,]/g, "").trim()}
            </span>
            <input
              type="text"
              value={displayBalance}
              onChange={handleBalanceChange}
              placeholder="0"
              className="w-full px-4 py-3 sm:py-3.5 pl-8 sm:pl-9 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base"
            />
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            {t("balanceInputHelper")}
          </p>
        </div>

        {/* Default Wallet Toggle */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-emerald-800 font-semibold mb-2 text-sm sm:text-base">
            {t("defaultWallet")}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-4">
            {t("defaultWalletDescription")}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 text-sm sm:text-base font-medium">
              {t("setAsDefaultWallet")}
            </span>
            <button
              onClick={() => setIsDefault(!isDefault)}
              className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all ${
                isDefault
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md transition-transform ${
                  isDefault
                    ? "translate-x-6 sm:translate-x-7"
                    : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-emerald-800 font-bold py-3.5 sm:py-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
          aria-label={mode === "edit" ? t("updateWallet") : t("saveNewWallet")}
          title={mode === "edit" ? t("updateWallet") : t("saveNewWallet")}
        >
          {mode === "edit" ? t("updateWalletButton") : t("saveNewWalletButton")}
        </button>
      </div>
    </div>
  );
}
