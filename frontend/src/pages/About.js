import React from "react";
import { FaLeaf, FaSeedling, FaBan, FaChild, FaHistory, FaShieldAlt } from "react-icons/fa";
import "./About.css";

function About() {
    return (
        <div className="about-page-container">
            {/* SECTION 1: Page Title */}
            <section className="about-hero">
                <h1>About FeelFibre</h1>
                <p>Nourishing families with traditional, wholesome, and 100% natural health mixes.</p>
            </section>

            <div className="about-content">
                {/* SECTION 2: About the Brand */}
                <section className="about-section about-brand">
                    <h2>About the Brand</h2>
                    <p>
                        FeelFibre provides premium natural health mixes made from traditional grains and millets.
                        We are fundamentally driven by a focus on healthy living and a return to our nutritional roots.
                        Every product we craft brings back the goodness of ancient dietary wisdom wrapped in modern hygiene.
                    </p>
                </section>

                {/* SECTION 3: Why Choose FeelFibre */}
                <section className="about-section why-choose">
                    <h2>Why Choose FeelFibre</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <FaLeaf className="benefit-icon" />
                            <h3>100% Natural Ingredients</h3>
                        </div>
                        <div className="benefit-card">
                            <FaSeedling className="benefit-icon" />
                            <h3>Rich in Fiber & Nutrients</h3>
                        </div>
                        <div className="benefit-card">
                            <FaBan className="benefit-icon" />
                            <h3>No Artificial Preservatives</h3>
                        </div>
                        <div className="benefit-card">
                            <FaChild className="benefit-icon" />
                            <h3>Suitable for Kids & Adults</h3>
                        </div>
                        <div className="benefit-card">
                            <FaHistory className="benefit-icon" />
                            <h3>Traditional Millet-Based</h3>
                        </div>
                        <div className="benefit-card">
                            <FaShieldAlt className="benefit-icon" />
                            <h3>Hygienically Prepared</h3>
                        </div>
                    </div>
                </section>

                {/* SECTION 4 & 5: Mission and Vision Wrapper */}
                <div className="mission-vision-container">
                    {/* SECTION 4: Our Mission */}
                    <section className="about-section mission-card">
                        <h2>Our Mission</h2>
                        <p>
                            To promote healthy lifestyles across communities through natural, unadulterated,
                            and nutrient-dense grain-based nutrition that everyone can enjoy.
                        </p>
                    </section>

                    {/* SECTION 5: Our Vision */}
                    <section className="about-section vision-card">
                        <h2>Our Vision</h2>
                        <p>
                            To become a universally trusted health food brand that actively supports and builds
                            healthier families worldwide.
                        </p>
                    </section>
                </div>

                {/* SECTION 6: Our Products */}
                <section className="about-section about-products">
                    <h2>Our Products</h2>
                    <p className="products-intro">
                        All our products are thoughtfully designed to provide balanced, everyday nutrition.
                    </p>
                    <ul className="products-list">
                        <li><strong>Ragi Health Mix</strong> - Power-packed classic for daily energy.</li>
                        <li><strong>Baby Nutrition Mix</strong> - Gentle, building blocks for early growth.</li>
                        <li><strong>Millet Energy Mix</strong> - Sustained vitality for active lifestyles.</li>
                        <li><strong>Traditional Grain Combos</strong> - Holistic wellness in every serve.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default About;
