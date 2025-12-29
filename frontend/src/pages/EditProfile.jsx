import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditProfile() {
  const [form, setForm] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ profilePic: "" });
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setForm({ name: data.name, email: data.email });
      } catch (err) {
        console.error(err);
        toast.error("Session expired. Please log in again.");
        setTimeout(() => navigate("/login"), 800);
      }
    };
    fetchUser();
  }, [token, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    };
    fetchUser();
  }, [token]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully! ");
        setTimeout(() => navigate("/profile"), 1000);
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating.");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully ");
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 flex justify-center items-center">
      <nav className="bg-white/30 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1
            className="text-2xl font-bold text-blue-700 tracking-wide cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Todo<span className="text-gray-700">App</span>
          </h1>

          <div className="flex items-center space-x-4">
            <Link
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
              to="/Home"
            >
              Home
            </Link>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg hover:ring-2 hover:ring-blue-300 transition"
              >
                <img
                  src={
                    user.profilePic
                      ? `http://localhost:5000${user.profilePic}`
                      : "https://via.placeholder.com/40"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white/30 backdrop-blur-md border border-white/30 rounded-xl shadow-lg py-2 flex flex-col">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-blue-100/50 rounded-lg text-left transition"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-700 hover:bg-red-100/50 rounded-lg text-left transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-10 bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h2>

        {/* Name Input */}
        <div className="relative mb-6">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="peer w-full border-b-2 border-gray-300 bg-transparent py-2 text-gray-800 placeholder-transparent focus:border-blue-500 focus:outline-none"
            required
          />
          <label className="absolute left-0 -top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-gray-600 peer-focus:text-sm">
            Name
          </label>
        </div>

        {/* Email Input */}
        <div className="relative mb-6">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="peer w-full border-b-2 border-gray-300 bg-transparent py-2 text-gray-800 placeholder-transparent focus:border-blue-500 focus:outline-none"
            required
          />
          <label className="absolute left-0 -top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-gray-600 peer-focus:text-sm">
            Email
          </label>
        </div>
        <div className="">
          <button
            type="submit"
            className="w-full py-2  bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Update Profile
          </button>
          <button
            onClick={() => navigate("/password")}
            className=" w-full py-2 mt-2 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-200"
          >

            Manage Password
          </button>
        </div>
      </form>
    </div>
  );
}
