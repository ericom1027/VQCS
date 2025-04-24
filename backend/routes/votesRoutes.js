const express = require("express");
const router = express.Router();
const {
  getVoteResults,
  submitVote,
  getBarangayResults,
  getOverallResults,
  // getCandidatesPercentageResults,
} = require("../controller/voteController");

const { verify } = require("../middleware/authentication");

router.get("/votes", getVoteResults);
router.post("/votes", verify, submitVote);
router.get("/votes/barangayResult", getBarangayResults);

router.get("/votes/overall", getOverallResults);

// router.get("/getpercentage", getCandidatesPercentageResults);

module.exports = router;
