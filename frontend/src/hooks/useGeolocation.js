import { useState, useEffect, useRef } from 'react';

export const useGeolocation = (
    fallbackCoords = { lat: 28.4636, lon: -16.2518 },
) => {
    const [coords, setCoords] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const fallbackRef = useRef(fallbackCoords);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            setCoords(fallbackRef.current);
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setLoading(false);
            },
            (err) => {
                console.warn('Geolocation access denied or failed:', err);
                setError(err.message);
                setCoords(fallbackRef.current);
                setLoading(false);
            },
        );
    }, []);

    return { coords, error, loading };
};
