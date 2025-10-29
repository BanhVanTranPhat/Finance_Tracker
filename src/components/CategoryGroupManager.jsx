import { useState } from "react";
import { X, Plus, ChevronUp, ChevronDown, Menu, Trash2 } from "lucide-react";
import { useFinance } from "../contexts/FinanceContext.jsx";
import DeleteCategoryConfirmModal from "./DeleteCategoryConfirmModal.jsx";
import CategoryTutorial from "./CategoryTutorial.jsx";

export default function CategoryGroupManager({ isOpen, onClose }) {
  const { categories, deleteCategory } = useFinance();
  const [expandedGroups, setExpandedGroups] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  if (!isOpen) return null;

  // Group categories by group
  const groupedCategories = categories
    .filter((c) => c.type === "expense")
    .reduce((acc, category) => {
      const group = category.group || "Khác";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(category);
      return acc;
    }, {});

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id || categoryToDelete._id);
        setShowDeleteConfirm(false);
        setCategoryToDelete(null);
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Có lỗi xảy ra khi xóa danh mục");
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0">
        <div className="bg-white w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Chỉnh sửa ngân sách
            </h1>
            <button
              onClick={() => setShowTutorial(true)}
              className="text-yellow-600 font-bold text-lg px-3"
            >
              LƯU
            </button>
          </div>

          {/* Create Group Button */}
          <div className="px-5 pt-4 pb-4 flex-shrink-0">
            <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg font-bold text-gray-800">
              <Plus className="w-5 h-5" />
              TẠO NHÓM DANH MỤC
            </button>
          </div>

          {/* Category Groups List */}
          <div className="flex-1 overflow-y-auto px-5 pb-20">
            <div className="space-y-3">
              {Object.entries(groupedCategories).map(([groupName, cats]) => (
                <div
                  key={groupName}
                  className="bg-white rounded-2xl overflow-hidden"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(groupName)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-semibold text-gray-800 text-lg">
                        {groupName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1">
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="p-1">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </button>

                  {/* Category Items */}
                  {expandedGroups[groupName] !== false && (
                    <div className="border-t border-gray-100">
                      {cats.map((category) => (
                        <div
                          key={category.id || category._id}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">
                                {category.icon || "📚"}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">
                              {category.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2">
                              <Menu className="w-5 h-5 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(category)}
                              className="p-2 bg-red-500 rounded-lg"
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Category Button */}
                  {expandedGroups[groupName] !== false && (
                    <button className="w-full p-4 flex items-center justify-center gap-2 text-yellow-600 font-semibold hover:bg-gray-50 transition-colors border-t border-gray-100">
                      <Plus className="w-5 h-5" />
                      <span>THÊM DANH MỤC</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteCategoryConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        categoryName={categoryToDelete?.name}
      />

      {/* Tutorial */}
      <CategoryTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </>
  );
}
