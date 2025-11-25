import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const destinations = [
  {
    id: 1,
    name: "Teide National Park",
    location: "Tenerife",
    image: "https://images.unsplash.com/photo-1546587348-d646658c363c?auto=format&fit=crop&w=800&q=80",
    description: "Spain's highest peak and a UNESCO World Heritage Site."
  },
  {
    id: 2,
    name: "Maspalomas Dunes",
    location: "Gran Canaria",
    image: "https://images.unsplash.com/photo-1605537964076-3cb0ea235296?auto=format&fit=crop&w=800&q=80",
    description: "A vast expanse of sand dunes resembling a desert by the sea."
  },
  {
    id: 3,
    name: "Timanfaya National Park",
    location: "Lanzarote",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    description: "A unique volcanic landscape that looks like the surface of Mars."
  },
  {
    id: 4,
    name: "Corralejo Natural Park",
    location: "Fuerteventura",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80",
    description: "Stunning white sand dunes and turquoise waters."
  },
  {
    id: 5,
    name: "Garajonay National Park",
    location: "La Gomera",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    description: "Ancient laurel forests shrouded in mist."
  }
];

export default function DestinationCarousel() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsPerPage >= destinations.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, destinations.length - itemsPerPage) : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        {t('popularDestinations') || "Popular Destinations"}
      </h2>
      
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-6"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
        >
          {destinations.map((dest) => (
            <div 
              key={dest.id} 
              className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full transform transition-all hover:scale-105 duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{dest.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                      {dest.location}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {dest.description}
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
        <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 lg:-mr-12 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10 focus:outline-none"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
