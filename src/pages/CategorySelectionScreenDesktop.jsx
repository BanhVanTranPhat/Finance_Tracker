import { useState } from "react";
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
import { categoryTemplates } from "../data/categoryTemplates.js";

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

  const [localTemplate, setLocalTemplate] = useState(
    selectedTemplate || categoryTemplates[0]
  );

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

  const getGroupIcon = (groupName) => {
    switch (groupName) {
      case "Chi phí bắt buộc":
        return <Target className="w-5 h-5" />;
      case "Chi phí không thường xuyên":
        return <Users className="w-5 h-5" />;
      case "Niềm vui của tôi":
        return <Heart className="w-5 h-5" />;
      case "Đầu tư dài hạn":
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
              aria-label="Quay lại"
              title="Quay lại"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chọn danh mục
              </h1>
              <p className="text-lg text-gray-600">
                {getTotalSelectedCount()} danh mục đã chọn
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Hãy chọn các nhóm danh mục và danh mục để bắt đầu
            </h2>
            <p className="text-gray-600">
              Đây là một vài gợi ý, bạn có thể chỉnh sửa bất kì lúc nào.
            </p>
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-8">
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {categoryTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  localTemplate.id === template.id
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
          {localTemplate.groups.map((group) => {
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
                      {getGroupIcon(group.name)}
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
                        Tất cả
                      </button>
                      <button
                        onClick={() => handleDeselectAll(group.id)}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
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
              Sẵn sàng tiếp tục?
            </h3>
            <p className="text-gray-600 mb-6">
              {getTotalSelectedCount() > 0
                ? `Bạn đã chọn ${getTotalSelectedCount()} danh mục để bắt đầu quản lý tài chính`
                : "Bạn có thể bỏ qua bước này và tạo danh mục sau trong ứng dụng"}
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-8 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
            >
              <span>TIẾP TỤC</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
