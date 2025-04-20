import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { post } from '../../api/api';

const ConfirmBooking = () => {
  const location = useLocation();
  const { hourlyRate, totalHours, totalAmount } = location.state || {};
  const [confirming, setConfirming] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleConfirmBooking = async () => {
    setConfirming(true);
    setFeedback('');
    try {
      const token = localStorage.getItem('bookingToken');
      if (!token) {
        setFeedback('No booking token found. Please verify your booking again.');
        setConfirming(false);
        return;
      }
      const payload = {
        token,
        amount: totalAmount
      };
      const response = await post('/api/v1/book/confirm', payload);
      if (response && response.id) {
        setFeedback('');
        setBookingInfo(response);
      } else if (response && response.message) {
        setFeedback(response.message);
      } else {
        setFeedback('Unexpected response from server.');
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        setFeedback(error.response.data.message);
      } else {
        setFeedback('Failed to confirm booking.');
      }
    } finally {
      setConfirming(false);
    }
  };

  // New state to hold booking info
  const [bookingInfo, setBookingInfo] = useState(null);

  return (
    <div className="confirm-booking-container">
      <h2>Booking Confirmation</h2>
      <div className="booking-details">
        <p><strong>Hourly Rate:</strong> Rs. {hourlyRate}</p>
        <p><strong>Total Hours:</strong> {totalHours}</p>
        <p><strong>Total Amount:</strong> Rs. {totalAmount}</p>
      </div>
      {!bookingInfo && (
        <button
          className="confirm-booking-btn"
          onClick={handleConfirmBooking}
          disabled={confirming}
          style={{ marginTop: '18px', padding: '10px 24px', fontSize: '1em' }}
        >
          {confirming ? 'Confirming...' : 'Confirm Booking'}
        </button>
      )}
      {feedback && (
        <div style={{ marginTop: '18px', color: feedback.includes('success') ? 'green' : 'red' }}>
          {feedback}
        </div>
      )}
      {bookingInfo && (
        <div className="final-booking-info" style={{ marginTop: '28px', padding: '18px', background: '#f7f7f7', borderRadius: '8px' }}>
          <h3>Booking Details</h3>
          <p><strong>Booking ID:</strong> {bookingInfo.id}</p>
          <p><strong>Status:</strong> {bookingInfo.status}</p>
          <p><strong>Start:</strong> {bookingInfo.startDate}</p>
          <p><strong>End:</strong> {bookingInfo.endDate}</p>
          <h4>Vehicle Info</h4>
          <p><strong>Name:</strong> {bookingInfo.vehicle?.name}</p>
          <p><strong>Model:</strong> {bookingInfo.vehicle?.model}</p>
          <p><strong>Type:</strong> {bookingInfo.vehicle?.type}</p>
          <p><strong>Plate Number:</strong> {bookingInfo.vehicle?.plateNum}</p>
          <h4>Booked By</h4>
          <p><strong>Name:</strong> {bookingInfo.bookedUser?.name}</p>
          <p><strong>Email:</strong> {bookingInfo.bookedUser?.email}</p>
        </div>
      )}
    </div>
  );
};

export default ConfirmBooking;
