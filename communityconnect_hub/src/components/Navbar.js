import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

// PUBLIC_INTERFACE
function Navbar() {
  /**
   * Dark mode navbar shared on every page. Uses primary, secondary, accent color palette.
   */
  return (
    <nav className="cch-navbar">
      <div className="cch-navbar-logo">
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>●</span>
        <span style={{ color: "var(--secondary)", fontWeight: 700 }}>●</span>
        <span style={{ color: "var(--accent)", fontWeight: 700 }}>●</span>
        <span style={{ marginLeft: 12, fontWeight: 700 }}>CommunityConnect Hub</span>
      </div>
      <div className="cch-navbar-links">
        <NavLink end to="/" className="cch-navbar-link">
          Home
        </NavLink>
        <NavLink to="/weather" className="cch-navbar-link">
          Weather
        </NavLink>
        <NavLink to="/news" className="cch-navbar-link">
          News
        </NavLink>
        <NavLink to="/events" className="cch-navbar-link">
          Community Events
        </NavLink>
        <NavLink to="/services" className="cch-navbar-link">
          Services
        </NavLink>
        <NavLink to="/emergency" className="cch-navbar-link">
          Emergency Contact
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
