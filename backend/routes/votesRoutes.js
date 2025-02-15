const express = require("express");
const router = express.Router();
const {
  getVoteResults,
  submitVote,
  getBarangayResults,
  getOverallResults,
  // getVoteDetails,
} = require("../controller/voteController");

router.get("/votes", getVoteResults);
router.post("/votes", submitVote);
router.get("/votes/barangayResult", getBarangayResults);

router.get("/votes/overall", getOverallResults);

// router.get("/votes/votedetails", getVoteDetails);

module.exports = router;
