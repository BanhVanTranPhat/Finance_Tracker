const express = require("express");
const Wallet = require("../models/Wallet");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all wallets for user
router.get("/", auth, async (req, res) => {
  try {
    const wallets = await Wallet.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(wallets);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new wallet
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      balance = 0,
      icon = "wallet",
      color = "#10b981",
      isDefault = false,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const wallet = new Wallet({
      name,
      balance,
      icon,
      color,
      isDefault,
      user: req.user.id,
    });

    await wallet.save();
    res.status(201).json(wallet);
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update wallet
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, balance, icon, color, isDefault } = req.body;
    const wallet = await Wallet.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, balance, icon, color, isDefault },
      { new: true }
    );

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json(wallet);
  } catch (error) {
    console.error("Error updating wallet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete all wallets for user
router.delete("/all", auth, async (req, res) => {
  try {
    const result = await Wallet.deleteMany({ user: req.user.id });
    res.json({
      message: "All wallets deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all wallets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete single wallet
router.delete("/:id", auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json({ message: "Wallet deleted successfully" });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
