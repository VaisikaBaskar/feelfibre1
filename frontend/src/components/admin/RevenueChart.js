import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../../styles/admin.css";

const RevenueChart = ({ data, onFilterChange }) => {
    const [filter, setFilter] = useState("Last 8 Days");

    const dropdownOptions = ["Last 8 Days", "Last Month", "Last Year"];

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilter(value);
        if (value === "Last 8 Days") onFilterChange(8);
        else if (value === "Last Month") onFilterChange(30);
        else if (value === "Last Year") onFilterChange(365);
    };

    return (
        <div style={{ padding: "0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h2 className="analytics-title" style={{ margin: 0 }}>Revenue Analytics</h2>
                <select
                    className="chart-filter"
                    value={filter}
                    onChange={handleFilterChange}
                    style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.75rem",
                        color: "#64748b",
                        outline: "none",
                        background: "#f9f9f9"
                    }}
                >
                    {dropdownOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
            <div className="chart-container-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#666" }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#666" }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#2e7d32" strokeWidth={2.5} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
