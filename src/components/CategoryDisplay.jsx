import { useState } from "react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { translateCategoryName } from "../utils/translateCategoryName.js";
import { Folder, Plus, Settings } from "lucide-react";
import CreateCategoryModal from "./CreateCategoryModal.jsx";
import CategoryQuickGuide from "./CategoryQuickGuide.jsx";
import OnboardingPrompt from "./OnboardingPrompt.jsx";
import CategoryTemplateSelector from "./CategoryTemplateSelector.jsx";
import CategoryStats from "./CategoryStats.jsx";

export default function CategoryDisplay() {
  const { categories } = useFinance();
  const { t } = useLanguage();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("yourCategories")}
        </h3>
        {/* Thông báo onboarding */}
        <OnboardingPrompt />
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">{t("noCategoriesCreated")}</p>
          <p className="text-sm text-gray-400 mb-6">
            {t("createCategoriesToStart")}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{t("createNewCategory")}</span>
            </button>
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>{t("selectFromTemplate")}</span>
            </button>
          </div>
          {/* Hướng dẫn nhanh */}
          <div className="mt-6">
            <CategoryQuickGuide />
          </div>
        </div>
        {/* Modal tạo danh mục */}
        <CreateCategoryModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
        {/* Modal chọn mẫu danh mục */}
        <CategoryTemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
        />
      </div>
    );
  }

  // Nhóm danh mục theo group
  const groupedCategories = categories.reduce((acc, category) => {
    const group = category.group || "Khác";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(category);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Danh mục của bạn ({categories.length})
        </h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm</span>
        </button>
      </div>
      <div className="space-y-4">
        {Object.entries(groupedCategories).map(
          ([groupName, groupCategories]) => (
            <div key={groupName}>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                {groupName}
              </h4>
              <div className="flex flex-wrap gap-2">
                {groupCategories.map((category) => (
                  <div
                    key={category.id}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                  >
                    {translateCategoryName(category.name, language)}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
      {/* Thống kê danh mục */}
      <div className="mt-6">
        <CategoryStats />
      </div>
      {/* Modal tạo danh mục */}
      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      {/* Modal chọn mẫu danh mục */}
      <CategoryTemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
      />
    </div>
  );
}
