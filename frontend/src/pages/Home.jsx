import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import Activities from '../components/home/Activities';
import DestinationCarousel from '../components/home/DestinationCarousel';

/**
 * Home page component.
 * Serves as the landing page of the application, aggregating various sections.
 *
 * @returns {JSX.Element} The rendered Home page.
 */
function Home() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Hero />
            <Stats />
            <Activities />
            <div className="pt-10 pb-16 bg-white dark:bg-gray-900">
                <DestinationCarousel />
            </div>
        </div>
    );
}

export default Home;