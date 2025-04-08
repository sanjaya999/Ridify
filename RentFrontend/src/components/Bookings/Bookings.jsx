import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../api/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUserId = localStorage.getItem('user');


  const fetchVehicles = async () => {
    const { data } = await get(`api/v1/book/currentUserBooking`);
    return data;
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    staleTime:60000,
    cacheTime:20000,
  });
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
        <Typography variant="h6" color="error" align="center">
          Error: { 'Failed to load vehicles'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
             {console.log(data)}

    </Container>
  );
};

export default Bookings;
