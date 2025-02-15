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

      // I-group ang total votes per candidate
      {
        $group: {
          _id: {
            candidateId: "$candidateData._id",
            firstName: "$candidateData.firstName",
            middleName: "$candidateData.middleName",
            lastName: "$candidateData.lastName",
            position: "$candidateData.position",
          },
          totalVotes: { $sum: "$votes" },
        },
      },

      // I-project ang structured data
      {
        $project: {
          _id: 0,
          position: "$_id.position",
          candidate: {
            firstName: "$_id.firstName",
            middleName: "$_id.middleName",
            lastName: "$_id.lastName",
            position: "$_id.position",
          },
          totalVotes: 1,
        },
      },

      // I-group by position
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

      // I-sort ang candidates per position
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

      // Magdagdag ng ranking number per position gamit ang $denseRank
      {
        $unwind: "$candidates",
      },
      {
        $setWindowFields: {
          partitionBy: "$position",
          sortBy: { "candidates.totalVotes": -1 },
          output: {
            rank: { $denseRank: {} }, // Mag-assign ng ranking number
          },
        },
      },

      // I-group ulit para ma-structure ng maayos
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

// exports.getVoteDetails = async (req, res) => {
//   const { email } = req.query;

//   console.log("Email query:", email);

//   try {
//     // Hanapin ang user gamit ang email
//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log("User not found");
//       return res.status(404).json({ message: "User not found." });
//     }

//     console.log("User found:", user);

//     // Hanapin ang mga votes gamit ang submittedBy na ObjectId
//     const votes = await Vote.find({
//       submittedBy: user._id, // Dapat valid ObjectId na ang gagamitin
//     });
//     console.log("Votes for user:", votes);

//     // Aggregation query upang makuha ang total votes
//     const totalVotes = await Vote.aggregate([
//       { $match: { submittedBy: user._id } },
//       { $group: { _id: null, totalVotes: { $sum: "$votes" } } },
//     ]);
//     console.log("Total votes aggregation:", totalVotes);

//     // Pagkuha ng total votes count
//     const totalVoteCount = totalVotes.length > 0 ? totalVotes[0].totalVotes : 0;

//     // Ibalik ang user data at total votes count
//     return res.status(200).json({
//       user: user.name,
//       votes: totalVoteCount, // Ibalik ang total na boto
//     });
//   } catch (error) {
//     console.error("Error fetching vote details:", error);
//     return res.status(500).json({ message: "Server error." });
//   }
// };
