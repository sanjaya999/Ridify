import React, { useState, useEffect } from 'react';
import { get } from '../api/api';
import '../assets/styles/VehicleBookings.css';

const VehicleBookings = ({ vehicleId, vehicleName, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await get(`/api/v1/book/${vehicleId}/bookings`);
        
        if (response.success) {
          setBookings(response.data);
        } else {
          setError(response.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchBookings();
    }
  }, [vehicleId]);

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate duration between two dates
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Get status class
  const getStatusClass = (status) => {
    if (!status) return '';
    
    status = status.toLowerCase();
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'pending') return 'status-pending';
    if (status === 'cancelled') return 'status-cancelled';
    
    return '';
  };

  return (
    <div className="bookings-modal-backdrop" onClick={onClose}>
      <div className="bookings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bookings-modal-header">
          <h2 className="bookings-modal-title">
            Bookings for {vehicleName}
          </h2>
          <button className="bookings-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="bookings-modal-body">
          {loading ? (
            <div className="bookings-loading">
              <p>Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="bookings-error">
              <p>{error}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <h3>No bookings found</h3>
              <p>This vehicle doesn't have any bookings yet.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-header">
                    <span className="booking-id">Booking #{booking.id}</span>
                    <span className={`booking-status ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="booking-time">
                    <div className="booking-time-item">
                      <span className="booking-time-label">Start Time</span>
                      <span className="booking-time-value">
                        {formatDateTime(booking.startDate)}
                      </span>
                    </div>
                    <div className="booking-time-item">
                      <span className="booking-time-label">End Time</span>
                      <span className="booking-time-value">
                        {formatDateTime(booking.endDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="booking-user">
                    <div className="booking-user-avatar">
                      {getInitials(booking.bookedUser?.name)}
                    </div>
                    <div className="booking-user-info">
                      <span className="booking-user-name">
                        {booking.bookedUser?.name || 'Unknown User'}
                      </span>
                      <span className="booking-user-email">
                        {booking.bookedUser?.email || 'No email provided'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="booking-duration">
                    Duration: {calculateDuration(booking.startDate, booking.endDate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleBookings;
