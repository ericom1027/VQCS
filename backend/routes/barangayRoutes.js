const express = require("express");
const {
  addBarangay,
  getBarangays,
  updateBarangay,
  deleteBarangay,
} = require("../controller/barangayController");

const router = express.Router();

router.post("/", addBarangay);
router.get("/", getBarangays);
router.put("/:id", updateBarangay);
router.delete("/:id", deleteBarangay);

module.exports = router;
