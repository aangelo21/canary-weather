import { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';
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
                className="flex min-w-full gap-6"
                style={{
                    animationName:
                        duration > 0 ? `scroll-${direction}` : 'none',
                    animationDuration: `${duration}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}
            >
                <div ref={contentRef} className="flex gap-6 shrink-0">
                    {children}
                </div>
                <div className="flex gap-6 shrink-0">{children}</div>
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
    <div className="w-[400px] p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={avatar}
                        alt={name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20 dark:ring-blue-400/20 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-800">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {name}
                    </h3>
                    <div className="flex gap-0.5 text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < rating ? "currentColor" : "none"}
                                className={i < rating ? "" : "text-gray-300 dark:text-gray-600"}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Quote className="w-8 h-8 text-blue-100 dark:text-blue-900/30 group-hover:text-blue-200 dark:group-hover:text-blue-800 transition-colors" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm italic">
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
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                        {t('testimonials.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        {t('testimonials.subtitle')}
                    </p>
                </div>

                <div className="relative">
                    {/* Gradient masks for smooth fade effect on edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

                    <Marquee direction="left" className="py-8" speed={35}>
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
