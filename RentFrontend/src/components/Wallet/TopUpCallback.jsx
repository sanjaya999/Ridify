import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useQuery as useReactQuery } from '@tanstack/react-query';
import { post } from '../../api/api';
import { Box, Typography, Paper, Container, CircularProgress, Alert, Button } from '@mui/material';

// Utility to parse query params from URL
function useUrlQuery() {
  return new URLSearchParams(useLocation().search);
}

const TopUpCallback = () => {
  const urlQuery = useUrlQuery();
  const navigate = useNavigate();

  // Extract params from the callback URL
  const pidx = urlQuery.get('pidx');
  const statusParam = urlQuery.get('status');

  // Define the async function to verify the payment
  const verifyPayment = async (pidxToCheck) => {
    if (!pidxToCheck) {
      throw new Error('PIDX is required for verification.');
    }
    // Call the check-status API endpoint with only the pidx parameter
    return await post('/api/v1/payments/khalti/topup/check-status', { pidx: pidxToCheck });
  };

  // Use React Query to fetch verification status
  const {
    data: verificationData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useReactQuery({
    queryKey: ['khaltiTopUpVerification', pidx],
    queryFn: () => verifyPayment(pidx),
    enabled: !!pidx && statusParam !== 'User canceled',
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Determine display status and message
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
    const errorMsg = error?.response?.data?.message || error?.message || 'Failed to connect to verification server.';
    displayMessage = `Payment verification failed: ${errorMsg}`;
  } else if (isSuccess && verificationData) {
    if (verificationData.status === 'success') {
      displayStatus = 'success';
      displayMessage = verificationData.message || 'Payment verified and balance updated successfully!';
    } else {
      displayStatus = 'error';
      displayMessage = verificationData.message || 'Payment verification failed.';
    }
  } else if (!isLoading && !isError && !isSuccess && statusParam !== 'User canceled') {
    displayStatus = 'error';
    displayMessage = 'Verification process did not complete as expected. Please check details or contact support.';
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          border: '1px solid #333'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            color: '#fff',
            fontWeight: 500,
            mb: 3
          }}
        >
          Top Up Status
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 3
        }}>
          {isLoading ? (
            <CircularProgress sx={{ color: '#8c52ff', mb: 2 }} />
          ) : (
            <Box sx={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: 2,
              backgroundColor: displayStatus === 'success' ? 'rgba(76, 175, 80, 0.1)' : 
                              displayStatus === 'error' ? 'rgba(244, 67, 54, 0.1)' : 
                              displayStatus === 'cancelled' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(33, 150, 243, 0.1)',
              border: `2px solid ${displayStatus === 'success' ? '#4caf50' : 
                                  displayStatus === 'error' ? '#f44336' : 
                                  displayStatus === 'cancelled' ? '#ff9800' : '#2196f3'}`
            }}>
              {displayStatus === 'success' && (
                <span style={{ fontSize: '40px', color: '#4caf50' }}>✓</span>
              )}
              {displayStatus === 'error' && (
                <span style={{ fontSize: '40px', color: '#f44336' }}>✗</span>
              )}
              {displayStatus === 'cancelled' && (
                <span style={{ fontSize: '40px', color: '#ff9800' }}>!</span>
              )}
              {displayStatus === 'processing' && (
                <CircularProgress sx={{ color: '#2196f3' }} />
              )}
            </Box>
          )}

          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              color: displayStatus === 'success' ? '#4caf50' : 
                    displayStatus === 'error' ? '#f44336' : 
                    displayStatus === 'cancelled' ? '#ff9800' : '#2196f3',
              textTransform: 'capitalize',
              fontWeight: 500
            }}
          >
            {displayStatus}
          </Typography>
        </Box>

        <Alert 
          severity={displayStatus === 'success' ? 'success' : 
                  displayStatus === 'error' ? 'error' : 
                  displayStatus === 'cancelled' ? 'warning' : 'info'} 
          sx={{ mb: 3 }}
        >
          {displayMessage}
        </Alert>

        {!isLoading && (verificationData || isError || displayStatus === 'cancelled') && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ color: '#ccc', mb: 1 }}>
              Transaction Details:
            </Typography>
            {pidx && (
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                <strong>Transaction ID:</strong> {pidx}
              </Typography>
            )}
            {isSuccess && verificationData && verificationData.status === 'success' && (
              <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
                <strong>Payment Method:</strong> {verificationData.paymentMethod || 'Khalti'}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/"
            sx={{ 
              color: '#ccc',
              borderColor: '#555',
              '&:hover': {
                borderColor: '#777',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Go Home
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/profile')}
            sx={{ 
              backgroundColor: '#8c52ff',
              '&:hover': {
                backgroundColor: '#7440e0'
              }
            }}
          >
            View Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TopUpCallback;
