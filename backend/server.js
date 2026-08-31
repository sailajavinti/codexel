import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect MongoDB

connectDB();

// Middleware

app.use(cors());
app.use(express.json());

// Test route

app.get("/", (req, res) => {
  res.json({
    message: "CodeXel backend is running 🚀",
  });
});

// Start server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});