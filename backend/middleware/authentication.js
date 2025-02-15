const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create Access Token (Expires in 1 hour)
const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Create Refresh Token (Expires in 7 days)
const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// Middleware to verify access token (without role check)
const verify = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. No token provided or invalid token.",
    });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(400).json({ message: "Invalid token." });
  }
};

// Separate middleware for role checking
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. You are not authorized to access this resource.",
    });
  }
  next();
};

// Route for refreshing token
const refreshAccessToken = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const { id, name, email, role } = decoded;

    const newAccessToken = createAccessToken({ id, name, email, role });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Invalid refresh token:", error);
    res.status(403).json({ message: "Invalid refresh token." });
  }
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verify,
  verifyAdmin,
  refreshAccessToken,
};
