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
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >

          <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
            Features
          </span>

          <h2 className="text-5xl font-bold mt-6 text-slate-900">
            Everything You Need
          </h2>

          <p className="text-gray-600 mt-5 max-w-2xl mx-auto text-lg">
            CodeXel provides all the tools required to design modern,
            responsive websites and generate clean code effortlessly.
          </p>

        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              className="group bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300"
            >

              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">

                {feature.icon}

              </div>

              <h3 className="text-2xl font-semibold mt-6 text-slate-800">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
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