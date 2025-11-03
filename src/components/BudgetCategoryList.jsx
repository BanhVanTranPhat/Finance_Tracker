import { Edit, TrendingDown, TrendingUp } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { translateCategoryName } from "../utils/translateCategoryName.js";
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
  FaWrench,
  FaWallet,
  FaFolder,
  FaCoins,
  FaChartLine,
  FaDollarSign,
} from "react-icons/fa";
import { useCurrency } from "../contexts/CurrencyContext.jsx";
import { useFinance } from "../contexts/FinanceContext.jsx";

export default function BudgetCategoryList({ onEditCategory }) {
  const { categories } = useFinance();
  const { formatCurrency } = useCurrency();
  const { t, language } = useLanguage();

  // Group categories
  const groupedCategories = categories
    .filter((c) => c.type === "expense")
    .reduce((acc, category) => {
      const group = category.group || "Khác";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(category);
      return acc;
    }, {});

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg" data-tour="budget-list">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("editBudget")}
        </h3>
        <div className="text-center py-8 text-gray-500">
          {t("noCategoriesYet")}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg" data-tour="budget-list">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">{t("editBudget")}</h3>
        <div className="text-sm text-gray-500">
          {categories.filter((c) => c.type === "expense").length} {t("categoriesCount")}
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedCategories).map(([groupName, cats]) => (
          <div key={groupName} className="space-y-3">
            {/* Group Header */}
            <div className="flex items-center gap-2 px-2">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {groupName}
              </h4>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {/* Categories in Group */}
            {cats.map((category) => {
              const budgetLimit = category.budgetLimit || 0;
              const spent = category.spent || 0;
              const remaining = budgetLimit - spent;
              const percentage =
                budgetLimit > 0 ? (spent / budgetLimit) * 100 : 0;

              return (
                <div
                  key={category.id || category._id}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      {(() => {
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
                        const raw = (category.icon || "").toString().toLowerCase();
                        const fallbackKey = nameToKeyMap[(category.name || "").toString().toLowerCase()];
                        const key = iconMap[raw] ? raw : (iconMap[fallbackKey] ? fallbackKey : "");
                        const Icon = iconMap[key] || FaFolder;

                        // Per-icon color map for nicer visuals
                        const colorMap = {
                          home: "text-emerald-600",
                          house: "text-emerald-600",
                          receipt: "text-slate-600",
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

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {translateCategoryName(category.name, language)}
                        </h4>
                        <button
                          onClick={() => onEditCategory(category)}
                          className="w-8 h-8 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                        >
                          <Edit className="w-4 h-4 text-emerald-600" />
                        </button>
                      </div>

                      {/* Budget Info */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t("allocated")}</span>
                          <span className="font-semibold text-gray-800">
                            {formatCurrency(budgetLimit)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t("spent")}</span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(spent)}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {budgetLimit > 0 && (
                          <div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  percentage > 100
                                    ? "bg-red-500"
                                    : percentage > 80
                                    ? "bg-yellow-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${Math.min(percentage, 100)}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">
                                {Math.round(percentage)}%
                              </span>
                              <span
                                className={`text-xs font-medium ${
                                  remaining >= 0
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {t("remainingLabel")} {formatCurrency(remaining)}
                              </span>
                            </div>
                          </div>
                        )}

                        {budgetLimit === 0 && (
                          <div className="text-xs text-gray-400 italic">
                            {t("budgetNotSet")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
