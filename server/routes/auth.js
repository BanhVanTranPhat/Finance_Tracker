const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "885076368157-gk6624okffn4thbbh366uhb18ul2ne7t.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "GOCSPX-your-client-secret-here";

const googleClient = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:5173/auth/callback"
);

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

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
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Google Sign-In: verify Google ID token -> our JWT
router.post("/google", async (req, res) => {
  try {
    if (
      !GOOGLE_CLIENT_ID ||
      GOOGLE_CLIENT_ID === "GOCSPX-your-client-secret-here"
    ) {
      console.error(
        "Google OAuth not configured: GOOGLE_CLIENT_ID missing or invalid"
      );
      return res.status(500).json({
        message:
          "Google OAuth chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
      });
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Thiếu Google credential" });
    }

    console.log("Verifying Google ID token...");
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || email;
    const googleId = payload?.sub;

    if (!email || !googleId) {
      console.error("Invalid Google payload:", { email, googleId });
      return res
        .status(400)
        .json({ message: "Không xác thực được người dùng Google" });
    }

    console.log("Google user verified:", { email, name, googleId });

    let user = await User.findOne({ email });
    if (!user) {
      console.log("Creating new user for Google login");
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
      });
    } else if (!user.googleId) {
      console.log("Linking existing user with Google account");
      user.googleId = googleId;
      user.authProvider = user.authProvider || "google";
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    console.log("Google login successful for user:", user.email);
    res.json({
      message: "Đăng nhập Google thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted || false,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);

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
