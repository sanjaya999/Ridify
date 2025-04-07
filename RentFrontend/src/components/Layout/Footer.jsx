import React from 'react';
import { Container, Grid, Typography, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './Layout.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="footer-title">
              About Ridify
            </Typography>
            <Typography variant="body2" className="footer-text">
              Your trusted platform for vehicle rentals. We provide quality vehicles
              and exceptional service to make your journey comfortable and memorable.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="footer-title">
              Quick Links
            </Typography>
            <ul className="footer-links">
              <li><Link href="/vehicles">Available Vehicles</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="footer-title">
              Contact Info
            </Typography>
            <Typography variant="body2" className="footer-text">
              123 Rental Street<br />
              Kathmandu, Nepal<br />
              Phone: +977 1234567890<br />
              Email: info@ridify.com
            </Typography>
          </Grid>
        </Grid>
        
        <div className="footer-bottom">
          <div className="social-links">
            <IconButton color="inherit" aria-label="Facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="Twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="LinkedIn">
              <LinkedInIcon />
            </IconButton>
          </div>
          
          <Typography variant="body2" className="copyright">
            © {new Date().getFullYear()} Ridify. All rights reserved.
          </Typography>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
