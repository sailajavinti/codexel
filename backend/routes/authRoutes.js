import express from "express";

import { signup, login, getMe } from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Get current user
router.get("/me", authMiddleware, getMe);

export default router;