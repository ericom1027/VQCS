const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  createAccessToken,
  createRefreshToken,
} = require("../middleware/authentication");

exports.register = async (req, res) => {
  const { name, email, password, role, username } = req.body;

  if (!name || !email || !password || !role || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      username,
    });

    // Save user to database
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, username },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Edit user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= Delete User =================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= Fetch All Users =================
exports.fetchUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= Login =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create access and refresh tokens
    const token = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Send tokens in response
    res.json({ token, refreshToken, role: user.role, name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.adminDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied for non-admins" });
    }

    res.json({ message: "Admin dashboard content" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= Refresh Access Token =================
exports.refreshAccessToken = async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies["refreshToken"];

  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token provided." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error("Invalid refresh token:", error);
    res.status(400).json({ message: "Invalid or expired refresh token." });
  }
};
