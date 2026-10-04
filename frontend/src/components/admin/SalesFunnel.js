import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateFunnelMetrics } from "../../utils/analyticsHelper";
import "../../styles/admin.css";

const SalesFunnel = () => {
    const [funnelData, setFunnelData] = useState({
        views: 0,
        addToCart: 0,
        checkout: 0,
        purchased: 0,
        abandoned: 0
    });
    const [timeFilter, setTimeFilter] = useState("Last 30 days");

    const fetchFunnelStats = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/funnel-stats");
            setFunnelData(res.data);
        } catch (err) {
            console.error("Error fetching funnel stats:", err);
        }
    };

    useEffect(() => {
        fetchFunnelStats();
        const interval = setInterval(fetchFunnelStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const metrics = calculateFunnelMetrics(funnelData);

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
        <div className="funnel-inner-wrapper" style={{ width: "100%" }}>
            {/* Header Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#111827", fontWeight: "700" }}>Conversion Funnel</h2>
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
            <div className="funnel-cards" style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                paddingBottom: "10px",
                width: "100%"
            }}>
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
                            height: "20px"
                        }}>
                            {card.barHeights.map((h, i) => (
                                <div key={i} className="chart-bar" style={{
                                    width: "6px",
                                    height: `${h}px`,
                                    borderRadius: "4px",
                                    background: card.color || "#6366f1"
                                }} />
                            ))}
                        </div>
                    </div>
                ))}
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
        </div>
    );
};

export default SalesFunnel;
