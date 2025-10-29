const express = require("express");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const auth = require("../middleware/auth");

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
    console.error("Error fetching categories:", error);
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
    console.error("Error creating category:", error);
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
    console.error("Error updating budget limit:", error);
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
    console.error("Error allocating budgets:", error);
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
    console.error("Error fetching budget summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
