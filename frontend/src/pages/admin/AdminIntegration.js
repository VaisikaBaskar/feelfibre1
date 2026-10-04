import React from "react";
import AdminLayout from "./AdminLayout";
import "../../styles/admin.css";

const AdminIntegration = () => {
    return (
        <AdminLayout>
            <div className="admin-integration">
                <h1 style={{ marginBottom: "30px", color: "#2e7d32" }}>System Integrations</h1>
                <div className="admin-card-row">
                    <div className="admin-stat-card" style={{ textAlign: "left" }}>
                        <h3>Razorpay</h3>
                        <p style={{ fontSize: "0.9rem", color: "#666" }}>Connected for local payments</p>
                        <button className="admin-primary-btn" style={{ marginTop: "15px", background: "#3392ff" }}>Manage Keys</button>
                    </div>
                    <div className="admin-stat-card" style={{ textAlign: "left" }}>
                        <h3>Google Analytics</h3>
                        <p style={{ fontSize: "0.9rem", color: "#666" }}>Tracking visitor behavior</p>
                        <button className="admin-primary-btn" style={{ marginTop: "15px", background: "#4285f4" }}>Configure</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminIntegration;
