import { motion } from "framer-motion";
import { FaArrowRight, FaLaptopCode } from "react-icons/fa";
import { Link } from "react-router-dom";

function HomeCTA() {
  return (
    <section className="bg-slate-900 text-white py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40"
        aria-hidden="true"
      />

      {/* Gentle soft glow accent */}
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold mb-6">
            <FaLaptopCode className="text-xs" />
            <span>Instant Access Visual Studio</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white max-w-3xl mx-auto">
            Ready to build responsive web pages with clean code output?
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Jump into the CodeXel Studio now. Compose components, adjust properties with live feedback, and download your clean React & Tailwind code in seconds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/build"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-900/30 hover:bg-blue-500 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span>Launch Studio Now</span>
              <FaArrowRight className="text-xs" />
            </Link>

            <Link
              to="/auth"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <span>Create Free Account</span>
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            No credit card required • 100% Free & Open Front-End Builder • Zero Framework Lock-In
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeCTA;

