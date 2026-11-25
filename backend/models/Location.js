
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  latitude: {
    type: Number,
    required: true,
  },

  longitude: {
    type: Number,
    required: true,
  },

  isSharing: {
    type: Boolean,
    default: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Location", locationSchema);
