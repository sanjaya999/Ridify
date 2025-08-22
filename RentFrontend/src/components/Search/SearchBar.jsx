import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputBase, IconButton, Paper, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { get } from '../../api/api';
import '../../assets/styles/SearchBar.css';

const SearchBar = ({ fullWidth = false, onSearch, closeMobileMenu }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await get(`/vehicles/search?searchTerm=${encodeURIComponent(searchQuery)}`);
        if (response.success) {
          setSearchResults(response.data);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      }

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
    <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 300 }}>
      <Paper
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
          },
          zIndex: 2
        }}
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            color: '#e0e0e0',
            '& input::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              opacity: 1
            }
          }}
          placeholder="Search vehicles..."
          inputProps={{ 'aria-label': 'search vehicles' }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value) setShowResults(false);
          }}
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

      {showResults && searchResults.length > 0 && (
        <div className="search-results-container">
          {searchResults.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="search-result-item"
              onClick={() => {
                navigate(`/aboutVehicle/${vehicle.id}`);
                setShowResults(false);
                setSearchQuery('');
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/aboutVehicle/${vehicle.id}`);
                  setShowResults(false);
                  setSearchQuery('');
                }
              }}
            >
              <div className="search-result-content">
                <img
                  src={`${vehicle.photoUrl}`}
                  alt={vehicle.name}
                  className="search-result-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="search-result-image-placeholder" style={{ display: 'none' }}>
                  No image
                </div>
                <div className="search-result-details">
                  <h3 className="search-result-name">{vehicle.name}</h3>
                  <p className="search-result-model">{vehicle.model}</p>
                  <p className="search-result-price">
                    Rs. {Number(vehicle.price).toLocaleString()}/day
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};

export default SearchBar;
