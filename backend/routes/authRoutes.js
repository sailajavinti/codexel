import express from "express";

import {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  verifyEmail,
  resendVerificationEmail,
  deleteAccount
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import sendEmail from "../services/emailService.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/change-password", authMiddleware, changePassword);

router.get("/me", authMiddleware, getMe);
router.put("/update-profile", authMiddleware, updateProfile);
router.post("/resend-verification", resendVerificationEmail);

router.delete("/delete-account", authMiddleware, deleteAccount);


// Temporary email integration test
router.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    await sendEmail({
      action: "verification",
      to: email,
      name: "CodeXel Tester",
      link: "https://codexel-web-one.vercel.app/verify-email/test-token",
    });

    res.json({
      success: true,
      message: "Google Apps Script email test successful",
    });
  } catch (error) {
    console.error("Test email failed:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;