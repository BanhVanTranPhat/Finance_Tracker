import { useState } from "react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { categoryTemplates } from "../data/categoryTemplates.js";
import { X, Check, ArrowRight } from "lucide-react";

export default function CategoryTemplateSelector({ isOpen, onClose }) {
  const { importCategories, categories } = useFinance();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const existingNameSet = new Set(
    (categories || []).map((c) => (c.name || "").toString().trim().toLowerCase())
  );

  if (!isOpen) return null;

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Tự động chọn tất cả danh mục của template
    const allCategoryIds = template.groups.flatMap((group) =>
      group.categories.map((cat) => cat.id)
    );
    setSelectedCategories(allCategoryIds);
  };

  const toggleCategory = (categoryId) => {
    if (!selectedTemplate) return;
    const cat = selectedTemplate.groups
      .flatMap((g) => g.categories)
      .find((c) => c.id === categoryId);
    if (cat && existingNameSet.has((cat.name || "").toString().trim().toLowerCase())) {
      return; // ignore toggle for categories that already exist
    }
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleApply = async () => {
    if (!selectedTemplate || selectedCategories.length === 0) return;

    setIsSubmitting(true);
    try {
      // Chuyển đổi selectedCategories thành format cho FinanceContext
      const categoriesForFinance = selectedCategories
        .map((categoryId) => {
          const category = selectedTemplate.groups
            .flatMap((g) => g.categories)
            .find((cat) => cat.id === categoryId);
          if (!category) return null;
          const group = selectedTemplate.groups.find((g) =>
            g.categories.some((cat) => cat.id === categoryId)
          );
          return {
            id: category.id,
            name: category.name,
            group: group?.name || "Khác",
            isDefault: false,
          };
        })
        .filter(Boolean);

      await importCategories(categoriesForFinance);
      onClose();
    } catch (error) {
      console.error("Error applying template: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Chọn mẫu danh mục
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Đóng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Template Selection */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">
              Chọn mẫu danh mục
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTemplate?.id === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h5 className="font-medium text-gray-800 mb-1">
                    {template.name}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          {selectedTemplate && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">
                Chọn danh mục từ "{selectedTemplate.name}"
              </h4>
              {selectedTemplate.groups.map((group) => (
                <div key={group.id} className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">
                    {group.name}
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {group.categories.map((category) => {
                      const exists = existingNameSet.has(
                        (category.name || "").toString().trim().toLowerCase()
                      );
                      const isSelected = selectedCategories.includes(category.id);
                      return (
                        <button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          disabled={exists}
                          className={`p-2 rounded-lg border text-left transition-all flex items-center justify-between ${
                            exists
                              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                              : isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${exists ? "text-gray-400" : "text-gray-700"}`}>
                              {category.name}
                            </span>
                          </div>
                          {exists && (
                            <span className="text-xs font-medium text-gray-400">Đã có</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Đã chọn {selectedCategories.length} danh mục
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleApply}
                disabled={selectedCategories.length === 0 || isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Áp dụng</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
