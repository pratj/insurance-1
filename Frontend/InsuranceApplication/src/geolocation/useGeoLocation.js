import { useState, useEffect } from "react";

const useGeoLocation = () => {
    const [location, setLocation] =useState({
        loaded:false,
        coordinates:{ lat:"", lng:""}
    })

    const onSuccess = (location) => {
        setLocation({
            loaded:true,
            userAllowed:true,
            coordinates:{ 
            lat: location.coords.latitude, 
            lng: location.coords.longitude
            }
        })
    }

    const onError = (error) => {
        setLocation({
            loaded: true,
            userAllowed:false,
            error,
        })
    }

    useEffect(() => {
        if(!("geolocation" in navigator))
        { 
            onError({ 
                code:0,
                message:"Geolocation not supported",
            })      
        }
        navigator.geolocation.getCurrentPosition(onSuccess,onError)
    },[])

    return location
}

export default useGeoLocation


