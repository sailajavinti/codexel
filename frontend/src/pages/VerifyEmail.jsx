import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaEnvelope,
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
          "Unable to verify your email."
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
      const data = await resendVerificationEmail(
        email.trim()
      );

      setResendMessage(data.message);
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <FaSpinner className="mx-auto mb-5 animate-spin text-4xl text-blue-600" />

          <h1 className="text-2xl font-bold text-gray-900">
            Verifying your email...
          </h1>

          <p className="mt-2 text-gray-500">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <FaCheckCircle className="mx-auto mb-5 text-5xl text-green-500" />

          <h1 className="text-2xl font-bold text-gray-900">
            Email Verified!
          </h1>

          <p className="mt-3 text-gray-500">
            {message}
          </p>

          <Link
            to="/auth"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <FaExclamationCircle className="mx-auto mb-5 text-5xl text-red-500" />

          <h1 className="text-2xl font-bold text-gray-900">
            Verification Failed
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>
        </div>

        {/* Resend Section */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          {!showResend ? (
            <button
              type="button"
              onClick={() => setShowResend(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
            >
              <FaEnvelope />
              Resend Verification Email
            </button>
          ) : (
            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {resendError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {resendError}
                </p>
              )}

              {resendMessage && (
                <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
                  {resendMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={resendLoading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {resendLoading
                  ? "Sending..."
                  : "Send Verification Email"}
              </button>
            </form>
          )}
        </div>

        <Link
          to="/auth"
          className="mt-5 block text-center text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmail;