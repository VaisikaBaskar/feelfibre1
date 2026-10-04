import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "HealthMix", to: "/products" },
    { label: "BabyMix", to: "/babymix" },
    { label: "Combo", to: "/combo" },
    { label: "Why feelfibre", to: "/why-feelfibre" },
];

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <button
                className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--open" : ""}`}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation"
            >
                <span />
                <span />
                <span />
            </button>

            <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
                {NAV_LINKS.map(({ label, to }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            end={to === "/"}
                            className={({ isActive }) =>
                                "navbar__link" + (isActive ? " navbar__link--active" : "")
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;
