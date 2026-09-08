import { FaUser, FaHistory, FaSignOutAlt } from "react-icons/fa";

function ProfileSidebar({ user, activeSection, setActiveSection, onLogout }) {
  const initial = (user?.name || "U").charAt(0).toUpperCase();

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-6 max-md:w-full">
      {/* Profile Summary */}
      <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-bold text-white shadow">
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
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-gray-900">
            {user?.name || "User"}
          </h3>
          <p className="text-xs text-gray-400">My Account</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setActiveSection("profile")}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
            activeSection === "profile"
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaUser className="text-base" />
          <span>Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("history")}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
            activeSection === "history"
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaHistory className="text-base" />
          <span>History</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <FaSignOutAlt className="text-base" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default ProfileSidebar;