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


      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-100 blur-3xl opacity-70"></div>

      <div className="absolute top-40 right-0 w-96 h-96 rounded-full bg-indigo-100 blur-3xl opacity-60"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >


            <h1 className="mt-6 text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">

              Transforming Ideas

              <br />

              Into

              <span className="text-blue-600">
                {" "}Beautiful Websites
              </span>

            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">

              CodeXel is an AI-powered visual website builder that bridges
              the gap between design and development. We empower developers,
              designers, students and businesses to create beautiful,
              responsive websites with drag-and-drop simplicity and
              production-ready code generation.

            </p>

            <button
              onClick={() => navigate("/build")}
              className="mt-8 flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:bg-blue-700 hover:-translate-y-1"
            >
              Start Building

              <FaArrowRight />
            </button>

          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-6"
          >

            {/* Card */}

            <div className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

                <FaLightbulb />

              </div>

              <h3 className="mt-5 text-2xl font-semibold text-slate-900">

                Innovation

              </h3>

              <p className="mt-3 leading-7 text-gray-600">

                We simplify website development through modern visual
                tools powered by intelligent automation.

              </p>

            </div>

            {/* Two Cards */}

            <div className="grid sm:grid-cols-2 gap-6">

              <div className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

                  <FaCode />

                </div>

                <h3 className="mt-4 text-xl font-semibold text-slate-900">

                  Clean Code

                </h3>

                <p className="mt-2 text-gray-600 leading-7">

                  Every design is converted into readable and production-ready code.

                </p>

              </div>

              <div className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

                  <FaRocket />

                </div>

                <h3 className="mt-4 text-xl font-semibold text-slate-900">

                  Our Vision

                </h3>

                <p className="mt-2 text-gray-600 leading-7">

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