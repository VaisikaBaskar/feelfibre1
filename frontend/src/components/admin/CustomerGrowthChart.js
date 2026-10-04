import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Defs,
    LinearGradient,
    Stop
} from "recharts";

const CustomerGrowthChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/admin/customer-growth");
                const apiData = res.data; // Array of { day: "YYYY-MM-DD", customers: N }

                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const fullResults = [];

                // Generate last 7 days including today
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    const labelStr = `${d.getDate()} ${monthNames[d.getMonth()]}`;

                    const match = apiData.find(item => item.day === dayStr);
                    fullResults.push({
                        name: labelStr,
                        customers: match ? match.customers : 0
                    });
                }

                setData(fullResults);
            } catch (error) {
                console.error("Error fetching customer growth data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="analytics-card" style={{ height: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p>Loading Chart...</p>
        </div>
    );

    return (
        <div style={{ padding: "0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                    <h2 className="analytics-title" style={{ margin: 0 }}>Customer Growth</h2>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>New registrations over time</p>
                </div>
                <select style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.75rem",
                    color: "#64748b",
                    outline: "none"
                }}>
                    <option>Last 7 days</option>
                </select>
            </div>

            <div className="chart-container-wrapper">
                <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            dy={5}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            width={25}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                fontSize: "12px"
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="customers"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCustomers)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CustomerGrowthChart;
