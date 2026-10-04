import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin.css";

const ConversionRate = () => {
    const [conversion, setConversion] = useState({
        views: 0,
        cart: 0,
        checkout: 0,
        purchased: 0,
        abandoned: 0
    });

    useEffect(() => {
        axios.get("http://localhost:5000/api/conversion")
            .then(res => {
                setConversion(res.data);
            })
            .catch(err => {
                console.error("Error fetching conversion data:", err);
            });
    }, []);

    const funnelData = [
        { stage: "Product Views", value: conversion.views || 0, color: "#1b5e20" },
        { stage: "Add to Cart", value: conversion.cart || 0, color: "#2e7d32" },
        { stage: "Checkout", value: conversion.checkout || 0, color: "#388e3c" },
        { stage: "Purchased", value: conversion.purchased || 0, color: "#4caf50" },
        { stage: "Abandoned Cart", value: conversion.abandoned || 0, color: "#e53935" },
    ];

    return (
        <div className="admin-analytics-card">
            <h2 className="analytics-title">Sales Conversion Funnel</h2>
            <div className="funnel-container" style={{ overflow: "hidden" }}>
                {funnelData.map((item, index) => (
                    <div key={index} className="funnel-box-wrapper">
                        <div
                            className="funnel-box"
                            style={{
                                backgroundColor: item.color,
                                width: `${100 - (index * 10)}%`,
                                maxWidth: "100%",
                                boxSizing: "border-box",
                                margin: "0 auto"
                            }}
                        >
                            <div className="funnel-info">
                                <span className="funnel-stage">{item.stage}</span>
                                <span className="funnel-value">{item.value.toLocaleString()}</span>
                            </div>
                        </div>
                        {index < funnelData.length - 1 && (
                            <div className="funnel-arrow">▼</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversionRate;
