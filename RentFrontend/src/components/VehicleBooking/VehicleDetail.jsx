import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import '../../assets/styles/VehicleDetail.css';

// API functions
import { get, post } from '../../api/api';
import GeoLocation from "../GeoLocation.jsx";

const API_BASE_URL = 'https://rentthis-dawn-shape-1905.fly.dev';

const getVehicle = async (id) => {
  try {
    return await get(`/vehicles/getOne?id=${id}`);
  } catch (error) {
    console.error('Failed to fetch vehicle data', error);
    throw error;
  }
};



const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State variables
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [startingAddress, setStartingAddress] = useState('');
  const [endingAddress, setEndingAddress] = useState('');
  const [showGeo, setShowGeo] = useState();
// Verify booking availability
  const verifyBooking = async (bookingData) => {
    try {
      return await post('/api/v1/book/verify', bookingData);
    } catch (error) {
      console.error('Verify booking API error:', error);
      throw error;
    }
  };

  // React Query Hooks
  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['oneVehicle', id],
    queryFn: () => getVehicle(id),
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: verifyBooking,
    onSuccess: (data) => {
      if (data?.success && data?.data) {
        localStorage.setItem('bookingToken', data.data.token);
        setErrorMessage('');
        navigate('/confirm-booking', {
          state: {
            hourlyRate: data.data.hourlyRate,
            totalHours: data.data.totalHours,
            totalAmount: data.data.totalAmount,
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            vehicleModel: vehicle.model,
            vehiclePhotoUrl: vehicle.photoUrl
          }
        });
      } else if (data?.message) {
        setIsBooked(false);
        setErrorMessage(data.message);
      } else {
        setIsBooked(false);
        setErrorMessage('Unexpected response from server.');
      }
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || error?.message || 'Booking failed.';
      setErrorMessage(errorMsg);
      setIsBooked(false);
    }
  });

  useEffect(() => {
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
        const diffMillis = end - start;
        const diffHours = Math.round(diffMillis / (1000 * 60 * 60));
        setDuration(diffHours);
      } else {
        setDuration(0);
      }
    } else {
      setDuration(0);
    }
    
    setErrorMessage('');
  }, [startDateTime, endDateTime]);

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  
  const minDateTime = getMinDateTime();

  // Event Handlers
  const handleStartDateChange = (value) => {
    setStartDateTime(value);
    if (value) {
      const start = new Date(value);
      if (!isNaN(start.getTime())) {
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
        setEndDateTime(end.toISOString().slice(0, 16));
      } else {
        setEndDateTime('');
      }
    } else {
      setEndDateTime('');
    }
  };

  const handleEndDateChange = (value) => {
    setEndDateTime(value);
  };



  const handleShowBooking = () => {
    setShowDatePicker(true);
    const nowValue = getMinDateTime();
    setStartDateTime(nowValue);
    
    const start = new Date(nowValue);
    if (!isNaN(start.getTime())) {
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
      setEndDateTime(end.toISOString().slice(0, 16));
    }
  };

  const handleBooking = () => {
    setShowGeo(true);
    if (!startDateTime || !endDateTime || duration <= 0) {
      setErrorMessage('Please select a valid start and end time.');
      return;
    }
    if (!startingAddress || startingAddress.trim() === '') {
      setErrorMessage('Please enter a starting address.');
      return;
    }

    // Validate ending address
    if (!endingAddress || endingAddress.trim() === '') {
      setErrorMessage('Please enter an ending address.');
      return;
    }

    const formattedStartTime = `${startDateTime}:00`;
    const formattedEndTime = `${endDateTime}:00`;

    const bookingData = {
      vehicleId: parseInt(id, 10),
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      startingAddress,
      endingAddress,

    };

    bookingMutation.mutate(bookingData);
  };

  const formatAvailabilityMessage = (message) => {
    if (!message || !message.includes('Nearby availability:')) return message;
    
    const [errorPart, availabilityPart] = message.split('Nearby availability:');
    
    if (!availabilityPart) return message;
    
    const availabilitySlots = availabilityPart.trim().split(',').map(slot => slot.trim());
    
    return (
      <div>
        <p>{errorPart.trim()}</p>
        <p><strong>Nearby availability:</strong></p>
        <ul className="availability-slots">
          {availabilitySlots.map((slot, index) => (
            <li key={index}>{slot}</li>
          ))}
        </ul>
      </div>
    );
  };

  if (isLoading) return <p>Loading vehicle details...</p>;
  if (queryError) return <p>Error loading vehicle: {queryError.response.data.message}</p>;
  if (!data || !data.data) return <p>Vehicle not found.</p>;

  const vehicle = data.data;

  return (
      <div className="vehicle-page-wrapper">
        <div className="vehicle-detail-container">
          {/* Vehicle Info Section */}
          <div className="vehicle-info">
            <h1>{vehicle.name}</h1>
            {vehicle.photoUrl && (
                <img
                    src={`${API_BASE_URL}/${vehicle.photoUrl.startsWith('/') ? vehicle.photoUrl.substring(1) : vehicle.photoUrl}`}
                    alt={vehicle.name}
                    className="vehicle-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            )}
            <div className="vehicle-specs">
              <p><strong>Model:</strong> {vehicle.model || 'N/A'}</p>
              <p><strong>Plate Number:</strong> {vehicle.plateNum || 'N/A'}</p>
              <p><strong>Price:</strong> Rs{vehicle.price ? vehicle.price.toFixed(2) : 'N/A'}/day</p>
              <p><strong>Type:</strong> {vehicle.type || 'N/A'}</p>
            </div>
          </div>

          {/* Booking Section */}
          <div className="booking-section">
            <h2>Book this Vehicle</h2>

            {!showDatePicker ? (
                <button
                    className="book-button"
                    onClick={handleShowBooking}
                    disabled={isBooked}
                >
                  {isBooked ? 'Booked!' : 'Book Now'}
                </button>
            ) : (
                <>
                  {/* Date Time Pickers */}
                  <div className="date-time-container">
                    <div className="date-time-header">
                      <span>Select start time:</span>
                      <span>Select end time:</span>
                    </div>
                    <div className="date-time-pickers">
                      <div className="datetime-picker">
                        <input
                            type="datetime-local"
                            min={minDateTime}
                            value={startDateTime}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            disabled={isBooked || bookingMutation.isPending}
                        />
                      </div>
                      <div className="datetime-picker">
                        <input
                            type="datetime-local"
                            min={startDateTime || minDateTime}
                            value={endDateTime}
                            onChange={(e) => handleEndDateChange(e.target.value)}
                            disabled={isBooked || bookingMutation.isPending || !startDateTime}
                        />
                      </div>
                    </div>

                    {/* Display selected times */}
                    {startDateTime && endDateTime && (
                        <div className="selected-time-details">
                          <p>Selected: {formatDateTime(startDateTime)} to {formatDateTime(endDateTime)}</p>
                          {duration > 0 ? (
                              <p>Duration: {duration} hour(s)</p>
                          ) : (
                              <p className="warning-text">Duration: End time must be after start time.</p>
                          )}
                        </div>
                    )}
                  </div>
                  <div className="address-input">
                    <label>Starting Address:</label>
                    <input
                        type="text"
                        value={startingAddress}
                        onChange={(e) => setStartingAddress(e.target.value)}
                        placeholder="Enter pickup location"
                        disabled={isBooked || bookingMutation.isPending}
                        required
                    />
                  </div>
                  <div className="address-input">
                    <label>Ending Address:</label>
                    <input
                        type="text"
                        value={endingAddress}
                        onChange={(e) => setEndingAddress(e.target.value)}
                        placeholder="Enter drop-off location"
                        disabled={isBooked || bookingMutation.isPending}
                        required
                    />
                  </div>


                  {/* Error Message Display */}
                  {errorMessage && (
                      <div className="availability-error">
                        {formatAvailabilityMessage(errorMessage)}
                      </div>
                  )}

                  {/* Booking Button */}
                  <button
                      className={`book-button ${isBooked ? '' : 'confirm-button'}`}
                      onClick={handleBooking}
                      disabled={isBooked || bookingMutation.isPending || !startDateTime || !endDateTime || duration <= 0}
                  >
                    {bookingMutation.isPending ? 'Processing...' : (isBooked ? 'Booked!' : 'Confirm Booking')}
                  </button>

                  {/* Booking Confirmation Message */}
                  {isBooked && (
                      <p className="booking-confirmation">
                        Your booking has been confirmed from {formatDateTime(startDateTime)} to {formatDateTime(endDateTime)}
                      </p>
                  )}
                </>
            )}
          </div>
        </div>


        {showGeo ? <GeoLocation startTime = {startDateTime} endTime = {endDateTime} /> : null}

      </div>
  );
};

export default VehicleDetail;