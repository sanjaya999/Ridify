import React, { useState, useEffect } from 'react';
import { get } from '../api/api';
import { Link } from 'react-router-dom';
import VehicleBookings from '../components/VehicleBookings';
import '../assets/styles/AllVehicles.css';

const AllVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await get('/vehicles/currentUserVehicles');
        
        if (response.success) {
          setVehicles(response.data);
        } else {
          setError(response.message || 'Failed to fetch vehicles');
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to fetch vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
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

  // Open bookings modal for a vehicle
  const handleViewBookings = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  // Close bookings modal
  const handleCloseBookings = () => {
    setSelectedVehicle(null);
  };

  return (
    <div className="all-vehicles-container">
      <div className="all-vehicles-header">
        <h2>My Vehicles</h2>
        <p>Manage your vehicle fleet and track their status</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Loading vehicles...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="no-vehicles">
          <h3>You don't have any vehicles yet</h3>
          <p>Add your first vehicle to start renting it out</p>
          <Link to="/upload" className="add-vehicle-button">
            Add Vehicle
          </Link>
        </div>
      ) : (
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-card">
              <div 
                className="vehicle-image-container"
                onClick={() => handleViewBookings(vehicle)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`http://localhost:8080/${vehicle.photoUrl}`}
                  alt={vehicle.name}
                  className="vehicle-image"
                  onError={handleImageError}
                />
                <div className="vehicle-image-placeholder" style={{ display: 'none' }}>
                  Image not available
                </div>
              </div>
              <div className="vehicle-details">
                <h3 
                  className="vehicle-name"
                  onClick={() => handleViewBookings(vehicle)}
                  style={{ cursor: 'pointer' }}
                >
                  {vehicle.name}
                </h3>
                <p className="vehicle-model">{vehicle.model}</p>
                
                <div className="vehicle-info">
                  <div className="vehicle-info-item">
                    <span className="vehicle-info-label">Type</span>
                    <span className="vehicle-info-value">{vehicle.type}</span>
                  </div>
                  <div className="vehicle-info-item">
                    <span className="vehicle-info-label">Plate Number</span>
                    <span className="vehicle-info-value">{vehicle.plateNum}</span>
                  </div>
                  <div className="vehicle-info-item">
                    <span className="vehicle-info-label">Status</span>
                    <span className="vehicle-info-value">
                      {vehicle.status || 'Available'}
                    </span>
                  </div>
                </div>
                
                <div className="vehicle-price">
                  {formatPrice(vehicle.price)}
                </div>
                
                <div className="vehicle-actions">
                  <button 
                    className="vehicle-action-button edit-button"
                    onClick={() => handleViewBookings(vehicle)}
                  >
                    View Bookings
                  </button>
                  <button className="vehicle-action-button delete-button">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vehicle Bookings Modal */}
      {selectedVehicle && (
        <VehicleBookings
          vehicleId={selectedVehicle.id}
          vehicleName={selectedVehicle.name}
          onClose={handleCloseBookings}
        />
      )}
    </div>
  );
};

export default AllVehicles;
