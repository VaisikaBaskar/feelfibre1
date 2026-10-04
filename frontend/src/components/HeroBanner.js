import React from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero/healthmix.png";
import "./HeroBanner.css";

function HeroBanner() {
    const navigate = useNavigate();

    return (
        <section className="hero-banner">

            {/* LEFT: Text Content */}
            <div className="hero-banner__text">
                <p className="hero-banner__subtext">feelfibre Natural Nutrition</p>
                <h1 className="hero-banner__heading">
                    Natural Health Mix<br />for Strong Families
                </h1>
                <button
                    className="hero-banner__btn"
                    onClick={() => navigate("/products")}
                >
                    Shop Now
                </button>
            </div>

            {/* RIGHT: Image */}
            <div className="hero-banner__image-wrap">
                <img
                    src={heroImg}
                    alt="feelfibre Health Mix"
                    className="hero-banner__image"
                />
            </div>

        </section>
    );
}

export default HeroBanner;
