import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/ConfirmBooking.css';
import { post } from '../../api/api';
import { useOutletContext } from 'react-router-dom';


const API_BASE_URL =  'http://localhost:8080';

const ConfirmBooking = () => {
  const { refreshWalletBalance } = useOutletContext() || {};

  const location = useLocation();
  const navigate = useNavigate();

  const {
    hourlyRate,
    totalHours,
    totalAmount,
    vehicleName,
    vehicleModel,
    vehiclePhotoUrl
  } = location.state || {};

  const [feedback, setFeedback] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);

  const handlePaymentSelection = (method) => {

     if (bookingInfo || isProcessing) return;
     setPaymentMethod(method);
     setFeedback('');
  };

  const handleConfirmBooking = async () => {
    if (!paymentMethod) {
        setFeedback('Please select a payment method first.');
        return;
    }

    setIsProcessing(true);
    setFeedback('');

    if (paymentMethod === 'Khalti') {
      setFeedback('Initiating Khalti Payment...');
      try {

          const token = localStorage.getItem('bookingToken');

          const payload = {
            token

          };


          const initiateResponse = await post('/api/v1/payments/khalti', payload);

          if (initiateResponse && initiateResponse.payment_url) {
              setFeedback('Redirecting to Khalti...');
              window.location.href = initiateResponse.payment_url;
              // setIsProcessing(false)
              return;
          } else {
              throw new Error(initiateResponse?.message || 'Failed to initiate Khalti payment. Payment URL not received.');
          }
      } catch (error) {
          console.error("Khalti Initiation Error:", error);
          const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while initiating Khalti payment.';
          setFeedback(`Error: ${errorMessage}`);
          setIsProcessing(false);
      }
  }

    if (paymentMethod === 'Internal Payment') {
        try {
            const token = localStorage.getItem('bookingToken');
            if (!token) {
                throw new Error('Booking session expired or token not found. Please try booking again.');
            }

            const payload = {
                token,
                amount: totalAmount,
                paymentMethod: 'internal'
            };

            const response = await post('/api/v1/book/confirm', payload);

            if (response && response.id) {
                setFeedback('');
                if (typeof refreshWalletBalance === 'function') {
                  refreshWalletBalance();
                }
                navigate('/booking-details', {
                  state: {
                    bookingInfo: response,
                    paymentMethod,
                    totalAmount,
                    vehicleName,
                    vehicleModel
                  }
                });
                localStorage.removeItem('bookingToken');
            } else {
                throw new Error(response?.message || 'Failed to confirm booking. Unexpected response from server.');
            }
        } catch (error) {
            console.error("Booking Confirmation Error:", error);
            const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred during booking confirmation.';
            setFeedback(`Error: ${errorMessage}`);
            setBookingInfo(null);
        } finally {
            setIsProcessing(false);
        }
    } else {
        setFeedback('Invalid payment method selected.');
        setIsProcessing(false);
    }
  };


  if (!hourlyRate || !totalAmount || !vehicleName) {
      return (
          <div className="confirm-booking-container" style={{ padding: '20px' }}>
              <h2>Error</h2>
              <p>Booking details are missing or incomplete.</p>
              <p>Please go back and select the vehicle and dates again.</p>
              <button onClick={() => navigate(-1)} style={{ padding: '10px 15px', marginTop: '10px' }}>Go Back</button>
          </div>
      );
  }

  return (
    <div className="confirm-booking-container">
      <h2>
          {bookingInfo ? 'Booking Confirmed!' : 'Confirm Your Booking'}
      </h2>

      {!bookingInfo && (
        <>
          {/* Vehicle Summary Section */}
          <div className="vehicle-summary">
            {vehiclePhotoUrl && (
                <img
                    src={`${API_BASE_URL}/${vehiclePhotoUrl.startsWith('/') ? vehiclePhotoUrl.substring(1) : vehiclePhotoUrl}`}
                    alt={vehicleName}
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            )}
            <div>
                <h3>{vehicleName}</h3>
                <p>Model: {vehicleModel || 'N/A'}</p>
                <p>Rate: <strong>Rs. {hourlyRate?.toFixed(2)}/hour</strong></p>
            </div>
          </div>

          <div className="booking-details">
            <p><strong>Total Hours Selected:</strong> {totalHours || 'N/A'}</p>
            <p><strong>Estimated Total Amount:</strong> <strong>Rs. {totalAmount?.toFixed(2)}</strong></p>
          </div>
        </>
      )}

      {!bookingInfo && (
          <>
            <div className="payment-selection">
                <h4>Select Payment Method</h4>
                <div className="payment-buttons">
                    <button
                        className={`payment-btn${paymentMethod === 'Internal Payment' ? ' selected' : ''}`}
                        onClick={() => handlePaymentSelection('Internal Payment')}
                        disabled={isProcessing}
                    >
                        Internal Payment
                    </button>

                    <button
                        className={`payment-btn khalti${paymentMethod === 'Khalti' ? ' selected' : ''}`}
                        onClick={() => handlePaymentSelection('Khalti')}
                        disabled={isProcessing}
                    >
                        <img 
                            src="/khalti-logo.png" 
                            alt="Khalti" 
                            style={{ height: '20px', marginRight: '8px', verticalAlign: 'middle' }} 
                        />
                        Pay with Khalti
                    </button>
                </div>
            </div>

            {feedback && (
              <div className={`feedback-area${feedback.includes('Error') || feedback.includes('Failed') || feedback.includes('expired') || feedback.includes('Please select') ? ' error' : ''}`}>
                {feedback}
              </div>
            )}

            <button
              className="confirm-booking-btn"
              onClick={handleConfirmBooking}
              disabled={isProcessing || !paymentMethod}
            >
              {isProcessing ? 'Processing...' : (paymentMethod ? `Confirm & Proceed with ${paymentMethod}` : 'Select a Payment Method')}
            </button>
        </>
      )}


    </div>
  );
};

export default ConfirmBooking;