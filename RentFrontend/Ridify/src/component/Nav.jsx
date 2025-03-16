import { useState } from "react";
import { Link } from "react-router-dom";
import "../Style/Nav.css"

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand">MyBrand</Link>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/about" className="nav-item">About</Link>
          <Link to="/services" className="nav-item">Services</Link>
          <Link to="/contact" className="nav-item">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
