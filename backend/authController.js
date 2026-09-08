import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";


const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check required fields

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
      });
    }

    // 2. Check password length

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // 3. Check if user already exists

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 4. Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create user

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 6. Generate JWT

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 7. Send response

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.error("Signup error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check required fields

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // 2. Find user

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Compare password

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Generate JWT

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 5. Send response

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};


const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password"
    );

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
      },
    });

  } catch (error) {

    console.error("Get user error:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check email

    if (!email) {
      return res.status(400).json({
        message: "Please provide your email",
      });
    }

    // 2. Find user

    const user = await User.findOne({ email });

    // Always return the same message
    // so attackers cannot know whether an email exists.

    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // 3. Generate random reset token

    const resetToken = crypto.randomBytes(32).toString("hex");

    // 4. Hash token before storing it

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 5. Store hashed token + expiry

    user.resetPasswordToken = hashedToken;

    // Token expires after 5 minutes

    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    // 6. Create reset URL

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 7. Send email

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "CodeXel - Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          
          <h2 style="color: #2563eb;">
            Reset Your Password
          </h2>

          <p>
            Hello ${user.name},
          </p>

          <p>
            We received a request to reset your CodeXel password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 20px;">
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

          <p>
            Thanks,<br />
            CodeXel Team
          </p>

        </div>
      `,
    });

    // 8. Send response

    res.status(200).json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
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

    // 1. Check password

    if (!password) {
      return res.status(400).json({
        message: "Please provide a new password",
      });
    }

    // 2. Check password length

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // 3. Hash token received from frontend

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 4. Find user with valid token

    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    // 5. Invalid or expired token

    if (!user) {
      return res.status(400).json({
        message: "Password reset link is invalid or expired",
      });
    }

    // 6. Hash new password

    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Update password

    user.password = hashedPassword;

    // 8. Remove reset token

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    // 9. Send response

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


export { signup, login, getMe, forgotPassword, resetPassword };