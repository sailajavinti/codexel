import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";

import {
  verifyEmail,
  resendVerificationEmail,
} from "../services/authService";

function VerifyEmail() {
  const { token } = useParams();
  const verificationStarted = useRef(false);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showResend, setShowResend] = useState(false);
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    sessionStorage.setItem("verificationTab", "true");

    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const verify = async () => {
      try {
        const data = await verifyEmail(token);
        setVerified(true);
        setMessage(data.message);
      } catch (error) {
        setVerified(false);
        setError(
          error.response?.data?.message ||
          "Unable to verify your email address."
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();

    setResendMessage("");
    setResendError("");

    if (!email.trim()) {
      setResendError("Please enter your email address.");
      return;
    }

    setResendLoading(true);

    try {
      const data = await resendVerificationEmail(email.trim());
      setResendMessage(data.message || "Verification email sent. Please check your inbox.");
      setEmail("");
    } catch (error) {
      setResendError(
        error.response?.data?.message ||
        "Unable to resend verification email."
      );
    } finally {
      setResendLoading(false);
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
          {/* STATE 1: LOADING */}
          {loading && (
            <div className="text-center py-4">
              <FaSpinner className="mx-auto mb-4 animate-spin text-3xl text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">
                Verifying your email...
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                Please wait while we validate your verification token.
              </p>
            </div>
          )}

          {/* STATE 2: VERIFIED */}
          {!loading && verified && (
            <div className="text-center py-2">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 shadow-2xs">
                <FaCheckCircle className="text-3xl" />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Email Verified!
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                {message || "Your email has been verified successfully. You can now access your CodeXel studio."}
              </p>

              <Link
                to="/auth"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                Proceed to Sign In
              </Link>
            </div>
          )}

          {/* STATE 3: VERIFICATION FAILED */}
          {!loading && !verified && (
            <div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100/80 shadow-2xs">
                  <FaExclamationCircle className="text-3xl" />
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Verification Failed
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {error || "This verification link is invalid or has expired."}
                </p>
              </div>

              {/* Resend Section */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                {!showResend ? (
                  <button
                    type="button"
                    onClick={() => setShowResend(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <FaEnvelope className="text-xs text-slate-500" />
                    <span>Resend Verification Link</span>
                  </button>
                ) : (
                  <form onSubmit={handleResend} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setResendError("");
                          setResendMessage("");
                        }}
                        placeholder="developer@example.com"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {resendError && (
                      <p className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600 font-medium">
                        {resendError}
                      </p>
                    )}

                    {resendMessage && (
                      <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-700 font-medium">
                        <FaCheckCircle className="text-emerald-600 shrink-0" />
                        <span>{resendMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={resendLoading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {resendLoading ? (
                        <>
                          <FaSpinner className="animate-spin text-xs" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send Verification Email</span>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Back to Login */}
              <div className="mt-5 text-center pt-4 border-t border-slate-100">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <FaArrowLeft className="text-[10px]" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default VerifyEmail;