// src/components/Booking/KhaltiCallbackHandler.js

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useQuery as useReactQuery } from '@tanstack/react-query'; // Rename useQuery to avoid conflict with local hook name
import { post } from '../../api/api'; // Your API helper function

import '../../assets/styles/KhaltiCallback.css';

// Utility to parse query params from URL (keep this)
function useUrlQuery() {
  return new URLSearchParams(useLocation().search);
}

const KhaltiCallbackHandler = () => {
  const urlQuery = useUrlQuery();
  const navigate = useNavigate();

  // Extract params from the callback URL immediately
  const pidx = urlQuery.get('pidx');
  const statusParam = urlQuery.get('status'); // Initial status from Khalti redirect
  const bookingTokenFromUrl = urlQuery.get('bookingToken'); // Get token if passed back

  const bookingToken = localStorage.getItem('bookingToken');
  // Store booking token if needed for the *next* step (final confirmation)
  // This component only verifies, doesn't confirm booking here.
  // You might store this in localStorage temporarily or pass it differently.
  // For now, just acknowledge its potential presence.
  // const [bookingToken, setBookingToken] = useState(bookingTokenFromUrl);


  // --- Define the async function to fetch verification status ---
  const fetchKhaltiVerification = async (pidxToCheck) => {
    if (!pidxToCheck) {
      // Should not happen if enabled logic is correct, but good practice
      throw new Error('PIDX is required for verification.');
    }
    // Calls your backend endpoint
    return await post('/api/v1/payments/khalti/check-status', { pidx: pidxToCheck ,
      token: bookingToken
    });
  };

  // --- Use React Query to fetch verification status ---
  const {
    data: verificationData, // Will contain the backend response map on success
    isLoading,
    isError,
    error, // Contains the error object on failure
    isSuccess, // True if the query succeeded
    // isEnabled: queryEnabled // Can check if the query was enabled to run
  } = useReactQuery({
    // Unique key for this query, includes pidx
    queryKey: ['khaltiVerification', pidx],
    // Function to call for fetching data
    queryFn: () => fetchKhaltiVerification(pidx),
    // Only run the query if pidx exists AND the initial status isn't explicitly 'User canceled'
    // We rely on the backend check for final 'Completed' status
    enabled: !!pidx && statusParam !== 'User canceled',
    // Configuration options:
    staleTime: 0, // Re-fetch immediately if needed (likely not needed here)
    cacheTime: 5 * 60 * 1000, // Keep data for 5 minutes if user navigates back/forth
    retry: false, // Don't automatically retry on failure for this specific case
    refetchOnWindowFocus: false, // Don't refetch just because window focus changes
  });

  // Determine overall display status and message based on URL params and query state
  let displayStatus = 'processing';
  let displayMessage = 'Processing Khalti payment verification...';

  if (!pidx) {
    displayStatus = 'error';
    displayMessage = 'Payment Identifier (pidx) missing from Khalti callback URL.';
  } else if (statusParam === 'User canceled') {
    displayStatus = 'cancelled';
    displayMessage = 'Payment was canceled by user on Khalti page.';
  } else if (isLoading) {
    displayStatus = 'processing';
    displayMessage = 'Verifying payment status with server...';
  } else if (isError) {
    displayStatus = 'error';
    // Extract error message nicely
    const errorMsg = error?.response?.data?.message || error?.message || 'Failed to connect to verification server.';
    displayMessage = `Payment verification failed: ${errorMsg}`;
  } else if (isSuccess && verificationData) {
    // Query succeeded, check the status returned from *our backend*
    const verifiedStatus = verificationData.status;
    if (verifiedStatus === 'Completed') {
      displayStatus = 'success';
      displayMessage = 'Payment Verified Successfully!';
      // **NEXT STEP**: If successful, you would typically trigger
      // the final booking confirmation API call here, using the bookingTokenFromUrl.
      // Example: confirmBookingBackend(bookingTokenFromUrl, verificationData.transaction_id);
    } else {
      displayStatus = 'error'; // Treat non-completed verified status as an error/failure
      displayMessage = `Payment verification returned status: ${verifiedStatus || 'Unknown'}. Booking cannot be confirmed.`;
    }
  }
   // Add a fallback for unexpected states
   else if (!isLoading && !isError && !isSuccess && statusParam !== 'User canceled') {
       displayStatus = 'error';
       displayMessage = 'Verification process did not complete as expected. Please check details or contact support.';
   }


  // Helper to format amount from Paisa to NPR
 

  return (
    <div className="khalti-callback-container">
      <h3>Khalti Payment Status</h3>

      {/* Display derived status and message */}
      <span className={`khalti-status ${displayStatus}`}>{displayStatus}</span>
      <div className="khalti-callback-message">
        {isLoading ? 'Verifying payment, please wait...' : displayMessage}
      </div>

      {/* Display details only if verification was attempted and data/error exists */}
      {!isLoading && (verificationData || isError || displayStatus === 'cancelled') && (
        <div className="khalti-callback-details">
          <h4>Verification Details:</h4>

          {/* Always show PIDX if available */}
          {pidx && <p><strong>PIDX:</strong> {pidx}</p>}

          {/* Show details from successful verification */}
          {isSuccess && verificationData && verificationData.status === 'Completed' && (
            <>
              <p><strong>Verified Status:</strong> {verificationData.status}</p>
              <p><strong>Transaction ID:</strong> {verificationData.transaction_id || 'N/A'}</p>
              <p><strong>Verified Amount:</strong> Rs. {verificationData.total_amount}</p>
              <p><strong>Fee:</strong> Rs. {verificationData.fee}</p>
              <p><strong>Refunded:</strong> {verificationData.refunded ? 'Yes' : 'No'}</p>
            </>
          )}

          {/* Show details even if status wasn't Completed but verification happened */}
          {isSuccess && verificationData && verificationData.status !== 'Completed' && (
              <p><strong>Verified Status:</strong> {verificationData.status}</p>
          )}

          {/* Show initial status if verification failed or was cancelled */}
          {(isError || displayStatus === 'cancelled') && verificationData?.status && (
             <p><strong>Received Status:</strong> {verificationData.status}</p>
          )}

        </div>
      )}

      {/* Next Step Information/Actions */}
      {!isLoading && (
        <div className="khalti-callback-actions">
          <button className="view-bookings-btn" onClick={() => navigate('/bookings')}>
            View My Bookings
          </button>
          <Link to="/" className="khalti-go-home-btn">Go Home</Link>
        </div>
      )}
    </div>
  );
};

export default KhaltiCallbackHandler;