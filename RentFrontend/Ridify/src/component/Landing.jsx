import { Link } from 'react-router-dom';
import '../Style/Landing.css';
import { get } from '../api/api';
import { useQuery } from '@tanstack/react-query';

function Landing() {
  const baseUrl = "http://localhost:8080"; // Backend base URL

  const fetchVehicles = async() => {
    const {data} = await get(`vehicles/getAll`);
    console.log(data);
    return data;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  if (isLoading) return (
    <div className="landing-container">
      <div className="loading-spinner">Loading...</div>
    </div>
  );
  
  if (isError) return (
    <div className="landing-container">
      <div className="error-message">Error: {error.message}</div>
    </div>
  );

  return(
    <div className="landing-container">
      <div className="landing-hero">
        <h1>Explore Our Vehicle Fleet</h1>
        <p className="landing-subtitle">Find the perfect vehicle for your next adventure</p>
        
        <div className="landing-cta">
          <Link to="/book" className="landing-button primary">Book Now</Link>
          <Link to="/about" className="landing-button secondary">Learn More</Link>
        </div>
      </div>

      <section className="vehicle-list-section">
        <h2 className="section-title">Available Vehicles</h2>
        
        <div className="vehicle-grid">
          {data.map(vehicle => (
            <div key={vehicle.id} className="vehicle-card feature-card">
              <div className="vehicle-image-container">
                {console.log(baseUrl + "/" + vehicle.photoUrl)}
                <img 
                  src={`${baseUrl}/${vehicle.photoUrl}`}
                  alt={vehicle.name} 
                  className="vehicle-image" 
                />
              </div>
              <div className="vehicle-details">
                <h3 className="vehicle-name">{vehicle.name}</h3>
                <div className="vehicle-info">
                  <p><strong>Model:</strong> {vehicle.model}</p>
                  <p><strong>Type:</strong> {vehicle.type}</p>
                  <p><strong>Plate Number:</strong> {vehicle.plateNum}</p>
                  <p><strong>Owner:</strong> {vehicle.ownerName}</p>
                </div>
                <Link to={`/vehicle/${vehicle.id}`} className="landing-button primary vehicle-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial">
          <p>"Ridify made our family vacation so much easier! The booking process was simple and the vehicle we rented was in excellent condition."</p>
          <p className="testimonial-author">- Sarah J.</p>
        </div>
      </section>
    </div>
  );
}

export default Landing;
