const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
    precinct: { type: mongoose.Schema.Types.ObjectId, ref: "Precinct" },
    barangay: { type: mongoose.Schema.Types.ObjectId, ref: "Barangay" },
    votes: { type: Number, default: 0 },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteSchema);
