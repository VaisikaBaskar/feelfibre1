import React from "react";
import "../../styles/admin.css";

const DashboardStats = ({ statsData }) => {
    const stats = [
        { title: "Total Sales", value: `₹${statsData?.totalSales?.toLocaleString() || 0}`, growth: "+12%", isPositive: true },
        { title: "Total Orders", value: statsData?.totalOrders || 0, growth: "+8%", isPositive: true },
        { title: "Total Customers", value: statsData?.totalCustomers || 0, growth: "+5%", isPositive: true },
        { title: "Total Visitors", value: statsData?.totalVisitors || 0, growth: "+10%", isPositive: true }
    ];

    return (
        <div className="stats-row">
            {stats.map((item, index) => (
                <div key={index} className="stat-card">
                    <div className="stats-title">{item.title}</div>
                    <div className="stats-value">{item.value}</div>
                    <div className={`stats-growth ${item.isPositive ? "positive" : "negative"}`}>
                        {item.growth} <span>from last month</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
