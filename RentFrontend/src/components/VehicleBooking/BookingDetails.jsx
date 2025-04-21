import React from 'react';
import '../../assets/styles/ConfirmBooking.css';

const BookingDetails = ({ bookingInfo, paymentMethod, totalAmount, vehicleName, vehicleModel, navigate }) => {
  if (!bookingInfo) return null;
  return (
    <div className="final-booking-info">
      <h3>Booking Details</h3>

      <p><strong>Booking ID:</strong> {bookingInfo.id}</p>
      <p><strong>Status:</strong> <span className={bookingInfo.status === 'Confirmed' ? 'status-confirmed' : 'status-error'}>{bookingInfo.status}</span></p>
      <p><strong>Start Time:</strong> {bookingInfo.startDate ? new Date(bookingInfo.startDate).toLocaleString() : 'N/A'}</p>
      <p><strong>End Time:</strong> {bookingInfo.endDate ? new Date(bookingInfo.endDate).toLocaleString() : 'N/A'}</p>
      <p><strong>Payment Method:</strong> {bookingInfo.paymentMethod || paymentMethod || 'Internal Payment'}</p>
      <p><strong>Total Amount Paid:</strong> Rs. {bookingInfo.amount?.toFixed(2) || totalAmount?.toFixed(2)}</p>
      <hr />

      <h4>Vehicle Info</h4>
      <p><strong>Name:</strong> {bookingInfo.vehicle?.name || vehicleName}</p>
      <p><strong>Model:</strong> {bookingInfo.vehicle?.model || vehicleModel}</p>
      <p><strong>Type:</strong> {bookingInfo.vehicle?.type || 'N/A'}</p>
      <p><strong>Plate Number:</strong> {bookingInfo.vehicle?.plateNum || 'N/A'}</p>
      <hr />

      <h4>Booked By</h4>
      <p><strong>Name:</strong> {bookingInfo.bookedUser?.name || 'Current User'}</p>
      <p><strong>Email:</strong> {bookingInfo.bookedUser?.email || 'Current User Email'}</p>

       <button
          className="view-bookings-btn"
          onClick={() => navigate('/bookings')}>
          View My Bookings
        </button>
    </div>
  );
};

export default BookingDetails;
