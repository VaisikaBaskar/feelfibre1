import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

function Orders() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) return;

        try {
            const response = await axios.get(API_URL + "/orders/user/" + userEmail);
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const response = await axios.post(API_URL + "/orders/cancel/" + orderId);
            if (response.data.success) {
                alert("Order cancelled successfully");
                fetchOrders(); // Refresh list
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to cancel order";
            alert(errorMsg);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ color: "#2e7d32", marginBottom: "20px" }}>Your Orders</h1>
            {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <h3>No Orders Yet</h3>
                    <Link to="/products">
                        <button style={{
                            marginTop: "15px",
                            padding: "10px 20px",
                            background: "#2e7d32",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}>
                            Go Shopping
                        </button>
                    </Link>
                </div>
            ) : (
                orders.map((order, index) => (
                    <div key={index}
                        style={{
                            background: "white",
                            border: "1px solid #eee",
                            marginBottom: "15px",
                            padding: "20px",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                        }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <h3 style={{ margin: "0 0 10px 0" }}>Order #{order.id}</h3>
                                <p style={{ margin: "5px 0", color: "#666" }}>Total Price: <span style={{ fontWeight: "bold", color: "#333" }}>₹{order.total}</span></p>
                                <p style={{ margin: "5px 0", color: "#666" }}>Date: {new Date(order.created_at).toLocaleString()}</p>
                                <p style={{ margin: "5px 0", color: "#666" }}>Payment Method: {order.payment_method}</p>
                                <p style={{ margin: "10px 0" }}>
                                    Status: <span style={{
                                        fontWeight: "bold",
                                        color: (order.status || "").toLowerCase() === "cancelled" ? "#e53935" :
                                            (order.status || "").toLowerCase() === "delivered" ? "#4caf50" :
                                                (order.status || "").toLowerCase() === "shipped" ? "#1976d2" : "#ff9800",
                                        padding: "4px 8px",
                                        background: (order.status || "").toLowerCase() === "cancelled" ? "#ffebee" :
                                            (order.status || "").toLowerCase() === "delivered" ? "#e8f5e9" :
                                                (order.status || "").toLowerCase() === "shipped" ? "#e3f2fd" : "#fff3e0",
                                        borderRadius: "4px",
                                        fontSize: "0.85rem",
                                        marginLeft: "5px",
                                        textTransform: "capitalize"
                                    }}>{order.status || "Placed"}</span>
                                </p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {(order.status || "").trim().toLowerCase() !== "delivered" && (
                                    <Link to={`/track-order/${order.id}`}>
                                        <button style={{
                                            display: "inline-block",
                                            width: "140px",
                                            padding: "8px 16px",
                                            background: "#2e7d32",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            fontSize: "0.9rem",
                                            boxSizing: "border-box"
                                        }}>
                                            Track Order
                                        </button>
                                    </Link>
                                )}

                                {(!order.status || ["placed", "processing", "pending"].includes((order.status || "").trim().toLowerCase())) && (
                                    <button
                                        onClick={() => {
                                            console.log("Attempting to cancel order:", order.id);
                                            handleCancelOrder(order.id);
                                        }}
                                        style={{
                                            display: "inline-block",
                                            width: "140px",
                                            padding: "8px 16px",
                                            background: "#e53935",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            fontSize: "0.9rem",
                                            boxSizing: "border-box"
                                        }}
                                    >
                                        Cancel Order
                                    </button>
                                )}

                                {((order.status || "").trim().toLowerCase() === "cancelled" || (order.status || "").trim().toLowerCase() === "canceled") && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                        <span style={{
                                            display: "inline-block",
                                            width: "140px",
                                            textAlign: "center",
                                            padding: "8px 16px",
                                            background: "#ffebee",
                                            color: "#c62828",
                                            borderRadius: "6px",
                                            fontWeight: "600",
                                            fontSize: "0.9rem",
                                            boxSizing: "border-box"
                                        }}>
                                            Order Cancelled
                                        </span>

                                        {/* Refund Status stickers */}
                                        {(order.refund_status || "").trim().toLowerCase() === "pending" && (
                                            <span style={{
                                                display: "inline-block",
                                                width: "140px",
                                                textAlign: "center",
                                                padding: "6px 12px",
                                                background: "#fff3cd",
                                                color: "#856404",
                                                borderRadius: "6px",
                                                fontWeight: "600",
                                                fontSize: "0.8rem",
                                                boxSizing: "border-box"
                                            }}>
                                                Refund Processing
                                            </span>
                                        )}

                                        {(order.refund_status || "").trim().toLowerCase() === "refunded" && (
                                            <span style={{
                                                display: "inline-block",
                                                width: "140px",
                                                textAlign: "center",
                                                padding: "6px 12px",
                                                background: "#e8f5e9",
                                                color: "#2e7d32",
                                                borderRadius: "6px",
                                                fontWeight: "600",
                                                fontSize: "0.8rem",
                                                boxSizing: "border-box"
                                            }}>
                                                Refund Completed
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Orders;
