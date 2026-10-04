import React from "react";
import "../../styles/admin.css";

const ActiveUsers = ({ stats }) => {
    // Extract values safely with optional chaining
    const totalUsers = stats?.totalCustomers || 0;
    const activeUsers = stats?.totalVisitors || 0;

    // Calculate active percentage safely
    const activePercentage = totalUsers > 0
        ? Math.round((activeUsers / totalUsers) * 100)
        : 0;

    // SVG Constants for circular progress
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (activePercentage / 100) * circumference;

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: 0
        }}>
            <h2 className="analytics-title" style={{ width: "100%", textAlign: "left", marginBottom: "12px" }}>Active Users Analytics</h2>

            <div style={{ position: "relative", display: "inline-flex", marginBottom: "12px" }}>
                {/* Circular Progress SVG */}
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <defs>
                        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4caf50" />
                            <stop offset="100%" stopColor="#2e7d32" />
                        </linearGradient>
                    </defs>
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#f0f0f0"
                        strokeWidth="8"
                    />
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="url(#greenGradient)"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        style={{
                            strokeDashoffset: offset,
                            transition: "stroke-dashoffset 0.8s ease-in-out",
                            strokeLinecap: "round",
                            transform: "rotate(-90deg)",
                            transformOrigin: "center"
                        }}
                    />
                </svg>

                {/* Inner Number */}
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1b5e20", lineHeight: "1" }}>
                        {activeUsers.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#666", marginTop: "2px" }}>Active</span>
                </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", color: "#2e7d32", fontWeight: "bold", fontSize: "0.85rem" }}>
                    <span>↑ +2</span>
                    <span style={{ fontWeight: "normal", color: "#999" }}>from last hour</span>
                </div>
            </div>

            <div style={{
                width: "100%",
                borderTop: "1px solid #f0f0f0",
                paddingTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div style={{ textAlign: "left" }}>
                    <p style={{ margin: "0", fontSize: "0.75rem", color: "#666" }}>Registered:</p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.95rem", fontWeight: "bold", color: "#333" }}>{totalUsers.toLocaleString()}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0", fontSize: "0.85rem", color: "#666" }}>Rate:</p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.95rem", fontWeight: "bold", color: "#2e7d32" }}>{activePercentage}%</p>
                </div>
            </div>
        </div>
    );
};

export default ActiveUsers;
