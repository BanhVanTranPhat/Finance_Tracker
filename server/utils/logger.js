/**
 * Winston Logger Configuration
 * Provides structured logging for the application
 */

const winston = require("winston");
const path = require("path");

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// Add colors to winston
winston.addColors(logColors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development (more readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Create logs directory path
const logsDir = path.join(__dirname, "../logs");

// Ensure logs directory exists
const fs = require("fs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create logger instance
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "info"), // Changed from 'debug' to 'info' to reduce noise
  format: logFormat,
  defaultMeta: { service: "finance-tracker-api" },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write errors to error.log
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  // Handle exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "exceptions.log"),
    }),
  ],
  // Handle promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "rejections.log"),
    }),
  ],
});

// In development, also log to console with colors (but limit to info and above to reduce noise)
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.LOG_LEVEL || "info", // Changed from 'debug' to 'info' to reduce noise
    })
  );
}

// In production, only log errors and above to console
if (process.env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      level: "error",
    })
  );
}

/**
 * Helper function to log HTTP requests
 */
logger.logRequest = (req, res, responseTime) => {
  const { method, url, ip } = req;
  const { statusCode } = res;

  const logLevel = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "http";

  // In development, only log errors and warnings (skip successful requests to reduce noise)
  if (process.env.NODE_ENV === "development" && statusCode < 400) {
    return; // Skip logging successful requests in development
  }

  // Simplified log format
  const logData = {
    message: `${method} ${url} ${statusCode} ${responseTime}ms`,
    method,
    url,
    statusCode,
    responseTime: `${responseTime}ms`,
  };

  // Only add extra details for errors
  if (statusCode >= 400) {
    logData.ip = ip;
    logData.userAgent = req.get("user-agent");
  }

  logger[logLevel](logData);
};

/**
 * Helper function to log errors with context
 */
logger.logError = (error, context = {}) => {
  logger.error({
    message: error.message || "Unknown error",
    stack: error.stack,
    ...context,
  });
};

module.exports = logger;

