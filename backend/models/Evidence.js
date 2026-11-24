
const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Evidence", evidenceSchema);
