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
    if (!selectedTemplate) return;

    setSelectedCategories((prev) => {
      const existingIndex = prev.findIndex((cat) => cat.id === categoryId);

      if (existingIndex >= 0) {
        // Remove category if already selected
        return prev.filter((cat) => cat.id !== categoryId);
      } else {
        // Add category if not selected
        const group = selectedTemplate.groups.find((g) => g.id === groupId);
        const category = group?.categories.find((cat) => cat.id === categoryId);

        if (category) {
          return [...prev, { ...category, selected: true }];
        }
        return prev;
      }
    });
  };

  const selectAllCategories = (groupId) => {
    if (!selectedTemplate) return;

    const group = selectedTemplate.groups.find((g) => g.id === groupId);
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
    if (!selectedTemplate) return;

    const group = selectedTemplate.groups.find((g) => g.id === groupId);
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
    if (!selectedTemplate) return [];

    const group = selectedTemplate.groups.find((g) => g.id === groupId);
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
