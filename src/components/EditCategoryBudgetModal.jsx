import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext.jsx";

export default function EditCategoryBudgetModal({
  isOpen,
  onClose,
  category,
  onSave,
}) {
  const { formatCurrency } = useCurrency();
  const [budgetAmount, setBudgetAmount] = useState(0);

  useEffect(() => {
    if (isOpen && category) {
      setBudgetAmount(category.budgetLimit || 0);
    }
  }, [isOpen, category]);

  const handleIncrement = () => {
    setBudgetAmount((prev) => prev + 100000);
  };

  const handleDecrement = () => {
    if (budgetAmount >= 100000) {
      setBudgetAmount((prev) => prev - 100000);
    }
  };

  const handleSave = () => {
    onSave(category.id || category._id, budgetAmount);
    onClose();
  };

  if (!isOpen || !category) return null;

  const allocated = category.budgetLimit || 0;
  const spent = category.spent || 0;
  const remaining = allocated - spent;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">{category.icon || "📚"}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {category.name}
              </h2>
              <p className="text-sm text-gray-500">{category.group}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Budget Status */}
          <div className="mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Đã phân bổ</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(allocated)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Đã tiêu</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(spent)}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Còn lại</span>
              <span
                className={`font-bold text-lg ${
                  remaining >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>

          {/* Budget Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Số tiền dự kiến
            </label>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleDecrement}
                className="w-12 h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="number"
                  value={budgetAmount || ""}
                  onChange={(e) => setBudgetAmount(Number(e.target.value) || 0)}
                  placeholder="100,000"
                  className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center font-bold text-xl"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  đ
                </span>
              </div>

              <button
                onClick={handleIncrement}
                className="w-12 h-12 bg-emerald-500 border-2 border-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Budget Bar */}
            {allocated > 0 && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      spent / allocated > 1
                        ? "bg-red-500"
                        : spent / allocated > 0.8
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${Math.min((spent / allocated) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  Đã sử dụng {Math.round((spent / allocated) * 100)}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100 flex-shrink-0 space-y-2">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
          >
            Lưu
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
