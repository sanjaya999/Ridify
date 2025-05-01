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
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await get('/api/v1/s/all');
      if (response.success) {
        setUsers(response.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId) => {
    await toggleSuspension(userId, true);
  };

  const handleUnsuspend = async (userId) => {
    await toggleSuspension(userId, false);
  };

  const toggleSuspension = async (userId, suspend) => {
    setActionInProgress(true);
    const endpoint = suspend ? `/api/v1/s/sus/${userId}` : `/api/v1/s/unsus/${userId}`;
    
    try {
      const response = await post(endpoint, {});
      if (response.success) {
        // Update the user in the state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, suspended: suspend } : user
        ));
        
        setActionMessage({
          type: 'success',
          text: `User ${suspend ? 'suspended' : 'unsuspended'} successfully`
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setActionMessage({
          type: 'error',
          text: `Failed to ${suspend ? 'suspend' : 'unsuspend'} user`
        });
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: `An error occurred while ${suspend ? 'suspending' : 'unsuspending'} user`
      });
      console.error(`Error ${suspend ? 'suspending' : 'unsuspending'} user:`, err);
    } finally {
      setActionInProgress(false);
    }
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
          User Management
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={fetchUsers} 
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
          Refresh Users
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
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>User</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow 
                  key={user.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    },
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  <TableCell sx={{ color: '#e0e0e0' }}>{user.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#1a1a1a',
                          width: 40, 
                          height: 40,
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                          border: '2px solid #90caf9',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        {getInitials(user.name)}
                      </Avatar>
                      <Typography sx={{ color: '#ffffff', fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ color: '#90caf9', fontSize: 18 }} />
                      <Typography sx={{ color: '#90caf9' }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={user.suspended ? <BlockIcon /> : <CheckCircleIcon />}
                      label={user.suspended ? 'Suspended' : 'Active'}
                      sx={{
                        backgroundColor: user.suspended ? 'rgba(200, 50, 50, 0.2)' : 'rgba(50, 200, 50, 0.2)',
                        color: user.suspended ? '#ff7961' : '#81c784',
                        fontWeight: 600,
                        border: `1px solid ${user.suspended ? '#ff7961' : '#81c784'}`
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {user.suspended ? (
                      <Tooltip title="Unsuspend User">
                        <Button 
                          variant="contained" 
                          color="success" 
                          onClick={() => handleUnsuspend(user.id)}
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
                      <Tooltip title="Suspend User">
                        <Button 
                          variant="contained" 
                          color="error" 
                          onClick={() => handleSuspend(user.id)}
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
                <TableCell colSpan={5} align="center" sx={{ color: '#e0e0e0', padding: 4 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: 2,
                      padding: 3
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 48, color: '#90caf9' }} />
                    <Typography variant="h6" sx={{ color: '#ffffff' }}>
                      No users found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                      There are no users in the system yet
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

export default UserManagement;
