import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


const destinations = [
    { id: 1, key: 'teide', image: 'teide.webp', lat: 28.2724, lng: -16.6425 },
    {
        id: 5,
        key: 'maspalomas',
        image: 'dunas.webp',
        lat: 27.7419,
        lng: -15.5891,
    },
    {
        id: 7,
        key: 'timanfaya',
        image: 'timanfaya.webp',
        lat: 29.003,
        lng: -13.6216,
    },
    {
        id: 9,
        key: 'corralejo',
        image: 'corralejo.webp',
        lat: 28.7373,
        lng: -13.8751,
    },
    {
        id: 12,
        key: 'garajonay',
        image: 'garajonay.webp',
        lat: 28.0907,
        lng: -17.2349,
    },
    {
        id: 4,
        key: 'roquenublo',
        image: 'roquenublo.webp',
        lat: 27.9871,
        lng: -15.6302,
    },
];


export default function DestinationCarousel() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    
    const extendedDestinations = [
        ...destinations,
        ...destinations,
        ...destinations,
    ];

    
    const [currentIndex, setCurrentIndex] = useState(destinations.length);

    
    const [isTransitioning, setIsTransitioning] = useState(true);

    
    const [itemsPerPage, setItemsPerPage] = useState(1);

    
    const [itemWidth, setItemWidth] = useState(0);

    
    const [containerWidth, setContainerWidth] = useState(0);

    const itemRef = useRef(null);
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(3);
            } else if (window.innerWidth >= 640) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(1);
            }
            
            setTimeout(() => {
                if (
                    itemRef.current &&
                    contentRef.current &&
                    containerRef.current
                ) {
                    
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

    
    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    
    const nextSlide = () => {
        if (!isTransitioning) return;
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    
    const prevSlide = () => {
        if (!isTransitioning) return;
        setCurrentIndex((prevIndex) => prevIndex - 1);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
            <div className="text-center mb-12 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {t('popularDestinations') || 'Popular Destinations'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                    {t('popularDestinationsSubtitle') || 'Explore the most breathtaking locations across the islands with real-time weather updates.'}
                </p>
            </div>

            <div className="relative group">
                <div
                    className="relative overflow-hidden py-4 -mx-4 sm:-mx-6 lg:-mx-8"
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
                                    className="group relative bg-gray-900 rounded-3xl shadow-xl overflow-hidden h-[320px] transform transition-all hover:scale-[1.02] duration-500 cursor-pointer"
                                    onClick={() =>
                                        navigate('/map', {
                                            state: { lat: dest.lat, lng: dest.lng },
                                        })
                                    }
                                >
                                    <img
                                        src={dest.image}
                                        alt={t(`destinations.${dest.key}.name`)}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                                    
                                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex justify-between items-end mb-3">
                                            <h3 className="text-2xl font-bold text-white tracking-tight">
                                                {t(`destinations.${dest.key}.name`)}
                                            </h3>
                                            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                                                {t(`destinations.${dest.key}.location`)}
                                            </span>
                                        </div>
                                        <p className="text-gray-200 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                            {t(`destinations.${dest.key}.description`)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 lg:-ml-12 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                    className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 lg:-mr-12 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
        </div>
    );
}
