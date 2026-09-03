import { motion } from "framer-motion";
import {
  FaBullseye,
  FaEye,
  FaCode,
  FaRobot,
  FaPaintBrush,
  FaRocket,
} from "react-icons/fa";

function AboutContent() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Why We Built CodeXel
          </h2>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
            Building modern websites often requires switching between design
            tools, code editors, and multiple frameworks. This process is
            time-consuming, repetitive, and difficult for beginners.
          </p>
          <p className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
            CodeXel was created to bridge the gap between design and development.
            With a visual interface, AI assistance, and clean code generation,
            anyone can build responsive websites faster without compromising
            quality.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 sm:mt-14 lg:mt-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-100 text-xl sm:text-2xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <FaBullseye />
            </div>

            <h3 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-semibold text-slate-900">
              Our Mission
            </h3>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
              To simplify website development through visual design, intelligent
              automation and production-ready code generation, enabling creators
              to build faster with confidence.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-100 text-xl sm:text-2xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <FaEye />
            </div>

            <h3 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-semibold text-slate-900">
              Our Vision
            </h3>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
              To become the leading AI-powered visual website builder that
              transforms ideas into professional websites with speed, simplicity
              and innovation.
            </p>
          </motion.div>
        </div>

        {/* ================ Why CodeXel Features ================= */}
        <div className="mt-14 sm:mt-18 lg:mt-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Everything You Need To Build Faster
            </h2>

            <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              Powerful features that simplify website development while keeping
              your workflow fast and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 sm:mt-10">
            {[
              {
                icon: <FaPaintBrush />,
                title: "Visual Builder",
                desc: "Design websites with an intuitive drag & drop interface.",
              },
              {
                icon: <FaCode />,
                title: "Clean Code",
                desc: "Generate readable React, HTML, CSS and Tailwind code.",
              },
              {
                icon: <FaRobot />,
                title: "AI Powered",
                desc: "Generate layouts and sections using intelligent AI.",
              },
              {
                icon: <FaRocket />,
                title: "Fast Workflow",
                desc: "Reduce development time from hours to minutes.",
              },
            ].map((item, index) => (
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
                className="group rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-100 text-xl sm:text-2xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  {item.icon}
                </div>

                <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= Technology Stack ================= */}
        <div className="mt-14 sm:mt-18 lg:mt-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Built With Modern Technologies
            </h2>

            <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              CodeXel is powered by modern tools focused on performance,
              scalability and developer experience.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-2.5 sm:gap-3.5 max-w-4xl mx-auto">
            {[
              "React",
              "Tailwind CSS",
              "Framer Motion",
              "Node.js",
              "Express",
              "MongoDB",
              "Firebase",
              "OpenAI API",
              "Cloudinary",
              "JWT",
            ].map((tech) => (
              <div
                key={tech}
                className="rounded-full border border-gray-200 bg-white px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 transition duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white cursor-default"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* ================= Values ================= */}
        <div className="mt-14 sm:mt-18 lg:mt-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              What Drives CodeXel
            </h2>

            <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              These values guide every feature we build and every experience we
              create for our users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 sm:mt-10">
            {[
              {
                title: "Innovation",
                desc: "We continuously explore new technologies and ideas to simplify modern web development.",
              },
              {
                title: "Simplicity",
                desc: "Powerful tools should remain intuitive, clean and easy for everyone to use.",
              },
              {
                title: "Quality",
                desc: "Every generated website should be responsive, maintainable and production-ready.",
              },
            ].map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
                  {val.title}
                </h3>

                <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutContent;