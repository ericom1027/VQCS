require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDb = require("./config/connection");
const path = require("path");

// Import Routes
const candidateRoutes = require("./routes/candidatesRoutes");
const authRoutes = require("./routes/authRoutes");
const precinctRoutes = require("./routes/precinctsRoutes");
const voteRoutes = require("./routes/votesRoutes");
const barangayRoutes = require("./routes/barangayRoutes");

// Initialize Express App
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL.split(","),
    methods: "GET,POST,PUT,DELETE",
  },
});

global.io = io;
// console.log("io initialized", io ? "Yes" : "No");

// Handle socket connections
io.on("connection", (socket) => {
  // console.log(` User connected: ${socket.id}`);

  socket.on("voteUpdate", (data) => {
    // console.log(" Broadcasting updated vote data:", data);
    io.emit("updateVotes", data);
  });

  socket.on("disconnect", () => {
    console.log(` User disconnected: ${socket.id}`);
  });
});

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
  })
);

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.use(express.json());

// Connect to MongoDB
connectDb();

// Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/precincts", precinctRoutes);
app.use("/api", voteRoutes);
app.use("/api/barangays", barangayRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Export for external use
module.exports = { mongoose, app, server, io };
