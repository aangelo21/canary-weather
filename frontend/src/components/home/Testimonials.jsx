import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
                    animationName:
                        duration > 0 ? `scroll-${direction}` : 'none',
                    animationDuration: `${duration}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
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
    <div className="w-80 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center gap-4 mb-6">
            <div className="relative">
                <img
                    src={avatar}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-gray-50 dark:ring-gray-700"
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
            </div>
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                    {name}
                </h3>
                <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                                i < rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-200 dark:text-gray-600'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
            "{review}"
        </p>
    </div>
);

/**
 * Testimonials Section Component
 * Displays a marquee of user reviews
 */
export default function Testimonials() {
    const { t } = useTranslation();

    const reviews = [
        {
            id: 1,
            name: 'Michelangelo Martínez',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
            rating: 5,
            review: t('testimonials.review1'),
        },
        {
            id: 2,
            name: 'Gabriel Medina',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
            rating: 5,
            review: t('testimonials.review2'),
        },
        {
            id: 3,
            name: 'Samuel Ponce',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
            rating: 4,
            review: t('testimonials.review3'),
        },
        {
            id: 4,
            name: 'Carlos Luis',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
            rating: 5,
            review: t('testimonials.review4'),
        },
        {
            id: 5,
            name: 'Ángel Lallave',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
            rating: 5,
            review: t('testimonials.review5'),
        },
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {t('testimonials.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        {t('testimonials.subtitle')}
                    </p>
                </div>

                <div className="relative">
                    {/* Gradient masks for smooth fade effect on edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />

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
