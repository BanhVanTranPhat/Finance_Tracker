const express = require("express");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const auth = require("../middleware/auth");
const { validateTransaction } = require("../middleware/validation");
const logger = require("../utils/logger");

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
    logger.logError(error, { action: "getTransactions", userId: req.user?.id });
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
    logger.logError(error, { action: "getTransaction", transactionId: req.params.id, userId: req.user?.id });
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Create new transaction
router.post("/", auth, validateTransaction, async (req, res) => {
  try {
    const { type, amount, currency, date, category, wallet, note, description } = req.body;
    // Support both 'note' and 'description' for backward compatibility
    // Only include note if it has a value (not empty string or undefined)
    const transactionNote = (note || description)?.trim() || undefined;

    // Validation
    if (!type || !amount || !date || !category || !wallet) {
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

    // Find wallet by name
    const walletDoc = await Wallet.findOne({
      user: req.user.id,
      name: wallet,
    });

    if (!walletDoc) {
      return res.status(404).json({ message: "Không tìm thấy ví" });
    }

    // Update wallet balance
    if (type === "income") {
      walletDoc.balance += amount;
    } else {
      walletDoc.balance -= amount;
    }

    await walletDoc.save();

    const transactionData = {
      user: req.user.id,
      type,
      amount,
      currency: currency || "VND",
      date: transactionDate,
      category,
      wallet,
    };
    
    // Only include note if it has a value
    if (transactionNote) {
      transactionData.note = transactionNote;
    }
    
    const transaction = new Transaction(transactionData);

    await transaction.save();

    res.status(201).json({
      message: "Thêm giao dịch thành công",
      transaction,
    });
  } catch (error) {
    logger.logError(error, { action: "createTransaction", userId: req.user?.id });
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
    const { type, amount, currency, date, category, wallet, note, description } = req.body;
    // Support both 'note' and 'description' for backward compatibility
    const transactionNote = note || description;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    // Store old values for wallet balance adjustment
    const oldType = transaction.type;
    const oldAmount = transaction.amount;
    const oldWallet = transaction.wallet;

    // Find old wallet
    const oldWalletDoc = await Wallet.findOne({
      user: req.user.id,
      name: oldWallet,
    });

    if (oldWalletDoc) {
      // Reverse old transaction effect
      if (oldType === "income") {
        oldWalletDoc.balance -= oldAmount;
      } else {
        oldWalletDoc.balance += oldAmount;
      }
      await oldWalletDoc.save();
    }

    // Update transaction fields
    if (type) transaction.type = type;
    if (amount !== undefined) transaction.amount = amount;
    if (currency) transaction.currency = currency;
    if (date) transaction.date = new Date(date);
    if (category) transaction.category = category;
    if (wallet) transaction.wallet = wallet;
    // Update note only if provided and not empty
    if (transactionNote !== undefined) {
      if (transactionNote && transactionNote.trim()) {
        transaction.note = transactionNote.trim();
      } else {
        transaction.note = undefined;
      }
    }

    await transaction.save();

    // Apply new transaction effect to wallet
    const newWalletDoc = await Wallet.findOne({
      user: req.user.id,
      name: transaction.wallet,
    });

    if (newWalletDoc) {
      if (transaction.type === "income") {
        newWalletDoc.balance += transaction.amount;
      } else {
        newWalletDoc.balance -= transaction.amount;
      }
      await newWalletDoc.save();
    }

    res.json({
      message: "Cập nhật giao dịch thành công",
      transaction,
    });
  } catch (error) {
    logger.logError(error, { action: "updateTransaction", transactionId: req.params.id, userId: req.user?.id });
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Delete all transactions for user
router.delete("/all", auth, async (req, res) => {
  try {
    const result = await Transaction.deleteMany({ user: req.user.id });
    res.json({
      message: "All transactions deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    logger.logError(error, { action: "deleteAllTransactions", userId: req.user?.id });
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Delete single transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    // Reverse transaction effect on wallet
    const walletDoc = await Wallet.findOne({
      user: req.user.id,
      name: transaction.wallet,
    });

    if (walletDoc) {
      if (transaction.type === "income") {
        walletDoc.balance -= transaction.amount;
      } else {
        walletDoc.balance += transaction.amount;
      }
      await walletDoc.save();
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: "Xóa giao dịch thành công" });
  } catch (error) {
    logger.logError(error, { action: "deleteTransaction", transactionId: req.params.id, userId: req.user?.id });
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
    logger.logError(error, { action: "getStats", userId: req.user?.id });
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
