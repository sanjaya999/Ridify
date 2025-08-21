import React, { useEffect, useState } from 'react';
import { post } from "../api/api.js";
import '../assets/styles/GeoLocation.css';
import {useNavigate} from "react-router-dom";

function GeoLocation(startTime , endTime) {
    console.log("starttime: and endtime: ",startTime.startTime , startTime.endTime);
    const navigate = useNavigate();

    const [nearestVehicles, setNearestVehicles] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [usingFallback, setUsingFallback] = useState(false);

    const FALLBACK_LOCATION = {
        latitude: 27.7172,
        longitude: 85.3240
    };

    useEffect(() => {

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (!isOnline) {
            console.log("Offline detected, using fallback location");
            setCurrentLocation(FALLBACK_LOCATION);
            setUsingFallback(true);
            return;
        }

        if ("geolocation" in navigator) {
            // Add timeout to prevent hanging
            const timeoutId = setTimeout(() => {
                console.log("Geolocation timeout, using fallback location");
                setCurrentLocation(FALLBACK_LOCATION);
                setUsingFallback(true);
            }, 10000); // 10 second timeout

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(timeoutId);
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setCurrentLocation(coords);
                    setUsingFallback(false);
                },
                (error) => {
                    clearTimeout(timeoutId);
                    console.error("Error getting location:", error);
                    console.log("Using fallback location due to geolocation error");
                    setCurrentLocation(FALLBACK_LOCATION);
                    setUsingFallback(true);
                },
                {
                    timeout: 8000,
                    enableHighAccuracy: false
                }
            );
        } else {
            console.log("Geolocation not supported, using fallback location");
            setCurrentLocation(FALLBACK_LOCATION);
            setUsingFallback(true);
        }
    }, [isOnline]);

    useEffect(() => {
        async function fetchNearestVehicles() {
            if (!currentLocation) return;

            if (!isOnline) {
                setError("You're offline. Please check your internet connection to see available vehicles.");
                return;
            }

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
                setError("Failed to fetch nearest vehicles. Please check your internet connection.");
            } finally {
                setLoading(false);
            }
        }

        fetchNearestVehicles();
    }, [currentLocation, isOnline]);


    if (error) {
        return (
            <div className="recommended-vehicles-container">
                <div className="error-container">
                    <h3>Error</h3>
                    <p>{error}</p>
                    {!isOnline && (
                        <p style={{ color: '#666', fontSize: '0.9em', marginTop: '10px' }}>
                            You're currently offline. Connect to the internet to see available vehicles.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="recommended-vehicles-container">
                <div className="loading-container">
                    <p>Finding nearest vehicles...</p>
                    {usingFallback && (
                        <p style={{ color: '#666', fontSize: '0.9em' }}>
                            Using approximate location
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="recommended-vehicles-container">
            <div className="recommended-header">
                <h2>Nearest Vehicles</h2>
                {currentLocation && (
                    <p>
                        {usingFallback
                            ? "Based on approximate location"
                            : "Based on your current location"
                        }
                        {!isOnline && " (offline mode)"}
                    </p>
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
                                        src={`https://rentthis-dawn-shape-1905.fly.dev/${vehicle.photoUrl}`}
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
                                    <button onClick={() => navigate(`/aboutVehicle/${vehicle.id}`)}>
                                        Book Now
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