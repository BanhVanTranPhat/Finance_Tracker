import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useCategory } from "../contexts/CategoryContext.jsx";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import {
  getLocalizedCategoryTemplates,
  getLocalizedIncomeCategories,
} from "../utils/getLocalizedCategoryTemplates.js";

export default function CategorySelectionScreen({ onBack, onNext }) {
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
  const { t, language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const localizedTemplates = useMemo(
    () => getLocalizedCategoryTemplates(t),
    [t]
  );

  const [localTemplate, setLocalTemplate] = useState(null);

  // Update localTemplate when templates are localized or selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate) {
      // Find matching template in localized templates
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
    // Store original template reference (will use for CategoryContext)
    setSelectedTemplate(template);
  };

  const handleCategoryToggle = (groupId, categoryId) => {
    console.log("🔄 handleCategoryToggle called:", { groupId, categoryId });
    toggleCategory(groupId, categoryId);
  };

  const handleSelectAll = (groupId) => {
    console.log("🔄 handleSelectAll called:", groupId);
    selectAllCategories(groupId);
  };

  const handleDeselectAll = (groupId) => {
    console.log("🔄 handleDeselectAll called:", groupId);
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
        const group = localTemplate?.groups.find((g) =>
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

      console.log("📝 Initializing categories:", {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-emerald-100 rounded-full transition-colors"
            aria-label={t("goBack")}
            title={t("goBack")}
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("selectExpenseCategories")}
            </h1>
            <p className="text-sm text-gray-600">
              {getTotalSelectedCount()} {t("categoriesSelected")}
            </p>
          </div>
          <div className="w-10"></div>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {t("selectYourExpenseCategories")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("incomeCategoriesAutoCreated")}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {t("canEditLater")}
          </p>
        </div>
      </div>

      {/* Template Selection */}
      <div className="px-4 mb-6">
        <div className="flex space-x-3">
          {localizedTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                localTemplate?.id === template.id
                  ? "border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              <div className="text-sm font-semibold">{template.name}</div>
              <div className="text-xs opacity-75">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Category Groups */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          {localTemplate?.groups?.map((group) => {
            const selectedCount = getSelectedCountForGroup(group.id);
            const totalCount = group.categories.length;
            const allSelected = selectedCount === totalCount;
            const someSelected =
              selectedCount > 0 && selectedCount < totalCount;

            return (
              <div key={group.id} className="mb-6 last:mb-0">
                {/* Group Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-emerald-800">
                      {group.name}
                    </h3>
                    {group.percentage && (
                      <span className="text-sm text-gray-500">
                        ({group.percentage}%)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {selectedCount}/{totalCount}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleSelectAll(group.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          allSelected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {t("selectAll")}
                      </button>
                      <button
                        onClick={() => handleDeselectAll(group.id)}
                        className={`px-2 py-1 text-xs rounded ${
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
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-2 border-emerald-600 shadow-md"
                            : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{category.name}</span>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-4 pb-6 space-y-3">
        <button
          onClick={handleNext}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl ${
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
        {getTotalSelectedCount() === 0 && (
          <p className="text-center text-sm text-gray-500">
            {t("skipStepHint")}
          </p>
        )}
      </div>
    </div>
  );
}
