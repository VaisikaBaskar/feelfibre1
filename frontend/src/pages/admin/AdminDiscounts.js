import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import "../../styles/admin.css";

const AdminDiscounts = () => {
    const [coupons, setCoupons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        expiry_date: "",
        applicable_products: ""
    });

    const fetchCoupons = () => {
        axios.get("http://localhost:5000/api/coupons")
            .then(res => {
                setCoupons(res.data);
            })
            .catch(err => {
                console.error("Error fetching coupons:", err);
            });
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/coupons", formData);
            alert("Coupon Created Successfully");
            setShowForm(false);
            setFormData({ code: "", discount: "", expiry_date: "", applicable_products: "" });
            fetchCoupons();
        } catch (error) {
            console.error("Error creating coupon:", error);
            alert("Failed to create coupon");
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "disabled" : "active";
        try {
            await axios.put(`http://localhost:5000/api/coupons/${id}/status`, { status: newStatus });
            fetchCoupons();
        } catch (error) {
            console.error("Error toggling coupon status:", error);
            alert("Failed to update status");
        }
    };

    return (
        <AdminLayout>
            <div className="admin-discounts">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h1 style={{ color: "#2e7d32" }}>Discount Coupons</h1>
                    <button
                        className="admin-primary-btn"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? "Cancel" : "Create Coupon"}
                    </button>
                </div>

                {showForm && (
                    <div className="admin-table-container" style={{ marginBottom: "30px", padding: "20px" }}>
                        <h2 style={{ marginBottom: "20px", color: "#2e7d32" }}>New Coupon</h2>
                        <form onSubmit={handleSubmit} className="coupon-form-grid">
                            <div className="coupon-field">
                                <label>Coupon Code</label>
                                <input
                                    className="admin-input"
                                    type="text"
                                    placeholder="e.g. SAVE10"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    required
                                />
                            </div>
                            <div className="coupon-field">
                                <label>Discount (%)</label>
                                <input
                                    className="admin-input"
                                    type="number"
                                    placeholder="0"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="coupon-field">
                                <label>Expiry Date</label>
                                <input
                                    className="admin-input"
                                    type="date"
                                    value={formData.expiry_date}
                                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="coupon-field">
                                <label>Applicable Products (Optional IDs, comma-separated)</label>
                                <input
                                    className="admin-input"
                                    type="text"
                                    placeholder="e.g. 1,2,5"
                                    value={formData.applicable_products}
                                    onChange={(e) => setFormData({ ...formData, applicable_products: e.target.value })}
                                />
                            </div>
                            <div className="coupon-button">
                                <button type="submit" className="admin-primary-btn">Save Coupon</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Expiry</th>
                                <th>Restriction</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((c, i) => (
                                <tr key={i}>
                                    <td><strong>{c.code}</strong></td>
                                    <td>{c.discount}%</td>
                                    <td>{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : "No Date"}</td>
                                    <td style={{ fontSize: "12px", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {c.applicable_products ? `Products: ${c.applicable_products}` : "Global"}
                                    </td>
                                    <td style={{ color: c.status === "active" ? "green" : "red" }}>{c.status}</td>
                                    <td>
                                        <button
                                            onClick={() => handleStatusToggle(c.id, c.status)}
                                            style={{
                                                color: c.status === "active" ? "red" : "#2e7d32",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {c.status === "active" ? "Disable" : "Enable"}
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

export default AdminDiscounts;
