import {
  TrendingUp,
  PieChart,
  Target,
  Calendar,
  Download,
  Shield,
  BarChart3,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Languages,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useState } from "react";

export default function LandingPage({ onLogin, onRegister }) {
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const features = [
    {
      icon: TrendingUp,
      title: t("landingFeature1Title"),
      description: t("landingFeature1Desc"),
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: PieChart,
      title: t("landingFeature2Title"),
      description: t("landingFeature2Desc"),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Target,
      title: t("landingFeature3Title"),
      description: t("landingFeature3Desc"),
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Calendar,
      title: t("landingFeature4Title"),
      description: t("landingFeature4Desc"),
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: BarChart3,
      title: t("landingFeature5Title"),
      description: t("landingFeature5Desc"),
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Download,
      title: t("landingFeature6Title"),
      description: t("landingFeature6Desc"),
      color: "from-teal-500 to-teal-600",
    },
  ];

  const benefits = [
    t("landingBenefit1"),
    t("landingBenefit2"),
    t("landingBenefit3"),
    t("landingBenefit4"),
    t("landingBenefit5"),
    t("landingBenefit6"),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Finance Tracker
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
                  aria-label="Select language"
                >
                  <Languages className="w-5 h-5" />
                  <span className="hidden sm:inline">{language === "vi" ? "Tiếng Việt" : "English"}</span>
                </button>
                {showLanguageMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLanguageMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[150px]">
                      <button
                        onClick={() => {
                          setLanguage("vi");
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                          language === "vi" ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-gray-700"
                        }`}
                      >
                        Tiếng Việt
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("en");
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                          language === "en" ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-gray-700"
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={onLogin}
                className="text-gray-700 hover:text-emerald-600 px-4 py-2 rounded-lg font-medium transition"
              >
                {t("login")}
              </button>
              <button
                onClick={onRegister}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              >
                {t("registerFree")}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              {t("landingSecurityBadge")}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t("landingHeroTitle")}{" "}
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t("landingHeroSubtitle")}
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t("landingHeroDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onRegister}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                {t("landingStartFree")}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onLogin}
                className="border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg transition"
              >
                {t("login")}
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
              <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("landingExampleIncome")}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          15.000.000 ₫
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white rotate-180" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("landingExampleExpense")}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          8.500.000 ₫
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t("saved")}</p>
                        <p className="text-xl font-bold text-gray-900">
                          6.500.000 ₫
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("landingFeaturesTitle")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("landingFeaturesSubtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition group"
                >
                  <div
                    className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("landingWhyUsTitle")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t("landingCTATitle")}
          </h2>
          <p className="text-xl text-emerald-50 mb-8">
            {t("landingCTADescription")}
          </p>
          <button
            onClick={onRegister}
            className="bg-white hover:bg-gray-50 text-emerald-600 px-10 py-4 rounded-xl font-bold text-lg transition shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
          >
            {t("landingCTAButton")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Finance Tracker
              </span>
            </div>
            <p className="text-gray-400">
              © 2025 Finance Tracker. {t("landingFooterText")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
