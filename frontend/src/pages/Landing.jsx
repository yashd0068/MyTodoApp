import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 text-gray-900 overflow-hidden">

      {/* Subtle light noise texture for premium depth */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://assets.codepen.io/605876/noise.png')] mix-blend-multiply" />

      {/* ================= NAVBAR ================= */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl"
      >
        <div className="flex items-center justify-between rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-xl px-6 sm:px-10 py-4 sm:py-5 shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Todo<span className="text-indigo-600">Pro</span>
          </h1>

          <nav className="flex items-center gap-4 sm:gap-8">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-indigo-600 px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
            >
              Get started free
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* ================= HERO ================= */}
      <main className="pt-32 sm:pt-44 pb-20 sm:pb-40 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">

          {/* Text – Stacks on top on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="space-y-8 sm:space-y-12 order-2 lg:order-1 text-center lg:text-left"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl leading-tight font-bold tracking-tight">
              The calm way to
              <br />
              <span className="relative inline-block text-indigo-600">
                get work done.
                <span className="absolute left-0 -bottom-2 sm:-bottom-3 w-full h-1 bg-indigo-600/20 rounded-full blur-lg" />
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              TodoPro is a focused task management platform for modern teams and individuals who value clarity, execution, and momentum.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mx-auto lg:mx-0">
              <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.3 }}>
                <Link
                  to="/register"
                  className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold text-white shadow-lg hover:shadow-xl transition text-center block"
                >
                  Start free → No card required
                </Link>
              </motion.div>

              <Link
                to="/login"
                className="text-base sm:text-lg font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Sign in
              </Link>
            </div>
          </motion.div>

          {/* Visual – Full width on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex justify-center order-1 lg:order-2"
          >
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-lg lg:max-w-2xl rounded-3xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 sm:p-10 shadow-2xl"
            >
              <img
                src="https://themewagon.com/wp-content/uploads/2022/03/Final-1.png"
                alt="TodoPro premium dashboard preview"
                className="w-full rounded-2xl shadow-inner"
              />
            </motion.div>
          </motion.div>

        </div>
      </main>

      {/* ================= FEATURES ================= */}
      <section className="py-20 sm:py-40 bg-white/60 px-6">
        <div className="mx-auto max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 sm:mb-32 text-center"
          >
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Built for serious work
            </h3>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Thoughtfully designed features that scale from individuals to teams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                title: "Task Clarity",
                desc: "Structure your work with clear priorities and a distraction-free interface."
              },
              {
                title: "Manage Your Profile",
                desc: "Add a profile picture, view your information, and update your details anytime."
              },
              {
                title: "Smart Reminders",
                desc: "Timely notifications that keep you on track without breaking focus."
              }
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="rounded-3xl border border-gray-200/60 bg-white/80 backdrop-blur-sm px-8 py-10 shadow-xl transition text-center sm:text-left"
              >
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-indigo-100 rounded-2xl mb-6 mx-auto sm:mx-0" />
                <h4 className="text-xl sm:text-2xl font-semibold mb-4">
                  {f.title}
                </h4>
                <p className="text-base text-gray-600 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-200 py-12 sm:py-16 bg-white/60 px-6">
        <div className="mx-auto max-w-7xl text-center text-sm sm:text-base text-gray-600">
          © {new Date().getFullYear()} TodoPro. Built with precision by Yash Dubey.
        </div>
      </footer>

    </div>
  );
}