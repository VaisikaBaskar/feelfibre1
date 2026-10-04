import React from "react";
import AdminLayout from "./AdminLayout";
import "../../styles/admin.css";

const AdminHelps = () => {
    return (
        <AdminLayout>
            <div className="admin-helps">
                <h1 style={{ marginBottom: "30px", color: "#2e7d32" }}>Admin Help & Support</h1>
                <div className="admin-table-container">
                    <div style={{ marginBottom: "30px" }}>
                        <h3>📧 Contact Support</h3>
                        <p>For technical issues, contact: <strong>support@feelfibre.com</strong></p>
                    </div>
                    <div style={{ marginBottom: "30px" }}>
                        <h3>📖 Documentation</h3>
                        <p>Read the admin manual to understand how to manage products, orders, and reports.</p>
                        <button className="admin-primary-btn" style={{ padding: "8px 16px" }}>Open Docs</button>
                    </div>
                    <div>
                        <h3>❓ Frequently Asked Questions</h3>
                        <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
                            <li>How to add a new category?</li>
                            <li>How to process refunds?</li>
                            <li>How to update stock levels?</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminHelps;
