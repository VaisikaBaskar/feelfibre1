import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin.css";

const AdminHeader = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const adminName = localStorage.getItem("adminName") || "Admin User";

    const handleLogout = () => {
        localStorage.removeItem("admin");
        localStorage.removeItem("adminEmail");
        window.location.href = "/login";
    };

    const suggestions = [
        "Health Mix", "Baby Mix", "Combo Pack", "Order #1024", "Order #1025", "Vicky", "Anu"
    ].filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm !== "");

    return (
        <header className="admin-header">
            {/* Search Bar */}
            <div className="admin-search-container">
                <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search Products, Orders, Customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {suggestions.length > 0 && (
                    <div className="admin-dropdown" style={{ top: "45px", width: "100%" }}>
                        {suggestions.map((s, i) => (
                            <div key={i} className="dropdown-item" onClick={() => setSearchTerm(s)}>
                                🔍 {s}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Side Icons & Profile */}
            <div className="header-right">
                {/* Messages */}
                <div className="header-icon-wrapper" onClick={() => {
                    setShowMessages(!showMessages);
                    setShowNotifications(false);
                    setShowProfile(false);
                }}>
                    ✉️
                    <span className="badge">2</span>
                    {showMessages && (
                        <div className="admin-dropdown">
                            <div className="dropdown-item"><strong>John:</strong> Order enquiry...</div>
                            <div className="dropdown-item"><strong>Priya:</strong> Delivery question?</div>
                            <Link to="/admin/helps" className="dropdown-item" style={{ textAlign: "center", color: "#2e7d32" }}>View All Messages</Link>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="header-icon-wrapper" onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowMessages(false);
                    setShowProfile(false);
                }}>
                    🔔
                    <span className="badge">3</span>
                    {showNotifications && (
                        <div className="admin-dropdown">
                            <div className="dropdown-item">📦 New Order Received</div>
                            <div className="dropdown-item">👤 Customer Registered</div>
                            <div className="dropdown-item">⚠️ Stock Updated</div>
                            <Link to="/admin/dashboard" className="dropdown-item" style={{ textAlign: "center", color: "#2e7d32" }}>View All Notifications</Link>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="admin-profile-section" style={{ position: "relative" }}>
                    <div className="admin-profile-header" onClick={() => {
                        setShowProfile(!showProfile);
                        setShowNotifications(false);
                        setShowMessages(false);
                    }}>
                        <div className="admin-avatar">{adminName.charAt(0)}</div>
                        <span style={{ fontWeight: "600", color: "#333" }}>{adminName}</span>
                        <span style={{ fontSize: "0.8rem" }}>▼</span>
                    </div>

                    {showProfile && (
                        <div className="admin-dropdown" style={{ width: "200px" }}>
                            <Link to="/admin/settings" className="dropdown-item">👤 My Profile</Link>
                            <Link to="/admin/settings" className="dropdown-item">⚙️ Account Settings</Link>
                            <div className="dropdown-item" onClick={handleLogout} style={{ color: "#e53935", cursor: "pointer" }}>🚪 Logout</div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
