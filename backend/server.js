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
    credentials: true,
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

  socket.on("disconnect", (reason) => {
    console.log(` User disconnected: ${socket.id}`);
    console.log(`User disconnected due to ${reason}`);
  });
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL.split(","),
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

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

app.get("*", (res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Start Server
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Export for external use
module.exports = { mongoose, app, server, io };
