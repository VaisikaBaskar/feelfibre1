import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">

                {/* Brand & Logo */}
                <div className="footer__section">
                    <h2 className="footer__brand">feelfibre</h2>
                    <p className="footer__description">
                        Natural Health Mix for Healthy Living. Providing premium nutrition from traditional grains for your family.
                    </p>
                    <div className="footer__socials">
                        <a href="#" aria-label="Facebook"><FaFacebook /></a>
                        <a href="#" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        <a href="https://wa.me/919999999999" aria-label="WhatsApp"><FaWhatsapp /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer__section">
                    <h3 className="footer__title">Quick Links</h3>
                    <ul className="footer__links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/healthmix">Health Mix</Link></li>
                        <li><Link to="/combos">Combos</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div className="footer__section">
                    <h3 className="footer__title">Customer Service</h3>
                    <ul className="footer__links">
                        <li><Link to="/orders">Your Orders</Link></li>
                        <li><Link to="/profile">My Account</Link></li>
                        <li><Link to="/cart">Shopping Cart</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer__section">
                    <h3 className="footer__title">Contact Info</h3>
                    <ul className="footer__contact">
                        <li><FaMapMarkerAlt /> 123 Healthy Street, Organic City</li>
                        <li><FaPhone /> +91 99999 99999</li>
                        <li><FaEnvelope /> support@feelfibre.com</li>
                    </ul>
                </div>

            </div>

            <div className="footer__bottom">
                <p>&copy; {new Date().getFullYear()} feelfibre. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
