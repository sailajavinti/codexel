import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
} from "react-icons/fa";

function SignupForm({ setIsLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div>

      {/* Heading */}

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-slate-800">
          Create Account 🚀
        </h2>

        <p className="text-gray-500 mt-2">
          Start building amazing websites with CodeXel.
        </p>

      </div>

      <form className="space-y-5">

        {/* Full Name */}

        <div className="relative">

          <FaUser
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

        </div>

        {/* Email */}

        <div className="relative">

          <FaEnvelope
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

        </div>

        {/* Password */}

        <div className="relative">

          <FaLock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-12 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

        {/* Confirm Password */}

        <div className="relative">

          <FaLock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-12 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

        {/* Terms */}

        <label className="flex items-start gap-3 text-sm text-gray-600">

          <input
            type="checkbox"
            className="mt-1 accent-blue-600"
          />

          <span>
            I agree to the{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
            >
              Terms & Conditions
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </button>
          </span>

        </label>

        {/* Signup Button */}

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300"
        >
          Create Account
        </button>

      </form>

      {/* Divider */}

      <div className="flex items-center gap-4 my-8">

        <div className="flex-1 h-px bg-gray-300"></div>

        <span className="text-sm text-gray-500">
          OR SIGN UP WITH
        </span>

        <div className="flex-1 h-px bg-gray-300"></div>

      </div>

      {/* Social Signup */}

      <div className="grid grid-cols-2 gap-4">

        <button
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 transition hover:bg-gray-100"
        >
          <FaGoogle className="text-red-500" />
          Google
        </button>

        <button
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 transition hover:bg-gray-100"
        >
          <FaGithub />
          GitHub
        </button>

      </div>

      {/* Bottom */}

      <p className="mt-8 text-center text-gray-600">

        Already have an account?{" "}

        <button
          onClick={() => setIsLogin(true)}
          className="font-semibold text-blue-600 hover:underline"
        >
          Login
        </button>

      </p>

    </div>
  );
}

export default SignupForm;