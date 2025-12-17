import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

/**
 * Marquee component for scrolling content
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to scroll
 * @param {string} [props.direction="left"] - Scroll direction
 * @param {number} [props.speed=50] - Scroll speed in pixels per second
 * @param {boolean} [props.pauseOnHover=true] - Whether to pause on hover
 * @param {string} [props.className=""] - Additional CSS classes
 */
const Marquee = ({
    children,
    direction = 'left',
    speed = 30,
    pauseOnHover = true,
    className = '',
}) => {
    const [contentWidth, setContentWidth] = useState(0);
    const contentRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (contentRef.current) {
            setContentWidth(contentRef.current.scrollWidth);
        }
    }, [children]);

    const duration = contentWidth > 0 ? contentWidth / speed : 0;

    return (
        <div
            className={`overflow-hidden relative ${className}`}
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            <div
                className="flex min-w-full gap-4"
                style={{
                    animation:
                        duration > 0
                            ? `scroll-${direction} ${duration}s linear infinite`
                            : 'none',
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}
            >
                <div ref={contentRef} className="flex gap-4 shrink-0">
                    {children}
                </div>
                <div className="flex gap-4 shrink-0">{children}</div>
            </div>

            <style>
                {`
          @keyframes scroll-left {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
          }
          @keyframes scroll-right {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}
            </style>
        </div>
    );
};

/**
 * Review Card Component
 * @param {Object} props - Component props
 * @param {string} props.avatar - URL of the avatar image
 * @param {string} props.name - Name of the reviewer
 * @param {number} props.rating - Rating (1-5)
 * @param {string} props.review - Review text
 */
const ReviewCard = ({ avatar, name, rating, review }) => (
    <div className="w-80 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-4 mb-4">
            <img
                src={avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
            />
            <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    {name}
                </h3>
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${
                                i < rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            "{review}"
        </p>
    </div>
);

/**
 * Testimonials Section Component
 * Displays a marquee of user reviews
 */
export default function Testimonials() {
    const reviews = [
        {
            id: 1,
            name: 'Michelangelo Martínez',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
            rating: 5,
            review: 'The wind alerts for Fuerteventura saved my surf trip! Incredibly accurate and easy to read.',
        },
        {
            id: 2,
            name: 'Gabriel Medina',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
            rating: 5,
            review: 'Finally a weather app that understands the microclimates of Tenerife. The local forecasts are spot on.',
        },
        {
            id: 3,
            name: 'Samuel Ponce',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
            rating: 4,
            review: 'The Calima warnings are a lifesaver for my allergies. I check this app every morning before heading out.',
        },
        {
            id: 4,
            name: 'Carlos Luis',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
            rating: 5,
            review: 'Beautiful interface and the webcam integration is super useful to see the actual weather in real-time.',
        },
        {
            id: 5,
            name: 'Ángel Lallave',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
            rating: 5,
            review: 'Best app for hiking in La Gomera. The trail weather info is exactly what I needed.',
        },
    ];

    return (
        <section className="pt-4 pb-16 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                        Trusted by Locals & Travelers
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Join thousands of users who rely on Canary Weather for accurate, local forecasts across the islands.
                    </p>
                </div>

                <div className="relative">
                    {/* Gradient masks for smooth fade effect on edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

                    <Marquee direction="left" className="py-4" speed={40}>
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                avatar={review.avatar}
                                name={review.name}
                                rating={review.rating}
                                review={review.review}
                            />
                        ))}
                    </Marquee>
                </div>
            </div>
        </section>
    );
}
