import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Section: Mobile Button + Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Toggle Button (Left Side) */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 -ml-2 text-gray-700 hover:text-blue-600 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl sm:text-4xl font-extrabold text-blue-600 tracking-tight"
          >
            CodeXel
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 font-medium">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `transition ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `transition ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/build"
                className={({ isActive }) =>
                  `transition ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
              >
                Build
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                  `rounded-xl px-6 py-2.5 text-white font-semibold transition ${
                    isActive
                      ? "bg-blue-700 ring-2 ring-blue-600 ring-offset-2"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`
                }
              >
                Join Us
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Backdrop Overlay for Mobile */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Left Drawer / Side Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[80vw] bg-white border-r border-gray-200 shadow-2xl p-6 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-extrabold text-blue-600 tracking-tight"
          >
            CodeXel
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none transition"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav>
          <ul className="flex flex-col gap-2 font-medium text-base">
            <li>
              <NavLink
                to="/"
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/build"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                Build
              </NavLink>
            </li>
            <li className="pt-4">
              <NavLink
                to="/auth"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block text-center rounded-xl px-6 py-2.5 text-white font-semibold transition shadow-md shadow-blue-500/20 ${
                    isActive
                      ? "bg-blue-700 ring-2 ring-blue-600 ring-offset-2"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`
                }
              >
                Join Us
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </header>
  );
}

export default Header;