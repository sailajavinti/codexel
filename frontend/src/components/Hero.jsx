import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCode,
  FaLaptopCode,
  FaCheck,
  FaLayerGroup,
  FaSlidersH,
  FaDesktop,
  FaTabletAlt,
  FaMobileAlt,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("canvas"); // "canvas" | "code"
  const [activeViewport, setActiveViewport] = useState("desktop"); // "desktop" | "tablet" | "mobile"

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
      {/* Subtle Technical Dot Grid Background */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-70"
        aria-hidden="true"
      />

      {/* Soft Ambient Radial Highlight (No harsh blobs) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-50/70 blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ================= LEFT COLUMN: VALUE PROPOSITION ================= */}
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50/80 text-blue-700 text-xs font-semibold mb-6 shadow-2xs"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Next-Gen Visual Web Builder & Code Generator</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
            >
              Build websites visually.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Generate production code.
              </span>
            </motion.h1>

            {/* Supporting Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl"
            >
              CodeXel combines the speed of drag-and-drop visual design with the
              precision of clean developer output. Assemble responsive components and
              instantly export clean React 19, HTML5, and Tailwind CSS.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              <button
                type="button"
                onClick={() => navigate("/build")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer"
              >
                <span>Start Building Free</span>
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
              </button>

              <Link
                to="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>How It Works</span>
              </Link>
            </motion.div>

            {/* Developer Trust & Capability Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 pt-6 border-t border-slate-200/80 w-full flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-slate-500 font-medium"
            >
              <span className="flex items-center gap-1.5">
                <FaCheck className="text-blue-600 text-[11px]" /> React 19 JSX
              </span>
              <span className="flex items-center gap-1.5">
                <FaCheck className="text-blue-600 text-[11px]" /> Tailwind CSS v4
              </span>
              <span className="flex items-center gap-1.5">
                <FaCheck className="text-blue-600 text-[11px]" /> Clean Semantic HTML
              </span>
              <span className="flex items-center gap-1.5">
                <FaCheck className="text-blue-600 text-[11px]" /> Zero Lock-in ZIP
              </span>
            </motion.div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE STUDIO MOCKUP ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 w-full max-w-2xl mx-auto"
          >
            {/* App Window Container */}
            <div className="rounded-xl border border-slate-300/90 bg-white shadow-xl shadow-slate-200/60 overflow-hidden ring-1 ring-slate-900/5">

              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-400">
                {/* Window Dots */}
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]/90" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]/90" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]/90" />
                  <span className="ml-2 hidden sm:inline text-[11px] font-mono text-slate-400">
                    codexel-studio // preview
                  </span>
                </div>

                {/* Viewport Switcher Controls */}
                <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setActiveViewport("desktop")}
                    className={`p-1.5 rounded text-[11px] transition-colors ${activeViewport === "desktop"
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-400 hover:text-slate-200"
                      }`}
                    title="Desktop Preview"
                    aria-label="Desktop Preview"
                  >
                    <FaDesktop />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewport("tablet")}
                    className={`p-1.5 rounded text-[11px] transition-colors ${activeViewport === "tablet"
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-400 hover:text-slate-200"
                      }`}
                    title="Tablet Preview"
                    aria-label="Tablet Preview"
                  >
                    <FaTabletAlt />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewport("mobile")}
                    className={`p-1.5 rounded text-[11px] transition-colors ${activeViewport === "mobile"
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-400 hover:text-slate-200"
                      }`}
                    title="Mobile Preview"
                    aria-label="Mobile Preview"
                  >
                    <FaMobileAlt />
                  </button>
                </div>

                {/* Interactive Mode Toggle: Visual Canvas vs Generated Code */}
                <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setActiveTab("canvas")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${activeTab === "canvas"
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    <FaLaptopCode className="text-[11px]" />
                    <span className="hidden sm:inline">Visual</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("code")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${activeTab === "code"
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    <FaCode className="text-[11px]" />
                    <span className="hidden sm:inline">Clean Code</span>
                  </button>
                </div>
              </div>

              {/* Window Body (Interactive Preview) */}
              <div className="h-[360px] sm:h-[400px] bg-slate-50 relative overflow-hidden flex">

                {/* MODE 1: VISUAL STUDIO CANVAS */}
                {activeTab === "canvas" && (
                  <div className="w-full h-full flex">
                    {/* Mini Component Palette (Left Sidebar) */}
                    <div className="hidden sm:flex w-36 flex-col bg-slate-900 border-r border-slate-800 p-2.5 shrink-0 text-slate-300">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Components
                        </span>
                        <FaLayerGroup className="text-[10px] text-blue-400" />
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-slate-800/90 text-white border border-slate-700/60 text-[11px] font-medium shadow-2xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          Navbar
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/40 text-[11px] font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          Hero Section
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-slate-800/90 text-white border border-slate-700/60 text-[11px] font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Feature Grid
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-slate-800/90 text-white border border-slate-700/60 text-[11px] font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Call To Action
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-slate-800/90 text-white border border-slate-700/60 text-[11px] font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Footer
                        </div>
                      </div>
                    </div>

                    {/* Canvas Stage */}
                    <div className="flex-1 bg-slate-100 p-3 sm:p-4 overflow-auto flex items-center justify-center">
                      {/* Responsive Artboard simulation */}
                      <div
                        className={`bg-white rounded-lg border border-slate-200 shadow-sm transition-all duration-300 p-4 relative ${activeViewport === "desktop"
                            ? "w-full max-w-md"
                            : activeViewport === "tablet"
                              ? "w-72"
                              : "w-52"
                          }`}
                      >
                        {/* Active Component Selection Box */}
                        <div className="border-2 border-blue-500 rounded-md p-3 relative bg-blue-50/20">
                          {/* Selection Tag Pill */}
                          <div className="absolute -top-2.5 left-2 bg-blue-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shadow-2xs">
                            Hero // selected
                          </div>

                          {/* Rendered Component Content */}
                          <div className="text-center">
                            <span className="inline-block text-[9px] font-semibold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-full mb-1">
                              Visual Editor
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                              Modern Landing Page
                            </h4>
                            <p className="mt-1 text-[10px] text-slate-500 line-clamp-2">
                              Build and customize layout sections directly in real-time.
                            </p>
                            <div className="mt-2.5 flex items-center justify-center gap-1.5">
                              <span className="h-5 px-2.5 rounded bg-blue-600 text-[10px] font-medium text-white flex items-center">
                                Get Started
                              </span>
                              <span className="h-5 px-2 rounded border border-slate-200 text-[10px] font-medium text-slate-700 flex items-center">
                                Learn More
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Secondary Mock Component below */}
                        <div className="mt-3 p-2 border border-dashed border-slate-300 rounded text-center">
                          <span className="text-[10px] font-medium text-slate-400">
                            + Drop Feature Cards here
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mini Properties Inspector (Right Sidebar) */}
                    <div className="hidden md:flex w-40 flex-col bg-white border-l border-slate-200 p-2.5 shrink-0 text-slate-700">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Properties
                        </span>
                        <FaSlidersH className="text-[10px] text-blue-600" />
                      </div>

                      <div className="space-y-2.5 text-[11px]">
                        <div>
                          <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">
                            ALIGNMENT
                          </label>
                          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded text-center text-[9px] font-medium">
                            <span className="py-0.5">L</span>
                            <span className="py-0.5 bg-white text-blue-600 rounded shadow-2xs font-bold">C</span>
                            <span className="py-0.5">R</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">
                            PADDING Y
                          </label>
                          <div className="h-5 bg-slate-100 rounded px-1.5 flex items-center justify-between text-[10px] font-mono text-slate-600">
                            <span>py-16</span>
                            <span className="text-slate-400">64px</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">
                            ACCENT COLOR
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="h-4 w-4 rounded-full bg-blue-600 border border-slate-200 shrink-0" />
                            <span className="text-[10px] font-mono text-slate-600">#2563EB</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">
                            BORDER RADIUS
                          </label>
                          <div className="h-5 bg-slate-100 rounded px-1.5 flex items-center justify-between text-[10px] font-mono text-slate-600">
                            <span>rounded-lg</span>
                            <span className="text-slate-400">8px</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 2: GENERATED PRODUCTION CODE */}
                {activeTab === "code" && (
                  <div className="w-full h-full bg-[#0d1117] text-slate-200 p-4 font-mono text-xs overflow-auto select-text leading-relaxed">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        React 19 + Tailwind CSS Ready
                      </span>
                      <span className="text-slate-500">Zero Dependencies</span>
                    </div>

                    <pre className="text-[11px] sm:text-xs">
                      <code>
                        <span className="text-purple-400">import</span> React{" "}
                        <span className="text-purple-400">from</span>{" "}
                        <span className="text-emerald-300">"react"</span>;{"\n\n"}
                        <span className="text-blue-400">export default function</span>{" "}
                        <span className="text-yellow-300">HeroSection</span>() {"{\n"}
                        {"  "}<span className="text-blue-400">return</span> ({"\n"}
                        {"    "}&lt;<span className="text-red-400">section</span>{" "}
                        <span className="text-sky-300">className</span>=
                        <span className="text-emerald-300">
                          "py-20 bg-white border-b border-slate-200"
                        </span>
                        &gt;{"\n"}
                        {"      "}&lt;<span className="text-red-400">div</span>{" "}
                        <span className="text-sky-300">className</span>=
                        <span className="text-emerald-300">
                          "max-w-5xl mx-auto px-4 text-center"
                        </span>
                        &gt;{"\n"}
                        {"        "}&lt;<span className="text-red-400">h1</span>{" "}
                        <span className="text-sky-300">className</span>=
                        <span className="text-emerald-300">
                          "text-5xl font-extrabold text-slate-900"
                        </span>
                        &gt;{"\n"}
                        {"          "}Built Visually, Exported Clean{"\n"}
                        {"        "}&lt;/<span className="text-red-400">h1</span>&gt;{"\n"}
                        {"        "}&lt;<span className="text-red-400">button</span>{" "}
                        <span className="text-sky-300">className</span>=
                        <span className="text-emerald-300">
                          "mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
                        </span>
                        &gt;{"\n"}
                        {"          "}Start Now{"\n"}
                        {"        "}&lt;/<span className="text-red-400">button</span>&gt;{"\n"}
                        {"      "}&lt;/<span className="text-red-400">div</span>&gt;{"\n"}
                        {"    "}&lt;/<span className="text-red-400">section</span>&gt;{"\n"}
                        {"  "});{"\n"}
                        {"}"}
                      </code>
                    </pre>
                  </div>
                )}

              </div>

              {/* Window Footer Statusbar */}
              <div className="px-4 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live Sync Active
                </span>
                <span>Ready to Export</span>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Hero;