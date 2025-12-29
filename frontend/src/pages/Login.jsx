import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GoogleLoginButton from "./GoogleLoginButton";
import 'remixicon/fonts/remixicon.css'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful! ");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        toast.error(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your connection.");
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-700 tracking-wide">
            Todo<span className="text-gray-700">App</span>
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition hover:scale-[1.01]">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Login
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
          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-600 cursor-pointer hover:underline font-medium"
            >
              Register here
            </span>
          </p>
        </div>
      </main >
    </div >
  );
}
