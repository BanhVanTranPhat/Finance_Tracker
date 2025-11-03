import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Target,
  Users,
  Heart,
  TrendingUp,
} from "lucide-react";
import { useCategory } from "../contexts/CategoryContext.jsx";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import {
  getLocalizedCategoryTemplates,
  getLocalizedIncomeCategories,
} from "../utils/getLocalizedCategoryTemplates.js";

export default function CategorySelectionScreenDesktop({ onBack, onNext }) {
  const {
    selectedTemplate,
    selectedCategories,
    setSelectedTemplate,
    toggleCategory,
    selectAllCategories,
    deselectAllCategories,
    getSelectedCategoriesByGroup,
  } = useCategory();
  const { initializeCategories } = useFinance();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const localizedTemplates = useMemo(
    () => getLocalizedCategoryTemplates(t),
    [t]
  );

  const [localTemplate, setLocalTemplate] = useState(null);

  // Update localTemplate when templates are localized or selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate) {
      const matched = localizedTemplates.find(
        (t) => t.id === selectedTemplate.id
      );
      if (matched) {
        setLocalTemplate(matched);
      }
    } else if (localizedTemplates.length > 0) {
      setLocalTemplate(localizedTemplates[0]);
    }
  }, [selectedTemplate, localizedTemplates]);

  const handleTemplateSelect = (template) => {
    setLocalTemplate(template);
    setSelectedTemplate(template);
  };

  const handleCategoryToggle = (groupId, categoryId) => {
    toggleCategory(groupId, categoryId);
  };

  const handleSelectAll = (groupId) => {
    selectAllCategories(groupId);
  };

  const handleDeselectAll = (groupId) => {
    deselectAllCategories(groupId);
  };

  const isCategorySelected = (groupId, categoryId) => {
    return selectedCategories.some((cat) => cat.id === categoryId);
  };

  const getSelectedCountForGroup = (groupId) => {
    return getSelectedCategoriesByGroup(groupId).length;
  };

  const getTotalSelectedCount = () => {
    return selectedCategories.length;
  };

  const handleNext = async () => {
    // Prevent multiple clicks
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // Chuyển đổi selectedCategories (chi tiêu) thành format cho FinanceContext
      const expenseCategories = selectedCategories.map((category) => {
        const group = selectedTemplate?.groups.find((g) =>
          g.categories.some((c) => c.id === category.id)
        );
        const categoryInGroup = group?.categories.find((c) => c.id === category.id);
        const icon = categoryInGroup?.icon || "folder";
        // Ensure icon is a string, not emoji
        const cleanIcon = typeof icon === "string" && icon.length > 0 ? icon : "folder";
        // Don't send 'id' field to API - let MongoDB create it
        return {
          name: category.name.trim(),
          type: "expense",
          group: (group?.name || t("other")).trim(),
          icon: cleanIcon,
          isDefault: false,
        };
      });

      // Thêm danh mục thu nhập mặc định (localized)
      const localizedIncomeCategories = getLocalizedIncomeCategories(t);
      const incomeCategories = localizedIncomeCategories.map((category) => {
        // Ensure icon is a string, not emoji
        const cleanIcon = typeof category.icon === "string" && category.icon.length > 0 
          ? category.icon 
          : "dollar-sign";
        // Don't send 'id' field to API - let MongoDB create it
        return {
          name: category.name.trim(),
          type: "income",
          group: t("groupIncome").trim(),
          icon: cleanIcon,
          isDefault: true,
        };
      });

      // Kết hợp cả thu nhập và chi tiêu
      const allCategories = [...incomeCategories, ...expenseCategories];

      console.log("📝 Initializing categories (Desktop):", {
        income: incomeCategories.length,
        expense: expenseCategories.length,
        total: allCategories.length,
      });

      // Khởi tạo danh mục trong FinanceContext
      await initializeCategories(allCategories);

      // Chuyển sang bước tiếp theo
      onNext();
    } catch (error) {
      console.error("Error initializing categories:", error);
      const errorMessage = error?.response?.data?.message || error?.message || t("initializeCategoriesError");
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const getGroupIcon = (groupName, groupId) => {
    // Use groupId for more reliable matching
    switch (groupId) {
      case "mandatory":
      case "needs":
        return <Target className="w-5 h-5" />;
      case "irregular":
        return <Users className="w-5 h-5" />;
      case "joy":
      case "wants":
        return <Heart className="w-5 h-5" />;
      case "long-term-investment":
      case "savings-investment":
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={onBack}
              className="p-3 hover:bg-emerald-100 rounded-full transition-colors mr-4"
              aria-label={t("goBack")}
              title={t("goBack")}
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("selectExpenseCategories")}
              </h1>
              <p className="text-lg text-gray-600">
                {getTotalSelectedCount()} {t("categoriesSelected")}
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t("selectYourExpenseCategories")}
            </h2>
            <p className="text-gray-600">
              {t("incomeCategoriesAutoCreated")}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t("canEditLater")}
            </p>
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-8">
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {localizedTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  localTemplate?.id === template.id
                    ? "border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl"
                    : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:shadow-lg"
                }`}
              >
                <div className="text-lg font-semibold mb-2">
                  {template.name}
                </div>
                <div className="text-sm opacity-90">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Groups Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {localTemplate?.groups?.map((group) => {
            const selectedCount = getSelectedCountForGroup(group.id);
            const totalCount = group.categories.length;
            const allSelected = selectedCount === totalCount;
            const someSelected =
              selectedCount > 0 && selectedCount < totalCount;

            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                {/* Group Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      {getGroupIcon(group.name, group.id)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-800">
                        {group.name}
                      </h3>
                      {group.percentage && (
                        <span className="text-sm text-gray-500">
                          ({group.percentage}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 font-medium">
                      {selectedCount}/{totalCount}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleSelectAll(group.id)}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                          allSelected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {t("selectAll")}
                      </button>
                      <button
                        onClick={() => handleDeselectAll(group.id)}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                          selectedCount === 0
                            ? "bg-gray-100 text-gray-600"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        {t("deselectAll")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {group.categories.map((category) => {
                    const isSelected = isCategorySelected(
                      group.id,
                      category.id
                    );
                    return (
                      <button
                        key={category.id}
                        onClick={() =>
                          handleCategoryToggle(group.id, category.id)
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-2 border-emerald-600 shadow-md"
                            : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{category.name}</span>
                          {isSelected && <Check className="w-4 h-4" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {t("readyToContinue")}
            </h3>
            <p className="text-gray-600 mb-6">
              {getTotalSelectedCount() > 0
                ? t("selectedCategoriesCount").replace("{count}", getTotalSelectedCount())
                : t("skipStepHint")}
            </p>
            <button
              onClick={handleNext}
              disabled={isProcessing}
              className={`bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-8 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t("loading") || "Loading..."}</span>
                </>
              ) : (
                <>
                  <span>{t("continueButton")}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
