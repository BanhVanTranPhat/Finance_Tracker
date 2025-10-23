import { useState } from "react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { X, Plus } from "lucide-react";

export default function CreateCategoryModal({ isOpen, onClose }) {
  const { addCategory } = useFinance();
  const [categoryName, setCategoryName] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedGroups = [
    "Chi phí bắt buộc",
    "Chi phí không thường xuyên",
    "Niềm vui của tôi",
    "Đầu tư dài hạn",
    "Nhu cầu thiết yếu",
    "Mong muốn",
    "Tiết kiệm & Đầu tư",
    "Khác",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsSubmitting(true);
    try {
      const newCategory = {
        id: `custom-${Date.now()}`,
        name: categoryName.trim(),
        group: categoryGroup || "Khác",
        isDefault: false,
      };
      await addCategory(newCategory);
      setCategoryName("");
      setCategoryGroup("");
      onClose();
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Tạo danh mục mới
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Đóng modal"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên danh mục *
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ví dụ: Ăn uống, Đi lại, Giải trí..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhóm danh mục
            </label>
            <select
              value={categoryGroup}
              onChange={(e) => setCategoryGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Chọn nhóm danh mục"
              title="Chọn nhóm danh mục"
            >
              <option value="">Chọn nhóm danh mục</option>
              {predefinedGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!categoryName.trim() || isSubmitting}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tạo danh mục</span>
                </>
              )}
            </button>
          </div>
        </form>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>💡 Mẹo:</strong> Tạo danh mục phù hợp với thói quen chi tiêu
            của bạn để quản lý ngân sách hiệu quả hơn.
          </p>
        </div>
      </div>
    </div>
  );
}
