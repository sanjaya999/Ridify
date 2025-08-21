import React, { useState, useEffect } from 'react';
import { get, post } from '../../api/api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await get('/api/v1/v/all');
      if (response.success) {
        setVehicles(response.data);
      } else {
        setError('Failed to fetch vehicles');
      }
    } catch (err) {
      setError('An error occurred while fetching vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (vehicleId) => {
    await toggleSuspension(vehicleId, true);
  };

  const handleUnsuspend = async (vehicleId) => {
    await toggleSuspension(vehicleId, false);
  };

  const toggleSuspension = async (vehicleId, suspend) => {
    setActionInProgress(true);
    const endpoint = suspend ? `/api/v1/v/sus/${vehicleId}` : `/api/v1/v/unsus/${vehicleId}`;
    
    try {
      const response = await post(endpoint, {});
      if (response.success) {
        // Update the vehicle in the state
        setVehicles(vehicles.map(vehicle => 
          vehicle.id === vehicleId ? { ...vehicle, suspended: suspend } : vehicle
        ));
        
        setActionMessage({
          type: 'success',
          text: `Vehicle ${suspend ? 'suspended' : 'unsuspended'} successfully`
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setActionMessage({
          type: 'error',
          text: `Failed to ${suspend ? 'suspend' : 'unsuspend'} vehicle`
        });
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: `An error occurred while ${suspend ? 'suspending' : 'unsuspending'} vehicle`
      });
      console.error(`Error ${suspend ? 'suspending' : 'unsuspending'} vehicle:`, err);
    } finally {
      setActionInProgress(false);
    }
  };

  const getVehicleTypeIcon = (type) => {
    if (type === 'car') {
      return <DirectionsCarIcon />;
    } else if (type === 'motorcycle') {
      return <TwoWheelerIcon />;
    }
    return null;
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{
          background: 'linear-gradient(to bottom right, #1a1a1a, #242424)',
          borderRadius: '16px',
          padding: '3rem',
          margin: '2rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <CircularProgress sx={{ color: '#90caf9' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      <Box 
        sx={{ 
          background: 'linear-gradient(to right, #1a1a1a, #242424)',
          borderRadius: '16px',
          padding: { xs: 2, sm: 3 },
          marginBottom: 3,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' }
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom={isMobile} 
          sx={{ 
            color: '#ffffff',
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            marginBottom: { sm: 0 }
          }}
        >
          Vehicle Management
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={fetchVehicles} 
          disabled={loading || actionInProgress}
          sx={{ 
            backgroundColor: '#ffffff',
            color: '#121212',
            '&:hover': {
              backgroundColor: '#e0e0e0',
              transform: 'translateY(-2px)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
            },
            transition: 'all 0.3s ease',
            fontWeight: 600,
            borderRadius: '8px'
          }}
        >
          Refresh Vehicles
        </Button>
      </Box>
      
      {actionMessage.text && (
        <Alert 
          severity={actionMessage.type} 
          sx={{ 
            marginBottom: 2,
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}
          onClose={() => setActionMessage({ type: '', text: '' })}
        >
          {actionMessage.text}
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            marginBottom: 2,
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            borderLeft: '4px solid #d32f2f'
          }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      <TableContainer 
        component={Paper}
        sx={{
          background: 'linear-gradient(to bottom right, #1a1a1a, #242424)',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ 
              background: 'rgba(0, 0, 0, 0.2)'
            }}>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Model</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Plate Number</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Owner</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <TableRow 
                  key={vehicle.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    },
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  <TableCell sx={{ color: '#e0e0e0' }}>{vehicle.id}</TableCell>
                  <TableCell>
                    <Avatar 
                      src={`https://rentthis-dawn-shape-1905.fly.dev/${vehicle.photoUrl}`} 
                      alt={vehicle.name}
                      variant="rounded"
                      sx={{ 
                        width: 60, 
                        height: 60,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 500 }}>{vehicle.name}</TableCell>
                  <TableCell sx={{ color: '#90caf9' }}>{vehicle.model}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getVehicleTypeIcon(vehicle.type)}
                      label={vehicle.type}
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#ffffff',
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{vehicle.plateNum}</TableCell>
                  <TableCell sx={{ color: '#4caf50', fontWeight: 600 }}>${vehicle.price.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{vehicle.ownerName?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      icon={vehicle.suspended ? <BlockIcon /> : <CheckCircleIcon />}
                      label={vehicle.suspended ? 'Suspended' : 'Active'}
                      sx={{
                        backgroundColor: vehicle.suspended ? 'rgba(200, 50, 50, 0.2)' : 'rgba(50, 200, 50, 0.2)',
                        color: vehicle.suspended ? '#ff7961' : '#81c784',
                        fontWeight: 600,
                        border: `1px solid ${vehicle.suspended ? '#ff7961' : '#81c784'}`
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {vehicle.suspended ? (
                      <Tooltip title="Unsuspend Vehicle">
                        <Button 
                          variant="contained" 
                          color="success" 
                          onClick={() => handleUnsuspend(vehicle.id)}
                          disabled={actionInProgress}
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
                            }
                          }}
                        >
                          Unsuspend
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Suspend Vehicle">
                        <Button 
                          variant="contained" 
                          color="error" 
                          onClick={() => handleSuspend(vehicle.id)}
                          disabled={actionInProgress}
                          size="small"
                          startIcon={<BlockIcon />}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
                            }
                          }}
                        >
                          Suspend
                        </Button>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ color: '#e0e0e0', padding: 4 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: 2,
                      padding: 3
                    }}
                  >
                    <DirectionsCarIcon sx={{ fontSize: 48, color: '#90caf9' }} />
                    <Typography variant="h6" sx={{ color: '#ffffff' }}>
                      No vehicles found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                      There are no vehicles in the system yet
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VehicleManagement;
