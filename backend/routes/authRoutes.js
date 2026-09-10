import express from "express";

import {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  verifyEmail,

} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/me", authMiddleware, getMe);
router.put("/update-profile", authMiddleware, updateProfile);

export default router;