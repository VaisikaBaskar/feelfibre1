import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                firstName,
                lastName,
                email,
                password
            };
            await axios.post(API_URL + "/auth/register", formData);
            alert("Registration Successful. Please Login");
            navigate("/login");
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data || "Registration Failed";
            alert(errorMsg);
            console.error(error);
        }
    };

    return (
        <div style={{ padding: "80px 20px", maxWidth: "450px", margin: "auto" }}>
            <div style={{ background: "white", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#2e7d32" }}>Create Account</h2>
                <form onSubmit={handleRegister}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            style={{ display: "block", marginBottom: "15px", padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ddd" }}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            style={{ display: "block", marginBottom: "15px", padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ddd" }}
                        />
                    </div>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ display: "block", marginBottom: "15px", padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ display: "block", marginBottom: "20px", padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "14px",
                            background: "#2e7d32",
                            color: "white",
                            border: "none",
                            width: "100%",
                            cursor: "pointer",
                            borderRadius: "6px",
                            fontSize: "16px",
                            fontWeight: "bold"
                        }}
                    >
                        Create Account
                    </button>
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        Already have an account? <span onClick={() => navigate("/login")} style={{ color: "#2e7d32", cursor: "pointer", fontWeight: "bold" }}>Login</span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
