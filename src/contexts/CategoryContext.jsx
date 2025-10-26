import React, { createContext, useContext, useState } from "react";
import { categoryTemplates } from "../data/categoryTemplates.js";

const CategoryContext = createContext(undefined);

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (groupId, categoryId) => {
    console.log("🔄 toggleCategory called:", {
      groupId,
      categoryId,
      selectedTemplate,
    });
    // Use the template from categoryTemplates if selectedTemplate is null
    const template = selectedTemplate || categoryTemplates[0];
    if (!template) {
      console.log("❌ No template available");
      return;
    }

    setSelectedCategories((prev) => {
      const existingIndex = prev.findIndex((cat) => cat.id === categoryId);

      if (existingIndex >= 0) {
        // Remove category if already selected
        console.log("➖ Removing category:", categoryId);
        return prev.filter((cat) => cat.id !== categoryId);
      } else {
        // Add category if not selected
        const group = template.groups.find((g) => g.id === groupId);
        const category = group?.categories.find((cat) => cat.id === categoryId);

        if (category) {
          console.log("➕ Adding category:", categoryId);
          return [...prev, { ...category, selected: true }];
        }
        console.log("❌ Category not found:", categoryId);
        return prev;
      }
    });
  };

  const selectAllCategories = (groupId) => {
    // Use the template from categoryTemplates if selectedTemplate is null
    const template = selectedTemplate || categoryTemplates[0];
    if (!template) return;

    const group = template.groups.find((g) => g.id === groupId);
    if (!group) return;

    setSelectedCategories((prev) => {
      const otherGroupsCategories = prev.filter(
        (cat) => !group.categories.some((groupCat) => groupCat.id === cat.id)
      );
      const groupCategories = group.categories.map((cat) => ({
        ...cat,
        selected: true,
      }));
      return [...otherGroupsCategories, ...groupCategories];
    });
  };

  const deselectAllCategories = (groupId) => {
    // Use the template from categoryTemplates if selectedTemplate is null
    const template = selectedTemplate || categoryTemplates[0];
    if (!template) return;

    const group = template.groups.find((g) => g.id === groupId);
    if (!group) return;

    setSelectedCategories((prev) =>
      prev.filter(
        (cat) => !group.categories.some((groupCat) => groupCat.id === cat.id)
      )
    );
  };

  const resetSelection = () => {
    setSelectedTemplate(null);
    setSelectedCategories([]);
  };

  const getSelectedCategoriesByGroup = (groupId) => {
    // Use the template from categoryTemplates if selectedTemplate is null
    const template = selectedTemplate || categoryTemplates[0];
    if (!template) return [];

    const group = template.groups.find((g) => g.id === groupId);
    if (!group) return [];

    return selectedCategories.filter((cat) =>
      group.categories.some((groupCat) => groupCat.id === cat.id)
    );
  };

  const value = {
    selectedTemplate,
    selectedCategories,
    setSelectedTemplate,
    toggleCategory,
    selectAllCategories,
    deselectAllCategories,
    resetSelection,
    getSelectedCategoriesByGroup,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
