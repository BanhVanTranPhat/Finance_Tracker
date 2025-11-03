const express = require("express");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const auth = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// Get all categories for user
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    // Calculate spent for each category in current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
      type: "expense",
    });

    // Add spent amount to each category
    const categoriesWithSpent = categories.map((category) => {
      const categoryTransactions = transactions.filter(
        (t) => t.category === category.name
      );
      const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);

      return {
        ...category.toJSON(),
        spent: spent,
      };
    });

    res.json(categoriesWithSpent);
  } catch (error) {
    logger.logError(error, { action: "getCategories", userId: req.user?.id });
    res.status(500).json({ message: "Server error" });
  }
});

// Create new category
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      type = "expense",
      group,
      budgeted_amount = 0,
      isDefault = false,
    } = req.body;

    if (!name || !group) {
      return res.status(400).json({ message: "Name and group are required" });
    }

    const category = new Category({
      name,
      type,
      group,
      budgeted_amount,
      isDefault,
      user: req.user.id,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    logger.logError(error, { action: "createCategory", userId: req.user?.id });
    res.status(500).json({ message: "Server error" });
  }
});

// Update category
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, type, group, budgeted_amount, isDefault } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (group) updateData.group = group;
    if (budgeted_amount !== undefined)
      updateData.budgeted_amount = budgeted_amount;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    logger.logError(error, { action: "updateCategory", categoryId: req.params.id, userId: req.user?.id });
    res.status(500).json({ message: "Server error" });
  }
});

// Delete all categories for user (preserve income categories)
router.delete("/all", auth, async (req, res) => {
  try {
    // Only delete expense categories, preserve income categories
    const result = await Category.deleteMany({ 
      user: req.user.id,
      type: "expense"
    });

    // Check existing income categories (preserve all existing income categories)
    const existingIncomeCategories = await Category.find({
      user: req.user.id,
      type: "income"
    });

    // If no income categories exist, create the 4 default ones (in Vietnamese, user can edit later)
    // If some exist, preserve them (don't create duplicates)
    if (existingIncomeCategories.length === 0) {
      const defaultIncomeCategories = [
        { name: "Lương", type: "income", group: "Thu nhập", icon: "dollar-sign", isDefault: true },
        { name: "Thưởng", type: "income", group: "Thu nhập", icon: "gift", isDefault: true },
        { name: "Đầu tư", type: "income", group: "Thu nhập", icon: "line-chart", isDefault: true },
        { name: "Thu nhập khác", type: "income", group: "Thu nhập", icon: "coins", isDefault: true },
      ];

      const categoriesToCreate = defaultIncomeCategories.map(category => ({
        ...category,
        user: req.user.id,
      }));
      
      await Category.insertMany(categoriesToCreate);
      logger.info(`Created 4 default income categories for user (none existed)`, { userId: req.user.id });
    }

    res.json({
      message: "All expense categories deleted successfully (income categories preserved)",
      deletedCount: result.deletedCount,
      incomeCategoriesPreserved: existingIncomeCategories.length,
    });
  } catch (error) {
    logger.logError(error, { action: "deleteAllCategories", userId: req.user?.id });
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
    logger.logError(error, { action: "deleteCategory", categoryId: req.params.id, userId: req.user?.id });
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

    if (categories.length === 0) {
      return res.status(400).json({ message: "At least one category is required" });
    }

    // Validate each category has required fields
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      if (!cat.name || typeof cat.name !== "string" || cat.name.trim().length === 0) {
        return res.status(400).json({ 
          message: `Category at index ${i} is missing or has invalid name` 
        });
      }
      if (!cat.type || !["income", "expense"].includes(cat.type)) {
        return res.status(400).json({ 
          message: `Category at index ${i} has invalid type. Must be "income" or "expense"` 
        });
      }
      if (!cat.group || typeof cat.group !== "string" || cat.group.trim().length === 0) {
        return res.status(400).json({ 
          message: `Category at index ${i} is missing or has invalid group` 
        });
      }
    }

    // Delete existing categories for user
    await Category.deleteMany({ user: req.user.id });

    // Create new categories - ensure clean data
    const categoriesWithUser = categories.map((category) => ({
      name: category.name.trim(),
      type: category.type,
      group: category.group.trim(),
      icon: category.icon || "folder",
      isDefault: category.isDefault || false,
      budgeted_amount: category.budgeted_amount || 0,
      user: req.user.id,
    }));

    const createdCategories = await Category.insertMany(categoriesWithUser);
    res.status(201).json(createdCategories);
  } catch (error) {
    logger.logError(error, { 
      action: "initializeCategories", 
      userId: req.user?.id,
      errorMessage: error.message,
      stack: error.stack 
    });
    
    // Provide more helpful error message
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validation error: " + Object.values(error.errors).map(e => e.message).join(", ")
      });
    }
    
    res.status(500).json({ 
      message: "An error occurred while initializing categories. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Update budget limit for a single category
router.put("/:id/budget", auth, async (req, res) => {
  try {
    const { budgetLimit } = req.body;

    if (budgetLimit === undefined || budgetLimit < 0) {
      return res
        .status(400)
        .json({ message: "Valid budget limit is required" });
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { budgeted_amount: budgetLimit },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    logger.logError(error, { action: "updateBudgetLimit", categoryId: req.params.id, userId: req.user?.id });
    res.status(500).json({ message: "Server error" });
  }
});

// Allocate budgets for multiple categories
router.post("/allocate-budgets", auth, async (req, res) => {
  try {
    const { allocations, year, month } = req.body;

    if (!allocations || typeof allocations !== "object") {
      return res
        .status(400)
        .json({ message: "Allocations object is required" });
    }

    // Update each category with new budget allocation
    const updatePromises = Object.entries(allocations).map(
      ([categoryId, amount]) => {
        return Category.findOneAndUpdate(
          { _id: categoryId, user: req.user.id },
          { budgeted_amount: amount },
          { new: true }
        );
      }
    );

    const updatedCategories = await Promise.all(updatePromises);

    // Filter out null values (categories not found or not belonging to user)
    const validCategories = updatedCategories.filter((cat) => cat !== null);

    res.json({
      message: "Budget allocations updated successfully",
      categories: validCategories,
      year,
      month,
    });
  } catch (error) {
    logger.logError(error, { action: "allocateBudgets", userId: req.user?.id });
    res.status(500).json({ message: "Server error" });
  }
});

// Get budget summary for Zero-Based Budgeting
router.get("/budget-summary", auth, async (req, res) => {
  try {
    const { year, month } = req.query;

    // Parse year and month from query or use current date
    const targetDate = new Date();
    if (year && month) {
      targetDate.setFullYear(parseInt(year));
      targetDate.setMonth(parseInt(month));
    }

    const startOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Calculate totalIncome and totalSpent from transactions in the month
    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // "Tiền đã có việc" = Tổng chi tiêu thực tế (Cách đơn giản)
    const totalBudgeted = totalSpent;

    // Calculate total wallet balance
    const wallets = await Wallet.find({ user: req.user.id });
    const totalWalletBalance = wallets.reduce(
      (sum, wallet) => sum + (wallet.balance || 0),
      0
    );

    // Calculate remaining to budget
    // Tiền chưa có việc = Tổng số dư ví - Tiền đã lập kế hoạch
    // (Số dư ví đã bao gồm thu nhập rồi vì khi thêm thu nhập, ví tự động tăng)
    const remainingToBudget = totalWalletBalance - totalBudgeted;

    res.json({
      totalIncome,
      totalWalletBalance,
      totalBudgeted,
      totalSpent,
      remainingToBudget,
      savings: totalIncome - totalSpent,
      savingsPercentage:
        totalIncome > 0
          ? Math.round(((totalIncome - totalSpent) / totalIncome) * 100)
          : 0,
    });
  } catch (error) {
    logger.logError(error, { action: "getBudgetSummary", userId: req.user?.id });
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
