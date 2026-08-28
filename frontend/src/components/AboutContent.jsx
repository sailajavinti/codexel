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
    <section className="bg-white py-16">

      <div className="max-w-7xl mx-auto px-6 lg:px-4">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >

          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-slate-900">
            Why We Built CodeXel
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Building modern websites often requires switching between
            design tools, code editors, and multiple frameworks.
            This process is time-consuming, repetitive, and difficult
            for beginners.

            <br /><br />

            CodeXel was created to bridge the gap between design
            and development. With a visual interface, AI assistance,
            and clean code generation, anyone can build responsive
            websites faster without compromising quality.

          </p>

        </motion.div>


        <div className="grid md:grid-cols-2 gap-6 mt-16">

          {/* Mission */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

              <FaBullseye />

            </div>

            <h3 className="mt-5 text-2xl font-semibold text-slate-900">

              Our Mission

            </h3>

            <p className="mt-3 leading-7 text-gray-600">

              To simplify website development through visual design,
              intelligent automation and production-ready code generation,
              enabling creators to build faster with confidence.

            </p>

          </motion.div>

          {/* Vision */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

              <FaEye />

            </div>

            <h3 className="mt-5 text-2xl font-semibold text-slate-900">

              Our Vision

            </h3>

            <p className="mt-3 leading-7 text-gray-600">

              To become the leading AI-powered visual website builder
              that transforms ideas into professional websites with
              speed, simplicity and innovation.

            </p>

          </motion.div>

        </div>

        {/* ================= WHY CODEXEL ================= */}

        <div className="mt-16">

          <div className="text-center">


            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-slate-900">
              Everything You Need To Build Faster
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              Powerful features that simplify website development while
              keeping your workflow fast and efficient.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-10">

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
                className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

                  {item.icon}

                </div>

                <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {item.desc}
                </p>

              </motion.div>

            ))}

          </div>

        </div>

        {/* ================= TECHNOLOGY STACK ================= */}

        <div className="mt-16">

          <div className="text-center">


            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-slate-900">
              Built With Modern Technologies
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              CodeXel is powered by modern tools focused on performance,
              scalability and developer experience.
            </p>

          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

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
                className="rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                {tech}
              </div>

            ))}

          </div>

        </div>

        {/* ================= VALUES ================= */}

        <div className="mt-16">

          <div className="text-center">


            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-slate-900">
              What Drives CodeXel
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              These values guide every feature we build and every experience we
              create for our users.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-3 mt-10">

            {/* Innovation */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
            >


              <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                Innovation
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We continuously explore new technologies and ideas to simplify
                modern web development.
              </p>

            </motion.div>

            {/* Simplicity */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
            >


              <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                Simplicity
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Powerful tools should remain intuitive, clean and easy for
                everyone to use.
              </p>

            </motion.div>

            {/* Quality */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
            >


              <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                Quality
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Every generated website should be responsive, maintainable and
                production-ready.
              </p>

            </motion.div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default AboutContent;