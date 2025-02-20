const jwt = require("jsonwebtoken");
require("dotenv").config();

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// Middleware to verify access token
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error("JWT Error: No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    console.error("JWT Error: Invalid token format");
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token.trim(), process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Error: Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. You are not authorized to access this resource.",
    });
  }
  next();
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verify,
  verifyAdmin,
};
