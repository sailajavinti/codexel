import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { getCurrentUser } from "../services/authService";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const data = await getCurrentUser();
        console.log("Current user:", data);
      } catch (error) {
        console.log("Authentication failed:", error);
      }
    };

    checkUser();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Subtle Technical Dot Grid Background */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-70"
        aria-hidden="true"
      />

      {/* Soft Ambient Radial Light */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-50/70 blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group"
            aria-label="CodeXel Home"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-blue-600 text-white shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <img
                src="/codexel.jpeg"
                alt="CodeXel Logo"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Code<span className="text-blue-600">Xel</span>
            </span>
          </Link>
        </div>

        {/* Elevated Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50"
        >
          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg mb-6 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-2 rounded-md transition-all duration-150 ${isLogin
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "hover:text-slate-900"
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-2 rounded-md transition-all duration-150 ${!isLogin
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "hover:text-slate-900"
                }`}
            >
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{
                opacity: 0,
                x: isLogin ? -10 : 10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: isLogin ? 10 : -10,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              {isLogin ? (
                <LoginForm setIsLogin={setIsLogin} />
              ) : (
                <SignupForm setIsLogin={setIsLogin} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Security / Open Standard footer note */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Encrypted authentication • Standard JWT session management
        </p>
      </div>
    </div>
  );
}

export default Auth;