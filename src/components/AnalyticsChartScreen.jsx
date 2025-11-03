import { useMemo } from "react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useCurrency } from "../contexts/CurrencyContext.jsx";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const EXPENSE_COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#eab308", // yellow-500
  "#84cc16", // lime-500
  "#22c55e", // green-500
  "#10b981", // emerald-500
  "#14b8a6", // teal-500
];

const INCOME_COLORS = [
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#a855f7", // purple-500
  "#d946ef", // fuchsia-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#0891b2", // cyan-600
];

export default function AnalyticsChartScreen() {
  const { transactions, categories } = useFinance();
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();

  // Calculate expense data by category
  const expenseData = useMemo(() => {
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );
    const categoryTotals = {};

    expenseTransactions.forEach((t) => {
      const category = t.category || t("other");
      categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        percentage: 0, // Will calculate after
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Calculate income data by category
  const incomeData = useMemo(() => {
    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const categoryTotals = {};

    incomeTransactions.forEach((t) => {
      const category = t.category || t("other");
      categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        percentage: 0, // Will calculate after
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExpense = expenseData.reduce((sum, item) => sum + item.value, 0);
  const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0);

  // Calculate percentages
  expenseData.forEach((item) => {
    item.percentage =
      totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : 0;
  });

  incomeData.forEach((item) => {
    item.percentage =
      totalIncome > 0 ? ((item.value / totalIncome) * 100).toFixed(1) : 0;
  });

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if less than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-bold"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-blue-500 pt-12 pb-6 px-4">
        <h1 className="text-3xl font-bold text-white text-center">{t("analysis")}</h1>
        <p className="text-white/80 text-sm text-center mt-2">
          {t("analysisDetails")}
        </p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Expense Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {t("spendingAnalysis")}
              </h2>
              <p className="text-sm text-gray-500">{t("byCategory")}</p>
            </div>
          </div>

          {expenseData.length > 0 ? (
            <>
              {/* Pie Chart */}
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={CustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Total */}
              <div className="text-center mb-6 p-4 bg-red-50 rounded-xl">
                <div className="text-sm text-red-700 mb-1">{t("totalSpending")}</div>
                <div className="text-3xl font-bold text-red-600">
                  {formatCurrency(totalExpense)}
                </div>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {expenseData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            EXPENSE_COLORS[index % EXPENSE_COLORS.length],
                        }}
                      />
                      <span className="font-medium text-gray-800">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-bold text-red-600">
                          {formatCurrency(item.value)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.percentage}%
                        </div>
                      </div>
                      <div className="w-12 bg-red-100 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <TrendingDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t("noExpenseTransactions")}</p>
            </div>
          )}
        </div>

        {/* Income Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {t("incomeAnalysis")}
              </h2>
              <p className="text-sm text-gray-500">{t("byCategory")}</p>
            </div>
          </div>

          {incomeData.length > 0 ? (
            <>
              {/* Pie Chart */}
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={incomeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={CustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incomeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Total */}
              <div className="text-center mb-6 p-4 bg-green-50 rounded-xl">
                <div className="text-sm text-green-700 mb-1">{t("totalIncome")}</div>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </div>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {incomeData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            INCOME_COLORS[index % INCOME_COLORS.length],
                        }}
                      />
                      <span className="font-medium text-gray-800">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {formatCurrency(item.value)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.percentage}%
                        </div>
                      </div>
                      <div className="w-12 bg-green-100 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t("noIncomeTransactions")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
