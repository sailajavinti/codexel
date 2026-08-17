import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-8 py-12">

        <div className="grid md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-white">CodeXel</h2>
            <p className="mt-4 text-gray-400 leading-7">
              Build beautiful websites visually and export clean,
              production-ready code with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/build" className="hover:text-white">
                  Build
                </Link>
              </li>

              <li>
                <Link to="/login" className="hover:text-white">
                  Login
                </Link>
              </li>

              <li>
                <Link to="/signup" className="hover:text-white">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Contact
            </h3>

            <p>Email: support@codexel.com</p>
            <p className="mt-2">GitHub: github.com/codexel</p>
          </div>
        </div>

        <hr className="my-8 border-slate-700" />

        <div className="text-center text-gray-400">
          © {new Date().getFullYear()} CodeXel. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;