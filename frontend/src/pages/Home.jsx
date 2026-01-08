import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";
import TodoCard from "./Card";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ profilePic: "", name: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(6);
  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ------------------- Fetch Todos ------------------- */
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/todos?search=${search}&page=${page}&limit=${limit}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok) {
          setTodos(data.todos);
          setTotalPages(data.pagination.totalPages);
        }
      } catch {
        toast.error("Failed to load todos");
      }
    };
    fetchTodos();
  }, [token, search, page, limit]);

  /* ------------------- Fetch User ------------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch {
        toast.error("Failed to load profile");
      }
    };
    fetchUser();
  }, [token]);

  /* ------------------- Greeting & Quote ------------------- */
  useEffect(() => {
    const hour = new Date().getHours();
    let greet = "Hello";
    if (hour < 12) greet = "Good Morning";
    else if (hour < 17) greet = "Good Afternoon";
    else if (hour < 20) greet = "Good Evening";
    else greet = "Good Night";
    setGreeting(`${greet}, ${user.name || "User"}`);

    // Motivational quotes (can expand)
    const quotes = [
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "The secret of getting ahead is getting started.",
      "Do something today that your future self will thank you for.",
      "Focus on being productive instead of busy.",
      "Small steps every day lead to big results."
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [user.name]);

  /* ------------------- Actions ------------------- */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete task?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTodos((prev) => prev.filter((t) => t.todo_id !== id));
        toast.success("Task deleted");
      }
    }
  };

  const handleToggle = async (id, status) => {
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_completed: status }),
    });

    if (res.ok) {
      setTodos((prev) =>
        prev.map((t) =>
          t.todo_id === id ? { ...t, is_completed: status } : t
        )
      );
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will be logged out from this session.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-gray-900">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full bg-[#EEF1F4] border-b border-gray-300/40 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-lg font-semibold tracking-tight cursor-pointer text-indigo-600"
            onClick={() => navigate("/home")}
          >
            Todo<span className="text-gray-600">App</span>
          </h1>

          <div className="flex items-center gap-4">
            <Link
              to="/add"
              className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Add Task
            </Link>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-indigo-300 transition"
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
                <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigate("/password")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Security
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Greeting + Quote + Search */}
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-[0_12px_40px_-20px_rgba(0,0,0,0.15)] p-6 sm:p-8 mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Greeting */}
            <div className="flex items-center gap-4">
              <img
                src={
                  user.profilePic
                    ? `http://localhost:5000${user.profilePic}`
                    : "https://via.placeholder.com/50"
                }
                alt="Avatar"
                className="w-14 h-14 rounded-full border border-gray-300"
              />
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                  {greeting}
                </h2>
                <p className="text-sm text-gray-500 italic mt-1">"{quote}"</p>
              </div>
            </div>

            {/* Right: Search */}
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-300/50 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* Todo Grid */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {todos.length ? (
              todos.map((todo) => (
                <TodoCard
                  key={todo.todo_id}
                  todo={todo}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))
            ) : (
              <div className="col-span-full border border-dashed border-gray-300 rounded-xl bg-[#F9FAFB] p-14 text-center">
                <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Create your first task to get started.
                </p>
                <Link
                  to="/add"
                  className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                >
                  Create Task
                </Link>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, v) => setPage(v)}
                color="primary"
              />
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 bg-[#F9FAFB] border border-gray-300/50 rounded-lg text-sm"
            >
              <option value="5">5 per page</option>
              <option value="6">6 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="all">All tasks</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
}
