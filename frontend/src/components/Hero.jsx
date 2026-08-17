import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">

      <div className="absolute -top-32 -left-24 w-72 h-72 rounded-full bg-blue-100 blur-3xl opacity-70"></div>

      <div className="absolute top-32 right-0 w-96 h-96 rounded-full bg-indigo-100 blur-3xl opacity-60"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-3">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* ================= LEFT ================= */}

          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="pt-2"
          >

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">

              Build Websites

              <br />

              <span className="text-blue-600">
                Visually.
              </span>

              <br />

              Generate Clean

              <br />

              Code.

            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">

              CodeXel lets you design responsive websites with drag &
              drop components and instantly export clean React,
              HTML, CSS and Tailwind code.

            </p>

            <div className="mt-4">

              <button
                onClick={() => navigate("/build")}
                className="flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:bg-blue-700 hover:scale-105"
              >

                Start Building

                <FaArrowRight />

              </button>

            </div>

          </motion.div>

          {/* ================= RIGHT ================= */}

          <motion.div
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center lg:pt-6"
          >

            <div className="w-full max-w-lg lg:max-w-xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">

              {/* Browser Header */}

              <div className="flex items-center justify-between border-b bg-gray-100 px-5 py-4">

                <div className="flex gap-2">

                  <div className="h-3 w-3 rounded-full bg-red-400"></div>

                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>

                  <div className="h-3 w-3 rounded-full bg-green-400"></div>

                </div>

                <div className="rounded-lg bg-white px-4 py-1 text-sm text-gray-500">
                  codexel.app
                </div>

              </div>

              {/* Editor */}

              <div className="grid grid-cols-12 h-[390px]">

                {/* Sidebar */}

                <div className="col-span-3 bg-slate-900 p-3 text-gray-300">

                  <h3 className="mb-4 font-semibold text-white">
                    Components
                  </h3>

                  <div className="space-y-3">

                    <div className="rounded-lg bg-slate-800 px-3 py-2">
                      Navbar
                    </div>

                    <div className="rounded-lg bg-slate-800 px-3 py-2">
                      Hero
                    </div>

                    <div className="rounded-lg bg-slate-800 px-3 py-2">
                      Button
                    </div>

                    <div className="rounded-lg bg-slate-800 px-3 py-2">
                      Card
                    </div>

                  </div>

                </div>

                {/* Canvas */}

                <div className="col-span-6 bg-slate-50 p-4">

                  <div className="h-20 rounded-lg bg-blue-500"></div>

                  <div className="mt-5 h-5 w-40 rounded bg-gray-300"></div>

                  <div className="mt-3 h-4 w-full rounded bg-gray-200"></div>

                  <div className="mt-2 h-4 w-4/5 rounded bg-gray-200"></div>

                  <div className="mt-6 flex gap-3">

                    <div className="h-10 w-28 rounded-lg bg-blue-600"></div>

                    <div className="h-10 w-28 rounded-lg border"></div>

                  </div>

                </div>

                {/* Properties */}

                <div className="col-span-3 border-l bg-white p-3">

                  <h3 className="mb-4 font-semibold">
                    Properties
                  </h3>

                  <div className="space-y-4">

                    <div className="h-4 rounded bg-gray-200"></div>

                    <div className="h-10 rounded bg-gray-100"></div>

                    <div className="h-4 rounded bg-gray-200"></div>

                    <div className="h-10 rounded bg-gray-100"></div>

                    <div className="h-4 rounded bg-gray-200"></div>

                    <div className="h-10 rounded bg-gray-100"></div>

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