import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from '../api/api';
import '../assets/styles/BrowseVehicles.css';

const BrowseVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllVehicles = async () => {
      try {
        setLoading(true);
        const response = await get('/vehicles/getAll');
        
        // Check the structure of the response and extract the vehicles array
        if (response) {
          // If response is an array, use it directly
          if (Array.isArray(response)) {
            setVehicles(response);
          } 
          // If response has a data property that is an array, use that
          else if (response.data && Array.isArray(response.data)) {
            setVehicles(response.data);
          }
          // If response is an object with success property (API might return {success: true, data: [...]}
          else if (response.success && Array.isArray(response.data)) {
            setVehicles(response.data);
          } else {
            console.error('Unexpected API response structure:', response);
            setError('Failed to parse vehicle data. Unexpected response format.');
          }
        } else {
          setError('Failed to fetch vehicles');
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to fetch vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllVehicles();
  }, []);

  // Format price with commas and currency
  const formatPrice = (price) => {
    return `Rs. ${Number(price).toLocaleString()}`;
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'block';
  };

  return (
    <div className="browse-vehicles-container">
      <div className="browse-header">
        <h1>Browse All Vehicles</h1>
        <p>Find the perfect vehicle for your next journey</p>
      </div>

      {/* Vehicles Grid */}
      <div className="vehicles-content">
        {loading ? (
          <div className="loading-container">
            <p>Loading vehicles...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
          </div>
        ) : !Array.isArray(vehicles) || vehicles.length === 0 ? (
          <div className="no-vehicles">
            <h3>No vehicles found</h3>
            <p>Check back later for available vehicles</p>
          </div>
        ) : (
          <div className="vehicles-grid">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-image-container">
                  <img
                    src={`http://localhost:8080/${vehicle.photoUrl}`}
                    alt={vehicle.name}
                    className="vehicle-image"
                    onError={handleImageError}
                  />
                  <div className="vehicle-image-placeholder" style={{ display: 'none' }}>
                    Image not available
                  </div>
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
                  <div className="vehicle-footer">
                    <p className="vehicle-price">{formatPrice(vehicle.price)}</p>
                    <button 
                      className="book-button"
                      onClick={() => navigate(`/aboutVehicle/${vehicle.id}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseVehicles;
