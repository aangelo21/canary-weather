import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PrivacyPolicy Page.
 *
 * Displays the Privacy Policy for the Canary Weather application.
 * This page outlines how user data is collected, used, and protected.
 *
 * Features:
 * - **Responsive Layout**: Adapts to different screen sizes.
 * - **Dark Mode Support**: Uses Tailwind CSS dark mode classes.
 * - **Internationalization**: Uses `useTranslation` for localized content (placeholders used for now).
 *
 * @returns {JSX.Element} The rendered Privacy Policy page.
 */
const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                        Privacy Policy
                    </h1>
                    
                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last updated: December 1, 2025
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
                            <p>
                                Welcome to Canary Weather ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and with our services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our application.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
                            <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>
                                    <strong>Geolocation Data:</strong> We may request access or permission to and track location-based information from your mobile device or browser, either continuously or while you are using the Application, to provide location-based services (such as local weather forecasts).
                                </li>
                                <li>
                                    <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and profile picture, that you voluntarily give to us when you register with the Application or when you choose to participate in various activities related to the Application.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Use of Your Information</h2>
                            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Create and manage your account.</li>
                                <li>Compile anonymous statistical data and analysis for use internally.</li>
                                <li>Email you regarding your account or order.</li>
                                <li>Enable user-to-user communications.</li>
                                <li>Generate a personal profile about you to make future visits to the Application more personalized.</li>
                                <li>Provide accurate weather forecasts based on your location.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Disclosure of Your Information</h2>
                            <p>
                                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>
                                    <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Security of Your Information</h2>
                            <p>
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Contact Us</h2>
                            <p>
                                If you have questions or comments about this Privacy Policy, please contact us at:
                            </p>
                            <p className="mt-2 font-semibold text-brand-primary dark:text-blue-400">
                                info@canaryweather.xyz
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
