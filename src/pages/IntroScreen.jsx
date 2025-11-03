import { ArrowRight, Target, DollarSign, TrendingUp } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function IntroScreen({ onNext }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("welcomeToFinanceTracker")}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {t("smartPersonalFinanceApp")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {t("smartSpendingManagement")}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {t("trackAndAnalyzeIncomeExpenses")}
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {t("enterIncomeAndExpenses")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("recordAllDailyTransactions")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {t("categorizeByCategory")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("divideMoneyIntoCategories")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {t("viewChartsAndStatistics")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("analyzeSpendingThroughCharts")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <h3 className="font-semibold text-emerald-800 mb-3 text-center">
            {t("keyFeatures")}
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>{t("simpleIncomeExpenseManagement")}</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>{t("visualEasyToUnderstandCharts")}</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>{t("filterAndSortTransactions")}</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>{t("manageMultipleWallets")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6">
        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <span>{t("startNow")}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
