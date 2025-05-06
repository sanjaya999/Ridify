import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ fullWidth = false, onSearch, closeMobileMenu }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // If an onSearch prop is provided, use it
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        // Otherwise, navigate to the vehicles page with the search query
        navigate(`/vehicles?search=${encodeURIComponent(searchQuery)}`);
      }
      
      // Close mobile menu if provided (for mobile view)
      if (closeMobileMenu) {
        closeMobileMenu();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={(e) => e.preventDefault()}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: fullWidth ? '100%' : 300,
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search vehicles..."
        inputProps={{ 'aria-label': 'search vehicles' }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <IconButton 
        type="button" 
        sx={{ 
          p: '10px', 
          color: '#8c52ff',
          '&:hover': {
            backgroundColor: 'rgba(140, 82, 255, 0.08)'
          } 
        }} 
        aria-label="search"
        onClick={handleSearch}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
