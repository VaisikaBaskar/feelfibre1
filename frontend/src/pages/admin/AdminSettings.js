import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import "../../styles/admin.css";

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteName: "FeelFibre",
        email: "admin@feelfibre.com",
        tax: "5%",
        shipping: "50"
    });

    const handleSave = () => {
        // Simulating save success for UI flow
        alert("General Settings Updated Successfully!");
    };

    const handleChange = (e, field) => {
        setSettings({
            ...settings,
            [field]: e.target.value
        });
    };

    return (
        <AdminLayout>
            <div className="settings-container">
                <div className="settings-form">
                    <h2 className="settings-title">General Settings</h2>
                    <hr className="settings-divider" />

                    <div className="settings-field">
                        <label>Website Name</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => handleChange(e, "siteName")}
                        />
                    </div>

                    <div className="settings-field">
                        <label>Contact Email</label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleChange(e, "email")}
                        />
                    </div>

                    <div className="settings-field">
                        <label>Tax Percentage (%)</label>
                        <input
                            type="text"
                            value={settings.tax}
                            onChange={(e) => handleChange(e, "tax")}
                        />
                    </div>

                    <div className="settings-field">
                        <label>Standard Shipping Cost (₹)</label>
                        <input
                            type="text"
                            value={settings.shipping}
                            onChange={(e) => handleChange(e, "shipping")}
                        />
                    </div>

                    <div className="settings-actions">
                        <button className="admin-primary-btn" onClick={handleSave}>
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
