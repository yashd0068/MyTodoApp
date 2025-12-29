import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GoogleLoginButton from "./GoogleLoginButton";
import 'remixicon/fonts/remixicon.css'

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(" Registration successful!");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server!");
    }
  };

  const githubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = "http://localhost:5173/github-callback";

    window.location.href =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=read:user user:email`;
  };

  const facebookLogin = () => {
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
    const redirectUri = "http://localhost:5173/facebook-callback";

    window.location.href =
      `https://www.facebook.com/v18.0/dialog/oauth` +
      `?client_id=${appId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=email,public_profile`;
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-pink-50 to-blue-200">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-700 tracking-wide">
            Todo<span className="text-gray-700">app</span>
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Register Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition hover:scale-[1.01]">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Create Your Account
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Join us today and start your journey!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Register
            </button>
          </form>

          <div className=" flex  gap-2 mt-4" >
            <button className=" mt-2 w-1/2 "> <GoogleLoginButton /> </button>

            <button
              onClick={githubLogin}
              className="w-2/3 mt-2 flex items-center justify-center gap-2 
             border border-gray-300  rounded-lg font-semibold text-m
             hover:bg-gray-100 transition"
            > <i class="ri-github-fill"></i> </button>
            <button
              onClick={facebookLogin}
              className="w-2/3 mt-2 flex items-center justify-center gap-2 
             border border-gray-300  rounded-lg font-semibold text-m
             hover:bg-gray-100 transition"
            >
              Facebook
            </button>

          </div>


          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
