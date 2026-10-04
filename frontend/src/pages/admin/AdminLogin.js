import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../config/api";

function AdminLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(API_URL + "/auth/login", { email, password });
            const data = response.data;

            if (data.success && data.token === "admin-token") {
                // Store token and admin flag
                localStorage.setItem("admin", "true");
                localStorage.setItem("adminEmail", email);
                localStorage.setItem("adminToken", data.token);

                // Set axios default header for all future admin API calls
                axios.defaults.headers.common["x-admin-token"] = data.token;

                window.location.href = "/admin";
            } else {
                alert("Invalid Admin Email or Password");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data || "Login Failed";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: "90vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9" }}>
            <div style={{ width: "400px", padding: "40px", borderRadius: "10px", background: "white", boxShadow: "0px 5px 20px rgba(0,0,0,0.15)" }}>
                <div style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
                    Admin Login
                </div>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "12px", marginTop: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    style={{ width: "100%", padding: "12px", marginTop: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{ width: "100%", padding: "12px", background: "black", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );

}

export default AdminLogin;
