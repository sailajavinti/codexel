import { useState } from "react";
import {
  FaUser,
  FaHistory,
  FaLock,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

function ProfileSidebar({
  user,
  activeSection,
  setActiveSection,
  onLogout,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
        {/* User Header */}
        <div className="border-b border-gray-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-bold text-blue-600">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                (user?.name || "U").charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">
                {user?.name || "User"}
              </p>

              <p className="text-[10px] text-gray-500">
                My Account
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="space-y-1 p-3">
          <button
            type="button"
            onClick={() => handleSectionChange("profile")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              activeSection === "profile"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FaUser className="text-xs" />
            Profile
          </button>

          <button
            type="button"
            onClick={() => handleSectionChange("history")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              activeSection === "history"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FaHistory className="text-xs" />
            History
          </button>

          <button
            type="button"
            onClick={() => handleSectionChange("password")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              activeSection === "password"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FaLock className="text-xs" />
            Reset Password
          </button>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <FaSignOutAlt className="text-xs" />
            Logout
          </button>
        </nav>
      </aside>

      {/* =====================================================
          TABLET + MOBILE
          ===================================================== */}
      <div className="relative block w-full lg:hidden">
        {/* ---------------------------------------------------
            ACCOUNT BAR
            --------------------------------------------------- */}
        <div
          className={`relative z-[60] flex min-h-[54px] items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-5 ${
            isDropdownOpen ? "shadow-sm" : ""
          }`}
        >
          {/* User */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 sm:h-9 sm:w-9 sm:text-xs">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                (user?.name || "U").charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <p className="max-w-[145px] truncate text-[11px] font-bold text-gray-900 sm:max-w-[220px] sm:text-xs">
                {user?.name || "User"}
              </p>

              <p className="text-[8px] text-gray-500 sm:text-[9px]">
                My Account
              </p>
            </div>
          </div>

          {/* Account Dropdown Button */}
          <button
            type="button"
            onClick={() =>
              setIsDropdownOpen((previous) => !previous)
            }
            className="flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-gray-700 transition hover:bg-gray-50 sm:px-3 sm:text-xs"
          >
            <span>My Account</span>

            {isDropdownOpen ? (
              <FaChevronUp className="text-[9px] text-gray-400" />
            ) : (
              <FaChevronDown className="text-[9px] text-gray-400" />
            )}
          </button>
        </div>

        {/* ---------------------------------------------------
            BLUR BACKDROP
            --------------------------------------------------- */}
        {isDropdownOpen && (
          <button
            type="button"
            aria-label="Close account menu"
            onClick={() => setIsDropdownOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/10 backdrop-blur-[3px]"
          />
        )}

        {/* ---------------------------------------------------
            DROPDOWN MENU
            --------------------------------------------------- */}
        {isDropdownOpen && (
          <div className="absolute right-3 top-[54px] z-[60] w-[190px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:right-5 sm:w-[210px]">
            <nav className="flex flex-col p-1.5">
              {/* Profile */}
              <button
                type="button"
                onClick={() =>
                  handleSectionChange("profile")
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium transition sm:text-xs ${
                  activeSection === "profile"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaUser className="w-3 shrink-0 text-[10px]" />
                <span>Profile</span>
              </button>

              {/* History */}
              <button
                type="button"
                onClick={() =>
                  handleSectionChange("history")
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium transition sm:text-xs ${
                  activeSection === "history"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaHistory className="w-3 shrink-0 text-[10px]" />
                <span>History</span>
              </button>

              {/* Reset Password */}
              <button
                type="button"
                onClick={() =>
                  handleSectionChange("password")
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium transition sm:text-xs ${
                  activeSection === "password"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaLock className="w-3 shrink-0 text-[10px]" />
                <span>Reset Password</span>
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogoutClick}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium text-red-500 transition hover:bg-red-50 sm:text-xs"
              >
                <FaSignOutAlt className="w-3 shrink-0 text-[10px]" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* =====================================================
          LOGOUT CONFIRMATION MODAL
          ===================================================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <FaExclamationTriangle />
              </div>

              <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                Logout?
              </h3>

              <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                Are you sure you want to logout from your
                CodeXel account?
              </p>

              <div className="mt-6 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 sm:text-sm"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmLogout}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 sm:text-sm"
                >
                  Logout
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