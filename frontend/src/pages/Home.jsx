import { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import HourlyForecast from '../components/home/HourlyForecast';
import Stats from '../components/home/Stats';
import DestinationCarousel from '../components/home/DestinationCarousel';
import SEO from '../components/SEO';

/**
 * Home Page Component.
 *
 * This component serves as the main landing page for the Canary Weather application.
 * It aggregates several key sections to provide a comprehensive overview of the application's features.
 *
 * Structure:
 * - **Hero Section**: Welcomes the user and provides primary calls to action.
 * - **HourlyForecast**: Displays a 24-hour timeline graph.
 * - **Stats Section**: Displays key weather statistics or app usage metrics.
 * - **Activities Section**: Suggests activities based on current weather conditions.
 * - **DestinationCarousel**: Showcases popular locations in the Canary Islands.
 *
 * Responsiveness:
 * The component uses a flex column layout (`flex-col`) to stack sections vertically.
 * It ensures full viewport height (`min-h-screen`) and adapts background colors for dark mode.
 *
 * @returns {JSX.Element} The rendered Home page containing all sub-sections.
 */
function Home() {
    // Lifted state for coordinates to share between Hero and HourlyForecast
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        // Get user location once on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (err) => {
                    console.warn("Geolocation access denied or failed:", err);
                    // Fallback to Tenerife coordinates
                    setCoords({ lat: 28.4636, lon: -16.2518 });
                }
            );
        } else {
            // Fallback if not supported
            setCoords({ lat: 28.4636, lon: -16.2518 });
        }
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <SEO 
                title="Home" 
                description="Welcome to Canary Weather. Get the latest weather forecasts, tide charts, and activity guides for the Canary Islands."
            />
            {/* Hero Section: Main introduction and CTA */}
            <Hero coords={coords} />

            {/* Hourly Forecast Timeline: 24h graph */}
            <HourlyForecast coords={coords} />

            {/* Stats Section: Key metrics display */}
            <Stats />

            {/* Destination Carousel: Horizontal scroll of locations */}
            <div className="pt-10 bg-white dark:bg-gray-900">
                <DestinationCarousel />
            </div>
        </div>
    );
}

export default Home;