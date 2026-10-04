import React from "react";
import "../../styles/admin.css";

const MonthlyTarget = () => {
    const targetInfo = {
        targetAmount: 800000,
        achievedRevenue: 650000,
    };

    const remainingAmount = targetInfo.targetAmount - targetInfo.achievedRevenue;
    const achievementPercentage = Math.round((targetInfo.achievedRevenue / targetInfo.targetAmount) * 100);

    return (
        <div className="admin-target-container">
            <h2>Monthly Sales Target</h2>
            <div className="target-details">
                <div className="target-item">
                    <span className="label">Target Amount:</span>
                    <span className="value">${targetInfo.targetAmount.toLocaleString()}</span>
                </div>
                <div className="target-item">
                    <span className="label">Achieved Revenue:</span>
                    <span className="value">${targetInfo.achievedRevenue.toLocaleString()}</span>
                </div>
                <div className="target-item">
                    <span className="label">Remaining Amount:</span>
                    <span className="value">${remainingAmount.toLocaleString()}</span>
                </div>
                <div className="target-item">
                    <span className="label">Achievement:</span>
                    <span className="value">{achievementPercentage}%</span>
                </div>
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${achievementPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default MonthlyTarget;
