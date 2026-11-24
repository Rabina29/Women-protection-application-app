
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Evidence = require("../models/Evidence");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4"
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP and MP4 files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Upload evidence
router.post("/upload", upload.single("evidence"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please select a file" });
    }

    const evidence = await Evidence.create({
      fileName: req.file.originalname,
      filePath: "/uploads/" + req.file.filename,
      fileType: req.file.mimetype,
      description: req.body.description || ""
    });

    res.status(201).json({
      message: "Evidence uploaded successfully",
      evidence
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all evidence
router.get("/", async (req, res) => {
  try {
    const evidence = await Evidence.find().sort({ uploadedAt: -1 });
    res.json(evidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit evidence description
router.patch("/:id", async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      { description: req.body.description || "" },
      { new: true, runValidators: true }
    );

    if (!evidence) {
      return res.status(404).json({ message: "Evidence not found" });
    }

    res.json({
      message: "Description updated successfully",
      evidence
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
