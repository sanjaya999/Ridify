import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../../assets/styles/Layout.css';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUserId = localStorage.getItem('userId');
    setIsAuthenticated(!!token);
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewBookings = () => {
    navigate('/bookings');
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserId(null);
    navigate('/login');
    handleProfileMenuClose();
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
        >
          {item.text}
        </Button>
      ))}
    </>
  );

  const drawer = (
    <List className="mobile-drawer-list">
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
      {isAuthenticated && (
        <>
          <ListItem
            button
            component={NavLink}
            to="/bookings"
            onClick={handleDrawerToggle}
            className="drawer-link"
          >
            <ListItemText primary="My Bookings" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('userId');
              setIsAuthenticated(false);
              setUserId(null);
              navigate('/login');
              handleDrawerToggle();
            }}
            className="drawer-link"
          >
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      )}
    </List>
  );

  const authButtons = isAuthenticated ? (
    <div className="profile-section">
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleViewBookings}>My Bookings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  ) : (
    <div className="auth-buttons">
      <Button
        component={NavLink}
        to="/login"
        variant="text"
        className="auth-button"
      >
        Login
      </Button>
      <Button
        component={NavLink}
        to="/register"
        variant="outlined"
        className="auth-button-register"
      >
        Register
      </Button>
    </div>
  );

  return (
    <>
      <AppBar position="fixed" className="navbar-minimal" elevation={0}>
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
          
          <div className="logo-minimal" onClick={() => navigate('/')}>
            <DirectionsCarIcon sx={{ mr: 1 }} />
            <span>Ridify</span>
          </div>

          {!isMobile && (
            <div className="nav-links-minimal">
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
