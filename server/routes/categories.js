const express = require("express");
const Category = require("../models/Category");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all categories for user
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new category
router.post("/", auth, async (req, res) => {
  try {
    const { name, group, isDefault = false } = req.body;

    if (!name || !group) {
      return res.status(400).json({ message: "Name and group are required" });
    }

    const category = new Category({
      name,
      group,
      isDefault,
      user: req.user.id,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update category
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, group, isDefault } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, group, isDefault },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete all categories for user
router.delete("/all", auth, async (req, res) => {
  try {
    const result = await Category.deleteMany({ user: req.user.id });
    res.json({
      message: "All categories deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all categories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete single category
router.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Initialize categories (bulk create)
router.post("/initialize", auth, async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ message: "Categories array is required" });
    }

    // Delete existing categories for user
    await Category.deleteMany({ user: req.user.id });

    // Create new categories
    const categoriesWithUser = categories.map((category) => ({
      ...category,
      user: req.user.id,
    }));

    const createdCategories = await Category.insertMany(categoriesWithUser);
    res.status(201).json(createdCategories);
  } catch (error) {
    console.error("Error initializing categories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
