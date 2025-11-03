/**
 * Rate limiting middleware
 * Protects API endpoints from abuse and brute force attacks
 */

const rateLimit = require("express-rate-limit");
const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 10000 : 100, // Higher limit in development
  message: {
    message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for login endpoints
 * 10 requests per 15 minutes per IP - prevents brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs (increased from 5)
  message: {
    message:
      "Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút để bảo vệ tài khoản của bạn.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests - only count failed attempts
  skipSuccessfulRequests: true,
});

/**
 * Separate rate limiter for register endpoint
 * 20 requests per 15 minutes per IP - more lenient for registration
 */
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs (allows multiple accounts creation)
  message: {
    message:
      "Quá nhiều lần thử đăng ký từ IP này, vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful registrations - only count failed attempts
  skipSuccessfulRequests: true,
});

/**
 * Moderate rate limiter for sensitive operations
 * 20 requests per 15 minutes per IP
 */
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 20, // Higher limit in development
  message: {
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  registerLimiter,
  sensitiveLimiter,
};

