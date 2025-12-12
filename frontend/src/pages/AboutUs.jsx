import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../services/api';
import SEO from '../components/SEO';

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
        <div className="col-span-1 md:col-span-2 row-span-2 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-4xl p-10 flex flex-col justify-between group hover:bg-slate-900/60 transition-all duration-500 hover:border-cyan-500/30 relative overflow-hidden">
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
        <div className="col-span-1 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/5 rounded-4xl p-8 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-transform duration-300">
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full animate-pulse"></div>
                <svg className="w-12 h-12 text-amber-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <span className="text-3xl font-bold text-white">24/7</span>
            <span className="text-xs font-mono text-slate-500 uppercase mt-1">Real-time Monitoring</span>
        </div>

        {/* Metric Card 2 */}
        <div className="col-span-1 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/5 rounded-4xl p-8 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-transform duration-300">
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full animate-pulse delay-75"></div>
                <svg className="w-12 h-12 text-emerald-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <span className="text-3xl font-bold text-white">88+</span>
            <span className="text-xs font-mono text-slate-500 uppercase mt-1">Municipalities</span>
        </div>

        {/* Team Member: Angelo */}
        <div className="col-span-1 row-span-2 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-4xl p-8 flex flex-col items-center text-center hover:border-blue-500/30 transition-colors duration-300 group">
            <div className="w-32 h-32 rounded-full p-0.5 bg-gradient-to-b from-blue-500 to-transparent mb-6 group-hover:rotate-180 transition-transform duration-700">
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
        <div className="col-span-1 row-span-2 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-4xl p-8 flex flex-col items-center text-center hover:border-teal-500/30 transition-colors duration-300 group">
            <div className="w-32 h-32 rounded-full p-0.5 bg-gradient-to-b from-teal-500 to-transparent mb-6 group-hover:rotate-180 transition-transform duration-700">
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
        <div className="relative z-10 bg-slate-900/30 border border-white/5 rounded-4xl p-12 overflow-hidden">
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
                { year: 'Q4 2026', title: t('roadmap.q4_2025.title'), desc: t('roadmap.q4_2025.desc'), active: true },
                { year: 'Q1 2027', title: t('roadmap.q1_2026.title'), desc: t('roadmap.q1_2026.desc'), active: false },
                { year: 'Q2 2027', title: t('roadmap.q2_2026.title'), desc: t('roadmap.q2_2026.desc'), active: false }
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
 * @description A premium, glassmorphic contact interface.
 * Replaces the standard two-column layout with a unified, atmospheric design
 * that blends seamlessly into the "Deep Ocean" theme.
 *
 * Design Features:
 * - **Glassmorphism**: Heavy backdrop blur and semi-transparent layers.
 * - **Mesh Gradient**: A subtle, animated gradient on the info side.
 * - **Floating Inputs**: Modern form fields with smooth focus transitions.
 * - **Neon Accents**: Cyan glows to guide user attention.
 */
const ContactSection = ({ t }) => {
    const [formState, setFormState] = useState({ name: '', subject: '', message: '' });
    const [focusedField, setFocusedField] = useState(null);
    const [status, setStatus] = useState('idle');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = () => {
            const user = localStorage.getItem('cw_user');
            setIsLoggedIn(!!user);
        };

        checkLogin();

        window.addEventListener('userLoggedIn', checkLogin);
        return () => {
            window.removeEventListener('userLoggedIn', checkLogin);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const response = await apiFetch('/users/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            if (response.ok) {
                setStatus('success');
                setFormState({ name: '', subject: '', message: '' });
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    /**
     * Generates dynamic classes for input fields based on focus state.
     * @param {string} fieldName - The name of the field (name, email, message).
     */
    const inputClasses = (fieldName) => `
        w-full bg-slate-900/50 border rounded-xl px-4 py-4 text-white placeholder-transparent
        transition-all duration-300 outline-none
        ${focusedField === fieldName ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-slate-900/80' : 'border-white/10 hover:border-white/20'}
    `;

    /**
     * Generates dynamic classes for floating labels.
     * @param {string} fieldName - The name of the field.
     */
    const labelClasses = (fieldName) => `
        absolute left-4 transition-all duration-300 pointer-events-none
        ${focusedField === fieldName || formState[fieldName] 
            ? '-top-2.5 text-xs bg-[#0B1120] px-2 text-cyan-400 font-medium' 
            : 'top-4 text-slate-400'}
    `;

    return (
        <div className="max-w-6xl mx-auto relative group mb-24">
            {/* Ambient Glow Effect behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-[#0B1120] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
                    
                    {/* 
                     * Left Column: Contact Info & Atmosphere 
                     * Uses a rich gradient overlay to create visual weight.
                     */}
                    <div className="lg:col-span-2 relative p-12 flex flex-col justify-between overflow-hidden">
                        {/* Background Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-slate-900/90 to-slate-900/90 z-0"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0"></div>
                        
                        {/* Decorative Circle */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
                                {t('getInTouch') || 'Let\'s Connect'}
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-12">
                                {t('contactDesc') || 'Building the future of weather forecasting requires community. Whether you have a feature request, a bug report, or just want to talk meteorology, we are all ears.'}
                            </p>
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-start gap-5 group/item">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:bg-cyan-500/10 group-hover/item:border-cyan-500/30 transition-all duration-300">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">{t('emailUs') || 'Email Us'}</h3>
                                    <p className="text-slate-400 text-sm">canaryweatherxyz@gmail.com</p>
                                    <p className="text-slate-500 text-xs mt-1">Response within 24h</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group/item">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:bg-blue-500/10 group-hover/item:border-blue-500/30 transition-all duration-300">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">{t('ourHQ') || 'Our HQ'}</h3>
                                    <p className="text-slate-400 text-sm">Las Palmas de Gran Canaria</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* 
                     * Right Column: Interactive Form 
                     * Clean, spacious, and focused.
                     */}
                    <div className="lg:col-span-3 p-12 bg-slate-900/30 backdrop-blur-sm">
                        {status === 'success' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white">
                                    {t('contactForm.successTitle') || 'Message Sent!'}
                                </h3>
                                <p className="text-slate-400 max-w-md">
                                    {t('contactForm.successDesc') || 'Thank you for reaching out. We will get back to you shortly.'}
                                </p>
                            </div>
                        ) : !isLoggedIn ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white">
                                    {t('loginToContact') || 'Login to Send Message'}
                                </h3>
                                <p className="text-slate-400 max-w-md">
                                    {t('loginToContactDesc') || 'Please log in to your account to send us a message. This helps us prevent spam and respond to you faster.'}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8 h-full flex flex-col justify-center">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            id="name"
                                            className={inputClasses('name')}
                                            value={formState.name}
                                            onChange={(e) => setFormState({...formState, name: e.target.value})}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                        <label htmlFor="name" className={labelClasses('name')}>
                                            {t('contactForm.name') || 'Your Name'}
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            id="subject"
                                            className={inputClasses('subject')}
                                            value={formState.subject}
                                            onChange={(e) => setFormState({...formState, subject: e.target.value})}
                                            onFocus={() => setFocusedField('subject')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                        <label htmlFor="subject" className={labelClasses('subject')}>
                                            {t('contactForm.subject') || 'Subject'}
                                        </label>
                                    </div>
                                </div>

                                <div className="relative">
                                    <textarea 
                                        id="message"
                                        rows="6"
                                        className={`${inputClasses('message')} resize-none`}
                                        value={formState.message}
                                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                    ></textarea>
                                    <label htmlFor="message" className={labelClasses('message')}>
                                        {t('contactForm.message') || 'How can we help you?'}
                                    </label>
                                </div>

                                <div className="flex justify-end">
                                    <button 
                                        type="submit" 
                                        className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                        <span className="relative flex items-center gap-2">
                                            {t('contactForm.send') || 'Send Message'}
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
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
            <SEO 
                title="About Us" 
                description="Learn about the team behind Canary Weather and our mission to provide the most accurate weather data for the Canary Islands."
            />
            
            {/* 
             * ==================================================================================
             * AMBIENT ATMOSPHERE LAYERS
             * ==================================================================================
             * Multi-layered background gradients to simulate weather patterns and depth.
             * Uses mix-blend-modes to create organic color intersections.
             */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Deep Ocean Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-8000"></div>
                {/* Volcanic Heat Glow */}
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-12000"></div>
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
