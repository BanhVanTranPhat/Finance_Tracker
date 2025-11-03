const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { OAuth2Client } = require("google-auth-library");
const config = require("../config");
const { authLimiter, registerLimiter } = require("../middleware/rateLimiter");
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
} = require("../middleware/validation");
const logger = require("../utils/logger");
const crypto = require("crypto");
const { sendResetCodeEmail } = require("../utils/mailer");

const router = express.Router();

// Google OAuth client - only create when credentials exist to avoid crash in dev
let googleClient = null;
try {
  if (config.googleClientId && config.googleClientSecret) {
    googleClient = new OAuth2Client(
      config.googleClientId,
      config.googleClientSecret,
      process.env.GOOGLE_REDIRECT_URI || "http://localhost:5173/auth/callback"
    );
  }
} catch (e) {
  logger.warn("Google OAuth client init skipped", { error: e.message });
}

// Register
router.post("/register", registerLimiter, validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    logger.logError(error, { action: "register", email: req.body.email });
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Login
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    logger.logError(error, { action: "login", email: req.body.email });
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Forgot password - send OTP code
router.post("/forgot", authLimiter, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const user = await User.findOne({ email });
    if (!user) {
      // Trả thành công để tránh dò email
      return res.json({ message: "Nếu email tồn tại, mã đã được gửi" });
    }

    // Giới hạn số lần thử
    if ((user.resetAttempts || 0) >= 5 && user.resetCodeExpires && user.resetCodeExpires > new Date()) {
      return res.status(429).json({ message: "Thử lại sau ít phút" });
    }

    const code = ("" + Math.floor(100000 + Math.random() * 900000)); // 6 số
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    user.resetCodeHash = codeHash;
    user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    user.resetAttempts = 0;
    await user.save();

    await sendResetCodeEmail(email, code);
    res.json({ message: "Đã gửi mã xác thực về email" });
  } catch (error) {
    logger.logError(error, { action: "forgot", email: req.body?.email });
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Reset password with code
router.post("/reset", authLimiter, async (req, res) => {
  try {
    const { email, code, newPassword } = req.body || {};
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    const user = await User.findOne({ email }).select("+resetCodeHash +resetCodeExpires +resetAttempts");
    if (!user || !user.resetCodeHash || !user.resetCodeExpires) {
      return res.status(400).json({ message: "Mã không hợp lệ" });
    }

    if (user.resetCodeExpires < new Date()) {
      return res.status(400).json({ message: "Mã đã hết hạn" });
    }

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    if (codeHash !== user.resetCodeHash) {
      user.resetAttempts = (user.resetAttempts || 0) + 1;
      await user.save();
      return res.status(400).json({ message: "Mã không đúng" });
    }

    // Đổi mật khẩu và xóa thông tin reset
    user.password = newPassword;
    user.resetCodeHash = undefined;
    user.resetCodeExpires = undefined;
    user.resetAttempts = 0;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    logger.logError(error, { action: "reset", email: req.body?.email });
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    // auth middleware sets req.user.id (not req.userId)
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Không xác định được người dùng" });
    }
    
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    
    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
      }
    });
  } catch (error) {
    logger.logError(error, { action: "getUser", userId: req.user?.id });
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Update user profile
router.put(
  "/profile",
  auth,
  validateProfileUpdate,
  async (req, res) => {
  try {
    // auth middleware sets req.user.id (not req.userId)
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Không xác định được người dùng" });
    }
    
    const { name, email, avatar } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }
      user.email = email;
    }
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      message: "Cập nhật thông tin thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    logger.logError(error, { action: "updateProfile", userId: req.user?.id });
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Google Sign-In: verify Google ID token -> our JWT
router.post("/google", async (req, res) => {
  try {
    // Treat as not configured only if Google client is not initialized
    if (!googleClient) {
      logger.error("Google OAuth not configured: Missing credentials");
      return res.status(500).json({
        message:
          "Google OAuth chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
      });
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Thiếu Google credential" });
    }

    logger.debug("Verifying Google ID token...");
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || email;
    const googleId = payload?.sub;

    if (!email || !googleId) {
      logger.warn("Invalid Google payload", { email, googleId });
      return res
        .status(400)
        .json({ message: "Không xác thực được người dùng Google" });
    }

    logger.info("Google user verified", { email, name, googleId: googleId.substring(0, 10) + "..." });

    let user = await User.findOne({ email });
    if (!user) {
      logger.info("Creating new user for Google login", { email });
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
      });
    } else if (!user.googleId) {
      logger.info("Linking existing user with Google account", { email });
      user.googleId = googleId;
      user.authProvider = user.authProvider || "google";
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    logger.info("Google login successful", { email: user.email, userId: user._id });
    res.json({
      message: "Đăng nhập Google thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        onboardingCompleted: user.onboardingCompleted || false,
      },
    });
  } catch (error) {
    logger.logError(error, { action: "googleAuth" });

    // More specific error messages
    if (error.message?.includes("Invalid token")) {
      return res.status(400).json({ message: "Token Google không hợp lệ" });
    }
    if (error.message?.includes("Token expired")) {
      return res.status(400).json({ message: "Token Google đã hết hạn" });
    }
    if (error.message?.includes("Invalid audience")) {
      return res
        .status(400)
        .json({ message: "Cấu hình Google OAuth không đúng" });
    }

    res.status(500).json({ message: "Lỗi xác thực Google: " + error.message });
  }
});

module.exports = router;
