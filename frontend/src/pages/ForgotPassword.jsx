import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaKey,
  FaEnvelope,
  FaArrowLeft,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword({
        email: email.trim(),
      });

      setMessage(response.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Subtle Technical Dot Grid Background */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-70"
        aria-hidden="true"
      />

      {/* Soft Ambient Light */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-50/70 blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group"
            aria-label="CodeXel Home"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-blue-600 text-white shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <img
                src="/codexel.jpeg"
                alt="CodeXel Logo"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Code<span className="text-blue-600">Xel</span>
            </span>
          </Link>
        </div>

        {/* Elevated Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 shadow-2xs mb-4">
              <FaKey className="text-xl" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Forgot Password?
            </h1>

            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
              Enter your verified email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs transition-colors ${error ? "text-red-400" : "text-slate-400"
                    }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder="developer@example.com"
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${error
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                />
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/90 p-3 text-xs text-red-700">
                <FaExclamationCircle className="text-red-500 shrink-0 text-sm mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {message && (
              <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-800">
                <FaCheckCircle className="text-emerald-600 shrink-0 text-sm mt-0.5" />
                <span className="leading-relaxed">{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Sending link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FaArrowLeft className="text-[10px]" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;