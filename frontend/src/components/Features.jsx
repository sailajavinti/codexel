import { motion } from "framer-motion";
import {
  FaMousePointer,
  FaCode,
  FaCloudUploadAlt,
  FaMobileAlt,
  FaSlidersH,
  FaDownload,
} from "react-icons/fa";

const features = [
  {
    icon: <FaMousePointer className="text-xl sm:text-2xl" />,
    title: "Visual Drag & Drop Engine",
    description:
      "Assemble responsive websites with pre-styled modular UI components. Drag, reorder, and position elements with immediate canvas feedback.",
    badge: "11+ Modular Blocks",
  },
  {
    icon: <FaCode className="text-xl sm:text-2xl" />,
    title: "Multi-Format Clean Code Export",
    description:
      "Export human-readable React 19 JSX, semantic HTML5, and utility Tailwind CSS code instantly. Zero boilerplate and zero messy generated markup.",
    badge: "React 19 & Tailwind",
  },
  {
    icon: <FaMobileAlt className="text-xl sm:text-2xl" />,
    title: "Live Responsive Viewports",
    description:
      "Test responsive layouts dynamically. Toggle between Desktop (1200px), Tablet (768px), and Mobile (375px) device canvases directly in the studio.",
    badge: "Mobile-First Design",
  },
  {
    icon: <FaSlidersH className="text-xl sm:text-2xl" />,
    title: "Precision Property Inspector",
    description:
      "Customize typography, color palettes, spacing margins, border radiuses, and layout alignments with granular visual controls.",
    badge: "Granular Styling",
  },
  {
    icon: <FaCloudUploadAlt className="text-xl sm:text-2xl" />,
    title: "Cloud Project Management",
    description:
      "Save, manage, rename, and restore projects seamlessly in the cloud. Access your design workspace and draft history from anywhere.",
    badge: "Cloud Storage",
  },
  {
    icon: <FaDownload className="text-xl sm:text-2xl" />,
    title: "Zero-Lockin ZIP Export",
    description:
      "Download your entire generated website project packaged as a ready-to-run ZIP archive. Deploy to Vercel, Netlify, or GitHub Pages with ease.",
    badge: "Standalone Bundle",
  },
];

function Features() {
  return (
    <section className="bg-slate-50/70 border-b border-slate-200/80 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-2xs">
            Capabilities
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Engineered for modern visual web development
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            CodeXel delivers the visual intuition of a design tool combined with the
            code precision and flexibility required by professional front-end developers.
          </p>
        </motion.div>

        {/* 6-Pillar Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              whileHover={{ y: -3 }}
              className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div>
                {/* Icon & Badge Header */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100/80 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                    {feature.icon}
                  </div>

                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                    {feature.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Subtle Status */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform duration-150">
                <span>Explore capability &rarr;</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;