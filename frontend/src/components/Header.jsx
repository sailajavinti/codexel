import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaLaptopCode,
  FaHome,
  FaInfoCircle,
} from "react-icons/fa";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Check whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      return Boolean(localStorage.getItem("token"));
    }
    return false;
  });

  // Store user details to retrieve avatar
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        return null;
      }
    }
    return null;
  });

  // Update Header when login/logout/profile update happens
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("authChange", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsOpen(false);

    window.dispatchEvent(new Event("authChange"));
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section: Mobile Menu Trigger + Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors -ml-1.5 cursor-pointer"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
          >
            <FaBars className="text-base" />
          </button>

          {/* Logo - Restored original appearance without background box */}
          <Link
            to="/"
            className="flex items-center gap-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            aria-label="CodeXel Home"
          >
            <img
              src="/codexel.jpeg"
              alt="CodeXel Logo"
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />
            <span className="text-2xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
              odeXel
            </span>
          </Link>
        </div>

        {/* Right Section: [Home] [About] [Build] [Profile / Join Us] */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* ================= DESKTOP NAVIGATION ================= */}
          <nav className="hidden md:flex items-center gap-1.5 font-medium" aria-label="Main Navigation">
            {/* Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`
              }
            >
              Home
            </NavLink>

            {/* About */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`
              }
            >
              About
            </NavLink>

            {/* Build */}
            <NavLink
              to="/build"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`
              }
            >
              Build
            </NavLink>
          </nav>

          {/* Profile Button - Restored from previous version / Join Us */}
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex items-center transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full cursor-pointer"
              title="Profile"
              aria-label="Profile"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile Avatar"
                  className="h-8 w-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                />
              ) : (
                <FaUserCircle className="text-3xl text-blue-600" />
              )}
            </Link>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                `inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? "bg-blue-700 text-white ring-2 ring-blue-600 ring-offset-2"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                }`
              }
            >
              Join Us
            </NavLink>
          )}
        </div>
      </div>

      {/* ================= MOBILE BACKDROP ================= */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* ================= MOBILE SIDE DRAWER ================= */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 shadow-2xl p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile Navigation"
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-0"
              aria-label="CodeXel Home"
            >
              <img
                src="/codexel.jpeg"
                alt="CodeXel Logo"
                className="h-8 w-8 object-contain sm:h-9 sm:w-9"
              />
              <span className="text-2xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
                odeXel
              </span>
            </Link>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav>
            <ul className="flex flex-col gap-1 text-sm font-medium">
              <li>
                <NavLink
                  to="/"
                  end
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <FaHome className="text-xs text-slate-400" />
                  <span>Home</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <FaInfoCircle className="text-xs text-slate-400" />
                  <span>About</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/build"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <FaLaptopCode className="text-xs text-slate-400" />
                  <span>Build Studio</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Drawer Bottom: User Card or Join Us */}
        <div className="pt-4 border-t border-slate-100">
          {!isLoggedIn ? (
            <NavLink
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Join Us
            </NavLink>
          ) : (
            <div className="space-y-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50 transition-colors"
                title="Profile"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile Avatar"
                    className="h-8 w-8 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <FaUserCircle className="text-2xl text-blue-600" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    View Profile
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-red-50 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <FaSignOutAlt className="text-xs" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </header>
  );
}

export default Header;