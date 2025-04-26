const Vote = require("../models/Vote");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// const io = global.io;

exports.getVoteResults = async (req, res) => {
  try {
    const voteResults = await Vote.aggregate([
      {
        $lookup: {
          from: "precincts",
          localField: "precinct",
          foreignField: "_id",
          as: "precinctData",
        },
      },
      { $unwind: "$precinctData" },
      {
        $lookup: {
          from: "barangays",
          localField: "precinctData.barangay",
          foreignField: "_id",
          as: "barangayData",
        },
      },
      { $unwind: "$barangayData" },
      {
        $lookup: {
          from: "candidates",
          localField: "candidate",
          foreignField: "_id",
          as: "candidateData",
        },
      },
      { $unwind: "$candidateData" },
      {
        $lookup: {
          from: "users",
          localField: "submittedBy",
          foreignField: "_id",
          as: "submittedByData",
        },
      },
      {
        $unwind: { path: "$submittedByData", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: {
            barangay: "$barangayData.name",
            precinct: "$precinctData.number",
            candidate: {
              firstName: "$candidateData.firstName",
              middleName: "$candidateData.middleName",
              lastName: "$candidateData.lastName",
              position: "$candidateData.position",
            },
          },
          totalVotes: { $sum: "$votes" },
          submittedByName: { $first: "$submittedByData.name" },
        },
      },
      {
        $project: {
          _id: 0,
          barangay: "$_id.barangay",
          precinct: "$_id.precinct",
          candidate: {
            firstName: "$_id.candidate.firstName",
            middleName: "$candidateData.middleName",
            lastName: "$_id.candidate.lastName",
            position: "$_id.candidate.position",
          },
          totalVotes: 1,
          submittedBy: "$submittedByName",
        },
      },
      { $sort: { barangay: 1, precinct: 1, totalVotes: -1 } },
    ]);

    if (global.io) {
      global.io.emit("updateVotes", voteResults);
    } else {
      console.error("io is undefined!");
    }

    res.json(voteResults);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= Submit Votes =====================
exports.submitVote = async (req, res) => {
  let { candidate, precinct, barangay, votes } = req.body;

  if (!votes || isNaN(votes) || votes <= 0) {
    return res.status(400).json({ message: "Invalid or missing vote count." });
  }

  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    let voteRecord = await Vote.findOne({ candidate, precinct, barangay });

    if (voteRecord) {
      voteRecord.votes += parseInt(votes, 10);
      await voteRecord.save();
    } else {
      voteRecord = new Vote({
        candidate,
        precinct,
        barangay,
        votes: parseInt(votes, 10),
        submittedBy: req.user.id,
      });
      await voteRecord.save();
    }

    if (global.io) {
      global.io.emit("updateVotes", voteRecord);
    } else {
      console.error("io is undefined!");
    }

    res.json(voteRecord);
  } catch (error) {
    console.error("Error submitting vote:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBarangayResults = async (req, res) => {
  try {
    const barangayResults = await Vote.aggregate([
      {
        $lookup: {
          from: "precincts",
          localField: "precinct",
          foreignField: "_id",
          as: "precinctData",
        },
      },
      { $unwind: "$precinctData" },
      {
        $lookup: {
          from: "barangays",
          localField: "precinctData.barangay",
          foreignField: "_id",
          as: "barangayData",
        },
      },
      { $unwind: "$barangayData" },
      {
        $lookup: {
          from: "candidates",
          localField: "candidate",
          foreignField: "_id",
          as: "candidateData",
        },
      },
      { $unwind: "$candidateData" },
      {
        $group: {
          _id: {
            barangay: "$barangayData.name",
            candidate: {
              firstName: "$candidateData.firstName",
              middleName: "$candidateData.middleName",
              lastName: "$candidateData.lastName",
              position: "$candidateData.position",
            },
          },
          totalVotes: { $sum: "$votes" },
        },
      },
      {
        $project: {
          _id: 0,
          barangay: "$_id.barangay",
          candidate: "$_id.candidate",
          totalVotes: 1,
        },
      },
      {
        $sort: {
          barangay: 1,
          "candidate.firstName": 1,
          "candidate.middleName:": 1,
          "candidate.lastName": 1,
        },
      },
    ]);

    if (global.io) {
      global.io.emit("updateVotes", barangayResults);
    } else {
      console.error("io is undefined!");
    }

    res.json(barangayResults);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  ============ Get Final Canvassing ===========================
exports.getOverallResults = async (req, res) => {
  try {
    const overallResults = await Vote.aggregate([
      {
        $lookup: {
          from: "precincts",
          localField: "precinct",
          foreignField: "_id",
          as: "precinctData",
        },
      },
      { $unwind: "$precinctData" },
      {
        $lookup: {
          from: "barangays",
          localField: "precinctData.barangay",
          foreignField: "_id",
          as: "barangayData",
        },
      },
      { $unwind: "$barangayData" },
      {
        $lookup: {
          from: "candidates",
          localField: "candidate",
          foreignField: "_id",
          as: "candidateData",
        },
      },
      { $unwind: "$candidateData" },

      {
        $group: {
          _id: {
            candidateId: "$candidateData._id",
            firstName: "$candidateData.firstName",
            middleName: "$candidateData.middleName",
            lastName: "$candidateData.lastName",
            position: "$candidateData.position",
            photoData: "$candidateData.photo.data",
            photoData: { $ifNull: ["$candidateData.photo.data", null] },
            photoContentType: {
              $ifNull: ["$candidateData.photo.contentType", null],
            },
          },
          totalVotes: { $sum: "$votes" },
        },
      },

      {
        $project: {
          _id: 0,
          position: "$_id.position",
          candidate: {
            firstName: "$_id.firstName",
            middleName: "$_id.middleName",
            lastName: "$_id.lastName",
            position: "$_id.position",
            photo: {
              data: "$_id.photoData",
              contentType: "$_id.photoContentType",
            },
          },
          totalVotes: 1,
        },
      },

      {
        $group: {
          _id: "$position",
          candidates: {
            $push: {
              candidate: "$candidate",
              totalVotes: "$totalVotes",
            },
          },
        },
      },

      {
        $project: {
          position: "$_id",
          candidates: {
            $sortArray: {
              input: "$candidates",
              sortBy: { totalVotes: -1 },
            },
          },
        },
      },

      {
        $unwind: "$candidates",
      },
      {
        $setWindowFields: {
          partitionBy: "$position",
          sortBy: { "candidates.totalVotes": -1 },
          output: {
            rank: { $denseRank: {} },
          },
        },
      },

      {
        $group: {
          _id: "$position",
          candidates: {
            $push: {
              candidate: "$candidates.candidate",
              totalVotes: "$candidates.totalVotes",
              rank: "$rank",
            },
          },
        },
      },

      // Mag-assign ng "Winner" o "Loser" status
      {
        $project: {
          position: 1,
          candidates: {
            $map: {
              input: "$candidates",
              as: "candidate",
              in: {
                firstName: "$$candidate.candidate.firstName",
                middleName: "$$candidate.candidate.middleName",
                lastName: "$$candidate.candidate.lastName",
                position: "$$candidate.candidate.position",
                totalVotes: "$$candidate.totalVotes",
                rank: "$$candidate.rank",
                photo: {
                  data: "$$candidate.candidate.photo.data",
                  contentType: "$$candidate.candidate.photo.contentType",
                },

                status: {
                  $cond: {
                    if: {
                      $or: [
                        {
                          $and: [
                            { $eq: ["$_id", "Councilor"] },
                            { $lte: ["$$candidate.rank", 8] },
                          ],
                        },
                        {
                          $and: [
                            { $ne: ["$_id", "Councilor"] },
                            {
                              $eq: [
                                "$$candidate.totalVotes",
                                { $max: "$candidates.totalVotes" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    then: "Winner",
                    else: "Loser",
                  },
                },
              },
            },
          },
        },
      },
    ]);

    if (global.io) {
      global.io.emit("updateResults", overallResults);
    }

    res.json(overallResults);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
