const express = require("express");
const router = express.Router();
const {
  register,
  login,
  adminDashboard,
  editUser,
  deleteUser,
  fetchUsers,
  refreshAccessToken,
} = require("../controller/authController");

const { verify, verifyAdmin } = require("../middleware/authentication");

router.get("/", fetchUsers);

router.post("/register", register);
router.put("/user/:id", editUser);
router.delete("/user/:id", deleteUser);
router.post("/login", login);
router.get("/admin/dashboard", verify, verifyAdmin, adminDashboard);

router.post("/refresh-token", refreshAccessToken);

module.exports = router;
