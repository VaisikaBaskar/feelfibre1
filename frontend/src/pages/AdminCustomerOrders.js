import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./admin/AdminLayout";

function AdminCustomerOrders() {
    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/customer-orders/${id}`)
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching customer orders:", err);
                setLoading(false);
            });
    }, [id]);

    return (
        <AdminLayout>
            <div className="admin-orders" style={{ padding: "40px" }}>
                <h2 style={{ color: "#2e7d32", marginBottom: "30px" }}>Customer Order History</h2>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No orders found for this customer.</td></tr>
                            ) : (
                                orders.map((o, index) => (
                                    <tr key={index}>
                                        <td><strong>#{o.order_id}</strong></td>
                                        <td>{o.product_name}</td>
                                        <td>{o.quantity}</td>
                                        <td>₹{o.price}</td>
                                        <td>₹{o.total}</td>
                                        <td>{new Date(o.order_date).toLocaleDateString()}</td>
                                        <td>
                                            <span style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                background: o.status === "Delivered" ? "#e8f5e9" : "#fff3e0",
                                                color: o.status === "Delivered" ? "#2e7d32" : "#ef6c00"
                                            }}>
                                                {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminCustomerOrders;
