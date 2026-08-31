import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

export { signup };