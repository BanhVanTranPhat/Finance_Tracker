import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";

export default function UpdateBalanceModal({ isOpen, onClose }) {
  const { wallets, updateWallet } = useFinance();
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
      alert("Số dư không thể âm");
      return;
    }

    if (!selectedWallet) {
      alert("Vui lòng chọn ví");
      return;
    }

    const walletObj = wallets.find((w) => w.name === selectedWallet);

    try {
      await updateWallet(walletObj.id, {
        ...walletObj,
        balance: balance,
      });

      alert("Cập nhật số dư thành công!");
      onClose();
    } catch (error) {
      console.error("Error updating balance:", error);
      alert("Có lỗi xảy ra khi cập nhật số dư");
    }
  };

  const selectedWalletObj = wallets.find((w) => w.name === selectedWallet);
  const difference = selectedWalletObj
    ? parseFloat(newBalance) - selectedWalletObj.balance
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:w-[500px] sm:max-w-[90vw] rounded-t-3xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-800">
            Cập nhật số dư hiện tại trong ví
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Wallet Selection */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Ví thanh toán</div>
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
                Lần cuối cập nhật: {selectedWalletObj.balance.toLocaleString()}₫
              </div>
            )}
          </div>
        </div>

        {/* Balance Display */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Số dư mới</div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-emerald-800 mb-1">
              {parseFloat(newBalance).toLocaleString()}₫
            </div>
            {difference !== 0 && (
              <div
                className={`text-sm font-medium ${
                  difference > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {difference > 0 ? "+" : ""}
                {difference.toLocaleString()}₫
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
            Xóa hết
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

          {/* Quick Add */}
          <button
            onClick={() => handleNumberPress("000")}
            className="bg-white rounded-xl p-3 text-lg font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
          >
            000
          </button>

          {/* Update Button */}
          <button
            onClick={handleUpdateBalance}
            className="col-span-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-3 text-gray-800 font-bold hover:from-yellow-500 hover:to-yellow-600 active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <Check className="w-5 h-5" />
            <span>CẬP NHẬT SỐ DƯ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
