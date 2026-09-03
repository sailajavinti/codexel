import { motion } from "framer-motion";
import {
  FaCode,
  FaRocket,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AboutHero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Glows */}
      <div className="absolute -top-24 -left-24 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-blue-100 blur-3xl opacity-70 pointer-events-none"></div>
      <div className="absolute top-40 right-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-100 blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-14 items-center">

          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
              Transforming Ideas
              <br />
              Into
              <span className="text-blue-600"> Beautiful Websites</span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              CodeXel is an AI-powered visual website builder that bridges
              the gap between design and development. We empower developers,
              designers, students and businesses to create beautiful,
              responsive websites with drag-and-drop simplicity and
              production-ready code generation.
            </p>

            <div className="w-full sm:w-auto">
              <button
                onClick={() => navigate("/build")}
                className="mt-6 sm:mt-8 w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-3.5 sm:py-4 font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:bg-blue-700 hover:-translate-y-1 active:scale-95"
              >
                Start Building
                <FaArrowRight />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-4 sm:gap-6 w-full max-w-xl mx-auto lg:max-w-none"
          >
            {/* Featured Top Card */}
            <div className="group rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-100 text-xl sm:text-2xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <FaLightbulb />
              </div>

              <h3 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-semibold text-slate-900">
                Innovation
              </h3>

              <p className="mt-2.5 sm:mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
                We simplify website development through modern visual
                tools powered by intelligent automation.
              </p>
            </div>

            {/* Sub-grid (2 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="group rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-100 text-lg sm:text-xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <FaCode />
                </div>

                <h3 className="mt-4 text-lg sm:text-xl font-semibold text-slate-900">
                  Clean Code
                </h3>

                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-6 sm:leading-7">
                  Every design is converted into readable and production-ready code.
                </p>
              </div>

              <div className="group rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-100 text-lg sm:text-xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <FaRocket />
                </div>

                <h3 className="mt-4 text-lg sm:text-xl font-semibold text-slate-900">
                  Our Vision
                </h3>

                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-6 sm:leading-7">
                  Making website creation accessible to everyone through AI.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default AboutHero;