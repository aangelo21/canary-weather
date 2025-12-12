import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

/**
 * TermsAndConditions Page.
 *
 * Displays the Terms and Conditions for the Canary Weather application.
 * This page outlines the rules and regulations for using the website.
 *
 * Features:
 * - **Responsive Layout**: Adapts to different screen sizes.
 * - **Dark Mode Support**: Uses Tailwind CSS dark mode classes.
 * - **Internationalization**: Uses `useTranslation` for localized content (placeholders used for now).
 *
 * @returns {JSX.Element} The rendered Terms and Conditions page.
 */
const TermsAndConditions = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <SEO 
                title="Terms and Conditions" 
                description="Read our Terms and Conditions to understand the rules and regulations for using Canary Weather."
            />
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                        {t('terms.title')}
                    </h1>
                    
                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('terms.lastUpdated')}
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('terms.agreement.title')}</h2>
                            <p>
                                {t('terms.agreement.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('terms.ip.title')}</h2>
                            <p>
                                {t('terms.ip.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('terms.userRep.title')}</h2>
                            <p>{t('terms.userRep.content')}</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                {t('terms.userRep.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('terms.prohibited.title')}</h2>
                            <p>
                                {t('terms.prohibited.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('terms.management.title')}</h2>
                            <p>
                                {t('terms.management.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('terms.modifications.title')}</h2>
                            <p>
                                {t('terms.modifications.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('terms.contact.title')}</h2>
                            <p>
                                {t('terms.contact.content')}
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

export default TermsAndConditions;
