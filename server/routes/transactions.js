const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all transactions for user
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      type,
      category,
      startDate,
      endDate,
      min,
      max,
      sortBy = "date",
      sortOrder = "desc",
      search,
      currency,
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const query = { user: req.user.id };

    if (type && ["income", "expense"].includes(type)) query.type = type;
    if (currency && ["VND", "USD"].includes(currency))
      query.currency = currency;
    if (category) query.category = new RegExp(category, "i");

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (min || max) {
      query.amount = {};
      if (min) query.amount.$gte = Number(min);
      if (max) query.amount.$lte = Number(max);
    }

    if (search) {
      query.note = new RegExp(search, "i");
    }

    const sortField = ["date", "amount", "category", "createdAt"].includes(
      sortBy
    )
      ? sortBy
      : "date";
    const sortDir = sortOrder === "asc" ? 1 : -1;
    const sort = { [sortField]: sortDir };

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort(sort)
        .limit(limitNum)
        .skip((pageNum - 1) * limitNum),
      Transaction.countDocuments(query),
    ]);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
      pageSize: limitNum,
      sortBy: sortField,
      sortOrder: sortDir === 1 ? "asc" : "desc",
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Get transaction by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    res.json({ transaction });
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Create new transaction
router.post("/", auth, async (req, res) => {
  try {
    const { type, amount, currency, date, category, note } = req.body;

    // Validation
    if (!type || !amount || !date || !category) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Loại giao dịch không hợp lệ" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Số tiền phải lớn hơn 0" });
    }

    // Validate and parse date
    const transactionDate = new Date(date);
    if (isNaN(transactionDate.getTime())) {
      return res.status(400).json({ message: "Ngày không hợp lệ" });
    }

    const transaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      currency: currency || "VND",
      date: transactionDate,
      category,
      note,
    });

    await transaction.save();

    res.status(201).json({
      message: "Thêm giao dịch thành công",
      transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Update transaction
router.put("/:id", auth, async (req, res) => {
  try {
    const { type, amount, currency, date, category, note } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    // Update fields
    if (type) transaction.type = type;
    if (amount !== undefined) transaction.amount = amount;
    if (currency) transaction.currency = currency;
    if (date) transaction.date = new Date(date);
    if (category) transaction.category = category;
    if (note !== undefined) transaction.note = note;

    await transaction.save();

    res.json({
      message: "Cập nhật giao dịch thành công",
      transaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Delete all transactions for user
router.delete("/all", auth, async (req, res) => {
  try {
    const result = await Transaction.deleteMany({ user: req.user.id });
    res.json({ 
      message: "All transactions deleted successfully",
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error("Error deleting all transactions:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Delete single transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    res.json({ message: "Xóa giao dịch thành công" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Get transaction statistics
router.get("/stats/summary", auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { userId: req.userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const stats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const income = stats.find((s) => s._id === "income") || {
      total: 0,
      count: 0,
    };
    const expense = stats.find((s) => s._id === "expense") || {
      total: 0,
      count: 0,
    };

    res.json({
      income: income.total,
      expense: expense.total,
      balance: income.total - expense.total,
      incomeCount: income.count,
      expenseCount: expense.count,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
