import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">


      <header className="w-full px-10 py-4 flex justify-between items-center backdrop-blur-xl bg-white/30 border-b border-white/40 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700 tracking-wide">
          Todo<span className="text-gray-700">App</span>
        </h1>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-blue-600 text-blue-700 bg-white/50 backdrop-blur hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </header>


      <main className="flex flex-1 items-center justify-center px-10 py-10">
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">


          <img
            src="https://cdn-icons-png.flaticon.com/512/6104/6104865.png"
            alt="Landing Illustration"
            className="w-full max-h-[400px] object-contain drop-shadow-xl"
          />


          <div className="backdrop-blur-xl bg-white/40 border border-white/30 shadow-xl rounded-2xl p-10 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-4 leading-tight">
              Organize Your Day Effortlessly
            </h2>

            <p className="text-gray-800 text-md mb-6">
              Manage tasks efficiently, stay on top of deadlines, and boost your productivity with our intuitive Todo App.
            </p>

            <Link
              to="/register"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-700 text-sm backdrop-blur-xl bg-white/30 border-t border-white/40">
        © {new Date().getFullYear()} TodoApp.
      </footer>
    </div>
  );
}
