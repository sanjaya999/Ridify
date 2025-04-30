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
  Alert
} from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      
      {actionMessage.text && (
        <Alert 
          severity={actionMessage.type} 
          sx={{ marginBottom: 2 }}
          onClose={() => setActionMessage({ type: '', text: '' })}
        >
          {actionMessage.text}
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ marginBottom: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={fetchUsers} 
        sx={{ marginBottom: 2 }}
        disabled={loading || actionInProgress}
      >
        Refresh Users
      </Button>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Box 
                      component="span" 
                      sx={{ 
                        color: user.suspended ? 'error.main' : 'success.main',
                        fontWeight: 'bold'
                      }}
                    >
                      {user.suspended ? 'Suspended' : 'Active'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.suspended ? (
                      <Button 
                        variant="contained" 
                        color="success" 
                        onClick={() => handleUnsuspend(user.id)}
                        disabled={actionInProgress}
                        size="small"
                      >
                        Unsuspend
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => handleSuspend(user.id)}
                        disabled={actionInProgress}
                        size="small"
                      >
                        Suspend
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found
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
