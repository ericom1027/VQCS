const express = require("express");
const router = express.Router();
const {
  getAllPrecincts,
  addPrecinct,
  updatePrecinct,
  deletePrecinct,
} = require("../controller/precintController");

router.get("/", getAllPrecincts);
router.post("/", addPrecinct);
router.put("/:id", updatePrecinct);
router.delete("/:precinctId", deletePrecinct);

module.exports = router;
