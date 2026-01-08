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

  /* ---------------- Fetch user ---------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch {
        toast.error("Failed to load profile");
      }
    };
    fetchUser();
  }, [token]);

  /* ---------------- Fetch todo ---------------- */
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setForm(data);
        else toast.error("Todo not found");
      } catch {
        toast.error("Failed to fetch todo");
      }
    };
    fetchTodo();
  }, [id, token]);

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
        toast.success("Todo updated");
        navigate("/home");
      } else {
        toast.error("Failed to update todo");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF1F7] text-slate-800">
      {/* Navbar */}
      <nav className="bg-[#E6ECF4] border-b border-[#D7DEEA] fixed top-0 left-0 w-full z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1
            className="text-xl font-semibold text-indigo-600 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Todo<span className="text-slate-500">App</span>
          </h1>

          <div className="flex items-center gap-4">
            <Link
              to="/home"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
            >
              Home
            </Link>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 hover:ring-2 hover:ring-indigo-300 transition"
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
                <div className="absolute right-0 mt-3 w-44 bg-[#F1F5FA] border border-[#D7DEEA] rounded-lg shadow-md py-1">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#E6ECF4]"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100"
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
      <main className="flex-1 flex justify-center items-center px-4 pt-28 pb-20">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#F1F5FA] border border-[#D7DEEA] rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-center mb-6 text-slate-800">
            Edit Todo
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full mb-4 px-4 py-2 rounded-md bg-white border border-[#D7DEEA] focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows="3"
            className="w-full mb-4 px-4 py-2 rounded-md bg-white border border-[#D7DEEA] focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            name="due_date"
            type="date"
            value={form.due_date?.split("T")[0] || ""}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-2 rounded-md bg-white border border-[#D7DEEA] focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-md font-medium transition"
          >
            Update Todo
          </button>
        </form>
      </main>
    </div>
  );
}
