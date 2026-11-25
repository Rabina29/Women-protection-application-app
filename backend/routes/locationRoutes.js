
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Location = require("../models/Location");

// Verify login token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Please login to continue.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user" || !decoded.email) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired login session.",
    });
  }
};

// Start or update own live location
router.post("/update", authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        message: "Valid location details are required.",
      });
    }

    const email = req.user.email.toLowerCase();

    const location = await Location.findOneAndUpdate(
      { userEmail: email },
      {
        userEmail: email,
        latitude,
        longitude,
        isSharing: true,
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.json({
      message: "Location updated successfully.",
      location,
    });
  } catch (error) {
    console.log("Location Update Error:", error);
    res.status(500).json({
      message: "Location update failed.",
    });
  }
});

// Get own active location
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const location = await Location.findOne({
      userEmail: req.user.email.toLowerCase(),
      isSharing: true,
    });

    if (!location) {
      return res.status(404).json({
        message: "No active location found.",
      });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch location.",
    });
  }
});

// Stop own location sharing
router.post("/stop", authenticateToken, async (req, res) => {
  try {
    await Location.findOneAndUpdate(
      { userEmail: req.user.email.toLowerCase() },
      {
        isSharing: false,
        updatedAt: new Date(),
      }
    );

    res.json({
      message: "Location sharing stopped.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not stop location sharing.",
    });
  }
});

module.exports = router;
