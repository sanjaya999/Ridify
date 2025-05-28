import React, {useEffect, useState} from 'react';
import {post} from "../api/api.js"

function GeoLocation(location) {

    const [nearestVehicle, setNearestVehicle] = useState(null);


    useEffect(() => {
        async function fetchNearestVehicles() {
            const response = await post('/vehicles/nearest', {
                longitude: location.longitude,
                latitude: location.latitude,
            } );
            setNearestVehicle(response.data);}
        fetchNearestVehicles();

    }, []);
    return(
        <>
            {console.log(nearestVehicle)}
        </>
    )
}

export default GeoLocation;