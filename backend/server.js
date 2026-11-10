
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",")
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "CodeXel backend is running 🚀",
  });
});

// Database and Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`CodeXel backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);


