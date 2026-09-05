import { Link } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-slate-900 text-gray-300 mt-12 sm:mt-16 lg:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              onClick={scrollToTop}
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight inline-block"
            >
              CodeXel
            </Link>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-400 leading-6 sm:leading-7 max-w-sm">
              Build beautiful websites visually and export clean,
              production-ready code with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="transition hover:text-white inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={scrollToTop}
                  className="transition hover:text-white inline-block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/build"
                  onClick={scrollToTop}
                  className="transition hover:text-white inline-block"
                >
                  Build
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  onClick={scrollToTop}
                  className="transition hover:text-white inline-block"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  onClick={scrollToTop}
                  className="transition hover:text-white inline-block"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
              Contact
            </h3>

            <div className="space-y-2 text-sm sm:text-base text-gray-400">
              <p className="break-all">
                Email:{" "}
                <a
                  href="mailto:support@codexel.com"
                  className="hover:text-white transition"
                >
                  supportcodexel@gmail.com
                </a>
              </p>
              <p className="break-all">
                GitHub:{" "}
                <a
                  href="https://github.com/codexel"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  github.com/codexel
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-slate-800" />

        {/* Bottom Copyright */}
        <div className="text-center text-xs sm:text-sm text-gray-400">
          © {new Date().getFullYear()} CodeXel. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;