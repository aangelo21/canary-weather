import Hero from '../components/home/Hero';
import HourlyForecast from '../components/home/HourlyForecast';
import Stats from '../components/home/Stats';
import DestinationCarousel from '../components/home/DestinationCarousel';
import Testimonials from '../components/home/Testimonials';
import SEO from '../components/SEO';
import { useGeolocation } from '../hooks/useGeolocation';

function Home() {
    const { coords } = useGeolocation();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <SEO
                title="Home"
                description="Welcome to Canary Weather. Get the latest weather forecasts, tide charts, and activity guides for the Canary Islands."
            />
            <Hero coords={coords} />
            <HourlyForecast coords={coords} />
            <Stats coords={coords} />
            <div className="bg-white dark:bg-gray-900">
                <DestinationCarousel />
                <Testimonials />
            </div>
        </div>
    );
}

export default Home;
