import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { translateCategoryName } from "../utils/translateCategoryName.js";
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
import CalendarPicker from "./CalendarPicker.jsx";

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
  const { t, language } = useLanguage();
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
  const [repeatFrequency, setRepeatFrequency] = useState("none"); // none|daily|weekly|monthly|yearly
  const [saveAsRecurring, setSaveAsRecurring] = useState(false);

  // Filter categories based on transaction type
  const filteredCategories = categories.filter((category) => {
    if (type === "income") {
      return category.type === "income";
    } else {
      return category.type === "expense" || !category.type; // expense or undefined (old data)
    }
  });

  // Reset selected category when type changes
  useEffect(() => {
    if (filteredCategories.length > 0) {
      // Check if current selected category is valid for the new type
      const isValidCategory = filteredCategories.some(
        (cat) => cat.name === selectedCategory
      );
      if (!isValidCategory) {
        setSelectedCategory(filteredCategories[0].name);
      }
    } else {
      setSelectedCategory(t("selectCategory"));
    }
  }, [type, filteredCategories, selectedCategory]);

  // Initialize form when editing
  useEffect(() => {
    if (mode === "edit" && editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setSelectedWallet(editTransaction.wallet);
      setSelectedCategory(editTransaction.category);
      setDate(editTransaction.date.split("T")[0]);
      setDescription(editTransaction.note || editTransaction.description || "");
    } else {
      // Reset form for add mode
      setType(initialType);
      setAmount("0");
      setSelectedWallet(wallets.length > 0 ? wallets[0].name : t("selectWallet"));
      // Set default category based on type
      const defaultCategories = categories.filter((cat) =>
        initialType === "income"
          ? cat.type === "income"
          : cat.type === "expense" || !cat.type
      );
      setSelectedCategory(
        defaultCategories.length > 0
          ? defaultCategories[0].name
          : t("selectCategory")
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

  // Handle direct input from keyboard
  const handleAmountChange = (e) => {
    // Remove all non-digit characters including commas from formatted display
    const value = e.target.value.replace(/[^\d]/g, "");
    setAmount(value || "0");
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
    };
    
    // Only include note if it's not empty
    const noteValue = description.trim();
    if (noteValue) {
      transactionData.note = noteValue;
    }

    if (mode === "edit" && editTransaction) {
      const transactionId = editTransaction._id || editTransaction.id;
      onUpdate?.(transactionId, transactionData);
    } else {
      onSave(transactionData);
    }

    // Save recurring rule locally if chosen
    if (saveAsRecurring && repeatFrequency !== "none") {
      const rules = JSON.parse(localStorage.getItem("recurring_transactions") || "[]");
      const nextDate = computeNextDate(new Date(date), repeatFrequency);
      rules.push({
        type,
        amount: parseFloat(amount),
        wallet: selectedWallet,
        category: selectedCategory,
        description: description.trim() || undefined,
        frequency: repeatFrequency,
        nextDate: nextDate.toISOString(),
      });
      localStorage.setItem("recurring_transactions", JSON.stringify(rules));
    }
    onClose();
  };

  const computeNextDate = (d, freq) => {
    const nd = new Date(d.getTime());
    if (freq === "daily") nd.setDate(nd.getDate() + 1);
    else if (freq === "weekly") nd.setDate(nd.getDate() + 7);
    else if (freq === "monthly") nd.setMonth(nd.getMonth() + 1);
    else if (freq === "yearly") nd.setFullYear(nd.getFullYear() + 1);
    return nd;
  };

  const handleDelete = () => {
    if (mode === "edit" && editTransaction && onDelete) {
      const transactionId = editTransaction._id || editTransaction.id;
      onDelete(transactionId);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Show loading state if no data
  if (wallets.length === 0 || categories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-yellow-50 w-full sm:w-[600px] sm:max-w-[90vw] h-[90vh] sm:h-auto rounded-t-3xl sm:rounded-2xl p-6 overflow-y-auto">
          <div className="flex items-center justify-center sm:py-12">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                {t("loadingData")}
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {t("pleaseCreateWalletAndCategory")}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-yellow-50 w-full sm:w-[600px] sm:max-w-[90vw] h-[95vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-2xl p-5 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-800">
            {mode === "edit" ? "Chỉnh sửa giao dịch" : "Thêm giao dịch"}
          </h2>
          <div className="flex items-center space-x-2">
            {mode === "edit" && (
              <button
                onClick={handleDelete}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                aria-label={t("deleteTransaction")}
                title={t("deleteTransaction")}
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors"
              aria-label={t("close")}
              title={t("close")}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-800" />
            </button>
          </div>
        </div>

        {/* Transaction Type Toggle */}
        <div className="flex bg-white rounded-full p-1 mb-4 shadow-sm">
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-full font-semibold transition-all text-sm sm:text-base ${
              type === "income"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Thu nhập</span>
            </div>
          </button>
          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-full font-semibold transition-all text-sm sm:text-base ${
              type === "expense"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Chi tiêu</span>
            </div>
          </button>
        </div>

        {/* Amount Display */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 mb-4 text-center shadow-sm border border-gray-100">
          {/* Desktop: Input field */}
          <div className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={parseFloat(amount).toLocaleString()}
                onChange={handleAmountChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
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
            <div className="text-xs sm:text-sm text-gray-500 font-medium mt-3">
              {type === "income" ? t("income") : t("expense")}
            </div>
          </div>

          {/* Mobile: Display only */}
          <div className="block sm:hidden">
            <div className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-2">
              {parseFloat(amount).toLocaleString()}₫
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium">
              {type === "income" ? t("income") : t("expense")}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-2.5 sm:space-y-4 mb-4">
          {/* Wallet Selection */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <button
              onClick={() => setShowWalletSelector(!showWalletSelector)}
              className="w-full flex items-center justify-between hover:bg-gray-50 -m-1 p-1 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="text-gray-700 text-sm sm:text-base font-medium">
                  {selectedWallet || t("selectWallet")}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  showWalletSelector ? "rotate-180" : ""
                }`}
              />
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
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <button
              onClick={() => setShowCategorySelector(!showCategorySelector)}
              className="w-full flex items-center justify-between hover:bg-gray-50 -m-1 p-1 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="text-gray-700 text-sm sm:text-base font-medium">
                  {selectedCategory || t("selectCategory")}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  showCategorySelector ? "rotate-180" : ""
                }`}
              />
            </button>
            {showCategorySelector && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    {t("noCategoriesCreated")} {type === "income" ? t("income").toLowerCase() : t("expense").toLowerCase()}
                  </div>
                ) : (
                  filteredCategories.map((category) => (
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
                        <span>{translateCategoryName(category.name, language)}</span>
                        <span className="text-sm text-gray-500">
                          {category.group}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full flex items-center justify-between hover:bg-gray-50 -m-1 p-1 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="text-gray-700 text-sm sm:text-base font-medium">
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
              <div className="mt-3 relative">
                <CalendarPicker
                  selectedDate={new Date(date)}
                  onDateChange={(newDate) => {
                    setDate(newDate.toISOString().split("T")[0]);
                    setShowDatePicker(false);
                  }}
                  onClose={() => setShowDatePicker(false)}
                  className="absolute left-0 sm:left-auto sm:right-0 z-50"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2.5 sm:space-x-3 mb-3">
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <span className="text-gray-700 text-sm sm:text-base font-medium">
                {t("note")}
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("addNoteForTransaction")}
              className="w-full p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-sm sm:text-base"
              rows={3}
              aria-label={t("note")}
              title={t("note")}
            />
          </div>
        </div>

        {/* Number Pad - Mobile only */}
        <div className="grid grid-cols-4 gap-3 mb-3 sm:hidden">
          {/* Row 1 */}
          {["1", "2", "3"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-3.5 text-2xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm h-14"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="bg-white rounded-xl p-3.5 text-base font-bold text-gray-800 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all shadow-sm h-14"
          >
            ⌫
          </button>

          {/* Row 2 */}
          {["4", "5", "6"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-3.5 text-2xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm h-14"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="bg-white rounded-xl p-3.5 text-sm font-bold text-gray-800 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all shadow-sm leading-tight h-14"
          >
            {t("clearAll")}
          </button>

          {/* Row 3 */}
          {["7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberPress(num)}
              className="bg-white rounded-xl p-3.5 text-2xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm h-14"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberPress("0")}
            className="bg-white rounded-xl p-3.5 text-2xl font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-sm h-14"
          >
            0
          </button>

          {/* Row 4 - Save button only */}
          <button
            onClick={handleSave}
            className="col-span-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-3.5 text-white font-bold hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <Check className="w-5 h-5" />
            <span>{mode === "edit" ? t("update") : t("save")}</span>
          </button>
        </div>

        {/* Desktop - Save button */}
        <div className="hidden sm:block">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <Check className="w-5 h-5" />
            <span>
              {mode === "edit" ? t("updateTransaction") : t("saveTransaction")}
            </span>
          </button>
        </div>
      </div>

      {/* Recurring UI has been moved to AddTransactionSheet for a cleaner mobile UX */}
    </div>
  );
}
