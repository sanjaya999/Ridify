import { Link } from 'react-router-dom';
import '../Style/Landing.css';
import { get } from '../api/api';
import { useQuery } from '@tanstack/react-query';

function Landing() {
  const baseUrl = "http://localhost:8080"; // Backend base URL

  
  const  fetchVehicles = async()=>{
    const {data} = await get(`vehicles/getAll`);
    console.log(data);
    return data;
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;


return(
  <div>
      <h1>Vehicle List</h1>
      <ul>
        {data.map(vehicle => (
          <li key={vehicle.id}>
            <h2>{vehicle.name}</h2>
            <p>Model: {vehicle.model}</p>
            <p>Type: {vehicle.type}</p>
            <p>Plate Number: {vehicle.plateNum}</p>
            <p>Owner: {vehicle.ownerName}</p>
            {console.log(baseUrl/+vehicle.photoUrl)}
            <img 
              src={`${baseUrl}/${vehicle.photoUrl}`} // Construct the full image URL
              alt={vehicle.name} style={{ width: '200px', height: 'auto' }} />
          </li>
        ))}
      </ul>
    </div>
)  
}

export default Landing;
