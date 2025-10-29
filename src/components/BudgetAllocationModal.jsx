import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext.jsx";

export default function BudgetAllocationModal({
  isOpen,
  onClose,
  categories,
  onSave,
  currentAllocations = {},
  availableBalance = 0,
}) {
  const { formatCurrency } = useCurrency();
  const [allocations, setAllocations] = useState({});
  const [totalAllocated, setTotalAllocated] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Initialize with current allocations
      setAllocations(currentAllocations);
      calculateTotal(currentAllocations);
    }
  }, [isOpen, currentAllocations]);

  const calculateTotal = (allocs) => {
    const total = Object.values(allocs).reduce(
      (sum, amount) => sum + (Number(amount) || 0),
      0
    );
    setTotalAllocated(total);
  };

  const handleAllocationChange = (categoryId, value) => {
    const numValue = Number(value) || 0;
    const newAllocations = {
      ...allocations,
      [categoryId]: numValue,
    };
    setAllocations(newAllocations);
    calculateTotal(newAllocations);
  };

  const handleIncrement = (categoryId) => {
    const currentValue = allocations[categoryId] || 0;
    handleAllocationChange(categoryId, currentValue + 100000);
  };

  const handleDecrement = (categoryId) => {
    const currentValue = allocations[categoryId] || 0;
    if (currentValue > 0) {
      handleAllocationChange(categoryId, currentValue - 100000);
    }
  };

  const handleSave = () => {
    onSave(allocations);
    onClose();
  };

  const remainingBalance = availableBalance - totalAllocated;

  // Group categories
  const groupedCategories = categories.reduce((acc, category) => {
    const group = category.group || "Khác";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(category);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            Phân chia tiền vào ngân sách
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Balance Info */}
        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Đang có</div>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(availableBalance)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Còn lại</div>
              <div
                className={`text-2xl font-bold ${
                  remainingBalance >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {formatCurrency(remainingBalance)}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {Object.entries(groupedCategories).map(([groupName, cats]) => (
            <div key={groupName} className="mb-6 last:mb-0">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                📌 {groupName}
              </h3>

              <div className="space-y-3">
                {cats.map((category) => {
                  const categoryId = category.id || category._id;
                  const allocated = allocations[categoryId] || 0;
                  const spent = category.spent || 0;

                  return (
                    <div key={categoryId} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">
                            {category.icon || "📚"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 truncate">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Đã tiêu: {formatCurrency(spent)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecrement(categoryId)}
                          className="w-10 h-10 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>

                        <div className="flex-1">
                          <input
                            type="number"
                            value={allocated || ""}
                            onChange={(e) =>
                              handleAllocationChange(categoryId, e.target.value)
                            }
                            placeholder="0"
                            className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center font-semibold text-lg"
                          />
                          <div className="text-xs text-center text-gray-500 mt-0">
                            đ
                          </div>
                        </div>

                        <button
                          onClick={() => handleIncrement(categoryId)}
                          className="w-10 h-10 bg-emerald-500 border-2 border-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer - Save Button */}
        <div className="px-6 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={remainingBalance < 0}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              remainingBalance < 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"
            }`}
          >
            LƯU TẤT CẢ PHÂN BỔ
          </button>
          {remainingBalance < 0 && (
            <p className="text-red-500 text-sm text-center mt-2">
              Số tiền phân bổ vượt quá số dư khả dụng
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
