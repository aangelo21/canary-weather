// Footer.jsx - Footer component for the Canary Weather application
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-brand-primary to-blue-900 dark:from-gray-900 dark:to-black text-white pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 items-start">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.webp" alt="Canary Weather Logo" className="h-12 w-auto brightness-0 invert" />
                        </div>
                        <p className="text-blue-100 dark:text-gray-400 text-sm leading-relaxed">
                            {t('aboutUsDesc')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">{t('quickLinks')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-blue-100 dark:text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                                    {t('home')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/map" className="text-blue-100 dark:text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                                    {t('map')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/pois" className="text-blue-100 dark:text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                                    {t('pointsOfInterest')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/warnings" className="text-blue-100 dark:text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                                    {t('warnings')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/aboutus" className="text-blue-100 dark:text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                                    {t('aboutUs')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">{t('contactInfo')}</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-blue-100 dark:text-gray-400 text-sm">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>
                                    {t('emailUs')}:<br />
                                    <a href="mailto:info@canaryweather.xyz" className="hover:text-white transition-colors">info@canaryweather.xyz</a>
                                </span>
                            </li>
                            <li className="flex items-start gap-3 text-blue-100 dark:text-gray-400 text-sm">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>
                                    {t('location')}:<br />
                                    {t('canaryIslands')}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">{t('followUs')}</h3>
                        <div className="flex gap-4">
                            <a href="https://github.com/aangelo21/canary_weather" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                            <a href="https://x.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-blue-400/30 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-blue-100 dark:text-gray-500 text-sm text-center md:text-left">
                        {t('copyright')} {currentYear} {t('canaryWeather')}. {t('allRightsReserved')}
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-blue-100 dark:text-gray-500 hover:text-white transition-colors">{t('privacyPolicy')}</a>
                        <a href="#" className="text-blue-100 dark:text-gray-500 hover:text-white transition-colors">{t('termsOfService')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
