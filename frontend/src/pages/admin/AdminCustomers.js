import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import API_URL from "../../config/api";
import "../../styles/admin.css";

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/customers")
            .then(res => {
                setCustomers(res.data);
            })
            .catch(err => {
                console.error("Error fetching customers:", err);
            });
    }, []);

    return (
        <AdminLayout>
            <div className="admin-customers">
                <h1 style={{ marginBottom: "30px", color: "#2e7d32" }}>Customer Directory</h1>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Orders</th>
                                <th>Joined Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c, index) => (
                                <tr key={index}>
                                    <td>
                                        {c.name && c.name.trim() !== ""
                                            ? c.name
                                            : "N/A"}
                                    </td>
                                    <td>{c.email}</td>
                                    <td>{c.orders || 0}</td>
                                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}
                                            onClick={() => navigate(`/admin/customer-orders/${c.id}`)}
                                        >
                                            View History
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCustomers;
