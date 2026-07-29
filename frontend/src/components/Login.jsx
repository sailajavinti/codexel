import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Login() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

      {/* Background Glow */}
      <div className="absolute w-80 h-80 bg-blue-500 rounded-full blur-[120px] opacity-30 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-600 rounded-full blur-[120px] opacity-30 bottom-10 right-10"></div>

      {/* Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >

        {/* Logo */}
        <h1 className="text-center text-4xl font-extrabold text-blue-400 tracking-wider">
          CODEXEL
        </h1>

        <p className="text-center text-gray-300 mt-2 mb-8">
          Welcome Back 👋
        </p>

        {/* Email */}
        <div className="flex items-center bg-white/10 rounded-xl px-4 py-3 mb-5 border border-white/10">

          <FaEnvelope className="text-blue-400 mr-3" />

          <input
            type="email"
            placeholder="Email Address"
            className="bg-transparent outline-none text-white placeholder-gray-400 flex-1"
          />

        </div>

        {/* Password */}
        <div className="flex items-center bg-white/10 rounded-xl px-4 py-3 border border-white/10">

          <FaLock className="text-blue-400 mr-3" />

          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="bg-transparent outline-none text-white placeholder-gray-400 flex-1"
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-gray-300 hover:text-blue-400"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

        {/* Forgot Password */}
        <div className="text-right mt-3">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          className="
            w-full
            mt-8
            py-3
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            font-semibold
            text-white
            hover:scale-105
            transition
            duration-300
            shadow-lg
          "
        >
          Login
        </button>

        {/* Signup */}
        <div className="mt-6 text-center text-gray-300">

          Don't have an account?{" "}

          <Link
            to="/login"
            className="text-blue-400 font-semibold hover:text-blue-300"
          >
            Signup
          </Link>

        </div>

      </motion.div>

    </div>
  );
}

export default Login;