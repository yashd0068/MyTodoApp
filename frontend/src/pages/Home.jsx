import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import TodoCard from "./Card"
import Pagination from '@mui/material/Pagination';




export default function Home() {
  const [todos, setTodos] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ profilePic: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(6);



  // Fetch all todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/todos?search=${search}&page=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setTodos(data.todos);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load todos");
      }
    };

    fetchTodos();
  }, [token, search, page, limit]);



  // Fetch user for profile picture
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


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You’re about to delete this todo permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setTodos((prev) => prev.filter((t) => t.todo_id !== id));
          toast.success("Todo deleted successfully!");
        } else {
          toast.error("Failed to delete todo");
        }
      } catch (err) {

        toast.error("Error deleting todo");
      }
    }
  };

  // Toggle completed status
  const handleToggle = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_completed: newStatus }),
      });
      if (res.ok) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.todo_id === id ? { ...todo, is_completed: newStatus } : todo
          )
        );
        toast.success(
          newStatus ? "Marked as completed " : "Marked as pending "
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating todo");
    }
  };

  // Logout confirmation
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      navigate("/login");
      toast("Logged out successfully ", { icon: "" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Navbar */}
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
              to="/add"
            >
              + Add Todo
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
                <div className="absolute left-0 mt-2 w-40 bg-white/100 backdrop-blur-xl border border-white/30 rounded-xl shadow-lg py-2 flex flex-col">
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
                    Change password
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

      {/* Main Section */}
      <main className="flex-1 pt-28 px-6 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 w-3/4 ">Your Todo List</h2>
          <input
            type="text"
            placeholder="Search todos..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-4 py-2 rounded-lg border shadow  hover:bg-pink-50  "
          />


        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="text-center text-gray-600 text-lg col-span-full py-12">
              <p className="font-medium mb-2">No todos found</p>
              <Link
                to="/add"
                className="text-blue-600 hover:underline font-medium"
              >
                Add your first todo
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {limit !== "all" && totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </div>
        )}

        <div className="flex justify-end sm:flex-row gap-4 mb-6 pb-20 ">


          <select
            value={limit}
            onChange={(e) => {
              setLimit(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg border shadow"
          >
            <div className="">
              <option value="5">5 per page</option>
              <option value="6">6 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="all">All Todos</option>
            </div>
          </select>
        </div>



      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-md shadow-inner py-4 mt-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-600">TodoApp</span> — Built by
        Yash Dubey
      </footer>
    </div>
  );
}
