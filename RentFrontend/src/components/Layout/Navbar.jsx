import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import './Layout.css';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Vehicles', path: '/vehicles' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];

  const navLinks = (
    <>
      {menuItems.map((item) => (
        <Button
          key={item.text}
          component={NavLink}
          to={item.path}
          className="nav-link"
          sx={{
            color: 'white',
            '&.active': {
              color: '#ffd700',
            }
          }}
        >
          {item.text}
        </Button>
      ))}
    </>
  );

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.text}
          component={NavLink}
          to={item.path}
          onClick={handleDrawerToggle}
          className="drawer-link"
        >
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  const authButtons = isAuthenticated ? (
    <Button
      variant="contained"
      className="auth-button"
      onClick={() => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        navigate('/login');
      }}
      sx={{ 
        bgcolor: '#ffd700',
        color: '#000',
        '&:hover': {
          bgcolor: '#ffc800'
        }
      }}
    >
      Logout
    </Button>
  ) : (
    <div className="auth-buttons">
      <Button
        component={NavLink}
        to="/login"
        variant="text"
        className="auth-button"
        sx={{ color: 'white' }}
      >
        Login
      </Button>
      <Button
        component={NavLink}
        to="/register"
        variant="contained"
        className="auth-button"
        sx={{ 
          bgcolor: '#ffd700',
          color: '#000',
          '&:hover': {
            bgcolor: '#ffc800'
          }
        }}
      >
        Register
      </Button>
    </div>
  );

  return (
    <>
      <AppBar position="fixed" className="navbar">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <div className="logo" onClick={() => navigate('/')}>
            <DirectionsCarIcon sx={{ mr: 1 }} />
            <span>Ridify</span>
          </div>

          {!isMobile && (
            <div className="nav-links">
              {navLinks}
            </div>
          )}

          {authButtons}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        className="mobile-drawer"
        ModalProps={{
          keepMounted: true // Better mobile performance
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
