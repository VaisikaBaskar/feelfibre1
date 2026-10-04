import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config/api";
import "../styles/admin.css"; // Using some existing admin-like clean styles or basic styles

const ManageAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        is_default: false
    });

    // Get user id from local storage
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/user-addresses/user/${userId}`);
            setAddresses(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching addresses:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleEdit = (addr) => {
        setFormData({
            id: addr.id,
            full_name: addr.full_name,
            phone: addr.phone,
            address_line: addr.address_line,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            is_default: addr.is_default === 1
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;

        try {
            await axios.delete(`${API_URL}/api/user-addresses/${id}`);
            fetchAddresses();
        } catch (error) {
            console.error("Error deleting address:", error);
            alert("Failed to delete address");
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await axios.patch(`${API_URL}/api/user-addresses/${id}/default`, { user_id: userId });
            fetchAddresses();
        } catch (error) {
            console.error("Error setting default:", error);
            alert("Failed to set default address");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.full_name || !formData.phone || !formData.address_line || !formData.city || !formData.state || !formData.pincode) {
            alert("Please fill all required fields");
            return;
        }

        if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
            alert("Phone number must be 10 digits");
            return;
        }

        if (formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode)) {
            alert("Pincode must be 6 digits");
            return;
        }

        const payload = { ...formData, user_id: userId };

        try {
            if (formData.id) {
                // Update
                await axios.put(`${API_URL}/api/user-addresses/${formData.id}`, payload);
                if (formData.is_default) {
                    await axios.patch(`${API_URL}/api/user-addresses/${formData.id}/default`, { user_id: userId });
                }
            } else {
                // Create
                await axios.post(`${API_URL}/api/user-addresses`, payload);
            }
            fetchAddresses();
            resetForm();
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Failed to save address");
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            full_name: "",
            phone: "",
            address_line: "",
            city: "",
            state: "",
            pincode: "",
            is_default: false
        });
        setShowForm(false);
    };

    if (!user) {
        return (
            <div style={{ padding: "40px", textAlign: "center", minHeight: "50vh" }}>
                <h2>Please log in to manage your addresses</h2>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px", minHeight: "70vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "15px", marginBottom: "30px" }}>
                <h1 style={{ color: "#2e7d32", margin: 0 }}>Manage Addresses</h1>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            background: "#d32f2f",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        + Add New Address
                    </button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>Loading addresses...</div>
            ) : (
                <>
                    {showForm && (
                        <div style={{ background: "#f9f9f9", padding: "25px", borderRadius: "10px", marginBottom: "30px", border: "1px solid #ddd" }}>
                            <h3 style={{ marginTop: 0 }}>{formData.id ? "Edit Address" : "Add New Address"}</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Full Name *</label>
                                        <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Phone *</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required maxLength="10" style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Address Line *</label>
                                    <input type="text" name="address_line" value={formData.address_line} onChange={handleInputChange} required placeholder="Street address, nearest landmark" style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>City *</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>State *</label>
                                        <input type="text" name="state" value={formData.state} onChange={handleInputChange} required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Pincode *</label>
                                        <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required maxLength="6" style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
                                    <input type="checkbox" id="is_default" name="is_default" checked={formData.is_default} onChange={handleInputChange} style={{ marginRight: "10px", width: "18px", height: "18px" }} />
                                    <label htmlFor="is_default" style={{ cursor: "pointer" }}>Set as default address</label>
                                </div>

                                <div style={{ display: "flex", gap: "15px" }}>
                                    <button type="submit" style={{ background: "#2e7d32", color: "white", padding: "10px 25px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                                        Save Address
                                    </button>
                                    <button type="button" onClick={resetForm} style={{ background: "#666", color: "white", padding: "10px 25px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {!showForm && addresses.length === 0 && (
                        <div style={{ textAlign: "center", padding: "40px", background: "#f5f5f5", borderRadius: "10px", color: "#666" }}>
                            <h3>You haven't saved any addresses yet.</h3>
                            <p>Save your addresses here to make checkout faster and easier.</p>
                        </div>
                    )}

                    {!showForm && addresses.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                            {addresses.map((addr) => (
                                <div key={addr.id} style={{
                                    border: addr.is_default ? "2px solid #2e7d32" : "1px solid #ddd",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    background: "#fff",
                                    position: "relative",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                                }}>
                                    {addr.is_default === 1 && (
                                        <span style={{ position: "absolute", top: "15px", right: "15px", background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "bold" }}>
                                            Default
                                        </span>
                                    )}
                                    <h3 style={{ margin: "0 0 10px 0" }}>{addr.full_name}</h3>
                                    <p style={{ margin: "5px 0", color: "#666" }}><strong>Phone:</strong> {addr.phone}</p>
                                    <p style={{ margin: "5px 0", color: "#666", lineHeight: "1.5" }}>
                                        {addr.address_line}<br />
                                        {addr.city}, {addr.state} - {addr.pincode}
                                    </p>

                                    <div style={{ display: "flex", gap: "10px", marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                                        <button onClick={() => handleEdit(addr)} style={{ flex: 1, padding: "8px", background: "#f0f0f0", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", color: "#333" }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(addr.id)} style={{ flex: 1, padding: "8px", background: "#ffebee", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", color: "#d32f2f" }}>
                                            Delete
                                        </button>
                                    </div>
                                    {addr.is_default !== 1 && (
                                        <button onClick={() => handleSetDefault(addr.id)} style={{ width: "100%", marginTop: "10px", padding: "8px", background: "transparent", border: "1px solid #2e7d32", color: "#2e7d32", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                                            Set as Default
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ManageAddresses;
