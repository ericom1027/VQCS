const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    nickName: {
      type: String,
      required: [true, "Nick name is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    birthday: {
      type: Date,
      required: [true, "Birthday is required"],
    },
    placeOfBirth: {
      type: String,
      required: [true, "Place of birth is required"],
    },
    civilStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      required: [true, "Civil status is required"],
    },
    spouse: {
      type: String,
      required: function () {
        return this.civilStatus === "Married";
      },
    },
    officialNominee: {
      type: String,
      required: [true, "Official nominee is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    position: {
      type: String,
      enum: ["Mayor", "Vice Mayor", "Councilor"],
      required: [true, "Position is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
