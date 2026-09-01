import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
} from "react-icons/fa";

import { loginUser } from "../services/authService";

function LoginForm({ setIsLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Email validation

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate form

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Stop if validation fails

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: email.trim(),
        password,
      });

      // Store JWT

      localStorage.setItem("token", data.token);

      // Store user information

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Move to Build page

      navigate("/build");

    } catch (error) {

      if (error.response) {
        setError(
          error.response.data.message || "Login failed"
        );
      } else {
        setError(
          "Unable to connect to the server"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 mt-2">
          Sign in to continue building amazing websites.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Email */}

        <div>

          <div className="relative">

            <FaEnvelope
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                errors.email
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                // Clear email error while typing

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }

                setError("");
              }}
              className={`w-full rounded-xl border bg-white py-3 pl-12 pr-4 outline-none transition-all duration-200 focus:ring-4 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

          </div>

          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.email}
            </p>
          )}

        </div>

        {/* Password */}

        <div>

          <div className="relative">

            <FaLock
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                errors.password
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }

                setError("");
              }}
              className={`w-full rounded-xl border bg-white py-3 pl-12 pr-12 outline-none transition-all duration-200 focus:ring-4 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>

          </div>

          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.password}
            </p>
          )}

        </div>

        {/* Server Error */}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Remember */}

        <div className="flex items-center justify-between text-sm">

          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">

            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />

            Remember me

          </label>

          <button
            type="button"
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>

        </div>

        {/* Login */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      {/* Divider */}

      <div className="flex items-center gap-4 my-8">

        <div className="h-px flex-1 bg-gray-300"></div>

        <span className="text-sm text-gray-500">
          OR CONTINUE WITH
        </span>

        <div className="h-px flex-1 bg-gray-300"></div>

      </div>

      {/* Social Login */}

      <div className="grid grid-cols-2 gap-4">

        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 transition hover:bg-gray-100"
        >
          <FaGoogle className="text-red-500" />
          Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 transition hover:bg-gray-100"
        >
          <FaGithub />
          GitHub
        </button>

      </div>

      {/* Bottom */}

      <p className="mt-8 text-center text-gray-600">

        Don't have an account?{" "}

        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign Up
        </button>

      </p>

    </div>
  );
}

export default LoginForm;