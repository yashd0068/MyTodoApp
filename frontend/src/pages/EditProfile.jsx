import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditProfile() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [user, setUser] = useState({ profilePic: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setForm({ name: data.name, email: data.email });
        setUser(data);
      } catch {
        toast.error("Session expired");
        navigate("/login");
      }
    };
    fetchUser();
  }, [token, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

      if (res.ok) {
        toast.success("Changes saved");
        navigate("/profile");
      } else toast.error("Update failed");
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
    <div className="min-h-screen bg-[#F4F6F8] text-gray-900">

      {/* Top Navigation */}
      <nav className="bg-[#EEF1F4] border-b border-gray-300/40 fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate("/home")}
            className="text-lg font-semibold cursor-pointer"
          >
            Todo<span className="text-gray-500">App</span>
          </h1>

          <div className="flex items-center gap-4">
            <Link to="/home" className="text-sm text-gray-600 hover:text-gray-900">
              Home
            </Link>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full overflow-hidden border border-gray-300"
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
                <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-300/40 rounded-lg shadow-lg py-1">
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

      {/* Settings Layout */}
      {/* Settings Layout */}
      {/* Settings Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 
                 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="space-y-2 text-sm">
            <p className="px-3 py-2 rounded-md 
                    bg-indigo-100/60 text-indigo-700 font-medium">
              Account
            </p>
            <button
              onClick={() => navigate("/password")}
              className="px-3 py-2 text-gray-600 hover:text-indigo-600 transition"
            >
              Security
            </button>
          </div>
        </aside>

        {/* Content */}
        <section className="lg:col-span-9 space-y-8">

          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your personal information and login details
            </p>
          </div>

          {/* Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#F1F5FA] border border-gray-300/40 
                 rounded-2xl divide-y shadow-lg"
          >

            {/* Name */}
            <div className="px-5 sm:px-6 py-5
                      flex flex-col sm:flex-row
                      sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Full name
                </p>
                <p className="text-xs text-gray-500">
                  This will be visible on your profile
                </p>
              </div>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full sm:w-72 px-3 py-2 text-sm rounded-md
                     border border-gray-300/40 bg-white
                     focus:outline-none focus:ring-2 
                     focus:ring-indigo-300"
              />
            </div>

            {/* Email */}
            <div className="px-5 sm:px-6 py-5
                      flex flex-col sm:flex-row
                      sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Email address
                </p>
                <p className="text-xs text-gray-500">
                  Used for login and notifications
                </p>
              </div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full sm:w-72 px-3 py-2 text-sm rounded-md
                     border border-gray-300/40 bg-white
                     focus:outline-none focus:ring-2 
                     focus:ring-indigo-300"
              />
            </div>

            {/* Actions */}
            <div className="px-5 sm:px-6 py-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5
                     text-sm font-medium rounded-md
                     bg-indigo-600 text-white
                     hover:bg-indigo-500 transition"
              >
                Save changes
              </button>
            </div>

          </form>
        </section>
      </main>


    </div>
  );
}
