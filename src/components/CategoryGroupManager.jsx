import { useState, useEffect } from "react";
import { X, Plus, ChevronUp, ChevronDown, Menu, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FaHome,
  FaFileInvoice,
  FaUtensils,
  FaBus,
  FaBaby,
  FaPaw,
  FaCreditCard,
  FaPills,
  FaShieldAlt,
  FaCar,
  FaGift,
  FaGraduationCap,
  FaShoppingBag,
  FaSpa,
  FaCouch,
  FaPlane,
  FaWrench,
  FaWallet,
  FaFolder,
  FaCoins,
  FaChartLine,
  FaDollarSign,
} from "react-icons/fa";
import { useFinance } from "../contexts/FinanceContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { translateCategoryName } from "../utils/translateCategoryName.js";
import DeleteCategoryConfirmModal from "./DeleteCategoryConfirmModal.jsx";
import CategoryTutorial from "./CategoryTutorial.jsx";
import CreateCategoryModal from "./CreateCategoryModal.jsx";
import CategoryTemplateSelector from "./CategoryTemplateSelector.jsx";
import ContextTip from "./ContextTip.jsx";
import { categoryAPI } from "../services/api.js";

// Sortable Category Item Component
function SortableCategoryItem({ category, onDelete, language, t }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id || category._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm">
          {(() => {
            const iconMap = {
              home: FaHome,
              receipt: FaFileInvoice,
              utensils: FaUtensils,
              bus: FaBus,
              baby: FaBaby,
              "paw-print": FaPaw,
              "credit-card": FaCreditCard,
              pill: FaPills,
              "shield-check": FaShieldAlt,
              car: FaCar,
              gift: FaGift,
              "graduation-cap": FaGraduationCap,
              "shopping-bag": FaShoppingBag,
              sparkles: FaSpa,
              sofa: FaCouch,
              plane: FaPlane,
              house: FaHome,
              wrench: FaWrench,
              toolbox: FaWrench,
              wallet: FaWallet,
              coins: FaCoins,
              "line-chart": FaChartLine,
              "dollar-sign": FaDollarSign,
            };
            const nameToKeyMap = {
              "tiền nhà": "home",
              "nhà ở": "home",
              "mua nhà": "home",
              "hoá đơn": "receipt",
              "mua xe": "car",
              "sửa nhà": "wrench",
              "nâng cấp thiết bị": "wrench",
              "nâng cấp thiết bị, đồ nghề": "wrench",
              "ăn uống": "utensils",
              "ăn uống hằng ngày": "utensils",
              "đi lại": "bus",
              "khám bệnh/thuốc men": "pill",
              "bảo hiểm": "shield-check",
              "bảo hiểm nhân thọ": "shield-check",
              "con cái": "baby",
              "thú cưng": "paw-print",
              "quà tặng": "gift",
              "học phí": "graduation-cap",
              shopping: "shopping-bag",
              spa: "sparkles",
              massage: "sparkles",
              "du lịch": "plane",
              "trả nợ": "credit-card",
              "trả nợ/khoản vay": "credit-card",
            };
            const raw = (category.icon || "").toString().toLowerCase();
            const fallbackKey =
              nameToKeyMap[(category.name || "").toString().toLowerCase()];
            const key = iconMap[raw]
              ? raw
              : iconMap[fallbackKey]
              ? fallbackKey
              : "";
            const Icon = iconMap[key] || FaFolder;
            const colorMap = {
              home: "text-emerald-600",
              house: "text-emerald-600",
              receipt: "text-blue-600",
              utensils: "text-orange-600",
              bus: "text-sky-600",
              baby: "text-rose-500",
              "paw-print": "text-orange-500",
              "credit-card": "text-cyan-600",
              pill: "text-teal-600",
              "shield-check": "text-indigo-600",
              car: "text-blue-600",
              gift: "text-pink-600",
              "graduation-cap": "text-purple-600",
              "shopping-bag": "text-fuchsia-600",
              sparkles: "text-yellow-500",
              sofa: "text-violet-600",
              plane: "text-blue-500",
              wrench: "text-amber-600",
              toolbox: "text-amber-600",
              wallet: "text-emerald-600",
              coins: "text-amber-500",
              "line-chart": "text-green-600",
              "dollar-sign": "text-green-600",
            };
            let colorClass = colorMap[key];
            if (!colorClass) {
              const lowerKey = key.toLowerCase();
              if (lowerKey.includes("home") || lowerKey.includes("house")) {
                colorClass = "text-emerald-600";
              } else if (
                lowerKey.includes("receipt") ||
                lowerKey.includes("bills")
              ) {
                colorClass = "text-blue-600";
              } else if (
                lowerKey.includes("utensils") ||
                lowerKey.includes("food")
              ) {
                colorClass = "text-orange-600";
              } else if (
                lowerKey.includes("bus") ||
                lowerKey.includes("transport")
              ) {
                colorClass = "text-sky-600";
              } else if (
                lowerKey.includes("baby") ||
                lowerKey.includes("children")
              ) {
                colorClass = "text-rose-500";
              } else if (lowerKey.includes("paw") || lowerKey.includes("pet")) {
                colorClass = "text-orange-500";
              } else if (
                lowerKey.includes("credit") ||
                lowerKey.includes("debt")
              ) {
                colorClass = "text-cyan-600";
              } else {
                colorClass = "text-indigo-600";
              }
            }
            return <Icon className={`w-5 h-5 ${colorClass}`} />;
          })()}
        </div>
        <span className="font-medium text-gray-800">
          {translateCategoryName(category.name, language)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="p-2 rounded-lg hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors"
          title={t("dragToSort") || "Kéo để sắp xếp"}
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
        <button
          onClick={() => onDelete(category)}
          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          title={t("deleteCategory")}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function CategoryGroupManager({ isOpen, onClose }) {
  const { categories, deleteCategory } = useFinance();
  const { t, language } = useLanguage();
  const [expandedGroups, setExpandedGroups] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update local categories when categories prop changes
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  if (!isOpen) return null;

  // Group categories by group and sort by order
  const groupedCategories = localCategories
    .filter((c) => c.type === "expense")
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .reduce((acc, category) => {
      const group = category.group || t("other");
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
        const categoryId = categoryToDelete.id || categoryToDelete._id;
        await deleteCategory(categoryId);

        // Close confirmation modal
        setShowDeleteConfirm(false);
        setCategoryToDelete(null);

        // Note: deleteCategory in FinanceContext already updates the state,
        // so categories list will be updated automatically
      } catch (error) {
        console.error("Error deleting category:", error);
        alert(
          t("deleteCategoryError") ||
            "An error occurred while deleting category"
        );
      }
    }
  };

  const handleDragEnd = async (event, groupName) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Get categories for this group
    const groupCats = groupedCategories[groupName] || [];
    const oldIndex = groupCats.findIndex((c) => (c.id || c._id) === active.id);
    const newIndex = groupCats.findIndex((c) => (c.id || c._id) === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Reorder categories in this group
      const reorderedCats = arrayMove(groupCats, oldIndex, newIndex);

      // Update order for all categories in this group
      const categoryOrders = reorderedCats.map((cat, index) => ({
        id: cat.id || cat._id,
        order: index,
      }));

      // Update local state immediately for better UX
      setLocalCategories((prevCats) => {
        const updatedCats = prevCats.map((cat) => {
          const orderUpdate = categoryOrders.find(
            (co) => co.id === cat.id || co.id === cat._id
          );
          if (orderUpdate) {
            return { ...cat, order: orderUpdate.order };
          }
          return cat;
        });
        return updatedCats.sort((a, b) => (a.order || 0) - (b.order || 0));
      });

      try {
        await categoryAPI.updateCategoryOrder(categoryOrders);
        // Reload categories from API to ensure sync
        const updatedCategories = await categoryAPI.getCategories();
        setLocalCategories(updatedCategories);
      } catch (error) {
        console.error("Error updating category order:", error);
        alert(t("updateOrderError") || "Failed to update category order");
        // Revert on error
        setLocalCategories(categories);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                title={t("close")}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {t("manageCategoryGroups")}
              </h1>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm"
            >
              {t("saveButton")}
            </button>
          </div>

          {/* Create Group Button */}
          <div className="px-6 pt-5 pb-4 flex-shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md font-bold text-white"
            >
              <Plus className="w-5 h-5" />
              {t("createCategoryGroup")}
            </button>
          </div>

          {/* Category Groups List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <ContextTip storageKey="tip_category_group_manager">
              {t("categoryGroupTip")}
            </ContextTip>
            <div className="space-y-4">
              {Object.entries(groupedCategories).map(([groupName, cats]) => (
                <div
                  key={groupName}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(groupName)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
                      <span className="font-semibold text-gray-800">
                        {groupName}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedGroups[groupName] !== false
                          ? "rotate-180"
                          : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* Category Items */}
                  {expandedGroups[groupName] !== false && (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handleDragEnd(event, groupName)}
                    >
                      <SortableContext
                        items={cats.map((c) => c.id || c._id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="border-t border-gray-100">
                          {cats.map((category) => (
                            <SortableCategoryItem
                              key={category.id || category._id}
                              category={category}
                              onDelete={handleDeleteClick}
                              language={language}
                              t={t}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}

                  {/* Add Category Button */}
                  {expandedGroups[groupName] !== false && (
                    <button
                      onClick={() => setShowTemplateSelector(true)}
                      className="w-full p-4 flex items-center justify-center gap-2 text-emerald-700 font-semibold hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                      <Plus className="w-5 h-5" />
                      <span>{t("addCategory")}</span>
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

      {/* Create New Category */}
      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Add From Templates */}
      <CategoryTemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
      />
    </>
  );
}
