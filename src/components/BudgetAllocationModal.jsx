import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { translateCategoryName } from "../utils/translateCategoryName.js";
// react-icons for category icons
import {
  FaHome,
  FaFileInvoice,
  FaUtensils,
  FaBus,
  FaBaby,
  FaPaw,
  FaCreditCard,
  FaPills,
  FaShieldAlt,
  FaCar,
  FaGift,
  FaGraduationCap,
  FaShoppingBag,
  FaSpa,
  FaCouch,
  FaPlane,
  // FaHouse is not available in FontAwesome v5 – use FaHome/House mapping above
  FaWrench,
  FaWallet,
  FaFolder,
  FaCoins,
  FaChartLine,
  FaDollarSign,
} from "react-icons/fa";
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
  const { t, language } = useLanguage();
  const [allocations, setAllocations] = useState({});
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [displayValues, setDisplayValues] = useState({});

  // Helper to format number with thousand separators using dots
  const formatNumber = (value) => {
    const digitsOnly = String(value).replace(/\D/g, "");
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    if (isOpen) {
      // Initialize with current allocations
      setAllocations(currentAllocations);
      calculateTotal(currentAllocations);
      // Prepare display values
      const initialDisplay = Object.fromEntries(
        Object.entries(currentAllocations).map(([k, v]) => [k, formatNumber(v || 0)])
      );
      setDisplayValues(initialDisplay);
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
    const raw = String(value);
    const numericStr = raw.replace(/\./g, "").replace(/\D/g, "");
    const numValue = Number(numericStr) || 0;
    const newAllocations = {
      ...allocations,
      [categoryId]: numValue,
    };
    setAllocations(newAllocations);
    setDisplayValues((prev) => ({ ...prev, [categoryId]: formatNumber(numericStr) }));
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
    const group = category.group || t("other");
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(category);
    return acc;
  }, {});

  if (!isOpen) return null;

  // Map category.icon (string id) -> Lucide icon component
  const iconMap = {
    home: FaHome,
    receipt: FaFileInvoice,
    utensils: FaUtensils,
    bus: FaBus,
    baby: FaBaby,
    "paw-print": FaPaw,
    "credit-card": FaCreditCard,
    pill: FaPills,
    "shield-check": FaShieldAlt,
    car: FaCar,
    gift: FaGift,
    "graduation-cap": FaGraduationCap,
    "shopping-bag": FaShoppingBag,
    sparkles: FaSpa,
    sofa: FaCouch,
    plane: FaPlane,
    house: FaHome,
    wrench: FaWrench,
    toolbox: FaWrench,
    wallet: FaWallet,
    coins: FaCoins,
    "line-chart": FaChartLine,
    "dollar-sign": FaDollarSign,
  };

  const nameToKeyMap = {
    // Nhà ở và chi phí bắt buộc
    "tiền nhà": "home",
    "nhà ở": "home",
    "mua nhà": "home",
    "hoá đơn": "receipt",
    "mua xe": "car",
    "sửa nhà": "wrench",
    "nâng cấp thiết bị": "wrench",
    "nâng cấp thiết bị, đồ nghề": "wrench",
    // Chi phí hàng ngày
    "ăn uống": "utensils",
    "ăn uống hằng ngày": "utensils",
    "đi lại": "bus",
    // Sức khoẻ và bảo hiểm
    "khám bệnh/thuốc men": "pill",
    "bảo hiểm": "shield-check",
    "bảo hiểm nhân thọ": "shield-check",
    // Gia đình
    "con cái": "baby",
    "thú cưng": "paw-print",
    // Khác
    "quà tặng": "gift",
    "học phí": "graduation-cap",
    shopping: "shopping-bag",
    spa: "sparkles",
    massage: "sparkles",
    "du lịch": "plane",
    "trả nợ": "credit-card",
    "trả nợ/khoản vay": "credit-card",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {t("allocateMoneyToBudget")}
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
              <div className="text-sm text-gray-600">{t("currentlyAvailable")}</div>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(availableBalance)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{t("remaining")}</div>
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
                          {(() => {
                            const raw = (category.icon || "").toString().toLowerCase();
                            const fallbackKey = nameToKeyMap[(category.name || "").toString().toLowerCase()];
                            const key = iconMap[raw] ? raw : (iconMap[fallbackKey] ? fallbackKey : "");
                            const Icon = iconMap[key] || FaFolder;

                            const colorMap = {
                              home: "text-emerald-600",
                              house: "text-emerald-600",
                              receipt: "text-blue-600",
                              utensils: "text-orange-600",
                              bus: "text-sky-600",
                              baby: "text-rose-500",
                              "paw-print": "text-orange-500",
                              "credit-card": "text-cyan-600",
                              pill: "text-teal-600",
                              "shield-check": "text-indigo-600",
                              car: "text-blue-600",
                              gift: "text-pink-600",
                              "graduation-cap": "text-purple-600",
                              "shopping-bag": "text-fuchsia-600",
                              sparkles: "text-yellow-500",
                              sofa: "text-violet-600",
                              plane: "text-blue-500",
                              wrench: "text-amber-600",
                              toolbox: "text-amber-600",
                              wallet: "text-emerald-600",
                              coins: "text-amber-500",
                              "line-chart": "text-green-600",
                              "dollar-sign": "text-green-600",
                            };
                            
                            // Use color from map, fallback to a default color based on icon type if key not found
                            let colorClass = colorMap[key];
                            
                            // If no color found, try to infer from icon name or use a vibrant default
                            if (!colorClass) {
                              // Try to find color by checking if key matches any colorMap entry
                              const lowerKey = key.toLowerCase();
                              if (lowerKey.includes("home") || lowerKey.includes("house")) {
                                colorClass = "text-emerald-600";
                              } else if (lowerKey.includes("receipt") || lowerKey.includes("bills")) {
                                colorClass = "text-blue-600";
                              } else if (lowerKey.includes("utensils") || lowerKey.includes("food")) {
                                colorClass = "text-orange-600";
                              } else if (lowerKey.includes("bus") || lowerKey.includes("transport")) {
                                colorClass = "text-sky-600";
                              } else if (lowerKey.includes("baby") || lowerKey.includes("children")) {
                                colorClass = "text-rose-500";
                              } else if (lowerKey.includes("paw") || lowerKey.includes("pet")) {
                                colorClass = "text-orange-500";
                              } else if (lowerKey.includes("credit") || lowerKey.includes("debt")) {
                                colorClass = "text-cyan-600";
                              } else {
                                // Use a nice vibrant color instead of gray/black
                                colorClass = "text-indigo-600";
                              }
                            }
                            
                            return <Icon className={`w-5 h-5 ${colorClass}`} />;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 truncate">
                            {translateCategoryName(category.name, language)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t("spent")} {formatCurrency(spent)}
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
                          <div className="relative">
                            <input
                              type="text"
                              value={displayValues[categoryId] ?? ""}
                              onChange={(e) =>
                                handleAllocationChange(categoryId, e.target.value)
                              }
                              inputMode="numeric"
                              placeholder="0"
                              className="w-full pr-8 pl-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center font-semibold text-lg"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                              đ
                            </span>
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
            {t("saveAllAllocations")}
          </button>
          {remainingBalance < 0 && (
            <p className="text-red-500 text-sm text-center mt-2">
              {t("allocationExceedsBalance")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
