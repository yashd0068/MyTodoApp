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
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    };
    fetchUser();
  }, [token, navigate]);

  // Open file picker
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Upload profile picture
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

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
        toast.success("Profile picture updated successfully!");
        setUser((prev) => ({ ...prev, profilePic: data.profilePic }));
      } else {
        toast.error(data.message || "Upload failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image!");
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">

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


      <div className="flex items-center justify-center pt-36 px-4">
        <div className="relative w-full max-w-md p-10 rounded-3xl bg-white/30 backdrop-blur-xl shadow-2xl">

          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
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
            className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 transition-all duration-200 mb-4"
          >
            Upload Picture
          </button>


          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={user.name}
                disabled
                className="peer w-full border-b-2 border-gray-300 bg-transparent py-2 text-gray-800 placeholder-transparent focus:border-blue-500 focus:outline-none"
                placeholder="Name"
              />
              <label className="absolute left-0 -top-2.5 text-gray-500 text-sm">
                Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                value={user.email}
                disabled
                className="peer w-full border-b-2 border-gray-300 bg-transparent py-2 text-gray-800 placeholder-transparent focus:border-blue-500 focus:outline-none"
                placeholder="Email"
              />
              <label className="absolute left-0 -top-2.5 text-gray-500 text-sm">
                Email
              </label>
            </div>

            <button
              type="button"
              onClick={() => navigate("/edit-profile")}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-200"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
