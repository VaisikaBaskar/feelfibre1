import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import API_URL from "../../config/api";
import "../../styles/admin.css";

const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [deliveryAddress, setDeliveryAddress] = React.useState(null);

    React.useEffect(() => {
        // Fetch order details (includes address via LEFT JOIN if available)
        fetch(`${API_URL}/api/orders/details/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setOrderData(data);
                setLoading(false);
                // If JOIN returned address fields, use them directly
                if (data && data.order && data.order.full_name) {
                    setDeliveryAddress(data.order);
                }
            })
            .catch((err) => {
                console.error("Error fetching order details:", err);
                setLoading(false);
            });

        // Also fetch address directly from dedicated endpoint (works for all orders)
        fetch(`${API_URL}/api/delivery-address/order/${id}`)
            .then((res) => res.json())
            .then((addr) => {
                if (addr && addr.full_name) {
                    setDeliveryAddress(addr);
                }
            })
            .catch(() => { });
    }, [id]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="admin-order-details">
                    <h1>Loading Order Details...</h1>
                </div>
            </AdminLayout>
        );
    }

    if (!orderData || !orderData.order) {
        return (
            <AdminLayout>
                <div className="admin-order-details">
                    <h1>Order Not Found</h1>
                    <button onClick={() => navigate("/admin/orders")} className="admin-primary-btn">
                        Back to Orders
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const { order, items } = orderData;

    return (
        <AdminLayout>
            <div className="admin-order-details">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h1 style={{ color: "#2e7d32" }}>Order Details #{order.id}</h1>
                    <button
                        onClick={() => navigate("/admin/orders")}
                        className="admin-primary-btn"
                        style={{ background: "#666" }}
                    >
                        Back to Orders
                    </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
                    <div className="admin-analytics-card" style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                        <h2 style={{ borderBottom: "2px solid #f0f0f0", paddingBottom: "10px", marginBottom: "20px" }}>Order Information</h2>
                        <div style={{ display: "grid", gap: "10px" }}>
                            <p><strong>Order ID:</strong> #{order.id}</p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                            <p><strong>Status:</strong>
                                <span className={`status-badge status-${order.status || 'pending'}`} style={{ marginLeft: "10px" }}>
                                    {order.status || 'Pending'}
                                </span>
                            </p>
                            <p><strong>Payment Method:</strong> {order.payment_method || 'COD'}</p>
                            {order.refund_status && (order.refund_status || "").trim().toLowerCase() !== 'none' && (
                                <p><strong>Refund Status:</strong>
                                    <span style={{
                                        marginLeft: "10px",
                                        fontWeight: "bold",
                                        color: (order.refund_status || "").trim().toLowerCase() === 'refunded' ? "#2e7d32" : "#856404",
                                        background: (order.refund_status || "").trim().toLowerCase() === 'refunded' ? "#e8f5e9" : "#fff3cd",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        fontSize: "0.85rem"
                                    }}>
                                        {order.refund_status}
                                    </span>
                                </p>
                            )}
                            <p style={{ fontSize: "1.2rem", color: "#2e7d32", marginTop: "10px" }}>
                                <strong>Total Amount:</strong> ₹{order.total_amount?.toLocaleString() || order.total?.toLocaleString() || 0}
                            </p>
                        </div>
                    </div>

                    <div className="admin-analytics-card" style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                        <h2 style={{ borderBottom: "2px solid #f0f0f0", paddingBottom: "10px", marginBottom: "20px" }}>Customer & Delivery</h2>
                        <div style={{ display: "grid", gap: "10px" }}>
                            <p><strong>Email:</strong> {order.user_email}</p>
                            {deliveryAddress ? (
                                <>
                                    <p><strong>Name:</strong> {deliveryAddress.full_name}</p>
                                    <p><strong>Phone:</strong> {deliveryAddress.phone}</p>
                                    <p><strong>Address:</strong> {deliveryAddress.address_line}, {deliveryAddress.city}, {deliveryAddress.state} – {deliveryAddress.pincode}</p>
                                </>
                            ) : (
                                <p style={{ color: "#666", fontStyle: "italic", fontSize: "0.9rem" }}>No delivery address on record for this order.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="admin-table-container">
                    <h2 style={{ padding: "20px", borderBottom: "1px solid #eee" }}>Products Ordered</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{item.price?.toLocaleString()}</td>
                                    <td>₹{item.subtotal?.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrderDetails;
