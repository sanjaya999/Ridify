import React, { useState } from 'react';
import { post } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, Container, CircularProgress, Alert } from '@mui/material';

const TopUp = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setAmount(value);
      setError('');
    }
  };

  const handleTopUp = async () => {
    if (!amount || parseInt(amount) < 100) {
      setError('Please enter an amount of at least Rs. 100');
      return;
    }

    setIsLoading(true);
    setFeedback('Initiating Khalti payment...');
    setError('');

    try {
      const response = await post('/api/v1/payments/khalti/topup', { amount: parseInt(amount) });
      
      if (response && response.payment_url) {
        setFeedback('Redirecting to Khalti...');
        window.location.href = response.payment_url;
      } else {
        throw new Error(response?.message || 'Failed to initiate Khalti payment');
      }
    } catch (error) {
      console.error('TopUp error:', error);
      setError(error.message || 'An error occurred while processing your request');
      setIsLoading(false);
    }
  };

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
          Top Up Your Wallet
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#ccc', mb: 1 }}>
            Add funds to your wallet using Khalti. Minimum amount: Rs. 100
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Amount (Rs.)"
            variant="outlined"
            value={amount}
            onChange={handleAmountChange}
            type="number"
            error={!!error}
            helperText={error}
            InputProps={{
              inputProps: { min: 100 },
              sx: { color: '#fff' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#555',
                },
                '&:hover fieldset': {
                  borderColor: '#777',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2196f3',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#aaa',
              },
            }}
          />
        </Box>

        {feedback && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {feedback}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
            sx={{ 
              color: '#ccc',
              borderColor: '#555',
              '&:hover': {
                borderColor: '#777',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleTopUp}
            disabled={isLoading || !amount}
            sx={{ 
              backgroundColor: '#8c52ff',
              '&:hover': {
                backgroundColor: '#7440e0'
              },
              '&.Mui-disabled': {
                backgroundColor: '#555',
                color: '#999'
              }
            }}
            startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          >
            {isLoading ? 'Processing...' : (
              <>
                <img 
                  src="/khalti-logo.png" 
                  alt="Khalti" 
                  style={{ height: '20px', marginRight: '8px' }} 
                />
                Top Up with Khalti
              </>
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TopUp;
