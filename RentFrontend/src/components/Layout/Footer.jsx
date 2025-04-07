import React from 'react';
import { Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" className="footer-title">
              About Ridify
            </Typography>
            <Typography variant="body2" className="footer-text">
              Your trusted platform for quality vehicle rentals in Nepal.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" className="footer-title">
              Quick Links
            </Typography>
            <ul className="footer-links">
              <li><Link href="/vehicles">Vehicles</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="footer-title">
              Contact
            </Typography>
            <Typography variant="body2" className="footer-text">
              Kathmandu, Nepal<br />
              info@ridify.com
            </Typography>
          </Grid>
        </Grid>
        
        <div className="footer-bottom">
          <div className="social-links">
            <IconButton><FacebookIcon fontSize="small" /></IconButton>
            <IconButton><TwitterIcon fontSize="small" /></IconButton>
            <IconButton><InstagramIcon fontSize="small" /></IconButton>
          </div>
          <Typography variant="body2" className="copyright">
            &copy; {new Date().getFullYear()} Ridify
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
