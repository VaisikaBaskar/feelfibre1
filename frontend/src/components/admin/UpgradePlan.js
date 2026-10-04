import React from "react";
import "../../styles/admin.css";

const UpgradePlan = () => {
    const handleUpgrade = () => {
        alert("Upgrade feature coming soon");
    };

    const features = [
        "Advanced Analytics",
        "Priority Support",
        "Unlimited Products",
        "Premium Reports"
    ];

    return (
        <div className="admin-upgrade-container">
            <div className="upgrade-card">
                <div className="upgrade-badge">PRO</div>
                <h2 className="upgrade-title">Upgrade to Pro Plan</h2>
                <p className="upgrade-subtitle">Get more out of your store with advanced features</p>

                <div className="upgrade-price">
                    <span className="amount">$19</span>
                    <span className="period">/ month</span>
                </div>

                <ul className="upgrade-features">
                    {features.map((feature, index) => (
                        <li key={index}>✅ {feature}</li>
                    ))}
                </ul>

                <button className="upgrade-btn" onClick={handleUpgrade}>
                    Upgrade Now
                </button>
                <p className="upgrade-note">Limited time offer. Terms apply.</p>
            </div>
        </div>
    );
};

export default UpgradePlan;
