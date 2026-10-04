import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API_URL from "../../config/api";
import axios from "axios";

const AdminLockedUsers = () => {
    const [lockedUsers, setLockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLockedUsers();
    }, []);

    const fetchLockedUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/locked-users`);
            setLockedUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching locked users:", error);
            setLoading(false);
        }
    };

    const handleUnlock = async (userId) => {
        if (!window.confirm("Are you sure you want to unlock this account?")) return;

        try {
            // Updated to use URL parameter as per specific request
            const response = await axios.post(`${API_URL}/api/admin/unlock-user/${userId}`);
            if (response.data.success || response.data.message.includes("successfully")) {
                alert("User account unlocked successfully");
                fetchLockedUsers(); // Refresh list
            } else {
                alert(response.data.message || "Failed to unlock account");
            }
        } catch (error) {
            console.error("Error unlocking user:", error);
            alert("An error occurred while unlocking the account");
        }
    };

    return (
        <AdminLayout>
            <div className="admin-locked-users">
                <h1 style={{ marginBottom: "30px", color: "#2e7d32" }}>Locked Accounts</h1>

                <div className="admin-table-container">
                    {loading ? (
                        <p>Loading locked accounts...</p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User Email</th>
                                    <th>Failed Attempts</th>
                                    <th>Locked At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lockedUsers.length > 0 ? (
                                    lockedUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.email}</td>
                                            <td>{user.failedLoginAttempts}</td>
                                            <td>{user.lockedAt ? new Date(user.lockedAt).toLocaleString() : "N/A"}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleUnlock(user.id)}
                                                    style={{
                                                        background: "#2e7d32",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "8px 16px",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    Unlock
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                            No accounts currently locked.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminLockedUsers;
