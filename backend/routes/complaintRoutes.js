
const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Submit a new complaint
router.post("/submit", async (req, res) => {
  try {
    const { name, phone, authority, incidentLocation, description } = req.body;

    if (!name || !phone || !authority || !incidentLocation || !description) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    const complaint = new Complaint({
      name,
      phone,
      authority,
      incidentLocation,
      description,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully!",
      complaint,
    });
  } catch (error) {
    console.error("Complaint submission error:", error);
    res.status(500).json({
      message: "Failed to submit complaint",
    });
  }
});

// Get all complaints (for demo/admin)
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaints",
    });
  }
});

module.exports = router;
