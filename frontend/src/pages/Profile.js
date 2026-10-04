import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
    const navigate = useNavigate();

    // 1. Session check
    const savedEmail = localStorage.getItem("userEmail");
    const userStr = localStorage.getItem("user");
    const userData = (userStr && userStr !== "undefined") ? JSON.parse(userStr) : {};

    // Robust cleaning function to filter out "undefined" or "null" strings
    const clean = (val) => {
        if (!val || val === "undefined" || val === "null") return "";
        return String(val);
    };

    const savedFirstName = clean(userData.first_name) || clean(localStorage.getItem("firstName"));
    const savedLastName = clean(userData.last_name) || clean(localStorage.getItem("lastName"));
    const savedPassword = localStorage.getItem("password") || "";

    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState(savedFirstName);
    const [lastName, setLastName] = useState(savedLastName);
    const [email, setEmail] = useState(savedEmail || "");
    const [password, setPassword] = useState(savedPassword);

    useEffect(() => {
        if (!savedEmail) {
            navigate("/login");
        }
    }, [savedEmail, navigate]);

    const handleSave = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/update-profile", {
                firstName: firstName,
                lastName: lastName,
                email: email
            });

            if (response.data.success) {
                localStorage.setItem("firstName", firstName);
                localStorage.setItem("lastName", lastName);
                localStorage.setItem("userEmail", email);
                localStorage.setItem("password", password);

                // Update persistent user object
                const updatedUser = {
                    ...userData,
                    first_name: firstName,
                    last_name: lastName,
                    email: email
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));

                alert("Profile Updated Successfully");
                setEditMode(false);
                window.location.reload(); // Refresh to sync UI
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || error.response?.data || "Failed to update profile";
            alert(errorMsg);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("password");
        localStorage.removeItem("user"); // Clear user object
        window.location.href = "/login";
    };

    if (!savedEmail) return null; // Prevent flicker before redirect

    return (
        <div style={{ padding: "80px 20px" }}>
            <div style={{
                maxWidth: "500px",
                margin: "auto",
                background: "#ffffff",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0px 5px 20px rgba(0,0,0,0.1)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "#e8f5e9",
                        margin: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "35px",
                        color: "#2e7d32"
                    }}>
                        👤
                    </div>
                </div>

                <h2 style={{
                    textAlign: "center",
                    color: "#2e7d32",
                    marginBottom: "20px",
                    fontSize: "28px",
                    fontWeight: "bold"
                }}>User Profile</h2>

                {!editMode ? (
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{
                            background: "#f9f9f9",
                            padding: "20px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            fontSize: "18px"
                        }}>
                            <p style={{ margin: "10px 0" }}>
                                <b style={{ color: "#555" }}>First Name:</b> {firstName}
                            </p>
                            <p style={{ margin: "10px 0" }}>
                                <b style={{ color: "#555" }}>Last Name:</b> {lastName}
                            </p>
                            <p style={{ margin: "10px 0" }}>
                                <b style={{ color: "#555" }}>Email:</b> {email}
                            </p>
                            <p style={{ margin: "10px 0" }}>
                                <b style={{ color: "#555" }}>Password:</b> ******
                            </p>
                        </div>
                        <button
                            onClick={() => setEditMode(true)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "#1976d2",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                marginTop: "10px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <div style={{ marginBottom: "20px" }}>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            style={{ display: "block", width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                        />
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            style={{ display: "block", width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            style={{ display: "block", width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            style={{ display: "block", width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                        />
                        <button
                            onClick={handleSave}
                            style={{
                                padding: "12px 24px",
                                background: "#2e7d32",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                width: "100%"
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                )}

                <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                    <h3 style={{ fontSize: "18px", color: "#555", marginBottom: "15px" }}>Account Actions</h3>

                    <button
                        onClick={() => navigate("/manage-addresses")}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "#0288d1",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                            transition: "background 0.3s",
                            marginBottom: "10px"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#01579b"}
                        onMouseOut={(e) => e.target.style.background = "#0288d1"}
                    >
                        Manage Addresses
                    </button>

                    <button
                        onClick={() => navigate("/orders")}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "#2e7d32",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                            transition: "background 0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#1b5e20"}
                        onMouseOut={(e) => e.target.style.background = "#2e7d32"}
                    >
                        Your Orders
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#e53935",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            marginTop: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "background 0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#c62828"}
                        onMouseOut={(e) => e.target.style.background = "#e53935"}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
