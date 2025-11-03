import {
  ArrowRight,
  Target,
  DollarSign,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function IntroScreenDesktop({ onNext }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Target className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("welcomeToFinanceTracker")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("smartPersonalFinanceApp")}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Quản lý chi tiêu thông minh Info */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {t("smartSpendingManagement")}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {t("zeroBasedBudgetingMethod")}
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                    {t("incomeMinusExpensesEqualsZero")}
                  </h3>
                  <p className="text-gray-600">
                    {t("everyDollarMustBeAssigned")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                    {t("createEnvelopes")}
                  </h3>
                  <p className="text-gray-600">
                    {t("divideMoneyIntoSpecificCategories")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                    {t("completeControl")}
                  </h3>
                  <p className="text-gray-600">
                    {t("knowExactlyWhereMoneyGoes")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
            <h3 className="font-bold text-emerald-800 mb-6 text-center text-xl">
              {t("benefitsOfSmartSpendingManagement")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  {t("betterSpendingControl")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  {t("saveMore")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  {t("achieveFinancialGoals")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  {t("reduceFinancialStress")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  {t("strengthenFinancialDiscipline")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  {t("betterFuturePlanning")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("readyToStartFinancialJourney")}
            </h3>
            <p className="text-gray-600 mb-8">
              {t("startSmartFinancialManagement")}
            </p>
            <button
              onClick={onNext}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-8 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
            >
              <span>{t("startNow")}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
