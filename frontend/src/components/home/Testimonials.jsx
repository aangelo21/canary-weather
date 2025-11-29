import { useTranslation } from 'react-i18next';

/**
 * Testimonials Component.
 *
 * Displays a grid of user reviews/testimonials to build social proof.
 * Redesigned with a "Metric-First" approach.
 *
 * Design Features:
 * - **Metric Badges**: Instead of generic stars, each review highlights a specific "System Metric" (e.g., Accuracy, Precision).
 * - **Layout**: Content first, User profile at the bottom (classic testimonial structure).
 * - **Visuals**: Clean, airy cards with subtle tech-inspired details.
 *
 * @component
 * @returns {JSX.Element} The rendered Testimonials section.
 */
export default function Testimonials() {
    const { t } = useTranslation();

    const testimonials = [
        {
            id: 1,
            contentKey: 'testimonial1',
            author: 'Elena Rodríguez',
            handle: '@elena_surfs',
            avatar: 'https://i.pravatar.cc/150?u=elena',
            role: 'Surfer & Local',
            highlight: 'testimonial1Highlight',
            metric: 'Wind Accuracy',
            score: '99.8%',
            trend: 'up'
        },
        {
            id: 2,
            contentKey: 'testimonial2',
            author: 'Marc Weber',
            handle: '@marc_hikes',
            avatar: 'https://i.pravatar.cc/150?u=marc',
            role: 'Digital Nomad',
            highlight: 'testimonial2Highlight',
            metric: 'Microclimate Data',
            score: 'Precise',
            trend: 'stable'
        },
        {
            id: 3,
            contentKey: 'testimonial3',
            author: 'Sarah Jenkins',
            handle: '@sarahj_travels',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            role: 'Tourist',
            highlight: 'testimonial3Highlight',
            metric: 'UX Rating',
            score: '10/10',
            trend: 'up'
        }
    ];

    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-color-dodge animate-blob"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-color-dodge animate-blob animation-delay-2000"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        {t('testimonialsTitle') || 'Loved by Locals & Travelers'}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {t('testimonialsSubtitle') || 'See how Canary Weather helps thousands of people plan their perfect days in the archipelago.'}
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((item) => (
                        <div 
                            key={item.id}
                            className="flex flex-col justify-between h-full bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-white/10 group"
                        >
                            <div>
                                {/* Custom "Tech Metric" Rating */}
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${item.trend === 'up' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
                                        <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            {item.metric}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded text-sm font-bold text-gray-900 dark:text-white">
                                        {item.score}
                                        {item.trend === 'up' && (
                                            <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        )}
                                        {item.trend === 'stable' && (
                                            <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Review Content */}
                                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                                    {t(item.contentKey).split(t(item.highlight)).map((part, i, arr) => (
                                        <span key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <span className="text-gray-900 dark:text-white font-semibold bg-blue-50 dark:bg-blue-900/20 px-1 rounded decoration-clone">
                                                    {t(item.highlight)}
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                </p>
                            </div>

                            {/* User Profile (Moved to Bottom) */}
                            <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                                <div className="relative">
                                    <img 
                                        src={item.avatar} 
                                        alt={item.author} 
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-800">
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-gray-900 dark:text-white leading-none mb-1">
                                        {item.author}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                            {item.handle}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                        <span className="text-xs font-semibold text-blue-600 dark:text-cyan-400 uppercase tracking-wide">
                                            {item.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
