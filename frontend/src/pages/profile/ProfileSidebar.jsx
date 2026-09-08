import {
  FaUser,
  FaHistory,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";

function ProfileSidebar({
  user,
  activeSection,
  setActiveSection,
  onLogout,
}) {
  const userName = user?.name || "User";
  const initial = userName.charAt(0).toUpperCase();

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <FaUser />,
    },
    {
      id: "history",
      label: "History",
      icon: <FaHistory />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FaShieldAlt />,
    },
  ];

  return (
    <aside className="flex min-h-screen w-[250px] shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 max-md:min-h-0 max-md:w-full">
      
      {/* User */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-2.5 pb-6">
        <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-bold text-white">
          {initial}
        </div>

        <div className="min-w-0">
          <h3 className="max-w-[145px] truncate text-sm font-medium text-gray-900">
            {userName}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            My Account
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm transition ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg bg-red-50 px-3.5 py-3 text-left text-sm text-red-600 transition hover:bg-red-100"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default ProfileSidebar;