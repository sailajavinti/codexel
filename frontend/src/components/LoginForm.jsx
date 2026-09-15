import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import {
  loginUser,
  resendVerificationEmail,
} from "../services/authService";

function LoginForm({ setIsLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Resend verification states
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  const navigate = useNavigate();

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate login form
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

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setResendMessage("");
    setResendError("");

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

      // Notify other components about login
      window.dispatchEvent(new Event("authChange"));

      // Move to Build page
      navigate("/build", { replace: true });
    } catch (error) {
      if (error.response) {
        const serverMessage =
          error.response.data.message || "Login failed";

        setError(serverMessage);

        // Show resend option when email is not verified
        if (
          error.response.status === 403 &&
          serverMessage.toLowerCase().includes("verify")
        ) {
          setResendEmail(email.trim());
          setShowResend(true);
        }
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async (e) => {
    e.preventDefault();

    setResendMessage("");
    setResendError("");

    if (!resendEmail.trim()) {
      setResendError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(resendEmail.trim())) {
      setResendError("Please enter a valid email address.");
      return;
    }

    setResendLoading(true);

    try {
      const data = await resendVerificationEmail(
        resendEmail.trim()
      );

      setResendMessage(
        data.message ||
          "Verification email sent. Please check your inbox."
      );
    } catch (error) {
      if (error.response) {
        setResendError(
          error.response.data.message ||
            "Unable to resend verification email."
        );
      } else {
        setResendError(
          "Unable to connect to the server."
        );
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-1 sm:px-0">

      {/* Heading */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 mt-1.5 sm:mt-2 text-sm sm:text-base">
          Sign in to continue building amazing websites.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5"
      >

        {/* Email */}
        <div>
          <div className="relative">
            <FaEnvelope
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base ${
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

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }

                setError("");
                setResendMessage("");
                setResendError("");
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
              className={`w-full rounded-xl border bg-white py-2.5 sm:py-3 pl-11 sm:pl-12 pr-11 sm:pr-12 text-sm sm:text-base outline-none transition-all duration-200 focus:ring-4 ${
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 p-1 focus:outline-none"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
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

        {/* Resend Verification */}
        {showResend && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

            <p className="text-sm font-medium text-blue-800">
              Your email is not verified.
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-600">
              Enter your email below and we'll send you
              a new verification link.
            </p>

            <div className="mt-3">
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => {
                  setResendEmail(e.target.value);
                  setResendError("");
                  setResendMessage("");
                }}
                placeholder="Email Address"
                className="w-full rounded-lg border border-blue-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {resendError && (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {resendError}
              </p>
            )}

            {resendMessage && (
              <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-600">
                {resendMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {resendLoading
                ? "Sending..."
                : "Resend Verification Email"}
            </button>
          </div>
        )}

        {/* Remember & Forgot Password */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">

          <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={() =>
              navigate("/forgot-password")
            }
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