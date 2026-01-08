import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddTodo() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ profilePic: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch {
        toast.error("Failed to load profile");
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Todo added");
        navigate("/home");
      } else {
        toast.error("Failed to add todo");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast("Logged out");
  };
  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#2C2C2C]">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-20 bg-[#FDFEFF]/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate("/home")}
            className="text-xl font-semibold cursor-pointer"
          >
            Todo<span className="text-indigo-600">App</span>
          </h1>

          <div className="flex items-center gap-4">
            <Link
              to="/home"
              className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Home
            </Link>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-300"
              >
                <img
                  src={
                    user.profilePic
                      ? `http://localhost:5000${user.profilePic}`
                      : "https://via.placeholder.com/40"
                  }
                  className="w-full h-full object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Form */}
      <main className="flex items-center justify-center px-4 pt-32 pb-20">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#FDFEFF] border border-gray-200 rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Add New Todo
          </h2>

          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            required
            className="w-full bg-[#F4F7FB] border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            rows={4}
            className="w-full bg-[#F4F7FB] border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="date"
            name="due_date"
            onChange={handleChange}
            className="w-full bg-[#F4F7FB] border border-gray-300 p-3 rounded-lg mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
          >
            Add Todo
          </button>
        </form>
      </main>
    </div>
  );

}
