import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(Array(6).fill(""));

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOTP = async () => {
        if (!email) return toast.error("Email is required");

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return toast.error("Please enter a valid email");

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/users/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Specifically handle "email not found" case to prevent proceeding
                if (data.message && data.message.toLowerCase().includes("not found")) {
                    toast.error("This email is not registered. Please sign up first.");
                } else {
                    toast.error(data.message || "Failed to send OTP");
                }
                return; // Important: Do NOT proceed to step 2
            }

            // Only if success
            toast.success(data.message || "OTP sent to your email");
            setStep(2); // Only move to OTP step if email exists and OTP was sent
        } catch (err) {
            console.error(err);
            toast.error("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    const verifyOTP = async () => {
        const enteredOtp = otp.join("");

        if (enteredOtp.length !== 6)
            return toast.error("Please enter complete OTP");

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/users/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: enteredOtp }),
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.message);

            toast.success(data.message || "OTP verified");
            setStep(3);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };



    const resetPassword = async () => {
        if (password.length < 6)
            return toast.error("Password must be at least 6 characters");

        if (password !== confirmPassword)
            return toast.error("Passwords do not match");

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/users/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword: password }),
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.message);

            toast.success(data.message || "Password reset successfully");
            navigate("/login");
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 px-4">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-5">
                <h2 className="text-3xl font-bold text-center text-blue-700">
                    Forgot Password
                </h2>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <input
                            type="email"
                            placeholder="Enter registered email"
                            className="w-full border-b-2 bg-transparent py-2 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            onClick={sendOTP}
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        if (!value) return;

                                        const newOtp = [...otp];
                                        newOtp[index] = value;
                                        setOtp(newOtp);

                                        // Auto-focus next box
                                        if (index < 5) {
                                            document.getElementById(`otp-${index + 1}`)?.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace") {
                                            const newOtp = [...otp];
                                            newOtp[index] = "";
                                            setOtp(newOtp);

                                            if (index > 0) {
                                                document.getElementById(`otp-${index - 1}`)?.focus();
                                            }
                                        }
                                    }}
                                    id={`otp-${index}`}
                                    className="w-12 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                        </div>

                        <button
                            onClick={verifyOTP}
                            disabled={loading || otp.join("").length !== 6}
                            className={`w-full py-3 mt-4 rounded-xl text-white
                ${loading || otp.join("").length !== 6
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"}
            `}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}


                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full border-b-2 bg-transparent py-2 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full border-b-2 bg-transparent py-2 focus:outline-none"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            onClick={resetPassword}
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </>
                )}

                <button
                    onClick={() => navigate("/login")}
                    className="w-full text-sm text-gray-600 hover:underline mt-2"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}
