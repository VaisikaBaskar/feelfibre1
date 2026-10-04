import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import "../../styles/admin.css";

const COLORS = ["#1b5e20", "#2e7d32", "#4caf50", "#81c784", "#a5d6a7"];

const TrafficSources = () => {
    const [traffic, setTraffic] = useState([]);

    useEffect(() => {
        const fetchTraffic = () => {
            axios.get("http://localhost:5000/api/traffic-sources")
                .then(res => {
                    setTraffic(res.data);
                })
                .catch(err => {
                    console.error("Error fetching traffic sources:", err);
                });
        };

        fetchTraffic();
        const interval = setInterval(fetchTraffic, 10000);
        return () => clearInterval(interval);
    }, []);

    const chartData = traffic.map((item, index) => ({
        name: item.source,
        value: item.total || 0,
        color: COLORS[index % COLORS.length]
    }));

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="admin-analytics-card" style={{ padding: "10px" }}>
            <h2 className="analytics-title">Traffic Sources Analytics</h2>
            <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" align="center" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrafficSources;
