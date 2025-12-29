import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditTodo() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", description: "", due_date: "" });
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

  const fetchTodo = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setForm(data);
      } else {
        toast.error("Failed to fetch todo details.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching todo. Please try again.");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Todo updated successfully! ");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        toast.error("Failed to update todo. Please try again.");
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

  useEffect(() => {
    fetchTodo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
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
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/password");
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-blue-100/50 rounded-lg text-left transition"
                  >
                    Password
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


      {/* Form */}
      <main className="flex-1 flex justify-center items-center px-4 py-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition hover:scale-[1.01]"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Edit Todo
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="due_date"
            type="date"
            value={form.due_date?.split("T")[0] || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Update Todo
          </button>
        </form>
      </main>
    </div>
  );
}
