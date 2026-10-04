import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import "../../styles/admin.css";

const TopCategories = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/category-sales")
            .then(res => {
                // Ensure the response data matches expected format
                setData(res.data);
            })
            .catch(err => {
                console.error("Error fetching category sales:", err);
            });
    }, []);

    return (
        <div style={{ padding: "0" }}>
            <h2 className="analytics-title">Top Categories Sales</h2>
            <div className="chart-container-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#666" }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#666" }} />
                        <Tooltip cursor={{ fill: "#f9fbf9" }} />
                        <Bar dataKey="sales" radius={[4, 4, 0, 0]} barSize={40}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={"#2e7d32"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopCategories;
