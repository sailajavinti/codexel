import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
} from "react-icons/fa";

import { loginUser } from "../services/authService";

function LoginForm({ setIsLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      // Store JWT
      localStorage.setItem("token", data.token);

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Move to Build page
      navigate("/build");

    } catch (error) {

      if (error.response) {
        setError(
          error.response.data.message || "Login failed"
        );
      } else {
        setError(
          "Unable to connect to the server"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 mt-2">
          Sign in to continue building amazing websites.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Email */}

        <div className="relative">

          <FaEnvelope
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-12 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

        {/* Error */}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Remember */}

        <div className="flex items-center justify-between text-sm">

          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">

            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />

            Remember me

          </label>

          <button
            type="button"
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>

        </div>

        {/* Login */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      {/* Divider */}

      <div className="flex items-center gap-4 my-8">

        <div className="h-px flex-1 bg-gray-300"></div>

        <span className="text-sm text-gray-500">
          OR CONTINUE WITH
        </span>

        <div className="h-px flex-1 bg-gray-300"></div>

      </div>

      {/* Social Login */}

      <div className="grid grid-cols-2 gap-4">

        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 transition hover:bg-gray-100"
        >
          <FaGoogle className="text-red-500" />
          Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 transition hover:bg-gray-100"
        >
          <FaGithub />
          GitHub
        </button>

      </div>

      {/* Bottom */}

      <p className="mt-8 text-center text-gray-600">

        Don't have an account?{" "}

        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign Up
        </button>

      </p>

    </div>
  );
}

export default LoginForm;