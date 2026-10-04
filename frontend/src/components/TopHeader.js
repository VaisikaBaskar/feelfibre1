import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch, FaHeart } from "react-icons/fa";
import "./TopHeader.css";

function TopHeader({ searchTerm, setSearchTerm }) {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    const calculateCounts = () => {
        // Cart Count
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        setCartCount(cCount);

        // Wishlist Count
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlistCount(wishlist.length);
    };

    useEffect(() => {
        calculateCounts();

        // Listen for storage changes across different tabs
        window.addEventListener("storage", calculateCounts);

        // Listen for custom events triggered within the same tab
        window.addEventListener("cartUpdated", calculateCounts);
        window.addEventListener("wishlistUpdated", calculateCounts);

        return () => {
            window.removeEventListener("storage", calculateCounts);
            window.removeEventListener("cartUpdated", calculateCounts);
            window.removeEventListener("wishlistUpdated", calculateCounts);
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate("/products");
    };

    const handleProfileClick = () => {
        const user = localStorage.getItem("userEmail");
        if (user) {
            navigate("/profile");
        } else {
            navigate("/login");
        }
    };

    const userEmail = localStorage.getItem("userEmail");

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <header className="top-header">
            {/* LEFT: Logo */}
            <div className="top-header__logo" onClick={() => navigate("/")}>
                feelfibre
            </div>

            {/* CENTER: Search Bar */}
            <div className="top-header__search">
                <form className="top-header__search-form" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="top-header__search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="top-header__search-btn">
                        <FaSearch />
                    </button>
                </form>
            </div>

            {/* RIGHT: Icons + Track Order */}
            <div className="top-header__actions">
                <button
                    className="top-header__icon-btn"
                    onClick={handleProfileClick}
                    aria-label="Profile"
                    title="Profile"
                >
                    <FaUser />
                </button>

                <button
                    className="top-header__icon-btn"
                    onClick={() => navigate("/wishlist")}
                    aria-label="Wishlist"
                    title="Wishlist"
                >
                    <div className="wishlist-container">
                        <FaHeart className="wishlist-icon" />
                        {wishlistCount > 0 && (
                            <span className="wishlist-count">{wishlistCount}</span>
                        )}
                    </div>
                </button>

                <button
                    className="top-header__icon-btn"
                    onClick={() => navigate("/cart")}
                    aria-label="Cart"
                    title="Cart"
                >
                    <div className="cart-container">
                        <FaShoppingCart className="cart-icon" />
                        <span className="cart-count">
                            {cartCount}
                        </span>
                    </div>
                </button>

                <button
                    className="top-header__track-btn"
                    onClick={() => navigate("/orders")}
                >
                    Orders
                </button>

                {userEmail && (
                    <button
                        onClick={handleLogout}
                        className="top-header__logout-btn"
                        style={{
                            marginLeft: "10px",
                            background: "#d32f2f",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}

export default TopHeader;
