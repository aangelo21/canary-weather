import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// Use translation keys for the destination text so content can be localized
const destinations = [
    { id: 1, key: 'teide', image: 'teide.webp', lat: 28.2724, lng: -16.6425 },
    { id: 5, key: 'maspalomas', image: 'dunas.webp', lat: 27.7419, lng: -15.5891 },
    { id: 7, key: 'timanfaya', image: 'timanfaya.webp', lat: 29.003, lng: -13.6216 },
    { id: 9, key: 'corralejo', image: 'corralejo.webp', lat: 28.7373, lng: -13.8751 },
    { id: 12, key: 'garajonay', image: 'garajonay.webp', lat: 28.0907, lng: -17.2349 },
    { id: 4, key: 'roquenublo', image: 'roquenublo.webp', lat: 27.9871, lng: -15.6302 },
];

/**
 * DestinationCarousel Component.
 *
 * Displays an interactive carousel of popular tourist destinations in the Canary Islands.
 * Features:
 * - Infinite Scrolling: The carousel loops seamlessly in both directions.
 * - Responsive Design: Adjusts the number of visible items based on screen width (1, 2, or 3 items).
 * - Touch/Click Navigation: Users can navigate using previous/next buttons.
 * - Localization: Destination names and descriptions are internationalized.
 *
 * The component uses a "tripled list" technique to achieve the infinite scroll effect,
 * resetting the index silently when the user reaches the duplicate sets at the ends.
 *
 * @component
 * @returns {JSX.Element} The rendered DestinationCarousel component.
 */
export default function DestinationCarousel() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    /**
     * @type {Array<Object>} extendedDestinations - Tripled list of destinations to simulate infinite scrolling.
     */
    const extendedDestinations = [
        ...destinations,
        ...destinations,
        ...destinations,
    ];

    /**
     * @type {[number, Function]} currentIndex - Current index of the carousel. Starts in the middle set.
     */
    const [currentIndex, setCurrentIndex] = useState(destinations.length);

    /**
     * @type {[boolean, Function]} isTransitioning - Controls whether the transition animation is active. Used for silent resets.
     */
    const [isTransitioning, setIsTransitioning] = useState(true);

    /**
     * @type {[number, Function]} itemsPerPage - Number of items visible at once based on screen width.
     */
    const [itemsPerPage, setItemsPerPage] = useState(1);

    /**
     * @type {[number, Function]} itemWidth - Width of a single carousel item including gap.
     */
    const [itemWidth, setItemWidth] = useState(0);

    /**
     * @type {[number, Function]} containerWidth - Width of the carousel container.
     */
    const [containerWidth, setContainerWidth] = useState(0);

    const itemRef = useRef(null);
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    /**
     * Effect hook to handle window resize events.
     * Updates `itemsPerPage` and `itemWidth` to ensure correct layout and scrolling behavior.
     */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(3);
            } else if (window.innerWidth >= 640) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(1);
            }
            // Update itemWidth after resize
            setTimeout(() => {
                if (
                    itemRef.current &&
                    contentRef.current &&
                    containerRef.current
                ) {
                    // compute item width (first child) and include gap (24px = gap-6)
                    const w = itemRef.current.offsetWidth;
                    setItemWidth(w + 24);
                    setContainerWidth(containerRef.current.offsetWidth);
                }
            }, 0);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * Effect hook to handle infinite scroll logic.
     * Checks if the carousel has reached the end of the extended list and silently resets the index to the middle set.
     */
    useEffect(() => {
        if (currentIndex >= destinations.length * 2) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(destinations.length);
            }, 500);
            return () => clearTimeout(timer);
        } else if (currentIndex < destinations.length) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(destinations.length * 2 - 1);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex]);

    /**
     * Effect hook to re-enable transitions after a silent reset.
     */
    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    /**
     * Advances the carousel to the next slide.
     */
    const nextSlide = () => {
        if (!isTransitioning) return;
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    /**
     * Moves the carousel to the previous slide.
     */
    const prevSlide = () => {
        if (!isTransitioning) return;
        setCurrentIndex((prevIndex) => prevIndex - 1);
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                {t('popularDestinations') || 'Popular Destinations'}
            </h2>

            <div
                className="relative overflow-hidden py-10 -mx-4 sm:-mx-6 lg:-mx-8"
                ref={containerRef}
            >
                <div
                    ref={contentRef}
                    className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                    style={{
                        transform: `translateX(${containerWidth / 2 - (itemWidth - 24) / 2 - currentIndex * itemWidth}px)`,
                    }}
                >
                    {extendedDestinations.map((dest, index) => (
                        <div
                            key={`${dest.id}-${index}`}
                            ref={index === 0 ? itemRef : null}
                            className="shrink-0 w-[75%] sm:w-[40%] lg:w-[30%]"
                        >
                            <div 
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full transform transition-all hover:scale-105 duration-300 cursor-pointer"
                                onClick={() => navigate('/map', { state: { lat: dest.lat, lng: dest.lng } })}
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={dest.image}
                                        alt={dest.key}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {t(`destinations.${dest.key}.name`)}
                                        </h3>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                            {t(
                                                `destinations.${dest.key}.location`
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        {t(
                                            `destinations.${dest.key}.description`
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 lg:-ml-12 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10 focus:outline-none"
                aria-label="Previous slide"
            >
                <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 lg:-mr-12 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10 focus:outline-none"
                aria-label="Next slide"
            >
                <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>
    );
}
