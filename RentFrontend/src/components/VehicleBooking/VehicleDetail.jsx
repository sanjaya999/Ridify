import React, {useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {get} from "../../api/api.js";
import {useParams} from "react-router-dom";
import Datetime from 'react-datetime';
import '../../assets/styles/VehicleDetail.css';


 const VehicleDetail =  () => {
     // Initialize with current date/time
     const currentDateTime = new Date();
     const [startDateTime, setStartDateTime] = useState(currentDateTime);
     const [endDateTime, setEndDateTime] = useState(new Date(currentDateTime.getTime() + 60 * 60 * 1000)); // Default to 1 hour later
     const [isBooked, setIsBooked] = useState(false);
     const [showDatePicker, setShowDatePicker] = useState(false);

     // Custom validator function for start date - disable past dates and times
     const isValidStartDate = (currentDate, selectedDate) => {
         // For date comparison, we need to check if it's today
         const now = new Date();
         const today = now.getDate();
         const currentMonth = now.getMonth();
         const currentYear = now.getFullYear();
         
         // Check if the selected date is today
         const isToday = selectedDate.date() === today &&
                        selectedDate.month() === currentMonth &&
                        selectedDate.year() === currentYear;
         
         if (isToday) {
             // If it's today, compare with current time
             const currentHour = now.getHours();
             const currentMinute = now.getMinutes();
             
             return selectedDate.hour() > currentHour || 
                   (selectedDate.hour() === currentHour && 
                    selectedDate.minute() >= currentMinute);
         } else {
             // For other dates, just check if it's in the future
             return selectedDate.isAfter(now);
         }
     };
     
     // Custom validator function for end date - disable dates before start date
     const isValidEndDate = (current) => {
         if (!startDateTime) return true;
         
         // Get the start date/time values
         let startHours, startMinutes, startYear, startMonth, startDay;
         
         if (startDateTime._isAMomentObject) {
             // It's a Moment.js object
             startHours = startDateTime.hours();
             startMinutes = startDateTime.minutes();
             startYear = startDateTime.year();
             startMonth = startDateTime.month();
             startDay = startDateTime.date();
         } else {
             // It's a JavaScript Date object
             startHours = startDateTime.getHours();
             startMinutes = startDateTime.getMinutes();
             startYear = startDateTime.getFullYear();
             startMonth = startDateTime.getMonth();
             startDay = startDateTime.getDate();
         }
         
         // Convert the moment object to a Date for comparison
         const selected = current.toDate();
         
         // Check if same day
         const sameDay = selected.getDate() === startDay &&
                        selected.getMonth() === startMonth &&
                        selected.getFullYear() === startYear;
         
         if (sameDay) {
             // If same day, check time
             return current.hour() > startHours ||
                   (current.hour() === startHours &&
                    current.minute() > startMinutes);
         }
         
         // For different days, create comparable date objects
         const startDate = new Date(startYear, startMonth, startDay);
         const selectedDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
         
         // If different day, just check if it's after start date
         return selectedDate > startDate;
     };
     
     const handleStartDateChange = (date) => {
         // Check if date is valid before setting it
         if (date && date._isValid !== false) {
             // Ensure the selected date is not in the past
             const now = new Date();
             const dateObj = date._isAMomentObject ? date.toDate() : date;
             
             if (dateObj < now) {
                 date = now;
             }
             
             setStartDateTime(date);
             // Set end time to be 1 hour after start time
             if (date._isAMomentObject) {
                 // If it's a Moment object, use Moment methods
                 setEndDateTime(date.clone().add(1, 'hour'));
             } else {
                 // If it's a Date object, use Date methods
                 setEndDateTime(new Date(date.valueOf() + 60 * 60 * 1000));
             }
         }
     };
     
     const handleEndDateChange = (date) => {
         // Check if date is valid before setting it
         if (date && date._isValid !== false) {
             // Convert both to comparable format
             const startTime = startDateTime._isAMomentObject ? startDateTime.toDate() : startDateTime;
             const endTime = date.toDate();
             
             // Only update if end time is after start time
             if (endTime > startTime) {
                 setEndDateTime(date);
             } else {
                 alert('End time must be after start time');
                 // Keep the previous valid end time
             }
         }
     };
     
     const handleShowBooking = () => {
         setShowDatePicker(true);
     };
     
     const handleBooking = () => {
         setIsBooked(true);
         
         // Helper function to get hours/minutes from either Date or Moment objects
         const getTimeValues = (dateObj) => {
             // Check if it's a Moment object (has _isAMomentObject property)
             if (dateObj._isAMomentObject) {
                 return {
                     hours: dateObj.hours(),
                     minutes: dateObj.minutes(),
                     date: dateObj.format('YYYY-MM-DD')
                 };
             } else {
                 // It's a JavaScript Date object
                 return {
                     hours: dateObj.getHours(),
                     minutes: dateObj.getMinutes(),
                     date: dateObj.toISOString().split('T')[0]
                 };
             }
         };
         
         // Get time values for start and end times
         const startValues = getTimeValues(startDateTime);
         const endValues = getTimeValues(endDateTime);
         
         // Format the times with the correct hours and minutes
         const formattedStartTime = `${startValues.date}T${String(startValues.hours).padStart(2, '0')}:${String(startValues.minutes).padStart(2, '0')}:00`;
         const formattedEndTime = `${endValues.date}T${String(endValues.hours).padStart(2, '0')}:${String(endValues.minutes).padStart(2, '0')}:00`;
         
         // Create the booking data object that would be sent to the backend
         const bookingData = {
             vehicleId: parseInt(id), // Convert to integer as backend expects a number
             startTime: formattedStartTime, // Format: "2025-04-06T18:00:00"
             endTime: formattedEndTime     // Format: "2025-04-06T19:00:00"
         };
         
         // Log the data that would be sent to the backend
         console.log('Booking data to be sent to backend:', bookingData);
         
         // Here you would typically make an API call to book the vehicle
         // Example:
         // await post('bookings/create', bookingData);
     };
     const {id} = useParams();

     console.log(id);
    const fetchOneVehicleId = async () => {
        const response= await get(`vehicles/getOne`,
            {params: {id}});
        console.log("this is response " , response);
        return response;
    }

    const {data , isLoading , error} = useQuery({
        queryKey: ["oneVehicle" , id],
        queryFn: fetchOneVehicleId

    });


     if (isLoading) return <p>Loading...</p>;
     if (error) return <p>Error</p>;

    return (
        <div className="vehicle-detail-container">
            <div className="vehicle-info">
                <h1>{data.data.name}</h1>
                <img 
                    src={`http://localhost:8080/${data.data.photoUrl}`} 
                    alt={data.data.name}
                    className="vehicle-image"
                />
                <div className="vehicle-specs">
                    <p><strong>Model:</strong> {data.data.model}</p>
                    <p><strong>Plate Number:</strong> {data.data.plateNum}</p>
                    <p><strong>Price:</strong> ${data.data.price}/day</p>
                    <p><strong>Type:</strong> {data.data.type}</p>
                </div>
            </div>
            
            <div className="booking-section">
                <h2>Book this Vehicle</h2>
                
                {!showDatePicker ? (
                    <button 
                        className="book-button"
                        onClick={handleShowBooking}
                    >
                        Book Now
                    </button>
                ) : (
                    <>
                        <div className="date-time-container">
                            <div className="date-time-header">
                                <span>Select start time:</span>
                                <span>Select end time:</span>
                            </div>
                            <div className="date-time-pickers">
                                <Datetime
                                    value={startDateTime}
                                    onChange={handleStartDateChange}
                                    dateFormat="YYYY-MM-DD"
                                    timeFormat="HH:mm"
                                    closeOnSelect={false}
                                    className="datetime-picker"
                                    minDate={new Date()}
                                    isValidDate={(current) => isValidStartDate(new Date(), current)}
                                    inputProps={{ readOnly: true }}
                                    timeConstraints={{
                                        hours: { min: 0, max: 23 },
                                        minutes: { min: 0, max: 59, step: 5 }
                                    }}
                                />
                                <Datetime
                                    value={endDateTime}
                                    onChange={handleEndDateChange}
                                    dateFormat="YYYY-MM-DD"
                                    timeFormat="HH:mm"
                                    closeOnSelect={false}
                                    className="datetime-picker"
                                    minDate={startDateTime}
                                    isValidDate={isValidEndDate}
                                    inputProps={{ readOnly: true }}
                                    timeConstraints={{
                                        hours: { min: 0, max: 23 },
                                        minutes: { min: 0, max: 59, step: 5 }
                                    }}
                                />
                            </div>
                            
                            {startDateTime && endDateTime && (
                                <p className="selected-time">
                                    Duration: {Math.round((endDateTime - startDateTime) / (1000 * 60 * 60))} hour(s)
                                </p>
                            )}
                        </div>
                        
                        <button 
                            className="book-button confirm-button" 
                            onClick={handleBooking}
                            disabled={isBooked}
                        >
                            {isBooked ? 'Booked!' : 'Confirm Booking'}
                        </button>
                        
                        {isBooked && (
                            <p className="booking-confirmation">
                                Your booking has been confirmed from {startDateTime.toLocaleString()} to {endDateTime.toLocaleString()}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default VehicleDetail;