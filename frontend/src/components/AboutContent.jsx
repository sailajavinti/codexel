import { motion } from "framer-motion";
import {
  FaBullseye,
  FaEye,
  FaCode,
  FaRobot,
  FaPaintBrush,
  FaRocket,
  FaArrowRight,
  FaServer,
  FaBrain,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const techCategories = [
  {
    category: "Front-End & Styling",
    icon: <FaPaintBrush className="text-xs text-blue-600" />,
    items: ["React", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend & Database",
    icon: <FaServer className="text-xs text-indigo-600" />,
    items: ["Node.js", "Express", "MongoDB"],
  },
  {
    category: "Cloud, Auth & AI",
    icon: <FaBrain className="text-xs text-purple-600" />,
    items: ["Firebase", "OpenAI API", "Cloudinary", "JWT"],
  },
];

const pillars = [
  {
    icon: <FaPaintBrush className="text-xl sm:text-2xl" />,
    title: "Visual Builder",
    description:
      "Design websites with an intuitive drag-and-drop interface and instant canvas feedback.",
    badge: "Intuitive Canvas",
  },
  {
    icon: <FaCode className="text-xl sm:text-2xl" />,
    title: "Clean Code First",
    description:
      "Generate clean, readable React 19, standard HTML5, CSS3, and utility Tailwind code.",
    badge: "Production Ready",
  },
  {
    icon: <FaRocket className="text-xl sm:text-2xl" />,
    title: "Fast Workflow",
    description:
      "Reduce front-end development cycles from hours to minutes with zero boilerplate.",
    badge: "Zero Setup",
  },
];

const values = [
  {
    title: "Innovation",
    description:
      "We continuously explore new technologies and ideas to simplify modern web development.",
    detail: "Pushing the boundaries of visual compilation and automated design workflows.",
  },
  {
    title: "Simplicity",
    description:
      "Powerful tools should remain intuitive, clean, and easy for every creator to use.",
    detail: "Refined interfaces that get out of your way and let you build faster.",
  },
  {
    title: "Quality",
    description:
      "Every generated website should be responsive, maintainable, and production-ready.",
    detail: "Clean semantic markup and modern standards with zero compromise.",
  },
];

function AboutContent() {
  return (
    <div className="bg-white">

      {/* ================= SECTION 1: WHY WE BUILT CODEXEL ================= */}
      <section className="py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
          >

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Why We Built CodeXel
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              Building modern websites often requires switching between design tools, code editors, and multiple frameworks. This process is time-consuming, repetitive, and difficult for beginners.
            </p>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              CodeXel was created to bridge the gap between design and development. With a visual interface, AI assistance, and clean code generation, anyone can build responsive websites faster without compromising quality.
            </p>
          </motion.div>

          {/* Mission & Vision Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-8 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100/80 mb-5 shadow-2xs">
                  <FaBullseye className="text-xl" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Our Mission
                </h3>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                  To simplify website development through visual design, intelligent automation, and production-ready code generation, enabling creators to build faster with confidence.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-blue-600">
                <FaCheckCircle className="text-blue-500" />
                <span>Democratizing front-end velocity</span>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-8 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100/80 mb-5 shadow-2xs">
                  <FaEye className="text-xl" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Our Vision
                </h3>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                  To become the leading AI-powered visual website builder that transforms ideas into professional websites with speed, simplicity, and innovation.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                <FaCheckCircle className="text-indigo-500" />
                <span>Next-generation web tooling</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 2: EVERYTHING YOU NEED TO BUILD FASTER ================= */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Everything You Need To Build Faster
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              Powerful features that simplify website development while keeping your workflow fast and efficient.
            </p>
          </motion.div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {pillars.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -3 }}
                className="group rounded-xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100/80 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      {item.icon}
                    </div>

                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= SECTION 3: WHAT DRIVES CODEXEL (VALUES) ================= */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              What Drives CodeXel
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              These values guide every feature we build and every experience we create for our users.
            </p>
          </motion.div>

          {/* 3 Values Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {values.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
                className="group rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 mb-4 inline-block">
                    0{idx + 1}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {val.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                    {val.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  {val.detail}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}

export default AboutContent;