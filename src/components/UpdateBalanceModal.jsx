import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useCurrency } from "../contexts/CurrencyContext.jsx";
import ContextTip from "./ContextTip.jsx";

export default function UpdateBalanceModal({ isOpen, onClose }) {
  const { wallets, updateWallet } = useFinance();
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [selectedWallet, setSelectedWallet] = useState("");
  const [newBalance, setNewBalance] = useState("0");

  useEffect(() => {
    if (isOpen && wallets.length > 0) {
      const wallet = wallets[0];
      setSelectedWallet(wallet.name);
      setNewBalance(wallet.balance.toString());
    }
  }, [isOpen, wallets]);

  useEffect(() => {
    if (selectedWallet) {
      const wallet = wallets.find((w) => w.name === selectedWallet);
      if (wallet) {
        setNewBalance(wallet.balance.toString());
      }
    }
  }, [selectedWallet, wallets]);

  if (!isOpen) return null;

  const handleNumberPress = (num) => {
    if (newBalance === "0") {
      setNewBalance(num);
    } else {
      setNewBalance(newBalance + num);
    }
  };

  const handleBackspace = () => {
    if (newBalance.length > 1) {
      setNewBalance(newBalance.slice(0, -1));
    } else {
      setNewBalance("0");
    }
  };

  const handleClear = () => {
    setNewBalance("0");
  };

  const handleUpdateBalance = async () => {
    const balance = parseFloat(newBalance);

    if (balance < 0) {
      alert(t("balanceCannotBeNegative"));
      return;
    }

    if (!selectedWallet) {
      alert(t("pleaseSelectWalletForUpdate"));
      return;
    }

    const walletObj = wallets.find((w) => w.name === selectedWallet);

    try {
      await updateWallet(walletObj.id, {
        ...walletObj,
        balance: balance,
      });

      alert(t("updateBalanceSuccess"));
      onClose();
    } catch (error) {
      console.error("Error updating balance:", error);
      alert(t("updateBalanceError"));
    }
  };

  const selectedWalletObj = wallets.find((w) => w.name === selectedWallet);
  const difference = selectedWalletObj
    ? parseFloat(newBalance) - selectedWalletObj.balance
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:w-[500px] sm:max-w-[90vw] rounded-t-3xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto mb-24 sm:mb-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-800">
            {t("updateBalanceTitle")}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            aria-label={t("close")}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Wallet Selection */}
        <ContextTip storageKey="tip_update_balance">
          {t("balanceInputTip")}
        </ContextTip>
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">{t("paymentWallets")}</div>
          <div className="bg-white rounded-xl p-3 shadow-sm border-2 border-gray-200">
            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="w-full text-base font-medium text-gray-800 focus:outline-none"
            >
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.name}>
                  {wallet.name}
                </option>
              ))}
            </select>
            {selectedWalletObj && (
              <div className="text-xs text-gray-500 mt-2">
                {t("lastUpdate")} {formatCurrency(selectedWalletObj.balance)}
              </div>
            )}
          </div>
        </div>

        {/* Balance Display */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">{t("newBalance")}</div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-emerald-800 mb-1 leading-[1.25] min-h-[2.75rem] flex items-center justify-center">
              {formatCurrency(parseFloat(newBalance))}
            </div>
            {difference !== 0 && (
              <div
                className={`text-sm font-medium ${
                  difference > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {difference > 0 ? "+" : ""}
                {formatCurrency(difference)}
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
              className="bg-white rounded-xl p-3 text-xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="bg-white rounded-xl p-3 text-xl font-bold text-gray-800 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all shadow-sm"
          >
            ⌫
          </button>

          {["4", "5", "6"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-3 text-xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="bg-white rounded-xl p-3 text-[11px] font-bold text-gray-800 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all shadow-sm leading-tight"
          >
            {t("clearAll")}
          </button>

          {["7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-3 text-xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberPress("0")}
            className="bg-white rounded-xl p-3 text-xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
          >
            0
          </button>

          {/* Update Button */}
          <button
            onClick={handleUpdateBalance}
            className="col-span-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-3 text-gray-800 font-bold hover:from-yellow-500 hover:to-yellow-600 active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <Check className="w-5 h-5" />
            <span>{t("updateBalance")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
