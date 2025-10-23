const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Không có token, truy cập bị từ chối" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = auth;
