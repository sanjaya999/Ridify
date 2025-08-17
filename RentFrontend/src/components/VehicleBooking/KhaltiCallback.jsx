// src/components/Booking/KhaltiCallbackHandler.js

import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useQuery as useReactQuery } from '@tanstack/react-query';
import { post } from '../../api/api';

import '../../assets/styles/KhaltiCallback.css';

function useUrlQuery() {
  return new URLSearchParams(useLocation().search);
}

const KhaltiCallbackHandler = () => {
  const urlQuery = useUrlQuery();
  const navigate = useNavigate();

  const pidx = urlQuery.get('pidx');
  const statusParam = urlQuery.get('status');
  const bookingTokenFromUrl = urlQuery.get('bookingToken');

  const bookingToken = localStorage.getItem('bookingToken');



  const fetchKhaltiVerification = async (pidxToCheck) => {
    if (!pidxToCheck) {
      throw new Error('PIDX is required for verification.');
    }
    return await post('/api/v1/payments/khalti/check-status', { pidx: pidxToCheck ,
      token: bookingToken
    });
  };

  const {
    data: verificationData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useReactQuery({
    queryKey: ['khaltiVerification', pidx],
    queryFn: () => fetchKhaltiVerification(pidx),
    enabled: !!pidx && statusParam !== 'User canceled',
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

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
    const verifiedStatus = verificationData.status;
    if (verifiedStatus === 'Completed') {
      displayStatus = 'success';
      displayMessage = 'Payment Verified Successfully!';
    } else {
      displayStatus = 'error';
      displayMessage = `Payment verification returned status: ${verifiedStatus || 'Unknown'}. Booking cannot be confirmed.`;
    }
  }
   else if (!isLoading && !isError && !isSuccess && statusParam !== 'User canceled') {
       displayStatus = 'error';
       displayMessage = 'Verification process did not complete as expected. Please check details or contact support.';
   }




  return (
    <div className="khalti-callback-container">
      <h3>Khalti Payment Status</h3>

      <span className={`khalti-status ${displayStatus}`}>{displayStatus}</span>
      <div className="khalti-callback-message">
        {isLoading ? 'Verifying payment, please wait...' : displayMessage}
      </div>

      {!isLoading && (verificationData || isError || displayStatus === 'cancelled') && (
        <div className="khalti-callback-details">
          <h4>Verification Details:</h4>

          {pidx && <p><strong>PIDX:</strong> {pidx}</p>}

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