import { useState } from "react";
import {
  FaUser,
  FaHistory,
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

function ProfileSidebar({
  user,
  activeSection,
  setActiveSection,
  onLogout,
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const initial = (user?.name || "U").charAt(0).toUpperCase();

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
      <aside
        className="
          w-64 shrink-0 border-r border-gray-200 bg-white p-6

          md:max-lg:w-full
          md:max-lg:border-r-0
          md:max-lg:border-b
          md:max-lg:p-5

          max-md:w-full
          max-md:border-r-0
          max-md:border-b
          max-md:p-4
        "
      >
        {/* Profile Summary */}
        <div
          className="
            flex items-center gap-3 border-b border-gray-100 pb-6

            md:max-lg:pb-4
            max-md:pb-4
          "
        >
          {/* Avatar */}
          <div
            className="
              flex h-12 w-12 shrink-0 items-center justify-center
              overflow-hidden rounded-full
              bg-gradient-to-br from-blue-600 to-violet-600
              text-lg font-bold text-white shadow

              max-md:h-10
              max-md:w-10
              max-md:text-base
            "
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="h-full w-full object-cover bg-slate-100"
              />
            ) : (
              initial
            )}
          </div>

          {/* User Details */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-gray-900">
              {user?.name || "User"}
            </h3>

            <p className="text-xs text-gray-400">
              My Account
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="
            mt-6 flex flex-col gap-1

            md:max-lg:mt-4
            md:max-lg:flex-row
            md:max-lg:gap-2

            max-md:mt-4
            max-md:flex-row
            max-md:gap-2
          "
        >
          {/* Profile */}
          <button
            type="button"
            onClick={() => setActiveSection("profile")}
            className={`
              flex items-center gap-3 rounded-xl px-4 py-3
              text-sm font-medium transition

              md:max-lg:flex-1
              md:max-lg:justify-center

              max-md:flex-1
              max-md:justify-center
              max-md:px-3
              max-md:py-2.5
              max-md:text-xs

              ${
                activeSection === "profile"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            <FaUser className="text-base max-md:text-sm" />
            <span>Profile</span>
          </button>

          {/* History */}
          <button
            type="button"
            onClick={() => setActiveSection("history")}
            className={`
              flex items-center gap-3 rounded-xl px-4 py-3
              text-sm font-medium transition

              md:max-lg:flex-1
              md:max-lg:justify-center

              max-md:flex-1
              max-md:justify-center
              max-md:px-3
              max-md:py-2.5
              max-md:text-xs

              ${
                activeSection === "history"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            <FaHistory className="text-base max-md:text-sm" />
            <span>History</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="
              mt-6 flex items-center gap-3 rounded-xl px-4 py-3
              text-sm font-medium text-red-600 transition hover:bg-red-50

              md:max-lg:mt-0
              md:max-lg:flex-1
              md:max-lg:justify-center

              max-md:mt-0
              max-md:flex-1
              max-md:justify-center
              max-md:px-3
              max-md:py-2.5
              max-md:text-xs
            "
          >
            <FaSignOutAlt className="text-base max-md:text-sm" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <FaExclamationTriangle className="text-xl" />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                Log Out
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Are you sure you want to log out of your account?
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="
                  w-full rounded-lg border border-gray-300
                  bg-white py-2.5 text-sm font-semibold
                  text-gray-700 transition hover:bg-gray-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="
                  w-full rounded-lg bg-red-600 py-2.5
                  text-sm font-semibold text-white shadow-sm
                  transition hover:bg-red-700
                "
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileSidebar;