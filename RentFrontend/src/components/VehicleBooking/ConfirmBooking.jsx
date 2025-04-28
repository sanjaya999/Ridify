// ConfirmBooking.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/ConfirmBooking.css';
import { post } from '../../api/api';
import { useOutletContext } from 'react-router-dom';

// Define your API base URL (needed for image path construction)
// Adjust if your environment setup differs
const API_BASE_URL =  'http://localhost:8080';

const ConfirmBooking = () => {
  const { refreshWalletBalance } = useOutletContext() || {};

  const location = useLocation();
  const navigate = useNavigate();

  // Destructure data passed from VehicleDetail state
  const {
    hourlyRate,
    totalHours,
    totalAmount,
    vehicleName, // Fallback display name
    vehicleModel, // Fallback display model
    vehiclePhotoUrl // Used before bookingInfo is loaded, or as fallback
  } = location.state || {}; // Use default empty object for safety

  // State for user feedback messages
  const [feedback, setFeedback] = useState('');
  // State to track the selected payment method ('Internal Payment' or 'Khalti')
  const [paymentMethod, setPaymentMethod] = useState(null); // Start with null (no selection)
  // State to show loading/processing state during API calls or simulations
  const [isProcessing, setIsProcessing] = useState(false);
  // State to hold the final booking details after successful API confirmation
  const [bookingInfo, setBookingInfo] = useState(null); // Starts null, populated on success

  // --- Event Handlers ---
  const handlePaymentSelection = (method) => {
     // Prevent changing method if booking is already confirmed or processing
     if (bookingInfo || isProcessing) return;
     setPaymentMethod(method);
     setFeedback(''); // Clear previous feedback when changing selection
  };

  // --- Confirmation Handler ---
  const handleConfirmBooking = async () => {
    // Ensure a payment method is selected
    if (!paymentMethod) {
        setFeedback('Please select a payment method first.');
        return;
    }

    setIsProcessing(true); // Indicate processing started
    setFeedback(''); // Clear previous feedback

    // --- Khalti Payment Simulation ---
    if (paymentMethod === 'Khalti') {
      setFeedback('Initiating Khalti Payment...');
      try {
          // **Payload for Khalti INITIATION endpoint**
          // It needs the token for the backend to decode details and calculate amount.
          // It also needs the returnUrl where Khalti sends the user back.
          const token = localStorage.getItem('bookingToken');

          const payload = {
            token
              // Construct the return URL pointing to your frontend callback route
              // Include the token (URL-encoded) so the callback handler can identify the booking
              // Review security implications of token in URL vs. using a server-side stored mapping ID
              // returnUrl: `${FRONTEND_BASE_URL}/khalti-callback?bookingToken=${encodeURIComponent(bookingToken)}`
          };

          // Call your backend endpoint responsible for Khalti initiation
          // This endpoint should return the JSON: { pidx, payment_url, ... }
          const initiateResponse = await post('/api/v1/payments/khalti', payload);

          // Check if the initiation was successful and we got the payment_url
          if (initiateResponse && initiateResponse.payment_url) {
              setFeedback('Redirecting to Khalti...');
              // **Redirect the user to Khalti's payment page**
              window.location.href = initiateResponse.payment_url;
              // NOTE: Execution stops here for the user on this page.
              // setIsProcessing(false) is NOT called here because the page navigates away.
              return; // Explicitly stop further execution in this function
          } else {
              // Handle cases where initiation failed or didn't return the URL
              throw new Error(initiateResponse?.message || 'Failed to initiate Khalti payment. Payment URL not received.');
          }
      } catch (error) {
          // Handle errors during the initiation API call
          console.error("Khalti Initiation Error:", error);
          const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while initiating Khalti payment.';
          setFeedback(`Error: ${errorMessage}`);
          // Stop processing indicator ONLY if an error occurs before redirect
          setIsProcessing(false);
      }
  }

    // --- Internal Payment API Call ---
    if (paymentMethod === 'Internal Payment') {
        try {
            // Retrieve the temporary booking token stored earlier
            const token = localStorage.getItem('bookingToken');
            if (!token) {
                // If token is missing, throw an error to be caught below
                throw new Error('Booking session expired or token not found. Please try booking again.');
            }

            // Prepare data payload for the confirmation API endpoint
            const payload = {
                token,
                amount: totalAmount, // Send the calculated total amount
                paymentMethod: 'internal' // Explicitly set method type for backend
            };

            // Make the actual API call to confirm the booking
            // Uses the 'post' function imported from your api utilities
            const response = await post('/api/v1/book/confirm', payload);

            // Check if the backend response indicates success (has an 'id')
            if (response && response.id) {
                // SUCCESS: Booking confirmed by the backend
                setFeedback(''); // Clear any processing feedback
                // Instead of rendering here, navigate to the booking details page with all info
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
                localStorage.removeItem('bookingToken'); // Clean up the used temporary token
            } else {
                // Backend responded but didn't confirm successfully
                // Throw an error with the message from the backend if available
                throw new Error(response?.message || 'Failed to confirm booking. Unexpected response from server.');
            }
        } catch (error) {
            // Handle errors from API call, token retrieval, or thrown exceptions
            console.error("Booking Confirmation Error:", error);
            // Extract a user-friendly error message
            const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred during booking confirmation.';
            setFeedback(`Error: ${errorMessage}`);
            setBookingInfo(null); // Ensure bookingInfo remains null on error
        } finally {
            // This block executes whether the try block succeeded or failed
            setIsProcessing(false); // Stop showing the processing state
        }
    } else {
        // Fallback for unexpected paymentMethod value
        setFeedback('Invalid payment method selected.');
        setIsProcessing(false);
    }
  };

  // --- Render Logic ---

  // Basic check if essential data from previous step is missing
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

  // Main component rendering
  return (
    <div className="confirm-booking-container">
      {/* Dynamic Heading based on confirmation status */}
      <h2>
          {bookingInfo ? 'Booking Confirmed!' : 'Confirm Your Booking'}
      </h2>

      {/* Section to display details BEFORE final confirmation */}
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

          {/* Booking Cost Details Section */}
          <div className="booking-details">
            <p><strong>Total Hours Selected:</strong> {totalHours || 'N/A'}</p>
            <p><strong>Estimated Total Amount:</strong> <strong>Rs. {totalAmount?.toFixed(2)}</strong></p>
          </div>
        </>
      )}

      {/* --- Show Payment Selection and Confirm Button ONLY if booking is NOT yet confirmed --- */}
      {!bookingInfo && (
          <>
            {/* Payment Method Selection Area */}
            <div className="payment-selection">
                <h4>Select Payment Method</h4>
                <div className="payment-buttons">
                    {/* Internal Payment Button */}
                    <button
                        className={`payment-btn${paymentMethod === 'Internal Payment' ? ' selected' : ''}`}
                        onClick={() => handlePaymentSelection('Internal Payment')}
                        disabled={isProcessing}
                    >
                        Internal Payment
                    </button>

                    {/* Khalti Payment Button (Simulation) */}
                    <button
                        className={`payment-btn khalti${paymentMethod === 'Khalti' ? ' selected' : ''}`}
                        onClick={() => handlePaymentSelection('Khalti')}
                        disabled={isProcessing}
                    >
                        Pay with Khalti
                    </button>
                </div>
            </div>

             {/* Feedback Area for messages and errors */}
            {feedback && (
              <div className={`feedback-area${feedback.includes('Error') || feedback.includes('Failed') || feedback.includes('expired') || feedback.includes('Please select') ? ' error' : ''}`}>
                {feedback}
              </div>
            )}

            {/* Final Confirmation Button */}
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