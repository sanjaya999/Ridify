import React from 'react';
import { Link } from 'react-router-dom';
import '../Style/Landing.css';

function Landing() {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <h1>Welcome to Ridify</h1>
        <p className="landing-subtitle">Your one-stop solution for renting vehicles</p>
        
        <div className="landing-cta">
          <Link to="/login" className="landing-button primary">Login</Link>
          <Link to="/register" className="landing-button secondary">Register</Link>
        </div>
      </div>
      
      <div className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">🚗</div>
          <h3>Wide Selection</h3>
          <p>Choose from hundreds of vehicles to rent</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Best Prices</h3>
          <p>Competitive rates with no hidden fees</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Booking</h3>
          <p>Safe and secure rental process</p>
        </div>
      </div>
      
      <div className="landing-testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial">
          <p>"Ridify made my vacation planning so much easier. Great service!"</p>
          <div className="testimonial-author">- John D.</div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
