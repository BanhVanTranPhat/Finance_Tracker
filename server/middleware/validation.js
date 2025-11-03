/**
 * Input validation and sanitization middleware
 * Uses express-validator to sanitize and validate user inputs
 */

const { body, validationResult, param } = require("express-validator");

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Register validation rules
 */
const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên không được để trống")
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên phải từ 2 đến 50 ký tự")
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
    .withMessage("Tên chỉ được chứa chữ cái và khoảng trắng")
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email quá dài"),
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6, max: 128 })
    .withMessage("Mật khẩu phải từ 6 đến 128 ký tự")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ hoa (A-Z), 1 chữ thường (a-z) và 1 số (0-9). Ví dụ: MyPass123")
    .optional(), // Optional because Google OAuth users don't have password
  handleValidationErrors,
];

/**
 * Login validation rules
 */
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 1 })
    .withMessage("Mật khẩu không được để trống"),
  handleValidationErrors,
];

/**
 * Transaction validation rules
 */
const validateTransaction = [
  body("type")
    .notEmpty()
    .withMessage("Loại giao dịch không được để trống")
    .isIn(["income", "expense"])
    .withMessage("Loại giao dịch phải là 'income' hoặc 'expense'"),
  body("amount")
    .notEmpty()
    .withMessage("Số tiền không được để trống")
    .isFloat({ min: 0.01 })
    .withMessage("Số tiền phải lớn hơn 0")
    .toFloat(),
  body("currency")
    .optional()
    .isIn(["VND", "USD", "EUR"])
    .withMessage("Tiền tệ không hợp lệ"),
  body("date")
    .notEmpty()
    .withMessage("Ngày không được để trống")
    .isISO8601()
    .withMessage("Ngày không hợp lệ")
    .toDate(),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Danh mục không được để trống")
    .isLength({ min: 1, max: 100 })
    .withMessage("Danh mục phải từ 1 đến 100 ký tự")
    .escape(),
  body("wallet")
    .trim()
    .notEmpty()
    .withMessage("Ví không được để trống")
    .isLength({ min: 1, max: 100 })
    .withMessage("Ví phải từ 1 đến 100 ký tự")
    .escape(),
  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Ghi chú không được quá 500 ký tự")
    .escape(),
  handleValidationErrors,
];

/**
 * Wallet validation rules
 */
const validateWallet = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên ví không được để trống")
    .isLength({ min: 1, max: 50 })
    .withMessage("Tên ví phải từ 1 đến 50 ký tự")
    .escape(),
  body("balance")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Số dư phải >= 0")
    .toFloat(),
  body("type")
    .optional()
    .isIn(["cash", "bank", "ewallet"])
    .withMessage("Loại ví không hợp lệ"),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault phải là boolean")
    .toBoolean(),
  handleValidationErrors,
];

/**
 * Category validation rules
 */
const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên danh mục không được để trống")
    .isLength({ min: 1, max: 100 })
    .withMessage("Tên danh mục phải từ 1 đến 100 ký tự")
    .escape(),
  body("type")
    .notEmpty()
    .withMessage("Loại danh mục không được để trống")
    .isIn(["income", "expense"])
    .withMessage("Loại danh mục phải là 'income' hoặc 'expense'"),
  body("group")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Nhóm danh mục không được quá 100 ký tự")
    .escape(),
  body("budgetLimit")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Ngân sách phải >= 0")
    .toFloat(),
  handleValidationErrors,
];

/**
 * Profile update validation rules
 */
const validateProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên phải từ 2 đến 50 ký tự")
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
    .withMessage("Tên chỉ được chứa chữ cái và khoảng trắng")
    .escape(),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email quá dài"),
  body("avatar")
    .optional()
    .custom((value) => {
      if (!value || value === "") return true; // Allow empty string
      
      // Don't trim base64 - it will break the data
      const trimmedValue = typeof value === "string" ? value.trim() : value;
      
      // Accept either HTTP/HTTPS URL or base64 data URL
      const isUrl = /^https?:\/\/.+/.test(trimmedValue);
      const isDataUrl = /^data:image\/[a-zA-Z+]+;base64,[A-Za-z0-9+/=]+/.test(trimmedValue);
      
      if (isUrl || isDataUrl) {
        // Check size: base64 data URLs can be large (5MB limit ≈ 6.67MB base64)
        if (isDataUrl && trimmedValue.length > 7000000) {
          throw new Error("Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB");
        }
        return true;
      }
      throw new Error("Avatar phải là một URL hợp lệ hoặc base64 data URL");
    }),
  handleValidationErrors,
];

/**
 * ID parameter validation
 */
const validateIdParam = [
  param("id")
    .notEmpty()
    .withMessage("ID không được để trống")
    .isMongoId()
    .withMessage("ID không hợp lệ"),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateTransaction,
  validateWallet,
  validateCategory,
  validateProfileUpdate,
  validateIdParam,
  handleValidationErrors,
};

