const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const evidenceRoutes = require("./routes/evidenceRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Existing Routes
app.use("/api/evidence", evidenceRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/location", locationRoutes);

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

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

// Incident Report Schema
const reportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  status: {
    type: String,
    enum: ["Pending", "Under Review", "Resolved"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", reportSchema);

// SOS Alert Schema
const sosSchema = new mongoose.Schema({
  location: {
    type: String,
    default: "Location not provided",
  },
  status: {
    type: String,
    default: "New",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SOSAlert = mongoose.model("SOSAlert", sosSchema);

// Safety Tip Schema
const safetyTipSchema = new mongoose.Schema({
  tip: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SafetyTip = mongoose.model("SafetyTip", safetyTipSchema);

// JWT Authentication Middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

// User Authentication Middleware
const verifyUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({
      message: "User access only.",
    });
  }

  next();
};

// Admin Authentication Middleware
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only.",
    });
  }

  next();
};

// Backend Status API
app.get("/api/status", (req, res) => {
  res.json({
    message: "Backend connected",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// User Register API
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful!",
    });
  } catch (error) {
    console.log("User Registration Error:", error);

    res.status(500).json({
      message: "Registration failed.",
    });
  }
});

// Get All Registered Users API
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    console.log("Users fetched:", users.length);

    res.json(users);
  } catch (error) {
    console.log("Fetch Users Error:", error);

    res.status(500).json({
      message: "Could not fetch users.",
    });
  }
});

// User Login API with JWT
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("User Login Error:", error);

    res.status(500).json({
      message: "Login failed.",
    });
  }
});

// Admin Registration API
app.post("/api/admin/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Admin email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin account created successfully!",
    });
  } catch (error) {
    console.log("Admin Registration Error:", error);

    res.status(500).json({
      message: "Admin registration failed.",
    });
  }
});

// Admin Login API
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin email or password.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid admin email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Admin login successful!",
      token,
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.log("Admin Login Error:", error);

    res.status(500).json({
      message: "Admin login failed.",
    });
  }
});

// Save Incident Report API
app.post("/api/reports", verifyToken, verifyUser, async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "Description is required.",
      });
    }

    const report = await Report.create({
      description: description.trim(),
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Report saved successfully.",
      report,
    });
  } catch (error) {
    console.log("Report Save Error:", error);

    res.status(500).json({
      message: "Report could not be saved.",
    });
  }
});

// Get My Report History API
app.get("/api/reports/my", verifyToken, verifyUser, async (req, res) => {
  try {
    const reports = await Report.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(reports);
  } catch (error) {
    console.log("My Report History Error:", error);

    res.status(500).json({
      message: "Could not fetch your reports.",
    });
  }
});

// Get All Incident Reports API
app.get("/api/admin/reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({
      createdAt: -1,
    });

    console.log("Reports fetched:", reports.length);

    res.status(200).json(reports);
  } catch (error) {
    console.log("Fetch Reports Error:", error);

    res.status(500).json({
      message: "Could not fetch reports.",
    });
  }
});

// Update Incident Report Status API
app.patch(
  "/api/admin/reports/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Under Review",
        "Resolved",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid report status.",
        });
      }

      const report = await Report.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );

      if (!report) {
        return res.status(404).json({
          message: "Report not found.",
        });
      }

      res.json({
        message: "Report status updated successfully.",
        report,
      });
    } catch (error) {
      console.log("Report Status Update Error:", error);

      res.status(500).json({
        message: "Report status update failed.",
      });
    }
  }
);

// Save SOS Alert API
app.post("/api/sos", async (req, res) => {
  try {
    const { location } = req.body;

    const alert = await SOSAlert.create({
      location: location || "Location not provided",
    });

    res.status(201).json({
      message: "SOS alert saved successfully.",
      alert,
    });
  } catch (error) {
    console.log("SOS Save Error:", error);

    res.status(500).json({
      message: "SOS alert could not be saved.",
    });
  }
});

// Get All SOS Alerts API
app.get("/api/admin/sos-alerts", async (req, res) => {
  try {
    const alerts = await SOSAlert.find().sort({
      createdAt: -1,
    });

    console.log("SOS Alerts fetched:", alerts.length);

    res.status(200).json(alerts);
  } catch (error) {
    console.log("Fetch SOS Alerts Error:", error);

    res.status(500).json({
      message: "Could not fetch SOS alerts.",
    });
  }
});

// Add Safety Tip API
app.post("/api/admin/safety-tips", async (req, res) => {
  try {
    const { tip } = req.body;

    if (!tip || !tip.trim()) {
      return res.status(400).json({
        message: "Safety tip is required.",
      });
    }

    const newTip = await SafetyTip.create({
      tip: tip.trim(),
    });

    res.status(201).json({
      message: "Safety tip added successfully.",
      safetyTip: newTip,
    });
  } catch (error) {
    console.log("Add Safety Tip Error:", error);

    res.status(500).json({
      message: "Safety tip could not be added.",
    });
  }
});

// Get All Safety Tips API
app.get("/api/admin/safety-tips", async (req, res) => {
  try {
    const safetyTips = await SafetyTip.find().sort({
      createdAt: -1,
    });

    res.status(200).json(safetyTips);
  } catch (error) {
    console.log("Fetch Safety Tips Error:", error);

    res.status(500).json({
      message: "Could not fetch safety tips.",
    });
  }
});

// Delete Safety Tip API
app.delete("/api/admin/safety-tips/:id", async (req, res) => {
  try {
    const deletedTip = await SafetyTip.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTip) {
      return res.status(404).json({
        message: "Safety tip not found.",
      });
    }

    res.status(200).json({
      message: "Safety tip deleted successfully.",
    });
  } catch (error) {
    console.log("Delete Safety Tip Error:", error);

    res.status(500).json({
      message: "Could not delete safety tips.",
    });
  }
});

// Public Transport Complaint Schema
const transportComplaintSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  busRoute: { type: String, required: true },
  incidentType: { type: String, required: true },
  incidentDate: { type: Date, required: true },
  incidentLocation: { type: String, required: true },
  description: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  evidenceUrl: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Pending", "Under Review", "Verified", "Resolved"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const TransportComplaint = mongoose.model(
  "TransportComplaint",
  transportComplaintSchema
);

// Community Post Schema
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
  comments: [
    {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

// Emergency Contact Schema
const emergencyContactSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relationship: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const EmergencyContact = mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);

// Submit Transport Complaint
app.post("/api/transport-complaints", async (req, res) => {
  try {
    const complaint = await TransportComplaint.create(req.body);

    res.status(201).json({
      message: "Transport complaint submitted successfully!",
      complaint,
    });
  } catch (error) {
    console.log("Transport Complaint Error:", error);

    res.status(500).json({
      message: "Complaint could not be submitted.",
    });
  }
});

// Get All Transport Complaints
app.get("/api/admin/transport-complaints", async (req, res) => {
  try {
    const complaints = await TransportComplaint.find().sort({
      createdAt: -1,
    });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch complaints.",
    });
  }
});

// Update Complaint Status
app.patch("/api/admin/transport-complaints/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Under Review",
      "Verified",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status.",
      });
    }

    const complaint = await TransportComplaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }

    res.json({
      message: "Complaint status updated!",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Status update failed.",
    });
  }
});

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO Live Location Connection
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});
// Create Community Post API
app.post("/api/posts", async (req, res) => {
  try {
    const { text, anonymous } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Post text is required.",
      });
    }

    const post = await Post.create({
      text: text.trim(),
      anonymous: anonymous || false,
    });

    res.status(201).json({
      message: "Post created successfully!",
      post,
    });
  } catch (error) {
    console.log("Create Post Error:", error);

    res.status(500).json({
      message: "Post could not be created.",
    });
  }
});
// Get All Community Posts API
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({
      createdAt: -1,
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.log("Fetch Posts Error:", error);

    res.status(500).json({
      message: "Could not fetch posts.",
    });
  }
});

 // Add Comment to Community Post API
app.post("/api/posts/:id/comments", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty.",
      });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            text: text.trim(),
          },
        },
      },
      { returnDocument: "after" }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    res.status(200).json({
      message: "Comment added successfully!",
      post,
    });
  } catch (error) {
    console.log("Add Comment Error:", error);

    res.status(500).json({
      message: "Could not add comment.",
    });
  }
});

// Emergency Contacts API
app.post("/api/contacts", async (req, res) => {
  try {
    const { userEmail, name, phone, relationship } = req.body;

    if (!userEmail || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const contact = new EmergencyContact({
      userEmail: userEmail.toLowerCase().trim(),
      name: name.trim(),
      phone: phone.trim(),
      relationship: relationship || "",
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Emergency Contact saved successfully!",
      contact,
    });
  } catch (error) {
    console.log("CONTACT SAVE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// Like Community Post API
app.patch("/api/posts/:id/like", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { returnDocument: "after" }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    res.status(200).json({
      message: "Post liked successfully!",
      post,
    });
  } catch (error) {
    console.log("Like Post Error:", error);
    res.status(500).json({
      message: "Could not like post.",
    });
  }
});
// Start Server
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});