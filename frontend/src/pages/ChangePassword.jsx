import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ChangePassword() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [user, setUser] = useState({ profilePic: "" });
    const [dropdownOpen, setDropdownOpen] = useState(false);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load profile");
            }
        };
        fetchUser();
    }, [token]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword)
            return toast.error("Passwords do not match");

        try {
            const res = await fetch("http://localhost:5000/api/users/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.message || "Failed to change password");

            toast.success("Password changed successfully");
            navigate("/profile");
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
            {/* Navbar */}
            <nav className="bg-white/30 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-20">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                    <h1
                        className="text-2xl font-bold text-blue-700 cursor-pointer"
                        onClick={() => navigate("/home")}
                    >
                        Todo<span className="text-gray-700">App</span>
                    </h1>

                    <div className="flex items-center space-x-4">
                        <Link
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                            to="/home"
                        >
                            Home
                        </Link>

                        {/* Profile */}
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
                                <div className="absolute right-0 mt-2 w-44 bg-white/30 backdrop-blur-md border border-white/30 rounded-xl shadow-lg py-2 flex flex-col">
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate("/profile"); }}
                                        className="px-4 py-2 text-gray-700 hover:bg-blue-100/50 rounded-lg text-left transition"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate("/password"); }}
                                        className="px-4 py-2 text-gray-700 hover:bg-blue-100/50 rounded-lg text-left transition"
                                    >
                                        Set Password
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

            {/* Change Password Form */}
            <main className="flex-1 flex justify-center items-center px-4 py-32">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4"
                >
                    <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
                        Change Password
                    </h2>

                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        required
                        onChange={handleChange}
                        className="w-full border-b-2 bg-transparent py-2 focus:outline-none"
                    />

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        required
                        onChange={handleChange}
                        className="w-full border-b-2 bg-transparent py-2 focus:outline-none"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                        onChange={handleChange}
                        className="w-full border-b-2 bg-transparent py-2 focus:outline-none"
                    />

                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
                        Update Password
                    </button>
                </form>
            </main>
        </div>
    );
}
