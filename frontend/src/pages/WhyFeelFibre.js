import React from "react";
import { useNavigate } from "react-router-dom";
import healthmixImg from "../assets/categories/healthmix.jpg";

function WhyFeelFibre() {
    const navigate = useNavigate();

    const styles = {
        container: {
            fontFamily: "'Inter', sans-serif",
            color: "#333",
            backgroundColor: "#fff",
        },
        section: {
            padding: "0 20px",
            maxWidth: "1200px",
            margin: "0 auto",
        },
        heroSection: {
            display: "flex",
            alignItems: "center",
            gap: "50px",
            flexWrap: "wrap",
            backgroundColor: "#f0f9f0",
            padding: "60px 0",
        },
        heroContent: {
            flex: 1,
            minWidth: "300px",
        },
        heroTitle: {
            fontSize: "3.5rem",
            color: "#2e7d32",
            margin: "0 0 20px 0",
            fontWeight: "800",
        },
        heroSubtitle: {
            fontSize: "1.5rem",
            color: "#2e7d32",
            marginBottom: "20px",
            fontWeight: "600",
        },
        heroImage: {
            flex: 1,
            minWidth: "300px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        },
        benefitsSection: {
            backgroundColor: "#fff",
            padding: "60px 0",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            marginTop: "50px",
        },
        benefitCard: {
            padding: "40px",
            borderRadius: "20px",
            backgroundColor: "#f9fbf9",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            transition: "transform 0.3s ease",
        },
        benefitTitle: {
            fontSize: "1.5rem",
            color: "#2e7d32",
            marginBottom: "15px",
            fontWeight: "700",
        },
        advantageSection: {
            backgroundColor: "#f0f9f0",
            padding: "60px 0",
        },
        advantageTitle: {
            textAlign: "center",
            fontSize: "2.5rem",
            color: "#2e7d32",
            marginBottom: "40px",
            fontWeight: "800",
        },
        advantageColumns: {
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
        },
        advantageColumn: {
            flex: 1,
            minWidth: "300px",
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        },
        advantageList: {
            listStyle: "none",
            padding: 0,
            margin: 0,
        },
        advantageItem: {
            padding: "15px 0",
            borderBottom: "1px solid #f0f0f0",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            gap: "10px",
        },
        categoriesSection: {
            padding: "60px 0",
        },
        categoryGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            marginTop: "50px",
        },
        categoryCard: {
            padding: "40px",
            borderRadius: "20px",
            backgroundColor: "#f9fbf9",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        },
        finalBanner: {
            backgroundColor: "#2e7d32",
            color: "#fff",
            textAlign: "center",
            padding: "60px 0",
        },
        finalTitle: {
            fontSize: "3rem",
            marginBottom: "20px",
            fontWeight: "800",
        },
    };

    return (
        <div style={styles.container}>
            {/* SECTION 1 — HERO SECTION */}
            <div style={styles.heroSection}>
                <div style={styles.section}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "50px", alignItems: "center" }}>
                        <div style={styles.heroContent}>
                            <h1 style={styles.heroTitle}>Why feelfibre?</h1>
                            <h2 style={styles.heroSubtitle}>Natural Nutrition for Strong Families</h2>
                            <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#666" }}>
                                feelfibre health mixes are made from carefully selected natural grains and millets.
                                Designed for daily nutrition and healthy living.
                            </p>
                        </div>
                        <div style={styles.heroImage}>
                            <img src={healthmixImg} alt="Health Mix" style={{ width: "100%", display: "block" }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2 — BENEFITS GRID */}
            <div style={styles.benefitsSection}>
                <div style={styles.section}>
                    <h2 style={{ textAlign: "center", fontSize: "2.5rem", color: "#2e7d32", fontWeight: "800" }}>Our Key Benefits</h2>
                    <div style={styles.grid}>
                        {[
                            { title: "Natural Ingredients", text: "Made from real grains and millets" },
                            { title: "High Fiber", text: "Supports healthy digestion" },
                            { title: "Rich Nutrition", text: "Full of essential nutrients" },
                            { title: "No Chemicals", text: "No artificial preservatives" },
                            { title: "Daily Energy", text: "Keeps you active" },
                            { title: "Family Friendly", text: "Suitable for all ages" },
                        ].map((benefit, idx) => (
                            <div key={idx} style={styles.benefitCard}>
                                <h3 style={styles.benefitTitle}>{benefit.title}</h3>
                                <p style={{ color: "#666", lineHeight: "1.6" }}>{benefit.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 3 — FEELFIBRE ADVANTAGE */}
            <div style={styles.advantageSection}>
                <div style={styles.section}>
                    <h2 style={styles.advantageTitle}>The feelfibre Advantage</h2>
                    <div style={styles.advantageColumns}>
                        <div style={styles.advantageColumn}>
                            <h3 style={{ color: "#2e7d32", fontSize: "1.8rem", marginBottom: "30px", borderBottom: "4px solid #2e7d32", display: "inline-block", paddingBottom: "10px" }}>feelfibre</h3>
                            <ul style={styles.advantageList}>
                                {["Natural Ingredients", "Traditional Processing", "High Fiber", "No Preservatives", "Homemade Style", "Safe Nutrition"].map((item, idx) => (
                                    <li key={idx} style={styles.advantageItem}>
                                        <span style={{ color: "#2e7d32", fontWeight: "bold" }}>✔</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={styles.advantageColumn}>
                            <h3 style={{ color: "#d32f2f", fontSize: "1.8rem", marginBottom: "30px", borderBottom: "4px solid #d32f2f", display: "inline-block", paddingBottom: "10px" }}>Other Products</h3>
                            <ul style={styles.advantageList}>
                                {["Artificial Ingredients", "Chemical Processing", "Low Nutrition", "Preservatives", "Processed Foods", "Low Fiber"].map((item, idx) => (
                                    <li key={idx} style={styles.advantageItem}>
                                        <span style={{ color: "#d32f2f", fontWeight: "bold" }}>✘</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4 — PRODUCT CATEGORIES */}
            <div style={styles.categoriesSection}>
                <div style={styles.section}>
                    <h2 style={{ textAlign: "center", fontSize: "2.5rem", color: "#2e7d32", fontWeight: "800" }}>Our Categories</h2>
                    <div style={styles.categoryGrid}>
                        {[
                            { title: "HealthMix", text: "Daily nutrition mixes", route: "/products" },
                            { title: "BabyMix", text: "Nutrition for babies", route: "/babymix" },
                            { title: "Combo", text: "Family packs", route: "/combo" },
                        ].map((cat, idx) => (
                            <div
                                key={idx}
                                style={styles.categoryCard}
                                onClick={() => navigate(cat.route)}
                            >
                                <h3 style={styles.benefitTitle}>{cat.title}</h3>
                                <p style={{ color: "#666", marginBottom: "20px" }}>{cat.text}</p>
                                <span style={{ color: "#2e7d32", fontWeight: "600", textDecoration: "underline" }}>View More</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 5 — FINAL BANNER */}
            <div style={styles.finalBanner}>
                <div style={styles.section}>
                    <h2 style={styles.finalTitle}>feelfibre – Natural Nutrition for Every Home</h2>
                    <p style={{ fontSize: "1.5rem", opacity: "0.9" }}>Traditional healthy foods made for modern families.</p>
                </div>
            </div>
        </div>
    );
}

export default WhyFeelFibre;
