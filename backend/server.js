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

// Define CORS options
const corsOptions = {
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Initialize Socket.IO with CORS settings
const io = new Server(server, { cors: corsOptions });
global.io = io;

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);

  socket.on("voteUpdate", (data) => {
    io.emit("updateVotes", data);
  });

  socket.on("disconnect", (reason) => {
    // console.log(`User disconnected: ${socket.id}`);
    // console.log(`Reason: ${reason}`);
  });
});

// Middleware
app.use(express.static(path.join(__dirname, "client")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDb();

// Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/precincts", precinctRoutes);
app.use("/api", voteRoutes);
app.use("/api/barangays", barangayRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = { mongoose, app, server, io };
