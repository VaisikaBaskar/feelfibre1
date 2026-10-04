import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import "../../styles/admin.css";

const AdminOrders = () => {
    const [orders, setOrders] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        fetch(API_URL + "/orders")
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.log(err));
    }, []);

    const updateStatus = (id, newStatus) => {
        fetch(`${API_URL}/api/orders/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Update local state to reflect change
                    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
                } else {
                    alert("Failed to update status");
                }
            })
            .catch(err => console.error("Error updating status:", err));
    };

    const markRefunded = (id) => {
        if (!window.confirm("Mark this order as refunded?")) return;

        fetch(`${API_URL}/api/admin/refund/${id}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "x-admin-token": localStorage.getItem("adminToken") || "admin-token"
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrders(prev => prev.map(o => o.id === id ? { ...o, refund_status: "Refunded" } : o));
                } else {
                    alert(data.message || "Failed to update refund status");
                }
            })
            .catch(err => console.error("Error updating refund status:", err));
    };

    return (
        <AdminLayout>
            <div className="admin-orders">
                <h1 style={{ marginBottom: "30px", color: "#2e7d32" }}>Manage Orders</h1>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Email</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Refund</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.user_email}</td>
                                    <td>₹{order.total}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status || 'pending'}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {(order.refund_status || "").trim().toLowerCase() === 'pending' ? (
                                            <button
                                                onClick={() => markRefunded(order.id)}
                                                style={{
                                                    background: "#4caf50",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    fontSize: "0.8rem",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                Mark as Refunded
                                            </button>
                                        ) : (
                                            <span style={{
                                                fontSize: "0.85rem",
                                                color: (order.refund_status || "").trim().toLowerCase() === 'refunded' ? "#2e7d32" : "#666",
                                                fontWeight: (order.refund_status || "").trim().toLowerCase() === 'refunded' ? "bold" : "normal"
                                            }}>
                                                {order.refund_status || 'None'}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            style={{ padding: "5px", borderRadius: "5px" }}
                                            defaultValue={order.status || "pending"}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                        <button
                                            style={{ marginLeft: "10px", color: "blue", border: "none", background: "none", cursor: "pointer" }}
                                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <p style={{ textAlign: "center", padding: "20px" }}>No orders found.</p>}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
