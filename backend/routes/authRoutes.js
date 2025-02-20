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
  getOfflineUsers,
  setUserStatus,
  getOnlineUsers,
} = require("../controller/authController");

const { verify, verifyAdmin } = require("../middleware/authentication");

router.get("/", fetchUsers);

router.post("/register", register);
router.put("/user/:id", editUser);
router.delete("/user/:id", verify, deleteUser);
router.post("/login", login);
router.get("/admin/dashboard", verify, verifyAdmin, adminDashboard);

router.post("/refresh-token", refreshAccessToken);

router.get("/online-users", verify, getOnlineUsers);

router.get("/offline-users", verify, getOfflineUsers);

router.put("/:id/status", verify, setUserStatus);

module.exports = router;
