import { useState, useEffect } from "react";
import {
  X,
  ArrowUp,
  ArrowDown,
  Building2,
  Folder,
  Calendar,
  Check,
  Wallet,
  Edit3,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  initialType = "expense",
  editTransaction,
  mode = "add",
}) {
  let wallets = [];
  let categories = [];
  try {
    const finance = useFinance();
    wallets = finance.wallets || [];
    categories = finance.categories || [];
  } catch (error) {
    console.error("Error accessing FinanceContext:", error);
    // Fallback to empty arrays
  }

  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState("0");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initialize form when editing
  useEffect(() => {
    if (mode === "edit" && editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setSelectedWallet(editTransaction.wallet);
      setSelectedCategory(editTransaction.category);
      setDate(editTransaction.date.split("T")[0]);
      setDescription(editTransaction.description || "");
    } else {
      // Reset form for add mode
      setType(initialType);
      setAmount("0");
      setSelectedWallet(wallets.length > 0 ? wallets[0].name : "Chọn ví");
      setSelectedCategory(
        categories.length > 0 ? categories[0].name : "Chọn danh mục"
      );
      setDate(new Date().toISOString().split("T")[0]);
      setDescription("");
    }
  }, [mode, editTransaction, initialType, wallets, categories]);

  const handleNumberPress = (number) => {
    if (amount === "0") {
      setAmount(number);
    } else {
      setAmount(amount + number);
    }
  };

  const handleClear = () => {
    setAmount("0");
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount("0");
    }
  };

  const handleSave = () => {
    if (!selectedWallet || !selectedCategory || parseFloat(amount) <= 0) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const transactionData = {
      type,
      amount: parseFloat(amount),
      wallet: selectedWallet,
      category: selectedCategory,
      date: new Date(date).toISOString(),
      description: description.trim() || undefined,
    };

    if (mode === "edit" && editTransaction) {
      onUpdate?.(editTransaction.id, transactionData);
    } else {
      onSave(transactionData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (mode === "edit" && editTransaction && onDelete) {
      onDelete(editTransaction.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Show loading state if no data
  if (wallets.length === 0 || categories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
        <div className="bg-yellow-50 w-full h-[90vh] rounded-t-3xl p-6 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Đang tải dữ liệu...
              </h3>
              <p className="text-gray-600 mb-4">
                Vui lòng tạo ví và danh mục trước khi thêm giao dịch
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-yellow-50 w-full h-[90vh] rounded-t-3xl p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-emerald-800">
            {mode === "edit" ? "Chỉnh sửa giao dịch" : "Thêm giao dịch"}
          </h2>
          <div className="flex items-center space-x-2">
            {mode === "edit" && (
              <button
                onClick={handleDelete}
                className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
                aria-label="Xóa giao dịch"
                title="Xóa giao dịch"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
              aria-label="Đóng modal"
              title="Đóng modal"
            >
              <X className="w-5 h-5 text-emerald-800" />
            </button>
          </div>
        </div>

        {/* Transaction Type Toggle */}
        <div className="flex bg-white rounded-full p-1 mb-6">
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-3 px-4 rounded-full font-semibold transition-all ${
              type === "income"
                ? "bg-green-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ArrowUp className="w-5 h-5" />
              <span>Thu nhập</span>
            </div>
          </button>
          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-3 px-4 rounded-full font-semibold transition-all ${
              type === "expense"
                ? "bg-red-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ArrowDown className="w-5 h-5" />
              <span>Chi tiêu</span>
            </div>
          </button>
        </div>

        {/* Amount Display */}
        <div className="bg-white rounded-2xl p-6 mb-6 text-center">
          <div className="text-4xl font-bold text-emerald-800 mb-2">
            {parseFloat(amount).toLocaleString()}₫
          </div>
          <div className="text-sm text-gray-500">
            {type === "income" ? "Thu nhập" : "Chi tiêu"}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          {/* Wallet Selection */}
          <div className="bg-white rounded-xl p-4">
            <button
              onClick={() => setShowWalletSelector(!showWalletSelector)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">
                  {selectedWallet || "Chọn ví"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showWalletSelector && (
              <div className="mt-3 space-y-2">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => {
                      setSelectedWallet(wallet.name);
                      setShowWalletSelector(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedWallet === wallet.name
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${wallet.color}`}
                      ></div>
                      <span>{wallet.name}</span>
                      <span className="text-sm text-gray-500">
                        {wallet.balance.toLocaleString()}₫
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="bg-white rounded-xl p-4">
            <button
              onClick={() => setShowCategorySelector(!showCategorySelector)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Folder className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">
                  {selectedCategory || "Chọn danh mục"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showCategorySelector && (
              <div className="mt-3 space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setShowCategorySelector(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.name
                        ? "bg-yellow-100 text-yellow-800"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">
                        {category.group}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="bg-white rounded-xl p-4">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">
                  {new Date(date).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showDatePicker && (
              <div className="mt-3">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setShowDatePicker(false);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Chọn ngày giao dịch"
                  title="Chọn ngày giao dịch"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Edit3 className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Ghi chú</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm ghi chú cho giao dịch..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              aria-label="Ghi chú giao dịch"
              title="Ghi chú giao dịch"
            />
          </div>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {/* Row 1 */}
          {["1", "2", "3"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-4 text-2xl font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="bg-white rounded-xl p-4 text-2xl font-bold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            ⌫
          </button>

          {/* Row 2 */}
          {["4", "5", "6"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-4 text-2xl font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="bg-white rounded-xl p-4 text-lg font-bold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            C
          </button>

          {/* Row 3 */}
          {["7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-4 text-2xl font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberPress("0")}
            className="bg-white rounded-xl p-4 text-2xl font-bold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            0
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleNumberPress("000")}
            className="bg-white rounded-xl p-4 text-lg font-bold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            000
          </button>
          <button
            onClick={() => handleNumberPress("000000")}
            className="bg-white rounded-xl p-4 text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            000K
          </button>
          <button
            onClick={() => handleNumberPress("0000000")}
            className="bg-white rounded-xl p-4 text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            000M
          </button>
          <button
            onClick={handleSave}
            className="bg-emerald-500 rounded-xl p-4 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>{mode === "edit" ? "Cập nhật" : "Lưu"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
