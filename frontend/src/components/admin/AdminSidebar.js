import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/admin.css";

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
        { name: "Orders", path: "/admin/orders", icon: "📋" },
        { name: "Products", path: "/admin/products", icon: "📦" },
        { name: "Customers", path: "/admin/customers", icon: "👥" },
        { name: "Reports", path: "/admin/reports", icon: "📈" },
        { name: "Discounts", path: "/admin/discounts", icon: "🏷️" },
        { name: "Locked Accounts", path: "/admin/locked-users", icon: "🔒" },
        { name: "Integration", path: "/admin/integration", icon: "🔗" },
        { name: "Settings", path: "/admin/settings", icon: "⚙️" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("admin");
        localStorage.removeItem("adminEmail");
        window.location.href = "/login";
    };

    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar-header">
                <h2>feelfibre Admin</h2>
            </div>
            <nav>
                <ul className="admin-nav">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`admin-nav-item ${location.pathname === item.path ? "active" : ""}`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={handleLogout}
                            className="admin-nav-item"
                            style={{
                                width: "100%",
                                textAlign: "left",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                borderTop: "1px solid #333",
                                marginTop: "20px"
                            }}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminSidebar;
