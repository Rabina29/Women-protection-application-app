const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.log("MongoDB Error:", error));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

// Incident Report Schema
const reportSchema = new mongoose.Schema({
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);

// Backend Status
app.get("/api/status", (req, res) => {
  res.json({
    message: "Backend connected",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Register API
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed." });
  }
});

// Login API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({ message: "Login successful!", user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Login failed." });
  }
});

// Save Incident Report
app.post("/api/reports", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required." });
    }

    await Report.create({ description: description.trim() });

    res.status(201).json({ message: "Report saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Report could not be saved." });
  }
});

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});