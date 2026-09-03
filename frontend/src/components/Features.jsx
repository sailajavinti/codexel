import { motion } from "framer-motion";
import {
  FaMousePointer,
  FaCode,
  FaCloudUploadAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaMousePointer className="text-2xl sm:text-[28px]" />,
    title: "Drag & Drop Builder",
    description:
      "Design beautiful websites visually without writing repetitive code.",
  },
  {
    icon: <FaCode className="text-2xl sm:text-[28px]" />,
    title: "Clean Code Export",
    description:
      "Export production-ready HTML, CSS, React and Tailwind instantly.",
  },
  {
    icon: <FaCloudUploadAlt className="text-2xl sm:text-[28px]" />,
    title: "Cloud Projects",
    description:
      "Save, manage and continue your projects anytime from anywhere.",
  },
];

function Features() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Everything You Need
          </h2>

          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
            CodeXel provides all the tools required to design modern,
            responsive websites and generate clean code effortlessly.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -6,
              }}
              className={`group rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-xl ${
                index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-100 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                {feature.icon}
              </div>

              <h3 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-2.5 sm:mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;