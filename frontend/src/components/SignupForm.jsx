import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
} from "react-icons/fa";

import { signupUser } from "../services/authService";

function SignupForm({ setIsLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms
    if (!agreeTerms) {
      newErrors.terms = "Please agree to the Terms & Conditions";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Stop if validation fails
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = await signupUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Store JWT
      localStorage.setItem("token", data.token);

      // Store user information
      localStorage.setItem("user", JSON.stringify(data.user));

      // Move to Build page
      navigate("/build");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Signup failed");
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-1 sm:px-0">
      {/* Heading */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
          Create Account 🚀
        </h2>

        <p className="text-gray-500 mt-1.5 sm:mt-2 text-sm sm:text-base">
          Start building amazing websites with CodeXel.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Full Name */}
        <div>
          <div className="relative">
            <FaUser
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base ${
                errors.name ? "text-red-400" : "text-gray-400"
              }`}
            />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);

                if (errors.name) {
                  setErrors((prev) => ({
                    ...prev,
                    name: "",
                  }));
                }

                setError("");
              }}
              className={`w-full rounded-xl border bg-white py-2.5 sm:py-3 pl-11 sm:pl-12 pr-4 text-sm sm:text-base outline-none transition-all duration-200 focus:ring-4 ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.name && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <FaEnvelope
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base ${
                errors.email ? "text-red-400" : "text-gray-400"
              }`}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }

                setError("");
              }}
              className={`w-full rounded-xl border bg-white py-2.5 sm:py-3 pl-11 sm:pl-12 pr-4 text-sm sm:text-base outline-none transition-all duration-200 focus:ring-4 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <FaLock
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base ${
                errors.password ? "text-red-400" : "text-gray-400"
              }`}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }

                setError("");
              }}
              className={`w-full rounded-xl border bg-white py-2.5 sm:py-3 pl-11 sm:pl-12 pr-11 sm:pr-12 text-sm sm:text-base outline-none transition-all duration-200 focus:ring-4 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 p-1 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="text-sm sm:text-base" />
              ) : (
                <FaEye className="text-sm sm:text-base" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <FaLock
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base ${
                errors.confirmPassword ? "text-red-400" : "text-gray-400"
              }`}
            />

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);

                if (errors.confirmPassword) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                  }));
                }

                setError("");
              }}
              className={`w-full rounded-xl border bg-white py-2.5 sm:py-3 pl-11 sm:pl-12 pr-11 sm:pr-12 text-sm sm:text-base outline-none transition-all duration-200 focus:ring-4 ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 p-1 focus:outline-none"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <FaEyeSlash className="text-sm sm:text-base" />
              ) : (
                <FaEye className="text-sm sm:text-base" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms */}
        <div>
          <label className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 cursor-pointer select-none leading-5 sm:leading-6">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);

                if (errors.terms) {
                  setErrors((prev) => ({
                    ...prev,
                    terms: "",
                  }));
                }

                setError("");
              }}
              className="mt-0.5 sm:mt-1 h-4 w-4 rounded border-gray-300 accent-blue-600 focus:ring-blue-500"
            />

            <span>
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline inline"
              >
                Terms & Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline inline"
              >
                Privacy Policy
              </button>
            </span>
          </label>

          {errors.terms && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">
              {errors.terms}
            </p>
          )}
        </div>

        {/* Server Error */}
        {error && (
          <p className="rounded-lg bg-red-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 sm:py-3.5 text-sm sm:text-base text-white font-semibold shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 sm:gap-4 my-6 sm:my-8">
        <div className="flex-1 h-px bg-gray-200 sm:bg-gray-300"></div>
        <span className="text-[11px] sm:text-xs tracking-wider text-gray-400 sm:text-gray-500 font-medium">
          OR SIGN UP WITH
        </span>
        <div className="flex-1 h-px bg-gray-200 sm:bg-gray-300"></div>
      </div>

      {/* Social Signup */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 sm:gap-3 rounded-xl border border-gray-300 bg-white py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99]"
        >
          <FaGoogle className="text-red-500 text-sm sm:text-base" />
          Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2.5 sm:gap-3 rounded-xl border border-gray-300 bg-white py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99]"
        >
          <FaGithub className="text-sm sm:text-base" />
          GitHub
        </button>
      </div>

      {/* Bottom */}
      <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="font-semibold text-blue-600 hover:underline transition focus:outline-none"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default SignupForm;