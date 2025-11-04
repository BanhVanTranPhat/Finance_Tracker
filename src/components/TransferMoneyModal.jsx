import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowUpDown, Check, Calendar, ChevronDown } from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useCurrency } from "../contexts/CurrencyContext.jsx";
import CalendarPicker from "./CalendarPicker.jsx";

export default function TransferMoneyModal({ isOpen, onClose }) {
  const { wallets, updateWallet, addTransaction } = useFinance();
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [fromWallet, setFromWallet] = useState("");
  const [toWallet, setToWallet] = useState("");
  const [amount, setAmount] = useState("0");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isOpen && wallets.length > 0) {
      setFromWallet(wallets[0].name);
      setToWallet(wallets.length > 1 ? wallets[1].name : "");
    }
  }, [isOpen, wallets]);

  if (!isOpen) return null;

  const handleNumberPress = (num) => {
    if (amount === "0") {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount("0");
    }
  };

  const handleClear = () => {
    setAmount("0");
  };

  const handleSwapWallets = () => {
    setFromWallet((prevFrom) => {
      const prevTo = toWallet;
      setToWallet(prevFrom);
      return prevTo;
    });
  };

  const handleTransfer = async () => {
    const transferAmount = parseFloat(amount);

    if (transferAmount <= 0) {
      alert(t("invalidAmount"));
      return;
    }

    if (!fromWallet || !toWallet) {
      alert(t("pleaseSelectWallet"));
      return;
    }

    if (fromWallet === toWallet) {
      alert(t("cannotTransferToSameWallet"));
      return;
    }

    const fromWalletObj = wallets.find((w) => w.name === fromWallet);
    const toWalletObj = wallets.find((w) => w.name === toWallet);

    if (fromWalletObj.balance < transferAmount) {
      alert(t("insufficientBalance"));
      return;
    }

    try {
      // Create transfer transactions - backend will automatically update wallet balances
      // We create 2 transactions: expense from source wallet, income to destination wallet
      const transferDescription = description || `Chuyển từ ${fromWallet} sang ${toWallet}`;
      
      // Expense transaction from source wallet (will decrease balance)
      await addTransaction({
        type: "expense",
        amount: transferAmount,
        category: "Chuyển ví",
        wallet: fromWallet,
        note: `Chuyển đi: ${transferDescription}`,
        date: date,
      });

      // Income transaction to destination wallet (will increase balance)
      await addTransaction({
        type: "income",
        amount: transferAmount,
        category: "Chuyển ví",
        wallet: toWallet,
        note: `Chuyển đến: ${transferDescription}`,
        date: date,
      });

      alert(t("transferSuccess"));
      onClose();

      // Reset form
      setAmount("0");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Error transferring money:", error);
      alert(t("transferError"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:w-[600px] sm:max-w-[90vw] h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-2xl p-5 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-800">
            {t("transferBetweenWallets")}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors"
            aria-label={t("close")}
          >
            <X className="w-5 h-5 text-emerald-800" />
          </button>
        </div>

        {/* Amount Display - Desktop: Input field, Mobile: Display only */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 mb-4 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-2">{t("youWantToTransfer")}</div>
          {/* Desktop: Input field */}
          <div className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={parseFloat(amount).toLocaleString()}
                onChange={(e) => {
                  // Remove all non-digit characters
                  const value = e.target.value.replace(/[^\d]/g, "");
                  setAmount(value || "0");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTransfer();
                  }
                }}
                className="w-full text-3xl sm:text-4xl font-bold text-emerald-800 text-center bg-transparent border-b-2 border-emerald-200 focus:border-emerald-500 outline-none transition-colors px-4 py-2"
                placeholder={t("enterAmount")}
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-bold text-emerald-600">
                ₫
              </div>
            </div>
          </div>
          {/* Mobile: Display with optional input */}
          <div className="block sm:hidden">
            <div className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-2">
              {formatCurrency(parseFloat(amount))}
            </div>
            {/* Optional keyboard input for mobile */}
            <input
              type="tel"
              inputMode="numeric"
              value={amount === "0" ? "" : amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, "");
                setAmount(value || "0");
              }}
              placeholder="Nhập số tiền"
              className="w-full text-base text-center text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Wallets Selection */}
        <div className="space-y-3 mb-4">
          {/* From Wallet */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <label className="text-xs text-gray-500 mb-2 block">
              {t("paymentWallets")}
            </label>
            <select
              value={fromWallet}
              onChange={(e) => setFromWallet(e.target.value)}
              className="w-full text-base font-medium text-gray-800 focus:outline-none"
            >
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.name}>
                  {wallet.name} - {wallet.balance.toLocaleString()}₫
                </option>
              ))}
            </select>
          </div>

          {/* Direction + Swap Controls */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleSwapWallets}
              className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="Đổi vị trí 2 ví"
              aria-label="Đổi vị trí 2 ví"
            >
              <ArrowUpDown className="w-5 h-5 text-gray-700" />
            </button>
            <div className="w-10 h-10 bg-[#1ABC9C] rounded-full flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* To Wallet */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <label className="text-xs text-gray-500 mb-2 block">{t("selectWallet")}</label>
            <select
              value={toWallet}
              onChange={(e) => setToWallet(e.target.value)}
              className="w-full text-base font-medium text-gray-800 focus:outline-none"
            >
              {wallets
                .filter((w) => w.name !== fromWallet)
                .map((wallet) => (
                  <option key={wallet.id} value={wallet.name}>
                    {wallet.name} - {formatCurrency(wallet.balance)}
                  </option>
                ))}
            </select>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("addDescription")}
              className="w-full text-sm text-gray-700 focus:outline-none"
            />
          </div>

          {/* Date */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full flex items-center justify-between hover:bg-gray-50 -m-1 p-1 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700 font-medium">
                  {new Date(date).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  showDatePicker ? "rotate-180" : ""
                }`}
              />
            </button>
            {showDatePicker && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 z-50">
                <CalendarPicker
                  selectedDate={new Date(date)}
                  onDateChange={(newDate) => {
                    setDate(newDate.toISOString().split("T")[0]);
                    setShowDatePicker(false);
                  }}
                  onClose={() => setShowDatePicker(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {["1", "2", "3"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-2.5 text-xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="bg-white rounded-xl p-2.5 text-xl font-bold text-gray-800 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all shadow-sm"
          >
            ⌫
          </button>

          {["4", "5", "6"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-2.5 text-xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="bg-white rounded-xl p-2.5 text-[11px] font-bold text-gray-800 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all shadow-sm leading-tight"
          >
            {t("clearAll")}
          </button>

          {["7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-2.5 text-xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberPress("0")}
            className="bg-white rounded-xl p-2.5 text-xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
          >
            0
          </button>

          {/* Transfer Button */}
          <button
            onClick={handleTransfer}
            className="col-span-4 bg-gradient-to-r from-[#1ABC9C] to-[#149D86] rounded-xl p-3.5 text-white font-bold hover:from-[#149D86] hover:to-[#118a77] active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <Check className="w-5 h-5" />
            <span>{t("updateBalance")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
