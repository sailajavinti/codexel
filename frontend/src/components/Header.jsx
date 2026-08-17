import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">

      <div className="max-w-7xl mx-auto h-20 px-6 lg:px-8 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/"
          className="text-4xl font-extrabold text-blue-600 tracking-tight"
        >
          CodeXel
        </Link>

        {/* Navigation */}

        <nav>
          <ul className="flex items-center gap-8 text-gray-700 font-medium">

            <li>
              <Link
                to="/"
                className="transition hover:text-blue-600"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="transition hover:text-blue-600"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/build"
                className="transition hover:text-blue-600"
              >
                Build
              </Link>
            </li>

            <li>
              <Link
                to="/auth"
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-white transition hover:bg-blue-700"
              >
                Join Us
              </Link>
            </li>

          </ul>
        </nav>

      </div>

    </header>
  );
}

export default Header;