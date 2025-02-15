const Barangay = require("../models/Barangay");
const Precinct = require("../models/Precinct");

exports.addPrecinct = async (req, res) => {
  const { number, barangay } = req.body;

  if (!number || !barangay) {
    return res
      .status(400)
      .json({ message: "Number and Barangay are required" });
  }

  try {
    let barangayData = await Barangay.findById(barangay);
    if (!barangayData) {
      return res.status(400).json({ message: "Barangay not found" });
    }

    const precinctNumber = number.trim();

    const existingPrecinct = await Precinct.findOne({
      number: precinctNumber,
      barangay: barangayData._id,
    });

    if (existingPrecinct) {
      return res
        .status(400)
        .json({ message: "Precinct already exists in this barangay" });
    }

    const precinct = new Precinct({
      number: precinctNumber,
      barangay: barangayData._id,
      votes: [],
    });

    await precinct.save();
    const populatedPrecinct = await Precinct.findById(precinct._id).populate(
      "barangay"
    );
    res.status(201).json({
      message: "Precinct added successfully",
      precinct: populatedPrecinct,
    });
  } catch (error) {
    console.error("Error saving precinct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllPrecincts = async (req, res) => {
  try {
    const precincts = await Precinct.find()
      .populate("barangay")
      .sort({ name: 1 });

    res.json(precincts);
  } catch (error) {
    console.error("Error fetching precincts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Edit precinct
exports.updatePrecinct = async (req, res) => {
  const { id } = req.params;
  const { number, barangay } = req.body;

  if (!id || !number || !barangay) {
    return res
      .status(400)
      .json({ message: "Precinct ID, number, and barangay are required" });
  }

  try {
    let barangayData = await Barangay.findById(barangay);
    if (!barangayData) {
      return res.status(404).json({ message: "Barangay not found" });
    }

    const precinct = await Precinct.findById(id);
    if (!precinct) {
      return res.status(404).json({ message: "Precinct not found" });
    }

    // Update precinct number and barangay
    precinct.number = number.trim();
    precinct.barangay = barangayData._id;

    await precinct.save();
    const populatedPrecinct = await Precinct.findById(precinct._id).populate(
      "barangay"
    );

    res.json({
      message: "Precinct updated successfully",
      precinct: populatedPrecinct,
    });
  } catch (error) {
    console.error("Error updating precinct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete precinct
exports.deletePrecinct = async (req, res) => {
  const { precinctId } = req.params;

  if (!precinctId) {
    return res.status(400).json({ message: "Precinct ID is required" });
  }

  try {
    const precinct = await Precinct.findById(precinctId);
    if (!precinct) {
      return res.status(404).json({ message: "Precinct not found" });
    }

    await precinct.deleteOne();
    res.json({ message: "Precinct deleted successfully" });
  } catch (error) {
    console.error("Error deleting precinct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
