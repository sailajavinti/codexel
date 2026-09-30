import { motion } from "framer-motion";
import { FaPuzzlePiece, FaPalette, FaCodeBranch } from "react-icons/fa";

const steps = [
  {
    step: "01",
    icon: <FaPuzzlePiece className="text-xl" />,
    title: "Compose Visually",
    description:
      "Select and assemble battle-tested front-end sections including Navbars, Heroes, Feature grids, Testimonials, Pricing tables, and FAQs onto your canvas.",
  },
  {
    step: "02",
    icon: <FaPalette className="text-xl" />,
    title: "Customize & Fine-Tune",
    description:
      "Inspect and tweak typography, color schemes, spacing dimensions, borders, and responsive alignments in real-time with instant canvas updates.",
  },
  {
    step: "03",
    icon: <FaCodeBranch className="text-xl" />,
    title: "Export & Ship Instantly",
    description:
      "Generate clean, dependency-free React 19 JSX, standard HTML5, and utility Tailwind CSS. Copy individual snippets or download the entire project bundle.",
  },
];

function WorkflowSection() {
  return (
    <section className="bg-white border-b border-slate-200/80 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-2xs">
            Workflow
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            From canvas to clean code in three steps
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            Skip boilerplate setup and repetitive UI coding. CodeXel accelerates your
            front-end development workflow from concept to deployable code.
          </p>
        </motion.div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative rounded-xl border border-slate-200/90 bg-slate-50/60 p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {item.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WorkflowSection;

