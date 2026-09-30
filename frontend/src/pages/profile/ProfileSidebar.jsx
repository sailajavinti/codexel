import { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaHistory,
  FaLock,
  FaSignOutAlt,
  FaTrash,
  FaExclamationTriangle,
  FaChevronDown,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";

import { deleteAccount } from "../../services/authService";

function ProfileSidebar({
  user,
  activeSection,
  setActiveSection,
  onLogout,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Delete account states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);

        if (!deleteLoading) {
          setShowDeleteModal(false);
        }

        setShowLogoutModal(false);
      }
    };

    if (
      isDropdownOpen ||
      showDeleteModal ||
      showLogoutModal
    ) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isDropdownOpen,
    showDeleteModal,
    showLogoutModal,
    deleteLoading,
  ]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  // Open delete account modal
  const handleDeleteAccountClick = () => {
    setIsDropdownOpen(false);
    setCurrentPassword("");
    setDeleteError("");
    setShowPassword(false);
    setShowDeleteModal(true);
  };

  // Delete account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    setDeleteError("");

    if (!currentPassword) {
      setDeleteError("Please enter your current password.");
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteAccount(currentPassword);

      // Account has been permanently deleted
      setShowDeleteModal(false);
      setCurrentPassword("");

      // Reuse existing logout logic to clear authentication
      onLogout();
    } catch (error) {
      console.error("Delete account error:", error);

      if (
        error.response?.data?.code ===
        "CURRENT_PASSWORD_INCORRECT"
      ) {
        setDeleteError("Current password is incorrect.");
      } else {
        setDeleteError(
          error.response?.data?.message ||
            "Unable to delete account. Please try again."
        );
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setShowDeleteModal(false);
    setCurrentPassword("");
    setDeleteError("");
    setShowPassword(false);
  };

  const sectionLabels = {
    profile: "My Profile",
    history: "Project History",
    password: "Password & Security",
  };

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white lg:flex lg:flex-col min-h-[calc(100vh-4rem)] p-4">
        <div>
          {/* User Account Header */}
          <div className="flex items-center gap-3 p-2.5 mb-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-2xs">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                (user?.name || "U").charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">
                {user?.name || "Developer"}
              </p>

              <p className="text-[11px] text-slate-500 truncate">
                {user?.email || "Account Settings"}
              </p>
            </div>
          </div>

          {/* =====================================================
              ALL 5 DESKTOP OPTIONS
              Same spacing between every item
              ===================================================== */}
          <nav
            className="space-y-1"
            aria-label="Account Settings Navigation"
          >
            {/* Profile Overview */}
            <button
              type="button"
              onClick={() =>
                handleSectionChange("profile")
              }
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                activeSection === "profile"
                  ? "bg-blue-50 text-blue-600 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FaUser
                className={`text-xs ${
                  activeSection === "profile"
                    ? "text-blue-600"
                    : "text-slate-400"
                }`}
              />

              <span>Profile Overview</span>
            </button>

            {/* Project History */}
            <button
              type="button"
              onClick={() =>
                handleSectionChange("history")
              }
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                activeSection === "history"
                  ? "bg-blue-50 text-blue-600 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FaHistory
                className={`text-xs ${
                  activeSection === "history"
                    ? "text-blue-600"
                    : "text-slate-400"
                }`}
              />

              <span>Project History</span>
            </button>

            {/* Security & Password */}
            <button
              type="button"
              onClick={() =>
                handleSectionChange("password")
              }
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                activeSection === "password"
                  ? "bg-blue-50 text-blue-600 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FaLock
                className={`text-xs ${
                  activeSection === "password"
                    ? "text-blue-600"
                    : "text-slate-400"
                }`}
              />

              <span>Security & Password</span>
            </button>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleLogoutClick}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <FaSignOutAlt className="text-xs text-slate-400" />

              <span>Sign Out</span>
            </button>

            {/* Delete Account */}
            <button
              type="button"
              onClick={handleDeleteAccountClick}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaTrash className="text-xs" />

              <span>Delete Account</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* =====================================================
          TABLET & MOBILE ACCOUNT BAR WITH DROPDOWN
          ===================================================== */}
      <div
        className="relative block w-full lg:hidden"
        ref={dropdownRef}
      >
        {/* Account Bar */}
        <div className="relative z-30 flex h-14 items-center justify-between border-b border-slate-200/90 bg-white px-4 sm:px-6 shadow-2xs">
          {/* User Info & Current Section */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[11px] font-bold text-white shadow-2xs">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                (user?.name || "U").charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <p className="max-w-[150px] truncate text-xs font-bold text-slate-900 sm:max-w-[240px]">
                {user?.name || "Developer"}
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                <span className="font-medium text-blue-600 truncate">
                  {sectionLabels[activeSection] ||
                    "Settings"}
                </span>
              </div>
            </div>
          </div>

          {/* Account Dropdown Trigger Button */}
          <button
            type="button"
            onClick={() =>
              setIsDropdownOpen((prev) => !prev)
            }
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            aria-label="Toggle account menu"
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              isDropdownOpen
                ? "border-blue-300 bg-blue-50/70 text-blue-700 ring-2 ring-blue-500/20"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span>Menu</span>

            <FaChevronDown
              className={`text-[10px] transition-transform duration-200 ${
                isDropdownOpen
                  ? "rotate-180 text-blue-600"
                  : "text-slate-400"
              }`}
            />
          </button>
        </div>

        {/* Backdrop for Mobile Dropdown */}
        {isDropdownOpen && (
          <div
            onClick={() => setIsDropdownOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-200"
            aria-hidden="true"
          />
        )}

        {/* Dropdown Menu Popover */}
        {isDropdownOpen && (
          <div
            className="absolute right-4 top-full mt-2 z-50 w-64 rounded-xl border border-slate-200/90 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
            role="menu"
            aria-orientation="vertical"
          >
            {/* Header info inside dropdown */}
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.name || "Developer"}
              </p>

              <p className="text-[11px] text-slate-500 truncate">
                {user?.email || "Account Management"}
              </p>
            </div>

            <nav className="flex flex-col gap-0.5">
              {/* Profile */}
              <button
                type="button"
                onClick={() =>
                  handleSectionChange("profile")
                }
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                  activeSection === "profile"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
                role="menuitem"
              >
                <FaUser className="text-xs text-slate-400" />

                <span>Profile Overview</span>
              </button>

              {/* History */}
              <button
                type="button"
                onClick={() =>
                  handleSectionChange("history")
                }
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                  activeSection === "history"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
                role="menuitem"
              >
                <FaHistory className="text-xs text-slate-400" />

                <span>Project History</span>
              </button>

              {/* Security */}
              <button
                type="button"
                onClick={() =>
                  handleSectionChange("password")
                }
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                  activeSection === "password"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
                role="menuitem"
              >
                <FaLock className="text-xs text-slate-400" />

                <span>Security & Password</span>
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogoutClick}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                role="menuitem"
              >
                <FaSignOutAlt className="text-xs text-slate-400" />

                <span>Sign Out</span>
              </button>

              {/* Delete Account */}
              <button
                type="button"
                onClick={handleDeleteAccountClick}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                role="menuitem"
              >
                <FaTrash className="text-xs" />

                <span>Delete Account</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* =====================================================
          DELETE ACCOUNT CONFIRMATION MODAL
          ===================================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 shadow-2xs">
                <FaTrash className="text-lg" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Delete CodeXel Account
              </h3>

              <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                This action is permanent and irreversible.
                Your account, profile settings, and associated
                cloud project data will be permanently wiped.
              </p>
            </div>

            {/* Password Verification */}
            <form
              onSubmit={handleDeleteAccount}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Current Password
                </label>

                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setDeleteError("");
                    }}
                    placeholder="Enter your current password"
                    disabled={deleteLoading}
                    autoFocus
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    disabled={deleteLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none transition-colors"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-xs" />
                    ) : (
                      <FaEye className="text-xs" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {deleteError && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/90 p-3 text-xs text-red-700">
                  <FaExclamationTriangle className="text-red-500 shrink-0 text-xs mt-0.5" />

                  <span className="font-medium leading-relaxed">
                    {deleteError}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="flex-1 rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash className="text-xs" />
                      <span>Delete Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          LOGOUT CONFIRMATION DIALOG
          ===================================================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <FaSignOutAlt className="text-lg" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Sign Out?
              </h3>

              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Are you sure you want to sign out of your
                CodeXel developer session?
              </p>

              <div className="mt-6 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowLogoutModal(false)
                  }
                  className="flex-1 rounded-lg border border-slate-300 bg-white py-2 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmLogout}
                  className="flex-1 rounded-lg bg-red-600 py-2 px-4 text-xs font-semibold text-white hover:bg-red-700 active:scale-[0.98] transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileSidebar;