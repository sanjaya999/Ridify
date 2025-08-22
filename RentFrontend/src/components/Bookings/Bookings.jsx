import React from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Paper, Chip, Card, CardContent, CardMedia, CardActions, Button, Divider } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../api/api';
import { format, parseISO } from 'date-fns';

const Booking = () => {
  const fetchVehicles = async () => {
    const { data } = await get(`api/v1/book/currentUserBooking`);
    return data;
  };
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchVehicles,
    staleTime: 60000,
    cacheTime: 20000,
  });
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
        <Typography variant="h6" color="error" align="center">
          Error: {'Failed to load bookings'}
        </Typography>
      </Container>
    );
  }

  // Function to get status color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#888';
    }
  };

  // Function to format date and time
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy h:mm a');
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        align="center" 
        gutterBottom
        sx={{ 
          color: '#fff',
          fontWeight: 500,
          mb: 4
        }}
      >
        My Bookings
      </Typography>
      
      {data && data.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: '#121212',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff'
          }}
        >
          <Typography variant="h6" color="#ccc">
            You don't have any bookings yet
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ backgroundColor: '#121212', p: 3, borderRadius: '8px' }}>
          {data && data.map((booking) => (
            <Card 
              key={booking.id}
              sx={{ 
                display: 'flex',
                mb: 2,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
                },
                backgroundColor: '#1a1a1a'
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: 200, height: '100%', objectFit: 'cover' }}
                image={`${booking.vehicle.photoUrl}`}
                alt={booking.vehicle.name}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ color: '#fff', fontWeight: 500 }}>
                      {booking.vehicle.name} - {booking.vehicle.model}
                    </Typography>
                    <Chip 
                      label={booking.status} 
                      size="small"
                      sx={{ 
                        backgroundColor: getStatusColor(booking.status),
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="#ccc" sx={{ mb: 1 }}>
                        <strong>Plate Number:</strong> {booking.vehicle.plateNum}
                      </Typography>
                      <Typography variant="body2" color="#ccc" sx={{ mb: 1 }}>
                        <strong>Price:</strong> Rs{booking.vehicle.price}/hour
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="#ccc" sx={{ mb: 1 }}>
                        <strong>From:</strong> {formatDate(booking.startDate)}
                      </Typography>
                      <Typography variant="body2" color="#ccc" sx={{ mb: 1 }}>
                        <strong>To:</strong> {formatDate(booking.endDate)}
                      </Typography>
                    </Grid>
                    <Typography variant="body2" color="#ccc" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <strong>Payment Method:</strong>&nbsp;
                      {booking.paymentMethod}
                      {booking.paymentMethod === 'Khalti' && (
                        <img 
                          src="/khalti-logo.png" 
                          alt="Khalti" 
                          style={{ height: '16px', marginLeft: '8px' }} 
                        />
                      )}
                    </Typography>
                    <Typography variant="body2" color="#ccc" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <strong>Owner Phone Number:</strong>&nbsp;
                      {booking.vehicle?.ownerName?.phoneNumber}
                    </Typography>
                    <Typography variant="body2" color="#ccc" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <strong>Pickup Address: </strong>&nbsp;
                      {booking?.startingAddress}
                    </Typography>
                    <Typography variant="body2" color="#ccc" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <strong>Drop Address: </strong>&nbsp;
                      {booking?.endingAddress}
                    </Typography>
                  </Grid>
                </CardContent>
                <Divider sx={{ backgroundColor: '#333' }} />

              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Booking;
