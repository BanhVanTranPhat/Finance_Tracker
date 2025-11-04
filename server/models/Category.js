const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      default: "expense",
      trim: true,
    },
    group: {
      type: String,
      required: true,
      trim: true,
    },
    budgeted_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    icon: {
      type: String,
      default: "📚",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
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
        ret.budgetLimit = ret.budgeted_amount;
        return ret;
      },
    },
  }
);

// Index for better query performance
categorySchema.index({ user: 1, name: 1 });

module.exports = mongoose.model("Category", categorySchema);
