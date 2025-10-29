const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: "wallet",
    },
    color: {
      type: String,
      default: "#10b981",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

// Index for better query performance
walletSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model("Wallet", walletSchema);
