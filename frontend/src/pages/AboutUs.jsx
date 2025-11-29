import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @component HeroSection
 * @description Renders the primary visual entry point of the page.
 * Uses large typography and atmospheric lighting to establish the "Deep Ocean" theme.
 */
const HeroSection = ({ t }) => (
    <div className="relative z-10 flex flex-col lg:flex-row items-end justify-between mb-24 gap-12 animate-fade-in-up">
        <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-12 bg-cyan-500/50"></span>
                <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">
                    {t('est') || 'EST. 2025 • CANARY ISLANDS'}
                </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95]">
                {t('aboutTitlePrefix') || 'Forecasting'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
                    {t('theUnpredictable') || 'The Unpredictable.'}
                </span>
            </h1>
        </div>
        <p className="text-lg text-slate-400 max-w-md leading-relaxed text-right lg:text-left border-r-2 lg:border-r-0 lg:border-l-2 border-slate-800 pr-6 lg:pr-0 lg:pl-6">
            {t('aboutSubtitle') || 'We decode the complex microclimates of the archipelago, turning raw meteorological data into actionable insights for locals and travelers alike.'}
        </p>
    </div>
);

/**
 * @component BentoGridSection
 * @description Displays core values, team members, and key metrics in a responsive grid layout.
 * Utilizes glassmorphism and hover effects for interactivity.
 */
const BentoGridSection = ({ t }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)] mb-32">
        {/* Philosophy Card */}
        <div className="col-span-1 md:col-span-2 row-span-2 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-10 flex flex-col justify-between group hover:bg-slate-900/60 transition-all duration-500 hover:border-cyan-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-cyan-900/20 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{t('ourPhilosophy') || 'Our Philosophy'}</h2>
                <div className="space-y-4">
                    <p className="text-slate-400 text-lg leading-relaxed">
                        {t('philosophyDesc1') || 'In the Canary Islands, weather is not just a backdrop—it is the protagonist. From the trade winds of the north to the calimas of the east, our lives are shaped by the elements.'}
                    </p>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        {t('philosophyDesc2') || 'We built Canary Weather to honor this complexity. We believe that everyone deserves access to hyper-local, precise data that respects the unique microclimates of our archipelago.'}
                    </p>
                </div>
            </div>
        </div>

        {/* Metric Card 1 */}
        <div className="col-span-1 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-transform duration-300">
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full animate-pulse"></div>
                <svg className="w-12 h-12 text-amber-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <span className="text-3xl font-bold text-white">24/7</span>
            <span className="text-xs font-mono text-slate-500 uppercase mt-1">Real-time Monitoring</span>
        </div>

        {/* Metric Card 2 */}
        <div className="col-span-1 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-transform duration-300">
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full animate-pulse delay-75"></div>
                <svg className="w-12 h-12 text-emerald-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <span className="text-3xl font-bold text-white">88+</span>
            <span className="text-xs font-mono text-slate-500 uppercase mt-1">Municipalities</span>
        </div>

        {/* Team Member: Angelo */}
        <div className="col-span-1 row-span-2 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-blue-500/30 transition-colors duration-300 group">
            <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-b from-blue-500 to-transparent mb-6 group-hover:rotate-180 transition-transform duration-700">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden group-hover:rotate-180 transition-transform duration-700">
                    <span className="text-4xl font-bold text-blue-400">A</span>
                </div>
            </div>
            <h3 className="text-2xl font-bold text-white">Angelo</h3>
            <p className="text-blue-400 text-sm font-medium tracking-wide mb-6">BACKEND DEVELOPER</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {t('angeloBio') || 'Ensuring data integrity and system resilience. Building the engine that powers the forecast.'}
            </p>
        </div>

        {/* Team Member: Gabriel */}
        <div className="col-span-1 row-span-2 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-teal-500/30 transition-colors duration-300 group">
            <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-b from-teal-500 to-transparent mb-6 group-hover:rotate-180 transition-transform duration-700">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden group-hover:rotate-180 transition-transform duration-700">
                    <span className="text-4xl font-bold text-teal-400">G</span>
                </div>
            </div>
            <h3 className="text-2xl font-bold text-white">Gabriel</h3>
            <p className="text-teal-400 text-sm font-medium tracking-wide mb-6">FRONTEND DEVELOPER</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {t('gabrielBio') || 'Architecting seamless user experiences. Obsessed with performance and pixel-perfect UI.'}
            </p>
        </div>
    </div>
);

/**
 * @component TechStackSection
 * @description Visualizes the technology stack used in the application.
 * Adds credibility and technical depth to the About page.
 */
const TechStackSection = ({ t }) => (
    <div className="mb-32 relative">
        <div className="absolute -left-20 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 bg-slate-900/30 border border-white/5 rounded-[2rem] p-12 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/3">
                    <h2 className="text-3xl font-bold text-white mb-4">{t('underTheHood') || 'Under The Hood'}</h2>
                    <p className="text-slate-400 leading-relaxed">
                        {t('techDesc') || 'Built with cutting-edge technologies to ensure speed, reliability, and scalability. We leverage the power of the modern web.'}
                    </p>
                </div>
                <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {[
                        { name: 'React', color: 'text-blue-400' },
                        { name: 'Node.js', color: 'text-green-500' },
                        { name: 'Tailwind', color: 'text-cyan-400' },
                        { name: 'Leaflet', color: 'text-emerald-400' }
                    ].map((tech) => (
                        <div key={tech.name} className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                            <span className={`text-lg font-bold ${tech.color}`}>{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/**
 * @component RoadmapSection
 * @description Displays the future trajectory of the project.
 * Uses a vertical timeline layout.
 */
const RoadmapSection = ({ t }) => (
    <div className="mb-32 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            {t('roadmapTitle') || 'Future Horizons'}
        </h2>
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            {[
                { year: 'Q4 2025', title: 'Advanced Alerts', desc: 'Real-time push notifications for severe weather events.', active: true },
                { year: 'Q1 2026', title: 'Mobile App', desc: 'Native iOS and Android applications for on-the-go access.', active: false },
                { year: 'Q2 2026', title: 'AI Forecasting', desc: 'Machine learning models to predict micro-climate shifts.', active: false }
            ].map((item, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-cyan-500 transition-colors">
                        <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-cyan-500 animate-pulse' : 'bg-slate-600'}`}></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-slate-900/40 border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-white">{item.title}</h3>
                            <span className="text-xs font-mono text-cyan-500">{item.year}</span>
                        </div>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

/**
 * @component ContactSection
 * @description A fully functional-looking contact form section.
 * Provides a direct channel for user feedback.
 */
const ContactSection = ({ t }) => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send data to a backend
        window.location.href = `mailto:info@canaryweather.xyz?subject=Contact from ${formState.name}&body=${formState.message}`;
    };

    return (
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 bg-blue-600 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6">{t('getInTouch') || 'Get in Touch'}</h2>
                        <p className="text-blue-100 mb-12 leading-relaxed">
                            {t('contactDesc') || 'Have questions about the data? Found a bug? Or just want to say hello? We are always listening to our community.'}
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <span>info@canaryweather.xyz</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <span>Canary Islands, Spain</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-12 bg-slate-900">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Your name"
                                value={formState.name}
                                onChange={(e) => setFormState({...formState, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                            <input 
                                type="email" 
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="your@email.com"
                                value={formState.email}
                                onChange={(e) => setFormState({...formState, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                            <textarea 
                                rows="4"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                placeholder="How can we help?"
                                value={formState.message}
                                onChange={(e) => setFormState({...formState, message: e.target.value})}
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 transition-all transform hover:-translate-y-1">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

/**
 * AboutUs Page Component (Main).
 *
 * A premium, highly-polished "Bento Grid" layout designed to reflect the atmospheric depth of the Canary Islands.
 * This iteration focuses on a "Deep Ocean & Volcanic Earth" color palette, moving away from generic dark modes
 * to a specific brand identity that feels organic yet technological.
 *
 * Design System & Architecture:
 * - **Palette**: Deep Slate (#0f172a) as base, accented with Cyan (Ocean), Amber (Sun), and Emerald (Flora).
 * - **Layout**: Modular sections (Hero, Bento, Tech, Roadmap, Contact).
 * - **Typography**: Variable font weights to create hierarchy without clutter.
 * - **Micro-interactions**: Hover states that reveal depth (Z-axis translation) and glow effects.
 *
 * @component
 * @returns {JSX.Element} The rendered AboutUs page.
 */
function AboutUs() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#0B1120] text-slate-200 overflow-hidden relative selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
            
            {/* 
             * ==================================================================================
             * AMBIENT ATMOSPHERE LAYERS
             * ==================================================================================
             * Multi-layered background gradients to simulate weather patterns and depth.
             * Uses mix-blend-modes to create organic color intersections.
             */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Deep Ocean Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[8000ms]"></div>
                {/* Volcanic Heat Glow */}
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[12000ms]"></div>
                {/* Sunlight Accent */}
                <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-cyan-500/10 rounded-full blur-[80px] mix-blend-overlay"></div>
                
                {/* Noise Texture Overlay for "Film Grain" feel */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <HeroSection t={t} />
                <BentoGridSection t={t} />
                <TechStackSection t={t} />
                <RoadmapSection t={t} />
                <ContactSection t={t} />

                {/* Footer removed as per design requirements */}
            </div>
        </div>
    );
}

export default AboutUs;
