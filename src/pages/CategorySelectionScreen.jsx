import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useCategory } from "../contexts/CategoryContext.jsx";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { categoryTemplates } from "../data/categoryTemplates.js";

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

  const [localTemplate, setLocalTemplate] = useState(
    selectedTemplate || categoryTemplates[0]
  );

  // Debug logging
  console.log("🔍 CategorySelectionScreen render:", {
    selectedTemplate,
    selectedCategories,
    localTemplate,
    categoryTemplates: categoryTemplates.length,
  });

  const handleTemplateSelect = (template) => {
    setLocalTemplate(template);
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
    // Chuyển đổi selectedCategories thành format cho FinanceContext
    const categoriesForFinance = selectedCategories.map((category) => ({
      id: category.id,
      name: category.name,
      group:
        selectedTemplate?.groups.find((g) =>
          g.categories.some((c) => c.id === category.id)
        )?.name || "Khác",
      isDefault: false,
    }));

    // Khởi tạo danh mục trong FinanceContext (có thể là mảng rỗng)
    await initializeCategories(categoriesForFinance);

    // Chuyển sang bước tiếp theo
    onNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-emerald-100 rounded-full transition-colors"
            aria-label="Quay lại"
            title="Quay lại"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Chọn danh mục</h1>
            <p className="text-sm text-gray-600">
              {getTotalSelectedCount()} danh mục đã chọn
            </p>
          </div>
          <div className="w-10"></div>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Hãy chọn các nhóm danh mục và danh mục để bắt đầu
          </h2>
          <p className="text-sm text-gray-600">
            Đây là một vài gợi ý, bạn có thể chỉnh sửa bất kì lúc nào.
          </p>
        </div>
      </div>

      {/* Template Selection */}
      <div className="px-4 mb-6">
        <div className="flex space-x-3">
          {categoryTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                localTemplate.id === template.id
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
          {localTemplate.groups.map((group) => {
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
                        Tất cả
                      </button>
                      <button
                        onClick={() => handleDeselectAll(group.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          selectedCount === 0
                            ? "bg-gray-100 text-gray-600"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        Bỏ chọn
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
          className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl"
        >
          <span>TIẾP TỤC</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        {getTotalSelectedCount() === 0 && (
          <p className="text-center text-sm text-gray-500">
            Bạn có thể bỏ qua bước này và tạo danh mục sau trong ứng dụng
          </p>
        )}
      </div>
    </div>
  );
}
