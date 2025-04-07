import React from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import SupportIcon from '@mui/icons-material/Support';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" className="hero-title">
                Find Your Perfect Ride
              </Typography>
              <Typography variant="h5" className="hero-subtitle">
                Rent quality vehicles at affordable prices. Your journey begins with us.
              </Typography>
              <Button
                variant="contained"
                size="large"
                className="cta-button"
                onClick={() => navigate('/vehicles')}
              >
                Browse Vehicles
              </Button>
            </Grid>
            <Grid item xs={12} md={6} className="hero-image">
              <img src="/hero-car.png" alt="Luxury car" />
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container maxWidth="lg">
          <Typography variant="h2" className="section-title">
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <div className="feature-card">
                <DirectionsCarIcon className="feature-icon" />
                <Typography variant="h6">Quality Vehicles</Typography>
                <Typography>
                  Wide selection of well-maintained vehicles to suit your needs.
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="feature-card">
                <SecurityIcon className="feature-icon" />
                <Typography variant="h6">Safe & Secure</Typography>
                <Typography>
                  Fully insured vehicles with 24/7 roadside assistance.
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="feature-card">
                <SupportIcon className="feature-icon" />
                <Typography variant="h6">Customer Support</Typography>
                <Typography>
                  Dedicated support team to assist you anytime.
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container maxWidth="lg">
          <Typography variant="h3">Ready to Start Your Journey?</Typography>
          <Typography variant="h6">
            Join thousands of satisfied customers who trust us for their vehicle rental needs.
          </Typography>
          <Button
            variant="contained"
            size="large"
            className="cta-button"
            onClick={() => navigate('/register')}
          >
            Get Started Now
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default Home;
