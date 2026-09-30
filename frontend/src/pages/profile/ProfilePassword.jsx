import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";

import { changePassword } from "../../services/authService";

function ProfilePassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    try {
      setLoading(true);

      await changePassword(currentPassword);

      setStep(2);
    } catch (error) {
      if (
        error.response?.data?.code ===
        "CURRENT_PASSWORD_INCORRECT"
      ) {
        setError("Current password is incorrect.");
      } else {
        setError(
          error.response?.data?.message ||
          "Unable to verify your password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await changePassword(
        currentPassword,
        newPassword
      );

      setSuccess(
        data.message || "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setStep(1);
        setSuccess("");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to change your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-[10px] font-bold tracking-wider text-blue-700 uppercase mb-2">
          Security
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Password & Security
        </h1>

        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Update and manage your account password securely.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs max-w-2xl">
        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${step >= 1
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-400"
                }`}
            >
              1
            </span>
            <span className={`text-xs font-semibold ${step === 1 ? "text-slate-900" : "text-slate-500"}`}>
              Verify Current
            </span>
          </div>

          <div className="h-0.5 flex-1 bg-slate-200 mx-4" />

          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${step >= 2
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-400"
                }`}
            >
              2
            </span>
            <span className={`text-xs font-semibold ${step === 2 ? "text-slate-900" : "text-slate-500"}`}>
              Set New Password
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/90 p-3 text-xs text-red-700">
            <FaExclamationCircle className="mt-0.5 shrink-0 text-red-500 text-sm" />
            <div className="flex-1">
              <p className="font-medium leading-relaxed">{error}</p>
              {step === 1 && error === "Current password is incorrect." && (
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="mt-1.5 font-bold text-red-700 underline hover:text-red-900 inline-block"
                >
                  Forgot password?
                </button>
              )}
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-800">
            <FaCheckCircle className="shrink-0 text-emerald-600 text-sm" />
            <p className="font-medium">{success}</p>
          </div>
        )}

        {/* STEP 1: VERIFY CURRENT PASSWORD */}
        {step === 1 && (
          <form onSubmit={handleVerifyPassword} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Current Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  autoFocus
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none transition-colors"
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash className="text-xs" />
                  ) : (
                    <FaEye className="text-xs" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Verifying current password...</span>
                </>
              ) : (
                <span>Continue to Step 2 &rarr;</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: ENTER NEW PASSWORD */}
        {step === 2 && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                New Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none transition-colors"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="text-xs" />
                  ) : (
                    <FaEye className="text-xs" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Minimum 6 characters.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm New Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-xs" />
                  ) : (
                    <FaEye className="text-xs" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setSuccess("");
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaArrowLeft className="text-[10px]" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePassword;