/**
 * Centralized Error Messages
 * Provides consistent error messages with support for multiple languages
 */

const errorMessages = {
  vi: {
    // Authentication errors
    auth: {
      missingToken: "Không có token, truy cập bị từ chối",
      invalidToken: "Token không hợp lệ",
      expiredToken: "Token đã hết hạn",
      unauthorized: "Bạn không có quyền truy cập",
      loginFailed: "Email hoặc mật khẩu không đúng",
      registerFailed: "Đăng ký thất bại",
      emailExists: "Email đã được sử dụng",
      weakPassword: "Mật khẩu phải có ít nhất 6 ký tự",
      googleOAuthError: "Lỗi xác thực Google",
    },
    // Validation errors
    validation: {
      required: "Trường này không được để trống",
      invalidEmail: "Email không hợp lệ",
      invalidFormat: "Định dạng không hợp lệ",
      tooShort: "Giá trị quá ngắn",
      tooLong: "Giá trị quá dài",
      invalidNumber: "Giá trị phải là số",
      invalidDate: "Ngày không hợp lệ",
      invalidType: "Loại không hợp lệ",
    },
    // Resource errors
    resource: {
      notFound: "Không tìm thấy",
      alreadyExists: "Đã tồn tại",
      deleted: "Đã bị xóa",
      cannotDelete: "Không thể xóa",
      cannotUpdate: "Không thể cập nhật",
      insufficientBalance: "Số dư không đủ",
      transactionNotFound: "Không tìm thấy giao dịch",
      walletNotFound: "Không tìm thấy ví",
      categoryNotFound: "Không tìm thấy danh mục",
    },
    // Server errors
    server: {
      internalError: "Lỗi server nội bộ",
      databaseError: "Lỗi cơ sở dữ liệu",
      serviceUnavailable: "Dịch vụ tạm thời không khả dụng",
      badRequest: "Yêu cầu không hợp lệ",
      endpointNotFound: "API endpoint không tồn tại",
    },
    // Generic
    generic: {
      error: "Đã xảy ra lỗi",
      tryAgain: "Vui lòng thử lại",
      contactSupport: "Vui lòng liên hệ hỗ trợ",
    },
  },
  en: {
    // Authentication errors
    auth: {
      missingToken: "No token, access denied",
      invalidToken: "Invalid token",
      expiredToken: "Token has expired",
      unauthorized: "You do not have permission to access",
      loginFailed: "Email or password is incorrect",
      registerFailed: "Registration failed",
      emailExists: "Email already exists",
      weakPassword: "Password must be at least 6 characters",
      googleOAuthError: "Google authentication error",
    },
    // Validation errors
    validation: {
      required: "This field is required",
      invalidEmail: "Invalid email",
      invalidFormat: "Invalid format",
      tooShort: "Value is too short",
      tooLong: "Value is too long",
      invalidNumber: "Value must be a number",
      invalidDate: "Invalid date",
      invalidType: "Invalid type",
    },
    // Resource errors
    resource: {
      notFound: "Not found",
      alreadyExists: "Already exists",
      deleted: "Has been deleted",
      cannotDelete: "Cannot delete",
      cannotUpdate: "Cannot update",
      insufficientBalance: "Insufficient balance",
      transactionNotFound: "Transaction not found",
      walletNotFound: "Wallet not found",
      categoryNotFound: "Category not found",
    },
    // Server errors
    server: {
      internalError: "Internal server error",
      databaseError: "Database error",
      serviceUnavailable: "Service temporarily unavailable",
      badRequest: "Bad request",
      endpointNotFound: "API endpoint does not exist",
    },
    // Generic
    generic: {
      error: "An error occurred",
      tryAgain: "Please try again",
      contactSupport: "Please contact support",
    },
  },
};

/**
 * Get error message based on language and category
 * @param {string} category - Error category (auth, validation, resource, server)
 * @param {string} key - Error key
 * @param {string} lang - Language code ('vi' or 'en')
 * @returns {string} Error message
 */
function getErrorMessage(category, key, lang = "vi") {
  const messages = errorMessages[lang] || errorMessages.vi;
  return messages[category]?.[key] || messages.generic.error;
}

/**
 * Create a standardized error response
 * @param {string} category - Error category
 * @param {string} key - Error key
 * @param {number} statusCode - HTTP status code
 * @param {string} lang - Language code
 * @param {object} additionalData - Additional data to include
 * @returns {object} Error response object
 */
function createErrorResponse(
  category,
  key,
  statusCode = 500,
  lang = "vi",
  additionalData = {}
) {
  return {
    statusCode,
    message: getErrorMessage(category, key, lang),
    category,
    key,
    ...additionalData,
  };
}

/**
 * Custom Error class for application errors
 */
class AppError extends Error {
  constructor(
    category,
    key,
    statusCode = 500,
    lang = "vi",
    additionalData = {}
  ) {
    const message = getErrorMessage(category, key, lang);
    super(message);
    this.name = "AppError";
    this.category = category;
    this.key = key;
    this.statusCode = statusCode;
    this.lang = lang;
    this.additionalData = additionalData;
  }

  toJSON() {
    return {
      message: this.message,
      category: this.category,
      key: this.key,
      statusCode: this.statusCode,
      ...this.additionalData,
    };
  }
}

module.exports = {
  errorMessages,
  getErrorMessage,
  createErrorResponse,
  AppError,
};

