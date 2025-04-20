import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import '../../assets/styles/VehicleDetail.css';

// --- API functions ---
import { get, post } from '../../api/api';

// Fetch single vehicle details
const getVehicle = async (id) => {
  try {
    return await get(`/vehicles/getOne?id=${id}`);
  } catch (error) {
    console.error('Failed to fetch vehicle data', error);
    throw error;
  }
};

const API_BASE_URL = 'http://localhost:8080';

// Verify booking availability
const verifyBooking = async (bookingData) => {
  try {
    return await post('/api/v1/book/verify', bookingData);
  } catch (error) {
    console.error('Verify booking API error:', error);
    throw error;
  }
};

// --- Component ---
const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State variables (remain the same)
  const [startDateTime, setStartDateTime] = useState(''); // Stores "YYYY-MM-DDTHH:mm"
  const [endDateTime, setEndDateTime] = useState('');   // Stores "YYYY-MM-DDTHH:mm"
  const [isBooked, setIsBooked] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState(0);

  // --- React Query Hooks (remain the same) ---
  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['oneVehicle', id],
    queryFn: () => getVehicle(id),
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: verifyBooking,
    onSuccess: (data) => {
      // Handle API structure: { success, message, status, data: { token, hourlyRate, ... } }
      if (data && data.success && data.data) {
        localStorage.setItem('bookingToken', data.data.token);
        navigate('/confirm-booking', {
          state: {
            hourlyRate: data.data.hourlyRate,
            totalHours: data.data.totalHours,
            totalAmount: data.data.totalAmount
          }
        });
      } else if (data && data.message) {
        setIsBooked(false);
        alert(data.message);
      } else {
        setIsBooked(false);
        alert('Unexpected response from server.');
      }
    },
    onError: (error) => {
      // Try to extract error message from API response
      let errorMsg = 'Booking failed.';
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.message) {
        errorMsg = error.message;
      }
      alert(errorMsg);
      setIsBooked(false);
    }
  });

  // --- Effects (remain the same) ---
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
  }, [startDateTime, endDateTime]);

  // --- Helper Functions (remain the same) ---
  const formatDateTime = (dateString) => {
    // This function is for DISPLAY only, still correct for 24h format
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

  // --- Event Handlers (remain the same, except handleBooking) ---
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
    if (startDateTime && value) {
      const start = new Date(startDateTime);
      const end = new Date(value);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
        setEndDateTime(value);
      } else {
         setEndDateTime(value);
      }
    } else {
      setEndDateTime(value);
    }
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

  // --- *** MODIFIED handleBooking function *** ---
  const handleBooking = () => {
     if (!startDateTime || !endDateTime || duration <= 0) {
       alert('Please select a valid start and end time.');
       return;
     }

    // The state variables (startDateTime, endDateTime) hold "YYYY-MM-DDTHH:mm" (local time)
    // Simply append ":00" to match the backend requirement "YYYY-MM-DDTHH:mm:ss"

    const formattedStartTime = `${startDateTime}:00`;
    const formattedEndTime = `${endDateTime}:00`;

    const bookingData = {
      vehicleId: parseInt(id, 10),
      startTime: formattedStartTime,
      endTime: formattedEndTime
    };

    // Send booking verification request
    bookingMutation.mutate(bookingData);
  };
  // --- *** End of modification ***


  // --- Render Logic (remain the same) ---
  if (isLoading) return <p>Loading vehicle details...</p>;
  if (queryError) return <p>Error loading vehicle: {queryError.message}</p>;
  if (!data || !data.data) return <p>Vehicle not found.</p>;

  const vehicle = data.data;

  return (
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
          <p><strong>Price:</strong> ${vehicle.price ? vehicle.price.toFixed(2) : 'N/A'}/day</p>
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

              {/* Display selected times formatted in 24h (for user feedback) */}
              {startDateTime && endDateTime && (
                <div className="selected-time-details" style={{ marginTop: '10px', fontSize: '0.9em' }}>
                   <p>Selected: {formatDateTime(startDateTime)} to {formatDateTime(endDateTime)}</p>
                   {duration > 0 ? (
                     <p>Duration: {duration} hour(s)</p>
                   ) : (
                     <p style={{ color: 'orange' }}>Duration: End time must be after start time.</p>
                   )}
                </div>
              )}
            </div>

            {/* Booking Button */}
            <button
              className={`book-button ${isBooked ? '' : 'confirm-button'}`}
              onClick={handleBooking}
              disabled={isBooked || bookingMutation.isPending || !startDateTime || !endDateTime || duration <= 0}
            >
              {bookingMutation.isPending ? 'Processing...' : (isBooked ? 'Booked!' : 'Confirm Booking')}
            </button>

            {/* Booking Confirmation Message (uses display format) */}
            {isBooked && (
              <p className="booking-confirmation">
                Your booking has been confirmed from {formatDateTime(startDateTime)} to {formatDateTime(endDateTime)}
              </p>
            )}

             {/* Display API errors */}
            {bookingMutation.isError && (
               <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                  Booking Error: {bookingMutation.error.message}
               </p>
            )}

            {/* Debug section - Shows the format being sent */}
            <div style={{
              marginTop: '20px', padding: '10px', backgroundColor: '#1a1a1a',
              borderRadius: '4px', fontSize: '12px', color: '#90caf9', wordBreak: 'break-all',
              border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <p>Debug Info (Format Sent to Backend):</p>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px', color: '#e0e0e0' }}>
                {JSON.stringify({
                  vehicleId: id ? parseInt(id, 10) : null,
                  // Show the actual strings being sent in the required format
                  startTimeToSend: startDateTime ? `${startDateTime}:00` : null,
                  endTimeToSend: endDateTime ? `${endDateTime}:00` : null,
                  currentState: { startDateTime, endDateTime, duration, isBooked }
                }, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleDetail;