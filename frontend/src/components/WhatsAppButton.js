import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp />
        </a>
    );
}

export default WhatsAppButton;
