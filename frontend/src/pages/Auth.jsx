import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCode,
  FaRocket,
  FaMagic,
} from "react-icons/fa";

import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 flex items-center justify-center px-6 py-10">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2"
      >

        {/* ================= LEFT PANEL ================= */}

        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white p-12">

          <div>

            <h1 className="text-5xl font-extrabold tracking-wide">
              CodeXel
            </h1>

            <p className="mt-6 text-xl leading-8 text-blue-100">
              Build websites visually.
              <br />
              Generate clean production-ready code.
            </p>

          </div>

          <div className="space-y-8">

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaRocket size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Drag & Drop Builder
                </h3>

                <p className="text-blue-100 text-sm mt-1">
                  Create beautiful websites without writing repetitive code.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaCode size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Clean Code Export
                </h3>

                <p className="text-blue-100 text-sm mt-1">
                  Export HTML, CSS, React and Tailwind in seconds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaMagic size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  AI Powered
                </h3>

                <p className="text-blue-100 text-sm mt-1">
                  Generate complete websites using simple prompts.
                </p>
              </div>
            </div>

          </div>

          <div className="text-sm text-blue-200">
            © 2026 CodeXel. All Rights Reserved.
          </div>

        </div>

        {/* ================= RIGHT PANEL ================= */}

        <div className="flex items-center justify-center bg-white">

          <div className="w-full max-w-md p-8">

            {/* Mobile Logo */}

            <div className="lg:hidden text-center mb-8">

              <h1 className="text-4xl font-bold text-blue-600">
                CodeXel
              </h1>

              <p className="text-gray-500 mt-2">
                Build Websites Visually
              </p>

            </div>

            {/* Toggle */}

            <div className="relative flex bg-gray-100 rounded-xl p-1 mb-8">

              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-blue-600 ${
                  isLogin ? "left-1" : "left-1/2"
                }`}
              />

              <button
                onClick={() => setIsLogin(true)}
                className={`relative z-10 w-1/2 py-3 font-semibold transition ${
                  isLogin
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`relative z-10 w-1/2 py-3 font-semibold transition ${
                  !isLogin
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                Sign Up
              </button>

            </div>

            {/* Forms */}

            <AnimatePresence mode="wait">

              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{
                  opacity: 0,
                  x: isLogin ? -40 : 40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: isLogin ? 40 : -40,
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                {isLogin ? (
                  <LoginForm setIsLogin={setIsLogin} />
                ) : (
                  <SignupForm setIsLogin={setIsLogin} />
                )}
              </motion.div>

            </AnimatePresence>

          </div>

        </div>

      </motion.div>

    </div>
  );
}

export default Auth;