import React, {useEffect, useState} from 'react';
import { post } from '../api/api';
import '../assets/styles/Upload.css';

function Upload() {
  // State for form fields
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('scooter'); // Default or common value
  const [plateNum, setPlateNum] = useState('');
  const [status, setStatus] = useState('available'); // Default or common value
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null); // State for the selected file
  const [location, setLocation] = useState(null)

  useEffect(() => {
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
           latitude : position.coords.latitude,
           longitude : position.coords.longitude
        }
        setLocation(coords);
      })
    }
  }, []);
  // State for submission status
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(''); // To show success/error messages
  const [error, setError] = useState('');

  // Handler for file input changes
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
      setMessage(''); // Clear previous messages on new file selection
      setError('');
    } else {
      setPhoto(null);
    }
  };

  // Handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default browser form submission
    setMessage('');
    setError('');

    if (!photo) {
      setError('Please select a photo for the vehicle.');
      return;
    }

    setSubmitting(true);

    // Create a FormData object
    const formData = new FormData();

    // Append all form fields to the FormData object
    formData.append('photo', photo); // The file object
    formData.append('name', name);
    formData.append('model', model);
    formData.append('type', type);
    formData.append('plateNum', plateNum);
    formData.append('status', status);
    formData.append('price', price);
    formData.append('latitude', location.latitude);
    formData.append('longitude', location.longitude);
    try {
      const response = await post('/vehicles/admin/add', formData);

      if (!(response.status >= 200 && response.status < 300)) { // Check status code range
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
            const errData = response.data; // Error details might be in response.data
            errorMsg = errData.message || JSON.stringify(errData) || errorMsg;
        } catch (e) {
            errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg); // Throw error to be caught below
      }

      // Success case
      const result = response.data; // Access the response body
      setMessage(result.message || 'Vehicle added successfully!');
      
      // Clear form fields on success
      setName('');
      setModel('');
      setType('scooter');
      setPlateNum('');
      setStatus('available');
      setPrice('');
      setPhoto(null);
      
      // Reset the file input by clearing its value
      document.getElementById('photo').value = '';

    } catch (err) {
      console.error("Submission failed:", err);
      // Handle errors (err might be the Error thrown above or a network error)
      let detail = 'Failed to add vehicle. Please try again.';
      if (err && err.data) { // Check if it has Axios response data (from thrown response errors)
          detail = err.data.message || JSON.stringify(err.data);
      } else if (err instanceof Error) {
          detail = err.message;
      } else if (typeof err === 'string') {
          detail = err;
      }
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2>Add New Vehicle</h2>
        <p>Fill in the details to add a new vehicle to the fleet</p>
      </div>
      
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Vehicle Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Honda Activa"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              placeholder="e.g., 2023"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Vehicle Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="scooter">Scooter</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="car">Car</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="plateNum">Plate Number</label>
            <input
              type="text"
              id="plateNum"
              value={plateNum}
              onChange={(e) => setPlateNum(e.target.value)}
              required
              placeholder="e.g., BA 12 PA 3456"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price (per hour)</label>
            <input
              type="number"
              id="price"
              value={price}
              min="0"
              onChange={(e) => setPrice(Math.max(0 , e.target.value))}
              required
              placeholder="e.g., 500"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="photo">Vehicle Photo</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {photo && <div className="file-preview">Selected file: {photo.name}</div>}
        </div>
        
        <button 
          className="submit-button" 
          type="submit" 
          disabled={submitting}
        >
          {submitting ? 'Adding Vehicle...' : 'Add Vehicle'}
        </button>
        
        {message && <div className="message success-message">{message}</div>}
        {error && <div className="message error-message">{error}</div>}
      </form>
    </div>
  );
}

export default Upload;