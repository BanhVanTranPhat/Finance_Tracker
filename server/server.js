const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Load and validate configuration
const config = require("./config");
const { apiLimiter } = require("./middleware/rateLimiter");
const logger = require("./utils/logger");

// Finance Tracker Backend Server
const app = express();

// Middleware
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware (only log errors/warnings in development to reduce noise)
app.use((req, res, next) => {
  // Skip logging for health check in all environments
  if (req.path === "/api/health") {
    return next();
  }

  const startTime = Date.now();

  // Log when response finishes
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    logger.logRequest(req, res, responseTime);
  });

  next();
});

// MongoDB Connection
mongoose
  .connect(config.mongoURI)
  .then(() => logger.info("✅ MongoDB connected successfully"))
  .catch((err) => {
    logger.error("❌ MongoDB connection error", { error: err.message, stack: err.stack });
    process.exit(1);
  });

// Health check endpoint (no rate limiting - must be before rate limiter)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Finance Tracker API is running",
    timestamp: new Date().toISOString(),
  });
});

// Apply rate limiting to all API routes (except health check which is above)
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/wallets", require("./routes/wallets"));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.logError(err, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    body: req.body,
  });

  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV !== "production";
  const errorMessage = isDevelopment
    ? err.message || "Lỗi server nội bộ"
    : "Lỗi server nội bộ";

  res.status(err.statusCode || 500).json({
    message: errorMessage,
    ...(isDevelopment && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - Endpoint not found: ${req.method} ${req.url}`, {
    ip: req.ip,
  });
  res.status(404).json({ message: "API endpoint không tồn tại" });
});

app.listen(config.port, () => {
  logger.info(`🚀 Server running on port ${config.port}`);
  logger.info(`📊 Health check: http://localhost:${config.port}/api/health`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
});
