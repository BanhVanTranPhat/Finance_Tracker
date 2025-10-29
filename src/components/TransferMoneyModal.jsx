import { useState, useEffect } from "react";
import { X, ArrowRight, Check } from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";

export default function TransferMoneyModal({ isOpen, onClose }) {
  const { wallets, updateWallet, addTransaction } = useFinance();
  const [fromWallet, setFromWallet] = useState("");
  const [toWallet, setToWallet] = useState("");
  const [amount, setAmount] = useState("0");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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

  const handleTransfer = async () => {
    const transferAmount = parseFloat(amount);

    if (transferAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (!fromWallet || !toWallet) {
      alert("Vui lòng chọn ví");
      return;
    }

    if (fromWallet === toWallet) {
      alert("Không thể chuyển tiền cho chính ví đó");
      return;
    }

    const fromWalletObj = wallets.find((w) => w.name === fromWallet);
    const toWalletObj = wallets.find((w) => w.name === toWallet);

    if (fromWalletObj.balance < transferAmount) {
      alert("Số dư ví không đủ");
      return;
    }

    try {
      // Update wallet balances
      await updateWallet(fromWalletObj.id, {
        ...fromWalletObj,
        balance: fromWalletObj.balance - transferAmount,
      });

      await updateWallet(toWalletObj.id, {
        ...toWalletObj,
        balance: toWalletObj.balance + transferAmount,
      });

      // Add transfer transaction (optional - for tracking)
      await addTransaction({
        type: "transfer",
        amount: transferAmount,
        category: "Chuyển ví",
        wallet: fromWallet,
        toWallet: toWallet,
        description: description || `Chuyển từ ${fromWallet} sang ${toWallet}`,
        date: date,
      });

      alert("Chuyển tiền thành công!");
      onClose();

      // Reset form
      setAmount("0");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Error transferring money:", error);
      alert("Có lỗi xảy ra khi chuyển tiền");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:w-[600px] sm:max-w-[90vw] h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-2xl p-5 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-800">
            Chuyển tiền giữa các ví
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 text-emerald-800" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 mb-4 text-center shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Bạn muốn chuyển đi</div>
          <div className="text-3xl font-bold text-emerald-800">
            {parseFloat(amount).toLocaleString()}₫
          </div>
        </div>

        {/* Wallets Selection */}
        <div className="space-y-3 mb-4">
          {/* From Wallet */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <label className="text-xs text-gray-500 mb-2 block">
              Ví thanh toán
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

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-gray-800" />
            </div>
          </div>

          {/* To Wallet */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <label className="text-xs text-gray-500 mb-2 block">Chọn ví</label>
            <select
              value={toWallet}
              onChange={(e) => setToWallet(e.target.value)}
              className="w-full text-base font-medium text-gray-800 focus:outline-none"
            >
              {wallets
                .filter((w) => w.name !== fromWallet)
                .map((wallet) => (
                  <option key={wallet.id} value={wallet.name}>
                    {wallet.name} - {wallet.balance.toLocaleString()}₫
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
              placeholder="Thêm mô tả..."
              className="w-full text-sm text-gray-700 focus:outline-none"
            />
          </div>

          {/* Date */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm text-gray-700 focus:outline-none"
            />
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
            Xóa hết
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
            className="col-span-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-3.5 text-gray-800 font-bold hover:from-yellow-500 hover:to-yellow-600 active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <Check className="w-5 h-5" />
            <span>CẬP NHẬT SỐ DƯ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
