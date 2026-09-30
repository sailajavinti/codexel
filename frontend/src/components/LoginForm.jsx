import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
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
    <div className="w-full">
      {/* Heading */}
      <div className="mb-6 text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="text-slate-500 mt-1 text-xs sm:text-sm">
          Sign in to your CodeXel developer workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs transition-colors ${errors.email ? "text-red-400" : "text-slate-400"
                }`}
            />
            <input
              type="email"
              placeholder="developer@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                }
                setError("");
                setResendMessage("");
                setResendError("");
              }}
              className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <FaLock
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs transition-colors ${errors.password ? "text-red-400" : "text-slate-400"
                }`}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: "" }));
                }
                setError("");
              }}
              className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="text-xs" />
              ) : (
                <FaEye className="text-xs" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.password}
            </p>
          )}
        </div>

        {/* Server Error Alert Banner */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/90 p-3 text-xs text-red-700">
            <FaExclamationCircle className="text-red-500 shrink-0 text-sm mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Resend Verification Drawer */}
        {showResend && (
          <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-4">
            <p className="text-xs font-bold text-blue-900">
              Email verification required
            </p>
            <p className="mt-1 text-xs text-blue-700 leading-relaxed">
              Your email has not been verified yet. Enter your email below to receive a new link.
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
                className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-xs outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {resendError && (
              <p className="mt-2 text-xs text-red-600 font-medium">
                {resendError}
              </p>
            )}

            {resendMessage && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <FaCheckCircle className="text-emerald-600" />
                <span>{resendMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                <>
                  <FaSpinner className="animate-spin text-xs" />
                  <span>Sending email...</span>
                </>
              ) : (
                <span>Resend Verification Email</span>
              )}
            </button>
          </div>
        )}

        {/* Remember Me Checkbox */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <p className="mt-6 text-center text-xs text-slate-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none cursor-pointer"
        >
          Create an account
        </button>
      </p>
    </div>
  );
}

export default LoginForm;