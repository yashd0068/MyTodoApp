import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GoogleLoginButton from "./GoogleLoginButton";
import { motion } from "framer-motion";
import "remixicon/fonts/remixicon.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Signed in successfully");
        navigate("/home");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">

          {/* LEFT: Premium Brand + Dashboard Preview – Hidden on small mobile */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="hidden sm:flex flex-col items-start order-2 lg:order-1"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
              Todo<span className="text-indigo-600">Pro</span>
            </h1>

            <motion.div
              whileHover={{ y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-3xl border border-gray-200/60 bg-white/70 backdrop-blur-xl p-8 md:p-12 shadow-2xl"
            >
              <img
                src="https://www.uidux.com/uploads/components/project-managment-app-dashboard-ui-1673041555.png"
                alt="TodoPro premium dashboard preview"
                className="w-full rounded-2xl shadow-inner"
              />
            </motion.div>

            <div className="mt-12 space-y-4 text-left">
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                The calm way to get work done.
              </p>
              <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed">
                Join thousands of focused teams and individuals who choose clarity over chaos.
              </p>
            </div>
          </motion.div>

          {/* RIGHT: Clean Auth Form – Always visible, prioritized on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 lg:order-2 w-full max-w-md mx-auto"
          >
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Welcome back
              </h2>
              <p className="mt-4 text-base sm:text-lg text-gray-600">
                Sign in to continue where you left off.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="
                    w-full rounded-xl border border-gray-300 bg-white/80 px-5 py-4 text-base
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600
                    focus:border-transparent transition backdrop-blur-sm
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    w-full rounded-xl border border-gray-300 bg-white/80 px-5 py-4 text-base
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600
                    focus:border-transparent transition backdrop-blur-sm
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-4
                  text-lg font-semibold text-white shadow-lg hover:shadow-xl
                  active:scale-[0.98] transition transform
                "
              >
                Sign in
              </button>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
                >
                  Forgot password?
                </button>
              </div>
            </form>

            <div className="my-10 flex items-center">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-6 text-sm text-gray-500 bg-gradient-to-br from-gray-50 via-white to-indigo-50">
                or continue with
              </span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            <div className="space-y-4">
              <GoogleLoginButton />

              <button
                className="
                  w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300
                  bg-white/80 backdrop-blur-sm py-4 text-base font-medium text-gray-700
                  hover:bg-gray-50 hover:shadow-md active:scale-[0.98] transition
                "
              >
                <i className="ri-github-fill text-xl" />
                Continue with GitHub
              </button>
            </div>

            <p className="mt-12 text-center text-base text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer hover:underline transition"
              >
                Sign up free
              </span>
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}