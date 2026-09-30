import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";

import { signupUser } from "../services/authService";

function SignupForm({ setIsLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms
    if (!agreeTerms) {
      newErrors.terms = "Please agree to the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Stop if validation fails
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = await signupUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Show verification message
      setMessage(
        data.message ||
        "Account created successfully. Please check your email to verify your account."
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreeTerms(false);
      setErrors({});
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Signup failed");
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-6 text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Create an account
        </h2>
        <p className="text-slate-500 mt-1 text-xs sm:text-sm">
          Start building responsive websites and export clean code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <FaUser
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs transition-colors ${errors.name ? "text-red-400" : "text-slate-400"
                }`}
            />
            <input
              type="text"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setMessage("");
                setError("");
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
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
                setMessage("");
                setError("");
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                }
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

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Password
          </label>
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
                setMessage("");
                setError("");
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: "" }));
                }
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
          <p className="mt-1 text-[11px] text-slate-400">
            Must contain at least 6 characters.
          </p>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <FaLock
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs transition-colors ${errors.confirmPassword ? "text-red-400" : "text-slate-400"
                }`}
            />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setMessage("");
                setError("");
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }
              }}
              className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <FaEyeSlash className="text-xs" />
              ) : (
                <FaEye className="text-xs" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms and Conditions Checkbox */}
        <div>
          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none leading-relaxed">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                setMessage("");
                setError("");
                if (errors.terms) {
                  setErrors((prev) => ({ ...prev, terms: "" }));
                }
              }}
              className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span>
              I agree to the{" "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:underline inline"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:underline inline"
              >
                Privacy Policy
              </button>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.terms}
            </p>
          )}
        </div>

        {/* Success Alert Message */}
        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5">
            <div className="flex items-start gap-2 text-xs text-emerald-800">
              <FaCheckCircle className="text-emerald-600 shrink-0 text-sm mt-0.5" />
              <div className="space-y-2">
                <p className="leading-relaxed font-medium">{message}</p>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                >
                  Proceed to Sign In &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Server Error Alert Banner */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/90 p-3 text-xs text-red-700">
            <FaExclamationCircle className="text-red-500 shrink-0 text-sm mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <p className="mt-6 text-center text-xs text-slate-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

export default SignupForm;