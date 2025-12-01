import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import Activities from '../components/home/Activities';
import DestinationCarousel from '../components/home/DestinationCarousel';
import Testimonials from '../components/home/Testimonials';

/**
 * Home Page Component.
 *
 * This component serves as the main landing page for the Canary Weather application.
 * It aggregates several key sections to provide a comprehensive overview of the application's features.
 *
 * Structure:
 * - **Hero Section**: Welcomes the user and provides primary calls to action.
 * - **Stats Section**: Displays key weather statistics or app usage metrics.
 * - **Activities Section**: Suggests activities based on current weather conditions.
 * - **DestinationCarousel**: Showcases popular locations in the Canary Islands.
 * - **Testimonials**: Displays user reviews and social proof.
 *
 * Responsiveness:
 * The component uses a flex column layout (`flex-col`) to stack sections vertically.
 * It ensures full viewport height (`min-h-screen`) and adapts background colors for dark mode.
 *
 * @returns {JSX.Element} The rendered Home page containing all sub-sections.
 */
function Home() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
            {/* Hero Section: Main introduction and CTA */}
            <Hero />

            {/* Stats Section: Key metrics display */}
            <Stats />

            {/* Activities Section: Weather-dependent activity suggestions */}
            <Activities />

            {/* Destination Carousel: Horizontal scroll of locations */}
            <div className="pt-10 bg-white dark:bg-gray-900">
                <DestinationCarousel />
            </div>

            {/* Testimonials Section: User reviews */}
            <Testimonials />
        </div>
    );
}

export default Home;