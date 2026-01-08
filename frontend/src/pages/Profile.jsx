import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", profilePic: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user
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
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    };
    fetchUser();
  }, [token, navigate]);

  // Upload profile pic
  const handleUploadClick = () => fileInputRef.current.click();
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("Please select a file first!");
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/upload-profile-pic/${user.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile picture updated!");
        setUser((prev) => ({ ...prev, profilePic: data.profilePic }));
      } else toast.error(data.message || "Upload failed!");
    } catch {
      toast.error("Error uploading image!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-gray-800">

      {/* Navbar */}
      <nav className="bg-[#EEF1F4] border-b border-gray-300/40 fixed top-0 left-0 w-full z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1
            className="text-xl font-semibold text-indigo-600 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Todo<span className="text-gray-600">App</span>
          </h1>

          <div className="flex items-center gap-4">
            <Link
              to="/home"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
            >
              Home
            </Link>

            {/* Profile Avatar */}
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
                <div className="absolute right-0 mt-3 w-44 bg-[#F9FAFB] border border-gray-300/40 rounded-lg shadow-lg py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200/60 transition"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/password");
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200/60 transition"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Card */}
      <main className="flex-1 flex justify-center items-start pt-28 px-4">
        <div className="w-full max-w-2xl">

          {/* Profile Container */}
          <div className="bg-[#F1F5FA] border border-gray-300/40 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)]">

            {/* Header */}
            <div className="px-10 pt-10 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Account profile
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your personal information and profile picture.
              </p>
            </div>

            <div className="h-px bg-gray-200/60" />

            {/* Content */}
            <div className="px-10 py-8 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-10">

              {/* Avatar Section */}
              <div className="flex flex-col items-center text-center">
                <div className="w-36 h-36 rounded-full overflow-hidden border border-gray-300/60 shadow-sm bg-white">
                  <img
                    src={
                      user.profilePic
                        ? `http://localhost:5000${user.profilePic}`
                        : "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  onClick={handleUploadClick}
                  className="
              mt-4 text-sm font-medium text-indigo-600
              hover:text-indigo-500 transition
            "
                >
                  Change photo
                </button>

                <p className="mt-2 text-xs text-gray-400">
                  JPG, PNG up to 2MB
                </p>
              </div>

              {/* Info Section */}
              <div className="space-y-6">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full name
                  </label>
                  <div className="px-4 py-3 rounded-xl bg-white border border-gray-300/50 text-gray-800">
                    {user.name || "—"}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email address
                  </label>
                  <div className="px-4 py-3 rounded-xl bg-white border border-gray-300/50 text-gray-800">
                    {user.email || "—"}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="
                px-6 py-3 rounded-xl bg-indigo-600 text-white
                font-medium text-sm
                hover:bg-indigo-500 transition
                focus:outline-none focus:ring-2 focus:ring-indigo-400
              "
                  >
                    Edit profile
                  </button>

                  <button
                    onClick={() => navigate("/password")}
                    className="
                px-6 py-3 rounded-xl bg-white border border-gray-300
                font-medium text-sm text-gray-700
                hover:bg-gray-100 transition
              "
                  >
                    Manage password
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Your information is securely stored and never shared.
          </p>
        </div>
      </main>

    </div>
  );
}
