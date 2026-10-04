import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loginMode, setLoginMode] = useState("password"); // "password" or "otp"
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(API_URL + "/auth/login", { email, password });
            if (response.data.success) {
                completeLogin(response.data);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data || "Login Failed";
            alert(errorMsg);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (!email) return alert("Please enter email first");
        setLoading(true);
        try {
            const response = await axios.post(API_URL + "/auth/send-otp", { email });
            if (response.data.success) {
                setOtpSent(true);
                if (response.data.devOtp) {
                    alert(`[DEV MODE] Email sending failed. Your OTP is: ${response.data.devOtp}`);
                } else {
                    alert("OTP sent to your email!");
                }
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data || "Failed to send OTP";
            alert(errorMsg);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(API_URL + "/auth/verify-otp", { email, otp });
            if (response.data.success) {
                completeLogin(response.data);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data || "OTP Verification Failed";
            alert(errorMsg);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const completeLogin = (userData) => {
        console.log("Received Login Response:", userData);
        const clean = (val) => (val === undefined || val === null) ? "" : String(val);

        localStorage.setItem("userEmail", clean(email));
        localStorage.setItem("firstName", clean(userData.first_name));
        localStorage.setItem("lastName", clean(userData.last_name));
        localStorage.setItem("user", JSON.stringify(userData));

        alert("Login Successful");
        navigate("/");
    };

    return (
        <>
            <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1 }}>
                <video
                    src="https://cdn.dribbble.com/userupload/4160016/file/original-5bb1d9d8eb6ff3aae25ccd0d17260b5e.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
                />
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)" }}></div>
            </div>
            <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", zIndex: 1, boxSizing: "border-box" }}>
                <div style={{ background: "white", padding: "40px", borderRadius: "10px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                    <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2e7d32" }}>User Login</h2>

                    {/* Login Mode Toggle */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "30px", background: "#f5f5f5", padding: "5px", borderRadius: "8px" }}>
                        <button
                            onClick={() => { setLoginMode("password"); setOtpSent(false); }}
                            style={{
                                flex: 1, padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer",
                                background: loginMode === "password" ? "#2e7d32" : "transparent",
                                color: loginMode === "password" ? "white" : "#666",
                                fontWeight: "bold", transition: "0.3s"
                            }}
                        >
                            Password
                        </button>
                        <button
                            onClick={() => setLoginMode("otp")}
                            style={{
                                flex: 1, padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer",
                                background: loginMode === "otp" ? "#2e7d32" : "transparent",
                                color: loginMode === "otp" ? "white" : "#666",
                                fontWeight: "bold", transition: "0.3s"
                            }}
                        >
                            OTP Login
                        </button>
                    </div>

                    {loginMode === "password" ? (
                        <form onSubmit={handleLogin}>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ display: "block", marginBottom: "20px", padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ display: "block", marginBottom: "25px", padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: "14px", background: "#2e7d32", color: "white", border: "none", width: "100%",
                                    cursor: loading ? "not-allowed" : "pointer", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", transition: "background 0.3s"
                                }}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    ) : (
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={otpSent}
                                style={{ display: "block", marginBottom: "20px", padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                            />

                            {!otpSent ? (
                                <button
                                    onClick={handleSendOTP}
                                    disabled={loading || !email}
                                    style={{
                                        padding: "14px", background: "#2e7d32", color: "white", border: "none", width: "100%",
                                        cursor: (loading || !email) ? "not-allowed" : "pointer", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", transition: "background 0.3s"
                                    }}
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </button>
                            ) : (
                                <form onSubmit={handleVerifyOTP}>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                        required
                                        style={{ display: "block", marginBottom: "20px", padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box", textAlign: "center", fontSize: "20px", letterSpacing: "5px" }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || otp.length < 6}
                                        style={{
                                            padding: "14px", background: "#2e7d32", color: "white", border: "none", width: "100%",
                                            cursor: (loading || otp.length < 6) ? "not-allowed" : "pointer", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", transition: "background 0.3s"
                                        }}
                                    >
                                        {loading ? "Verifying..." : "Verify & Login"}
                                    </button>
                                    <p
                                        onClick={() => { setOtpSent(false); setOtp(""); }}
                                        style={{ textAlign: "center", marginTop: "15px", fontSize: "14px", color: "#666", cursor: "pointer" }}
                                    >
                                        Use a different email
                                    </p>
                                </form>
                            )}
                        </div>
                    )}

                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        New user? <span onClick={() => navigate("/register")} style={{ color: "#2e7d32", cursor: "pointer", fontWeight: "bold" }}>Create Account</span>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;
