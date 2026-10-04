import React, { useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/admin.css";

const AdminLayout = ({ children }) => {

    useEffect(() => {
        const admin = localStorage.getItem("admin");
        if (!admin) {
            window.location.href = "/login";
            return;
        }
        // Restore admin token for axios on every page load / refresh
        const token = localStorage.getItem("adminToken");
        if (token) {
            axios.defaults.headers.common["x-admin-token"] = token;
        }
    }, []);

    return (
        <div className="admin-layout">
            <AdminHeader />
            <AdminSidebar />
            <main className="admin-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
