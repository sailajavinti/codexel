import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        
        <Link to="/" className="text-3xl font-bold text-blue-600">
          CodeXel
        </Link>

        <nav>
          <ul className="flex items-center gap-8 text-gray-700 font-medium">
            <li>
              <Link
                to="/"
                className="hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
            </li>


            <li>
              <Link
                to="/build"
                className="hover:text-blue-600 transition-colors"
              >
                Build
              </Link>
            </li>

            <li>
              <Link
                to="/auth"
                className="hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
            </li>

            <li>
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;