import { useMemo } from "react";
import { useTransactions } from "../contexts/TransactionContext.jsx";
import { formatCurrency } from "../utils/currency.js";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Lightbulb,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  isWithinInterval,
} from "date-fns";

const categoryLabels = {
  food: "Ăn uống",
  transportation: "Đi lại",
  bills: "Hóa đơn",
  shopping: "Mua sắm",
  entertainment: "Giải trí",
  healthcare: "Y tế",
  education: "Giáo dục",
  salary: "Lương",
  business: "Kinh doanh",
  investment: "Đầu tư",
  other: "Khác",
};

export default function Analytics() {
  const { transactions } = useTransactions();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const now = new Date();
    const thisMonth = {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };
    const lastMonth = {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    };

    const thisMonthTransactions = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), thisMonth)
    );
    const lastMonthTransactions = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), lastMonth)
    );

    const thisMonthIncome = thisMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const thisMonthExpense = thisMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthIncome = lastMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const lastMonthExpense = lastMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryExpenses = {};
    thisMonthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryExpenses[t.category] =
          (categoryExpenses[t.category] || 0) + t.amount;
      });

    const topCategory = Object.entries(categoryExpenses).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const avgDailyExpense = thisMonthExpense / new Date().getDate();

    const incomeChange =
      lastMonthIncome === 0
        ? 0
        : ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;
    const expenseChange =
      lastMonthExpense === 0
        ? 0
        : ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;
    const savingsRate =
      thisMonthIncome === 0
        ? 0
        : ((thisMonthIncome - thisMonthExpense) / thisMonthIncome) * 100;

    return {
      thisMonthIncome,
      thisMonthExpense,
      lastMonthIncome,
      lastMonthExpense,
      incomeChange,
      expenseChange,
      savingsRate,
      topCategory,
      avgDailyExpense,
      categoryExpenses,
    };
  }, [transactions]);

  const generateRecommendations = () => {
    if (!insights) return [];

    const recommendations = [];

    if (insights.savingsRate >= 20) {
      recommendations.push({
        type: "success",
        message: `Tuyệt vời! Bạn đang tiết kiệm được ${insights.savingsRate.toFixed(
          1
        )}% thu nhập. Tiếp tục duy trì!`,
      });
    } else if (insights.savingsRate < 10 && insights.savingsRate > 0) {
      recommendations.push({
        type: "warning",
        message: `Tỷ lệ tiết kiệm của bạn chỉ ${insights.savingsRate.toFixed(
          1
        )}%. Cố gắng giảm chi tiêu để tăng tiết kiệm.`,
      });
    } else if (insights.savingsRate < 0) {
      recommendations.push({
        type: "warning",
        message:
          "Chi tiêu của bạn đang vượt thu nhập! Cần cắt giảm chi tiêu khẩn cấp.",
      });
    }

    if (insights.expenseChange > 20) {
      recommendations.push({
        type: "warning",
        message: `Chi tiêu tăng ${insights.expenseChange.toFixed(
          1
        )}% so với tháng trước. Hãy xem xét lại các khoản chi.`,
      });
    } else if (insights.expenseChange < -10) {
      recommendations.push({
        type: "success",
        message: `Tốt lắm! Chi tiêu giảm ${Math.abs(
          insights.expenseChange
        ).toFixed(1)}% so với tháng trước.`,
      });
    }

    if (insights.topCategory) {
      const [category, amount] = insights.topCategory;
      const percentage = (amount / insights.thisMonthExpense) * 100;
      if (percentage > 40) {
        recommendations.push({
          type: "info",
          message: `${categoryLabels[category]} chiếm ${percentage.toFixed(
            1
          )}% tổng chi tiêu. Xem xét tối ưu hóa khoản này.`,
        });
      }
    }

    if (insights.avgDailyExpense * 30 > insights.thisMonthIncome * 0.8) {
      recommendations.push({
        type: "warning",
        message: `Chi tiêu trung bình ${formatCurrency(
          insights.avgDailyExpense
        )}/ngày có thể khiến bạn chi hết 80% thu nhập.`,
      });
    }

    if (insights.incomeChange > 10) {
      recommendations.push({
        type: "success",
        message: `Thu nhập tăng ${insights.incomeChange.toFixed(
          1
        )}% so với tháng trước. Đừng quên tiết kiệm phần tăng thêm!`,
      });
    }

    return recommendations;
  };

  if (!insights || transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Chưa đủ dữ liệu
        </h3>
        <p className="text-gray-600">
          Thêm giao dịch để xem phân tích và gợi ý chi tiết
        </p>
      </div>
    );
  }

  const recommendations = generateRecommendations();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Phân tích & Gợi ý
          </h2>
          <p className="text-gray-600">
            Thông tin chi tiết về tài chính của bạn
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Thu nhập tháng này</span>
            {insights.incomeChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  insights.incomeChange > 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {insights.incomeChange > 0 ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(insights.incomeChange).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(insights.thisMonthIncome)}
          </p>
          <p className="text-xs text-gray-500">
            Tháng trước: {formatCurrency(insights.lastMonthIncome)}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Chi tiêu tháng này</span>
            {insights.expenseChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  insights.expenseChange > 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {insights.expenseChange > 0 ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(insights.expenseChange).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(insights.thisMonthExpense)}
          </p>
          <p className="text-xs text-gray-500">
            Tháng trước: {formatCurrency(insights.lastMonthExpense)}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <span className="text-gray-600 text-sm block mb-2">
            Tỷ lệ tiết kiệm
          </span>
          <p
            className={`text-2xl font-bold mb-1 ${
              insights.savingsRate >= 20
                ? "text-emerald-600"
                : insights.savingsRate >= 10
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {insights.savingsRate.toFixed(1)}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            {(() => {
              const pct = Math.round(
                Math.min(Math.max(insights.savingsRate, 0), 100)
              );
              return (
                <div
                  className={`h-2 rounded-full ${
                    insights.savingsRate >= 20
                      ? "bg-emerald-500"
                      : insights.savingsRate >= 10
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-label={`Tỷ lệ tiết kiệm: ${insights.savingsRate.toFixed(
                    1
                  )}%`}
                />
              );
            })()}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <span className="text-gray-600 text-sm block mb-2">
            Chi tiêu TB/ngày
          </span>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(insights.avgDailyExpense)}
          </p>
          <p className="text-xs text-gray-500">
            Dự kiến: {formatCurrency(insights.avgDailyExpense * 30)}/tháng
          </p>
        </div>
      </div>

      {insights.topCategory && (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Chi tiêu nhiều nhất
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-orange-700">
              {categoryLabels[insights.topCategory[0]]}
            </p>
            <p className="text-sm text-gray-600">
              {(
                (insights.topCategory[1] / insights.thisMonthExpense) *
                100
              ).toFixed(1)}
              % tổng chi tiêu
            </p>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(insights.topCategory[1])}
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Gợi ý cho bạn
        </h3>
        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl flex items-start gap-3 ${
                  rec.type === "success"
                    ? "bg-emerald-50 border border-emerald-200"
                    : rec.type === "warning"
                    ? "bg-orange-50 border border-orange-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                {rec.type === "success" ? (
                  <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : rec.type === "warning" ? (
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
                <p
                  className={`text-sm ${
                    rec.type === "success"
                      ? "text-emerald-800"
                      : rec.type === "warning"
                      ? "text-orange-800"
                      : "text-blue-800"
                  }`}
                >
                  {rec.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">
            Tiếp tục ghi nhận giao dịch để nhận gợi ý cá nhân hóa
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Phân bổ chi tiêu tháng này
        </h3>
        <div className="space-y-3">
          {Object.entries(insights.categoryExpenses)
            .sort((a, b) => b[1] - a[1])
            .map(([category, amount]) => {
              const percentage = (amount / insights.thisMonthExpense) * 100;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {categoryLabels[category]}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(amount)}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    {(() => {
                      const pct = Math.round(
                        Math.min(Math.max(percentage, 0), 100)
                      );
                      return (
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                          role="progressbar"
                          aria-label={`Phần trăm chi tiêu: ${percentage.toFixed(
                            1
                          )}%`}
                        />
                      );
                    })()}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
