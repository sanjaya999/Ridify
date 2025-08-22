import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { get } from '../../api/api';
import '../../assets/styles/Home.css';
import {useAuth} from "../../context/AuthContext.jsx";

const Home = () => {
  const navigate = useNavigate();
  const{isAuthenticated } = useAuth();
  // Fetch only a limited number of featured vehicles for the landing page
  const fetchFeaturedVehicles = async () => {
    const { data } = await get(`vehicles/getAll`);
    // Return only the first 3 vehicles as featured
    return data.slice(0, 3);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['featuredVehicles'],
    queryFn: fetchFeaturedVehicles,
    staleTime: 60000,
    cacheTime: 20000,
  });

  // Hero section image
  const heroImage = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80";

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <img src={heroImage} alt="Ridify Hero" className="hero-image" />
        <div className="hero-content">
          <h1 className="hero-title">Rent Vehicles on Your Terms</h1>
          <p className="hero-subtitle">
            Discover the freedom of mobility with our premium vehicle rental service. 
            Easy booking, affordable rates, and a wide selection of vehicles.
          </p>
          <div>
            <button 
              className="hero-button"
              onClick={() => navigate('/vehicles')}
            >
              Browse Vehicles
            </button>
            <button 
              className="hero-button hero-button-secondary"
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="featured-section">
        <h2 className="section-title">Featured Vehicles</h2>
        <p className="section-subtitle">
          Explore our top picks for your next adventure. Quality vehicles at competitive prices.
        </p>

        {isLoading ? (
          <div className="loading-container">
            <p>Loading featured vehicles...</p>
          </div>
        ) : isError ? (
          <div className="error-container">
            <p>Error: {error.message || 'Failed to load vehicles'}</p>
          </div>
        ) : (
          <div className="vehicle-list">
            {data.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-image-container">
                  <img 
                    src={`${vehicle.photoUrl}`} 
                    alt={vehicle.name} 
                  />
                  <div className="vehicle-type-badge">
                    {vehicle.type}
                  </div>
                </div>
                <div className="vehicle-details">
                  <h3 className="vehicle-name">{vehicle.name}</h3>
                  <p className="vehicle-model">{vehicle.model}</p>
                  <p className="vehicle-description">
                    {vehicle.description || `Experience the thrill of riding the ${vehicle.name}. Perfect for your daily commute or weekend getaway.`}
                  </p>
                  <p className="vehicle-price">Rs. {Number(vehicle.price).toLocaleString()}</p>
                  <button onClick={() => navigate(`/aboutVehicle/${vehicle.id}`)}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/vehicles" className="hero-button">
            View All Vehicles
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Renting a vehicle with Ridify is quick and easy. Follow these simple steps to get started.
        </p>
        
        <div className="steps-container">
          <div className="step-item">
            <div className="step-icon">🔍</div>
            <h3 className="step-title">Browse & Select</h3>
            <p className="step-description">
              Browse our wide selection of vehicles and choose the one that fits your needs.
            </p>
          </div>
          
          <div className="step-item">
            <div className="step-icon">📅</div>
            <h3 className="step-title">Book & Pay</h3>
            <p className="step-description">
              Select your dates, confirm availability, and make a secure payment.
            </p>
          </div>
          
          <div className="step-item">
            <div className="step-icon">🚀</div>
            <h3 className="step-title">Ride & Enjoy</h3>
            <p className="step-description">
              Pick up your vehicle and enjoy the freedom of the open road.
            </p>
          </div>
        </div>
      </section>


      {isAuthenticated ? <></> : <section className="cta-section">
        <h2 className="cta-title">Ready to Hit the Road?</h2>
        <p className="cta-description">
          Join thousands of satisfied customers who have experienced the convenience and reliability of Ridify.
          Sign up today and get special offers on your first rental.
        </p>
        <Link to="/register" className="cta-button">
          Sign Up Now
        </Link>
      </section>}
    </div>
  );
};

export default Home;
