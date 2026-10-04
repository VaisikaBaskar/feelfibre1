import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateFunnelMetrics } from "../../utils/analyticsHelper";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import AdminLayout from "./AdminLayout";
import "../../styles/admin.css";

const AdminReports = () => {
    const [reportData, setReportData] = useState([]);
    const [stats, setStats] = useState({ monthlySales: 0, totalRevenue: 0 });
    const [conversion, setConversion] = useState({
        views: 0, cart: 0, checkout: 0, purchased: 0, abandoned: 0
    });
    const [timeFilter, setTimeFilter] = useState("Last 30 days");

    useEffect(() => {
        const fetchSummary = () => {
            // Existing reports API - unchanged
            axios.get("http://localhost:5000/api/reports/summary")
                .then(res => {
                    const data = res.data;
                    setReportData(data.monthlyPerformance);
                    setStats({ monthlySales: data.monthlySales, totalRevenue: data.totalRevenue });
                })
                .catch(err => console.error("Error fetching report data:", err));
        };

        const fetchConversion = () => {
            // Existing conversion API - now includes abandoned session check
            axios.get("http://localhost:5000/api/conversion")
                .then(res => setConversion(res.data))
                .catch(err => console.error("Error fetching conversion data:", err));
        };

        fetchSummary();
        fetchConversion();

        // Refresh analytics every 30 seconds as requested
        const interval = setInterval(fetchConversion, 30000);
        return () => clearInterval(interval);
    }, []);

    const metrics = calculateFunnelMetrics(conversion);

    const conversionCards = [
        {
            title: "Product Views",
            value: metrics.productViews,
            color: "#6366f1",
            barHeights: [12, 18, 14, 22, 16],
            change: "+9%",
            positive: true
        },
        {
            title: "Add to Cart",
            value: metrics.addToCartCount,
            color: "#0ea5e9",
            barHeights: [10, 15, 12, 18, 14],
            change: "+6%",
            positive: true
        },
        {
            title: "Checkout",
            value: metrics.checkoutCount,
            color: "#10b981",
            barHeights: [8, 12, 10, 15, 12],
            change: "+4%",
            positive: true
        },
        {
            title: "Purchased",
            value: metrics.purchasedCount,
            color: "#2e7d32",
            barHeights: [6, 10, 8, 12, 10],
            change: "+7%",
            positive: true
        },
        {
            title: "Abandoned Cart",
            value: metrics.abandonedCart,
            color: "#ef4444",
            barHeights: [4, 8, 6, 10, 8],
            change: "-5%",
            positive: false
        }
    ];

    return (
        <AdminLayout>
            <div className="admin-reports">
                <h1 style={{ marginBottom: "30px", color: "#2e7d32" }}>Sales &amp; Revenue Reports</h1>

                {/* EXISTING Report Stats - Unchanged */}
                <div className="report-stats-row">
                    <div className="report-card">
                        <h3>Monthly Sales</h3>
                        <div className="stat-value">₹{stats.monthlySales.toLocaleString()}</div>
                    </div>
                    <div className="report-card">
                        <h3>Total Revenue</h3>
                        <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
                    </div>
                </div>

                {/* REFINED: Modern Conversion Rate Section */}
                <div style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    marginBottom: "40px",
                    width: "100%",
                    overflow: "hidden"
                }}>
                    {/* Header Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#111827" }}>Conversion Funnel</h2>
                            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>Real-time sales conversion metrics</p>
                        </div>
                        <select
                            value={timeFilter}
                            onChange={e => setTimeFilter(e.target.value)}
                            style={{
                                padding: "8px 14px",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                fontSize: "14px",
                                color: "#334155",
                                background: "#f8fafc",
                                cursor: "pointer",
                                outline: "none"
                            }}
                        >
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                    </div>

                    {/* Conversion Cards Row */}
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "20px",
                        marginTop: "20px",
                        paddingBottom: "10px",
                        width: "100%",
                        overflow: "hidden"
                    }} className="funnel-cards">
                        {conversionCards.map((card, index) => (
                            <div key={index} className="metric-card" style={{
                                background: "#fdfdfd",
                                borderRadius: "12px",
                                padding: "18px",
                                flex: "1 1 180px",
                                minWidth: "180px",
                                maxWidth: "220px",
                                border: "1px solid #f0f0f0",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                transition: "transform 0.2s ease",
                                cursor: "default",
                                display: "flex",
                                flexDirection: "column",
                                position: "relative"
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                {/* Title */}
                                <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "6px" }}>
                                    {card.title}
                                </div>

                                {/* Value */}
                                <div style={{ fontSize: "32px", fontWeight: "700", color: "#111827", lineHeight: 1 }}>
                                    {card.value.toLocaleString()}
                                </div>

                                {/* Trend */}
                                <div style={{
                                    fontSize: "14px",
                                    marginTop: "6px",
                                    fontWeight: "600",
                                    color: card.positive ? "#16a34a" : "#dc2626"
                                }}>
                                    {card.positive ? `+${card.change.replace('+', '')}` : card.change}
                                </div>

                                {/* Mini Bar Chart */}
                                <div className="chart-bars" style={{
                                    display: "flex",
                                    gap: "4px",
                                    marginTop: "12px",
                                    alignItems: "flex-end",
                                    height: "24px"
                                }}>
                                    {card.barHeights.map((h, i) => (
                                        <div key={i} className="chart-bar" style={{
                                            width: "6px",
                                            height: `${h}px`,
                                            borderRadius: "4px",
                                            background: card.color
                                        }} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* EXISTING Monthly Performance Chart - Unchanged */}
                <div className="report-chart">
                    <h2 style={{ marginBottom: "20px" }}>Monthly Performance</h2>
                    <p style={{ color: "#666", marginBottom: "20px" }}>
                        Real-time data for {reportData.length} months analyzed...
                    </p>
                    <div style={{ height: "400px", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 13 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 13 }} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip
                                    cursor={{ fill: '#f8f9fa' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Bar dataKey="revenue" name="Monthly Revenue" fill="#2e7d32" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .funnel-cards {
                        justify-content: center;
                    }
                }
                @media (max-width: 480px) {
                    .metric-card {
                        width: 100% !important;
                        max-width: none !important;
                    }
                }
            `}</style>
        </AdminLayout>
    );
};

export default AdminReports;
