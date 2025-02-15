const express = require("express");
const router = express.Router();
const {
  getAllCandidates,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  upload,
} = require("../controller/candidateController");

// const { verify } = require("../middleware/authentication");

router.get("/", getAllCandidates);

router.post("/", upload.single("photo"), addCandidate);

router.put("/:id", upload.single("photo"), updateCandidate);

router.delete("/:id", deleteCandidate);

module.exports = router;
