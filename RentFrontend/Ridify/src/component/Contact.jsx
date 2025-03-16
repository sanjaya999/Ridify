import React from 'react';
import "../Style/Contact.css";

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Get in touch with our team.</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <div className="info-item">
            <div className="icon">📍</div>
            <div className="details">
              <h3>Our Location</h3>
              <p>123 Ridify Street, Kathmandu, Nepal</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="icon">📞</div>
            <div className="details">
              <h3>Phone Number</h3>
              <p>+977 1234567890</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="icon">✉️</div>
            <div className="details">
              <h3>Email Address</h3>
              <p>info@ridify.com</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="icon">🕒</div>
            <div className="details">
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9am - 5pm</p>
              <p>Saturday: 10am - 2pm</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="Your Name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="Your Email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" placeholder="Subject" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" placeholder="Your Message" required></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
