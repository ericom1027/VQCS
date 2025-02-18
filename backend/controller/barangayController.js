const Barangay = require("../models/Barangay");

exports.addBarangay = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Barangay name is required" });
  }

  try {
    const cleanedName = name.trim();

    const existingBarangay = await Barangay.findOne({
      name: { $regex: new RegExp(`^${cleanedName}$`, "i") },
    });

    if (existingBarangay) {
      return res.status(400).json({ message: "Barangay already exists" });
    }

    const barangay = new Barangay({ name: cleanedName });
    await barangay.save();

    res.status(201).json({ message: "Barangay added successfully", barangay });
  } catch (error) {
    console.error(" Error adding barangay:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBarangays = async (req, res) => {
  try {
    const barangays = await Barangay.find().sort({ name: 1 });
    res.json(barangays);
  } catch (error) {
    console.error("Error fetching barangays:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateBarangay = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "New barangay name is required" });
  }

  try {
    const existingBarangay = await Barangay.findOne({ name });
    if (existingBarangay && existingBarangay._id.toString() !== id) {
      return res.status(400).json({ message: "Barangay name already exists" });
    }

    const updatedBarangay = await Barangay.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedBarangay) {
      return res.status(404).json({ message: "Barangay not found" });
    }

    res.json({
      message: "Barangay updated successfully",
      barangay: updatedBarangay,
    });
  } catch (error) {
    console.error("Error updating barangay:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteBarangay = async (req, res) => {
  const { id } = req.params;

  try {
    const barangay = await Barangay.findById(id);
    if (!barangay) {
      return res.status(404).json({ message: "Barangay not found" });
    }

    await Barangay.findByIdAndDelete(id);
    res.json({ message: "Barangay deleted successfully" });
  } catch (error) {
    console.error("Error deleting barangay:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
