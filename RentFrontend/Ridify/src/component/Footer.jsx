import React from 'react'
import '../Style/Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Ridify. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer