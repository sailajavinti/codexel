import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              🚀 AI Powered Visual Website Builder
            </span>

            <h1 className="mt-6 text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">

              Build Websites
              <br />

              <span className="text-blue-600">
                Visually.
              </span>

              <br />

              Generate Clean Code.

            </h1>

            <p className="mt-8 text-lg text-gray-600 leading-8 max-w-xl">

              CodeXel lets you design responsive websites with drag &
              drop components and instantly export clean React,
              HTML, CSS and Tailwind code.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-xl font-semibold transition shadow-lg">

                Start Building

                <FaArrowRight />

              </button>

            </div>



          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >

            <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">

              {/* Browser Header */}

              <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-100">

                <div className="flex gap-2">

                  <div className="w-3 h-3 rounded-full bg-red-400"></div>

                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>

                  <div className="w-3 h-3 rounded-full bg-green-400"></div>

                </div>

                <div className="bg-white rounded-lg px-4 py-1 text-sm text-gray-500">
                  codexel.app
                </div>

              </div>

              {/* Editor */}

              <div className="grid grid-cols-12 h-[430px]">

                {/* Sidebar */}

                <div className="col-span-3 bg-slate-900 text-gray-300 p-4">

                  <h3 className="font-semibold text-white mb-4">
                    Components
                  </h3>

                  <div className="space-y-3">

                    <div className="bg-slate-800 rounded-lg px-3 py-2">
                      Navbar
                    </div>

                    <div className="bg-slate-800 rounded-lg px-3 py-2">
                      Hero
                    </div>

                    <div className="bg-slate-800 rounded-lg px-3 py-2">
                      Button
                    </div>

                    <div className="bg-slate-800 rounded-lg px-3 py-2">
                      Card
                    </div>

                  </div>

                </div>

                {/* Canvas */}

                <div className="col-span-6 bg-slate-50 p-5">

                  <div className="bg-blue-500 rounded-lg h-20"></div>

                  <div className="mt-5 h-5 w-40 bg-gray-300 rounded"></div>

                  <div className="mt-3 h-4 w-full bg-gray-200 rounded"></div>

                  <div className="mt-2 h-4 w-4/5 bg-gray-200 rounded"></div>

                  <div className="mt-6 flex gap-3">

                    <div className="h-10 w-28 rounded-lg bg-blue-600"></div>

                    <div className="h-10 w-28 rounded-lg border"></div>

                  </div>

                </div>

                {/* Properties */}

                <div className="col-span-3 border-l bg-white p-4">

                  <h3 className="font-semibold mb-4">
                    Properties
                  </h3>

                  <div className="space-y-4">

                    <div className="h-4 bg-gray-200 rounded"></div>

                    <div className="h-10 bg-gray-100 rounded"></div>

                    <div className="h-4 bg-gray-200 rounded"></div>

                    <div className="h-10 bg-gray-100 rounded"></div>

                    <div className="h-4 bg-gray-200 rounded"></div>

                    <div className="h-10 bg-gray-100 rounded"></div>

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