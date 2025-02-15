const mongoose = require("mongoose");

const precinctSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
    barangay: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barangay",
      required: true,
    },
    votes: [
      {
        candidate: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Candidate",
        },
        voteCount: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Precinct", precinctSchema);
