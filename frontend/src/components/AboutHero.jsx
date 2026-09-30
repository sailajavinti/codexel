import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCode,
  FaRocket,
  FaLayerGroup,
  FaLock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AboutHero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
      {/* Subtle Technical Dot Grid Background */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-70"
        aria-hidden="true"
      />

      {/* Soft Ambient Radial Light */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-blue-50/80 blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ================= LEFT COLUMN: MISSION & VALUE NARRATIVE ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50/80 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>About CodeXel • Our Story</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-slate-900">
              Transforming ideas into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                beautiful websites.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
              CodeXel is an AI-powered visual website builder that bridges the gap
              between design and development. We empower developers, designers,
              students, and businesses to create responsive websites with
              drag-and-drop simplicity and production-ready code generation.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/build")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                <span>Start Building</span>
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: ARCHITECTURE & IMPACT CARD ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-6 w-full max-w-xl mx-auto lg:max-w-none"
          >
            <div className="rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">

              {/* Architecture Flow Header */}
              <div className="pb-5 mb-6 border-b border-slate-100">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  System Architecture
                </span>
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-md text-slate-700">
                    <FaLayerGroup className="text-blue-600 text-[11px]" />
                    <span>Visual Canvas</span>
                  </div>
                  <span className="text-slate-400 font-bold">&rarr;</span>
                  <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-md text-blue-700 font-semibold">
                    <span>CodeXel Engine</span>
                  </div>
                  <span className="text-slate-400 font-bold">&rarr;</span>
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-md text-emerald-700 font-semibold">
                    <FaCode className="text-[11px]" />
                    <span>Clean Code</span>
                  </div>
                </div>
              </div>

              {/* 4 Core Developer Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-4">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    11+
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    Modular UI Blocks
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Pre-styled & responsive
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-4">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    4
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    Export Formats
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    React 19, HTML, CSS, Tailwind
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-4">
                  <div className="flex items-center gap-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    <span>100%</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    Client-Side Export
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Your code stays private
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-4">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Zero
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    Framework Lock-In
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Standalone deployable ZIP
                  </div>
                </div>
              </div>

              {/* Bottom Assurance Note */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FaRocket className="text-blue-600 text-[11px]" />
                  Production-grade developer output
                </span>
                <span className="flex items-center gap-1">
                  <FaLock className="text-slate-400 text-[10px]" />
                  Open Standards
                </span>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default AboutHero;