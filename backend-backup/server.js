
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });

// Home route
app.get("/", (req, res) => {
  res.send("Women Protection Application Backend is running!");
});

app.get("/test", (req, res) => {
  res.send("TEST WORKING!");
});

// API status route
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "Women Protection Application API is working!",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// Incident Report model
const incidentSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Incident = mongoose.model("Incident", incidentSchema);

// Save incident report
app.post("/api/reports", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Incident description is required.",
      });
    }

    const report = await Incident.create({
      description: description.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Incident report saved successfully!",
      report,
    });
  } catch (error) {
    console.error("Report save error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not save incident report.",
    });
  }
});

// Community Post model
const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

// Save Community Post
app.post("/api/posts", async (req, res) => {
  try {
    const { text, anonymous } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post text is required.",
      });
    }

    const post = await Post.create({
      text: text.trim(),
      anonymous: Boolean(anonymous),
    });

    res.status(201).json({
      success: true,
      message: "Community post saved successfully!",
      post,
    });
  } catch (error) {
    console.error("Post save error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not save community post.",
    });
  }
});

// Get all Community Posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Post loading error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not load community posts.",
    });
  }
});

// 404 route
app.use((req, res) => {
  res.status(404).send(
    `Route not found: ${req.method} ${req.originalUrl}`
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
