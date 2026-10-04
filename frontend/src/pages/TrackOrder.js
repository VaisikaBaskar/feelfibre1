import React from "react";
import { useParams } from "react-router-dom";

function TrackOrder() {
    const { id } = useParams();

    const steps = [
        "Order Placed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered"
    ];

    const currentStep = 2; // Hardcoded for now as per requirement

    return (
        <div style={{ padding: "80px 20px", maxWidth: "600px", margin: "auto" }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ color: "#2e7d32", marginBottom: "10px" }}>Track Your Order</h2>
                <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "30px" }}>Order ID: #{id}</p>

                <div style={{ marginTop: "20px" }}>
                    {steps.map((step, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                            <div style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                background: index <= currentStep ? "#2e7d32" : "#ddd",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "15px",
                                fontWeight: "bold",
                                fontSize: "14px"
                            }}>
                                {index <= currentStep ? "✓" : index + 1}
                            </div>
                            <div style={{
                                flex: 1,
                                padding: "15px",
                                background: index <= currentStep ? "#e8f5e9" : "#f5f5f5",
                                color: index <= currentStep ? "#2e7d32" : "#757575",
                                borderRadius: "8px",
                                fontWeight: index === currentStep ? "bold" : "normal",
                                borderLeft: index <= currentStep ? "5px solid #2e7d32" : "5px solid #ddd"
                            }}>
                                {step}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => window.history.back()}
                    style={{
                        marginTop: "30px",
                        padding: "12px 24px",
                        background: "#f5f5f5",
                        color: "#333",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        width: "100%"
                    }}
                >
                    Back to Orders
                </button>
            </div>
        </div>
    );
}

export default TrackOrder;
