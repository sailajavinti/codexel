import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Glows */}
      <div className="absolute -top-32 -left-24 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-blue-100 blur-3xl opacity-70 pointer-events-none"></div>
      <div className="absolute top-32 right-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-100 blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-14 items-center">

          {/* ================= LEFT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="pt-2 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-slate-900">
              Build Websites
              <br />
              <span className="text-blue-600">Visually.</span>
              <br />
              Generate Clean
              <br />
              Code.
            </h1>

            <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              CodeXel lets you design responsive websites with drag &
              drop components and instantly export clean React,
              HTML, CSS and Tailwind code.
            </p>

            <div className="mt-6 sm:mt-8 w-full sm:w-auto">
              <button
                onClick={() => navigate("/build")}
                className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:bg-blue-700 hover:scale-105 active:scale-95"
              >
                Start Building
                <FaArrowRight />
              </button>
            </div>
          </motion.div>

          {/* ================= RIGHT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex justify-center w-full"
          >
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-white shadow-xl sm:shadow-2xl">

              {/* Browser Header */}
              <div className="flex items-center justify-between border-b bg-gray-100 px-4 sm:px-5 py-3 sm:py-4">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400"></div>
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-400"></div>
                </div>

                <div className="rounded-lg bg-white px-3 sm:px-4 py-1 text-xs sm:text-sm text-gray-500 shadow-sm border border-gray-200/50">
                  codexel.app
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="grid grid-cols-12 h-[320px] sm:h-[390px]">

                {/* Sidebar (Collapsed / streamlined on small screens) */}
                <div className="col-span-3 bg-slate-900 p-2 sm:p-3 text-gray-300">
                  <h3 className="mb-2 sm:mb-4 text-xs sm:text-sm font-semibold text-white truncate">
                    Components
                  </h3>
                  <div className="space-y-1.5 sm:space-y-3">
                    <div className="rounded-md sm:rounded-lg bg-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs truncate">
                      Navbar
                    </div>
                    <div className="rounded-md sm:rounded-lg bg-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs truncate">
                      Hero
                    </div>
                    <div className="rounded-md sm:rounded-lg bg-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs truncate">
                      Button
                    </div>
                    <div className="rounded-md sm:rounded-lg bg-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs truncate">
                      Card
                    </div>
                  </div>
                </div>

                {/* Canvas */}
                <div className="col-span-6 sm:col-span-6 bg-slate-50 p-2.5 sm:p-4 overflow-hidden">
                  <div className="h-14 sm:h-20 rounded-md sm:rounded-lg bg-blue-500 shadow-inner"></div>
                  <div className="mt-3 sm:mt-5 h-3.5 sm:h-5 w-28 sm:w-40 rounded bg-gray-300"></div>
                  <div className="mt-2 sm:mt-3 h-2.5 sm:h-4 w-full rounded bg-gray-200"></div>
                  <div className="mt-1.5 sm:mt-2 h-2.5 sm:h-4 w-4/5 rounded bg-gray-200"></div>
                  <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                    <div className="h-7 sm:h-10 w-16 sm:w-28 rounded-md sm:rounded-lg bg-blue-600"></div>
                    <div className="h-7 sm:h-10 w-16 sm:w-28 rounded-md sm:rounded-lg border border-gray-300"></div>
                  </div>
                </div>

                {/* Properties Panel */}
                <div className="col-span-3 border-l bg-white p-2 sm:p-3">
                  <h3 className="mb-2 sm:mb-4 text-xs sm:text-sm font-semibold truncate">
                    Properties
                  </h3>
                  <div className="space-y-2 sm:space-y-4">
                    <div className="h-2.5 sm:h-4 rounded bg-gray-200"></div>
                    <div className="h-6 sm:h-10 rounded bg-gray-100"></div>
                    <div className="h-2.5 sm:h-4 rounded bg-gray-200"></div>
                    <div className="h-6 sm:h-10 rounded bg-gray-100"></div>
                    <div className="h-2.5 sm:h-4 rounded bg-gray-200"></div>
                    <div className="h-6 sm:h-10 rounded bg-gray-100"></div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Hero;