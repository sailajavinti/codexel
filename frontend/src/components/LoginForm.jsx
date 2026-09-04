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
      localStorage.setItem("user", JSON.stringify(data.user));

      // Move to Build page
      navigate("/build");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-1 sm:px-0">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 mt-1.5 sm:mt-2 text-sm sm:text-base">
          Sign in to continue building amazing websites.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Email */}
        <div>
          <div className="relative">
            <FaEnvelope
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base ${
                errors.email ? "text-red-400" : "text-gray-400"
              }`}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }

                setError("");
              }}
              className={`w-full rounded-xl border bg-white py-2.5 sm:py-3 pl-11 sm:pl-12 pr-4 text-sm sm:text-base outline-none transition-all duration-200 focus:ring-4 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <FaLock
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base ${
                errors.password ? "text-red-400" : "text-gray-400"
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
              className={`w-full rounded-xl border bg-white py-2.5 sm:py-3 pl-11 sm:pl-12 pr-11 sm:pr-12 text-sm sm:text-base outline-none transition-all duration-200 focus:ring-4 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 p-1 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="text-sm sm:text-base" />
              ) : (
                <FaEye className="text-sm sm:text-base" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">
              {errors.password}
            </p>
          )}
        </div>

        {/* Server Error */}
        {error && (
          <p className="rounded-lg bg-red-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Remember & Forgot Password */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 sm:gap-0 text-xs sm:text-sm pt-0.5">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 sm:py-3.5 text-sm sm:text-base text-white font-semibold shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 sm:gap-4 my-6 sm:my-8">
        <div className="h-px flex-1 bg-gray-200 sm:bg-gray-300"></div>
        <span className="text-[11px] sm:text-xs tracking-wider text-gray-400 sm:text-gray-500 font-medium">
          OR CONTINUE WITH
        </span>
        <div className="h-px flex-1 bg-gray-200 sm:bg-gray-300"></div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 sm:gap-3 rounded-xl border border-gray-300 bg-white py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99]"
        >
          <FaGoogle className="text-red-500 text-sm sm:text-base" />
          Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2.5 sm:gap-3 rounded-xl border border-gray-300 bg-white py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99]"
        >
          <FaGithub className="text-sm sm:text-base" />
          GitHub
        </button>
      </div>

      {/* Bottom */}
      <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="font-semibold text-blue-600 hover:underline transition focus:outline-none"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default LoginForm;