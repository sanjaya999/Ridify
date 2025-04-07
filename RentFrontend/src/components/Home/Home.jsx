import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../api/api';
import '../../assets/styles/Home.css';

const Home = () => {
  const fetchVehicles = async () => {
    const { data } = await get(`vehicles/getAll`);
    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    staleTime:60000,
    cacheTime:20000,
  });

  if (isLoading) return (
    <div className="loading-container">
      <p>Loading vehicles...</p>
    </div>
  );
  
  if (isError) return (
    <div className="error-container">
      <p>Error: {error.message || 'Failed to load vehicles'}</p>
    </div>
  );

  return (
    <div className="home-container">
      <h1>Welcome to Ridify</h1>
      <div className="vehicle-list">
        {data.map((vehicle) => (
          <div key={vehicle.id} className="vehicle-card">
            <img 
              src={`http://localhost:8080/${vehicle.photoUrl}`} 
              alt={vehicle.name} 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Vehicle+Image';
              }}
            />
            <h3>{vehicle.name}</h3>
            <p>{vehicle.description}</p>
            <p>Price: ${vehicle.price}/day</p>
            <button>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
