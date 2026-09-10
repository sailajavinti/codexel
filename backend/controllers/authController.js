import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import validator from "validator";
import dns from "dns/promises";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
      });
    }

    // 2. Check email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    // 3. Check whether email domain can receive emails
    const emailDomain = email.split("@")[1];

    try {
      const mxRecords = await dns.resolveMx(emailDomain);

      if (!mxRecords || mxRecords.length === 0) {
        return res.status(400).json({
          message: "Please provide a valid email address",
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    // 4. Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // 5. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Generate email verification token
    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    // 8. Hash token before storing it
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // 9. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      avatar: "",

      isVerified: false,

      emailVerificationToken: hashedVerificationToken,

      // Token expires after 15 minutes
      emailVerificationExpires: Date.now() + 5 * 60 * 1000,
    });

    // 10. Create verification URL
    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // 11. Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 12. Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "CodeXel - Verify Your Email",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
        ">

          <h2 style="color: #2563eb;">
            Welcome to CodeXel!
          </h2>

          <p>
            Hello ${user.name},
          </p>

          <p>
            Your CodeXel account has been created successfully.
          </p>

          <p>
            Please verify your email address by clicking the button below:
          </p>

          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            "
          >
            Verify Email
          </a>

          <p style="margin-top: 20px;">
            This verification link will expire in
            <strong>5 minutes</strong>.
          </p>

          <p>
            If you did not create this account, you can safely ignore
            this email.
          </p>

          <p>
            Thanks,<br />
            CodeXel Team
          </p>

        </div>
      `,
    });

    // 13. Don't generate JWT yet
    res.status(201).json({
      message:
        "Account created successfully. Please check your email to verify your account.",
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Check token
    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    // 2. Hash the token received from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 3. Find user with matching token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: {
        $gt: Date.now(),
      },
    });

    // 4. Token invalid or expired
    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or expired",
      });
    }

    // 5. Verify the email
    user.isVerified = true;

    // 6. Remove verification token
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    // 7. Send response
    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    res.status(500).json({
      message: "Unable to verify email",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const rawUserId = req.userId || req.user?._id || req.user?.id;
    const user = await User.findById(rawUserId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const rawUserId = req.userId || req.user?._id || req.user?.id;
    const { name, avatar } = req.body;

    const user = await User.findById(rawUserId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name && name.trim()) {
      if (name.trim().length < 2) {
        return res.status(400).json({
          message: "Name must be at least 2 characters",
        });
      }
      user.name = name.trim();
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Unable to update profile",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide your email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If an account exists with this email, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "CodeXel - Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #2563eb;">Reset Your Password</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your CodeXel password.</p>
          <p>Click the button below to create a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
          <p style="margin-top: 20px;">This link will expire in <strong>5 minutes</strong>.</p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <p>Thanks,<br />CodeXel Team</p>
        </div>
      `,
    });

    res.status(200).json({
      message: "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Unable to process password reset request",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Please provide a new password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset link is invalid or expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Unable to reset password",
    });
  }
};

export {
  signup, login, getMe, forgotPassword, resetPassword, updateProfile, verifyEmail,
};