import React, { useEffect, useState } from 'react';
import { post } from "../api/api.js";
import '../assets/styles/GeoLocation.css'; // Import the horizontal CSS

function GeoLocation(startTime , endTime) {
    console.log("starttime: and endtime: ",startTime.startTime , startTime.endTime);

    const [nearestVehicles, setNearestVehicles] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setCurrentLocation(coords);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError("Failed to get current location");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser");
        }
    }, []);

    useEffect(() => {
        async function fetchNearestVehicles() {
            if (!currentLocation) return;

            setLoading(true);
            setError(null);

            try {
                console.log("starting get request");
                const url = `/vehicles/available?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}&startTime=${startTime.startTime}&endTime=${startTime.endTime}`;
                const response = await post(url);

                if (response.success && response.data) {
                    setNearestVehicles(response.data);
                } else {
                    setError("No vehicles found nearby");
                }
            } catch (err) {
                console.error("Error fetching nearest vehicles:", err);
                setError("Failed to fetch nearest vehicles");
            } finally {
                setLoading(false);
            }
        }

        fetchNearestVehicles();
    }, [currentLocation]);

    const handleBookNow = (vehicleId) => {
        // Handle booking logic here
        console.log(`Booking vehicle with ID: ${vehicleId}`);
    };

    if (error) {
        return (
            <div className="recommended-vehicles-container">
                <div className="error-container">
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="recommended-vehicles-container">
                <div className="loading-container">
                    <p>Finding nearest vehicles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recommended-vehicles-container">
            <div className="recommended-header">
                <h2>Nearest Vehicles</h2>
                {currentLocation && (
                    <p>Based on your current location</p>
                )}
            </div>

            {nearestVehicles.length === 0 ? (
                <div className="no-vehicles">
                    <h3>No Vehicles Found</h3>
                    <p>There are no vehicles available near your location at the moment.</p>
                </div>
            ) : (
                <div className="geoVehicle">
                    {nearestVehicles.map((vehicle) => (
                        <div key={vehicle.id} className="vehicle-card">
                            <div className="vehicle-image-container">
                                {vehicle.photoUrl ? (
                                    <img
                                        src={`http://localhost:8080/${vehicle.photoUrl}`}
                                        alt={vehicle.name}
                                        className="vehicle-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className="vehicle-image-placeholder"
                                    style={{ display: vehicle.photoUrl ? 'none' : 'flex' }}
                                >
                                    No Image Available
                                </div>
                                <div className="vehicle-type-badge">
                                    {vehicle.type}
                                </div>
                            </div>

                            <div className="vehicle-details">
                                <h3 className="vehicle-name">{vehicle.name}</h3>
                                <p className="vehicle-model">{vehicle.model}</p>
                                <div className="vehicle-info">
                                    <p><strong>Plate Number:</strong> {vehicle.plateNum}</p>
                                    <p><strong>Owner:</strong> {vehicle.ownerName.name}</p>
                                </div>

                                <div className="vehicle-footer">
                                    <p className="vehicle-price">
                                        Rs. {vehicle.price.toLocaleString()}/day
                                    </p>
                                    <button
                                        className="book-button"
                                        onClick={() => handleBookNow(vehicle.id)}
                                        disabled={vehicle.suspended}
                                    >
                                        {vehicle.suspended ? 'Unavailable' : 'Book Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GeoLocation;