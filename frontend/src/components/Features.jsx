import { motion } from "framer-motion";
import {
  FaMousePointer,
  FaCode,
  FaCloudUploadAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaMousePointer size={28} />,
    title: "Drag & Drop Builder",
    description:
      "Design beautiful websites visually without writing repetitive code.",
  },
  {
    icon: <FaCode size={28} />,
    title: "Clean Code Export",
    description:
      "Export production-ready HTML, CSS, React and Tailwind instantly.",
  },
  {
    icon: <FaCloudUploadAlt size={28} />,
    title: "Cloud Projects",
    description:
      "Save, manage and continue your projects anytime from anywhere.",
  },
];

function Features() {
  return (
    <section className="bg-slate-50 py-16 lg:py-20">

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >

          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-slate-900">
            Everything You Need
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            CodeXel provides all the tools required to design modern,
            responsive websites and generate clean code effortlessly.
          </p>

        </motion.div>

        {/* Cards */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
              }}
              whileHover={{
                y: -6,
              }}
              className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl"
            >

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

                {feature.icon}

              </div>

              <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
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