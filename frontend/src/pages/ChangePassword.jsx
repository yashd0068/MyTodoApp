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
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-20">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                    <h1
                        className="text-2xl font-bold text-blue-600 cursor-pointer"
                        onClick={() => navigate("/home")}
                    >
                        Todo<span className="text-gray-700">App</span>
                    </h1>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/home"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Home
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-9 h-9 rounded-full overflow-hidden border"
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
                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md">
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            navigate("/profile");
                                        }}
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                    >
                                        Profile
                                    </button>

                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            navigate("/password");
                                        }}
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                    >
                                        Set Password
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
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
            <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-12">
                <div className="w-full max-w-lg">

                    {/* Card Container */}
                    <div className="relative bg-white rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

                        {/* Accent Line */}


                        {/* Header */}
                        <div className="px-10 pt-8 pb-6">
                            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                                Change password
                            </h2>
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-sm">
                                Protect your account by updating your password regularly.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-100" />

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current password
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    required
                                    onChange={handleChange}
                                    className="
              w-full rounded-xl bg-gray-50 border border-gray-300
              px-4 py-3 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-600/40
              focus:border-blue-600
            "
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    required
                                    onChange={handleChange}
                                    className="
              w-full rounded-xl bg-gray-50 border border-gray-300
              px-4 py-3 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-600/40
              focus:border-blue-600
            "
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm new password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    onChange={handleChange}
                                    className="
              w-full rounded-xl bg-gray-50 border border-gray-300
              px-4 py-3 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-600/40
              focus:border-blue-600
            "
                                />
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-6 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    className="
              w-full bg-blue-600 text-white py-3 rounded-xl
              font-medium text-sm tracking-wide
              hover:bg-blue-700 transition
              focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
            "
                                >
                                    Update password
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    Minimum 6 characters. Use a strong, unique password.
                                </p>
                            </div>

                        </form>
                    </div>

                    {/* Trust Text */}
                    <p className="mt-6 text-center text-xs text-gray-400">
                        Your credentials are securely stored.
                    </p>

                </div>
            </main>

        </div>
    );

}
