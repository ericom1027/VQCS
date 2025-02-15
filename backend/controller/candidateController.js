const Candidate = require("../models/Candidate");
const multer = require("multer");

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const addCandidate = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      position,
      nickName,
      gender,
      birthday,
      placeOfBirth,
      civilStatus,
      spouse,
      officialNominee,
      address,
    } = req.body;

    const newCandidate = new Candidate({
      firstName,
      middleName,
      lastName,
      position,
      nickName,
      gender,
      birthday,
      placeOfBirth,
      civilStatus,
      spouse,
      officialNominee,
      address,
      photo: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : null,
    });

    await newCandidate.save();
    res.status(201).json({
      message: "Candidate added successfully!",
      candidate: newCandidate,
    });
  } catch (error) {
    console.error("Error adding candidate:", error);
    res
      .status(500)
      .json({ error: "Failed to add candidate. Please try again." });
  }
};

const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Error fetching candidates" });
  }
};

const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.photo = { data: req.file.buffer, contentType: req.file.mimetype };
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({
      message: "Candidate updated successfully!",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Error updating candidate:", error);
    res
      .status(500)
      .json({ error: "Failed to update candidate. Please try again." });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCandidate = await Candidate.findByIdAndDelete(id);

    if (!deletedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate deleted successfully!" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res
      .status(500)
      .json({ error: "Failed to delete candidate. Please try again." });
  }
};

module.exports = {
  getAllCandidates,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  upload,
};
