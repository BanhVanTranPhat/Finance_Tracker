import { Edit, TrendingDown, TrendingUp } from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext.jsx";
import { useFinance } from "../contexts/FinanceContext.jsx";

export default function BudgetCategoryList({ onEditCategory }) {
  const { categories } = useFinance();
  const { formatCurrency } = useCurrency();

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
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Chỉnh sửa ngân sách
        </h3>
        <div className="text-center py-8 text-gray-500">
          Chưa có danh mục nào. Vui lòng tạo danh mục trước.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">Chỉnh sửa ngân sách</h3>
        <div className="text-sm text-gray-500">
          {categories.filter((c) => c.type === "expense").length} danh mục
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
                      <span className="text-2xl">{category.icon || "📚"}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {category.name}
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
                          <span className="text-gray-600">Đã phân bổ:</span>
                          <span className="font-semibold text-gray-800">
                            {formatCurrency(budgetLimit)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Đã tiêu:</span>
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
                                Còn: {formatCurrency(remaining)}
                              </span>
                            </div>
                          </div>
                        )}

                        {budgetLimit === 0 && (
                          <div className="text-xs text-gray-400 italic">
                            Chưa thiết lập ngân sách
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
