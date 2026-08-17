import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-100 flex items-center justify-center px-6 py-10">

      {/* Background Blobs */}

      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/60 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-200/60 blur-3xl"></div>

      {/* Auth Card */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md lg:max-w-lg rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
      >
        <AnimatePresence mode="wait">

          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{
              opacity: 0,
              x: isLogin ? -15 : 15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: isLogin ? 15 : -15,
            }}
            transition={{
              duration: 0.25,
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

    </div>
  );
}

export default Auth;