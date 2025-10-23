import { useState, useEffect } from "react";
import {
  X,
  ArrowUp,
  ArrowDown,
  Building2,
  Folder,
  Calendar,
  Check,
} from "lucide-react";

export default function AddTransactionModal({
  isOpen,
  onClose,
  onSave,
  initialType = "expense",
}) {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState("0");
  const [wallet, setWallet] = useState("Ví");
  const [category, setCategory] = useState("Danh mục");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Update type when initialType changes
  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  const handleNumberPress = (number) => {
    if (amount === "0") {
      setAmount(number);
    } else {
      setAmount(amount + number);
    }
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount("0");
    }
  };

  const handleSave = () => {
    const transactionData = {
      type,
      amount: parseFloat(amount),
      wallet,
      category,
      date: new Date(date).toISOString(),
    };
    onSave(transactionData);
    onClose();

    // Reset form
    setAmount("0");
    setType("expense");
    setWallet("Ví");
    setCategory("Danh mục");
    setDate(new Date().toISOString().split("T")[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-yellow-50 w-full h-[85vh] rounded-t-3xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
            aria-label="Đóng modal"
            title="Đóng modal"
          >
            <X className="w-5 h-5 text-emerald-800" />
          </button>
        </div>

        {/* Transaction Type Toggle */}
        <div className="flex bg-white rounded-full p-1 mb-6">
          <button
            onClick={() => setType("expense")}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-full transition-colors ${
              type === "expense"
                ? "bg-yellow-400 text-emerald-800"
                : "text-gray-500"
            }`}
            aria-label="Chọn loại chi tiêu"
          >
            <ArrowDown className="w-5 h-5 mr-2" />
            Tiền ra
          </button>
          <button
            onClick={() => setType("income")}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-full transition-colors ${
              type === "income"
                ? "bg-yellow-400 text-emerald-800"
                : "text-gray-500"
            }`}
            aria-label="Chọn loại thu nhập"
          >
            <ArrowUp className="w-5 h-5 mr-2" />
            Tiền vào
          </button>
        </div>

        {/* Amount Display */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-amber-600 rounded-full" />
          </div>
          <div
            className={`text-3xl font-bold ${
              type === "expense" ? "text-red-500" : "text-green-500"
            }`}
          >
            {type === "expense" ? "-" : "+"}đ{parseInt(amount).toLocaleString()}
          </div>
          <div className="text-sm text-emerald-600 mt-1">
            {type === "expense" ? "Chi tiêu" : "Thu nhập"}
          </div>
        </div>

        {/* Transaction Details */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl p-3 flex items-center">
            <Building2 className="w-5 h-5 text-purple-500 mr-2" />
            <span className="text-emerald-800 text-sm">{wallet}</span>
          </div>
          <div className="bg-white rounded-xl p-3 flex items-center">
            <Folder className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-gray-400 text-sm">{category}</span>
          </div>
          <div className="bg-white rounded-xl p-3 flex items-center">
            <Calendar className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-emerald-800 text-sm">{date}</span>
          </div>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          {["1", "2", "3"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="w-full h-12 bg-white rounded-xl flex items-center justify-center text-emerald-800 font-semibold text-lg hover:bg-gray-50"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberPress("000")}
            className="w-full h-12 bg-white rounded-xl flex items-center justify-center text-emerald-800 font-semibold text-lg hover:bg-gray-50"
          >
            000
          </button>

          {/* Row 2 */}
          {["4", "5", "6"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="w-full h-12 bg-white rounded-xl flex items-center justify-center text-emerald-800 font-semibold text-lg hover:bg-gray-50"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberPress("0")}
            className="w-full h-12 bg-white rounded-xl flex items-center justify-center text-emerald-800 font-semibold text-lg hover:bg-gray-50"
          >
            0
          </button>

          {/* Row 3 */}
          {["7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="w-full h-12 bg-white rounded-xl flex items-center justify-center text-emerald-800 font-semibold text-lg hover:bg-gray-50"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="w-full h-12 bg-gray-100 rounded-xl flex items-center justify-center text-emerald-800 font-semibold text-lg hover:bg-gray-200"
            aria-label="Xóa số cuối cùng"
            title="Xóa số cuối cùng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Bottom Row */}
          <div className="col-span-3" />
          <button
            onClick={handleSave}
            className="w-full h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg hover:bg-emerald-600"
            aria-label="Lưu giao dịch"
            title="Lưu giao dịch"
          >
            <Check className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
