import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import DashboardStats from "../../components/admin/DashboardStats";
import RevenueChart from "../../components/admin/RevenueChart";
import TopCategories from "../../components/admin/TopCategories";
import ActiveUsers from "../../components/admin/ActiveUsers";
import SalesFunnel from "../../components/admin/SalesFunnel";
import CustomerGrowthChart from "../../components/admin/CustomerGrowthChart";
import "../../styles/admin.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalVisitors: 0
    });

    const [revenueData, setRevenueData] = useState([]);

    const generateFullDateRange = (data, days) => {
        const result = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Format for comparison (YYYY-MM-DD)
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const dateStr = `${year}-${month}-${day}`;

            // Format for display (DD MMM)
            const displayDay = String(date.getDate()).padStart(2, "0");
            const displayMonth = monthNames[date.getMonth()];
            const displayName = `${displayDay} ${displayMonth}`;

            const existingEntry = data.find(item => {
                // Backend now returns exact 'YYYY-MM-DD' string via DATE_FORMAT
                return item.orderDate === dateStr;
            });

            result.push({
                name: displayName,
                date: dateStr,
                revenue: existingEntry ? existingEntry.dailyRevenue : 0
            });
        }
        return result;
    };

    const [monthlyTargetData, setMonthlyTargetData] = useState(null);

    const fetchMonthlyTarget = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/monthly-target");
            setMonthlyTargetData(res.data);
        } catch (error) {
            console.error("Error fetching monthly target:", error);
            setMonthlyTargetData(null);
        }
    };

    const fetchRevenue = async (days = 8) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/revenue?days=${days}`);
            const data = res.data;
            const formattedData = generateFullDateRange(data, days);
            setRevenueData(formattedData);
        } catch (err) {
            console.error("Error fetching revenue data:", err);
            setRevenueData([]);
        }
    };

    const refreshStats = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/stats");
            setStats(res.data);
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            setStats({
                totalSales: 0,
                totalOrders: 0,
                totalCustomers: 0,
                totalVisitors: 0
            });
        }
    };

    useEffect(() => {
        refreshStats();
        fetchRevenue(8);
        fetchMonthlyTarget();
        const interval = setInterval(() => {
            refreshStats();
            fetchMonthlyTarget();
        }, 10000); // refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <AdminLayout>
            <div className="admin-dashboard">
                <h1 style={{ marginBottom: "30px", color: "#2e7d32" }}>Admin Dashboard</h1>

                <DashboardStats statsData={stats} />
                <div className="dashboard-row-two">
                    <div className="revenue-chart-container">
                        <RevenueChart data={revenueData} onFilterChange={fetchRevenue} />
                    </div>
                    <div className="customer-growth-container">
                        <CustomerGrowthChart />
                    </div>
                </div>

                <div className="monthly-target-section" style={{ background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "1.2rem", color: "#333" }}>Monthly Sales Target</h2>
                        <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>
                            {monthlyTargetData?.achievementPercentage || 0}% Achieved
                        </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                        <div style={{ textAlign: "center", padding: "15px", background: "#f9f9f9", borderRadius: "8px" }}>
                            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "5px" }}>Target Amount:</p>
                            <h3 style={{ fontSize: "1.3rem", color: "#333" }}>₹{monthlyTargetData?.targetAmount?.toLocaleString() || "0"}</h3>
                        </div>
                        <div style={{ textAlign: "center", padding: "15px", background: "#f9f9f9", borderRadius: "8px" }}>
                            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "5px" }}>Achieved Revenue:</p>
                            <h3 style={{ fontSize: "1.3rem", color: "#2e7d32" }}>₹{monthlyTargetData?.achievedRevenue?.toLocaleString() || "0"}</h3>
                        </div>
                        <div style={{ textAlign: "center", padding: "15px", background: "#f9f9f9", borderRadius: "8px" }}>
                            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "5px" }}>Remaining Amount:</p>
                            <h3 style={{ fontSize: "1.3rem", color: "#ff9800" }}>₹{monthlyTargetData?.remainingAmount?.toLocaleString() || "0"}</h3>
                        </div>
                        <div style={{ textAlign: "center", padding: "15px", background: "#f9f9f9", borderRadius: "8px" }}>
                            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "5px" }}>Achievement:</p>
                            <h3 style={{ fontSize: "1.3rem", color: "#2196f3" }}>{monthlyTargetData?.achievementPercentage || 0}%</h3>
                        </div>
                    </div>

                    <div style={{ width: "100%", height: "12px", background: "#eee", borderRadius: "6px", overflow: "hidden" }}>
                        <div style={{
                            width: `${monthlyTargetData?.achievementPercentage || 0}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #4caf50, #8bc34a)",
                            transition: "width 0.5s ease-in-out"
                        }}></div>
                    </div>
                </div>

                <div className="dashboard-row-two">
                    <div className="top-categories-container">
                        <TopCategories />
                    </div>
                    <div className="active-users-container">
                        <ActiveUsers stats={stats} />
                    </div>
                </div>

                <div className="dashboard-bottom-row" style={{ gridTemplateColumns: "1fr", marginTop: "40px" }}>
                    <div className="sales-funnel-container" style={{ minHeight: "auto", padding: "0", background: "transparent", boxShadow: "none" }}>
                        <SalesFunnel />
                    </div>
                </div>




            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
