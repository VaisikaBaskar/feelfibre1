import React from "react";
import { useNavigate } from "react-router-dom";

import healthmixImg from "../assets/categories/healthmix.jpg";
import combosImg from "../assets/categories/combos.jpg";
import infantfoodImg from "../assets/categories/infantfood.jpg";
import shopallImg from "../assets/categories/shopall.jpg";

import "./CategoryCards.css";

const CATEGORIES = [
    { label: "Health Mix", img: healthmixImg, route: "/healthmix" },
    { label: "Combos", img: combosImg, route: "/combos" },
    { label: "Infant Food", img: infantfoodImg, route: "/infantfood" },
    { label: "Shop All", img: shopallImg, route: "/products" },
];

function CategoryCards() {
    const navigate = useNavigate();

    return (
        <section className="category-section">
            <div className="category-grid">
                {CATEGORIES.map(({ label, img, route }) => (
                    <div
                        key={label}
                        className="category-card"
                        onClick={() => navigate(route)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && navigate(route)}
                        aria-label={`Browse ${label}`}
                    >
                        <img src={img} alt={label} className="category-card__img" />
                        <div className="category-card__overlay" />
                        <span className="category-card__label">{label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CategoryCards;
