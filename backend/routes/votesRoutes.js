const express = require("express");
const router = express.Router();
const {
  getVoteResults,
  submitVote,
  getBarangayResults,
  getOverallResults,
} = require("../controller/voteController");

const { verify } = require("../middleware/authentication");

router.get("/votes", getVoteResults);
router.post("/votes", verify, submitVote);
router.get("/votes/barangayResult", getBarangayResults);

router.get("/votes/overall", getOverallResults);

module.exports = router;
