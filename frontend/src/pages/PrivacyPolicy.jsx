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
                        {t('privacyPolicy.title')}
                    </h1>
                    
                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('privacyPolicy.lastUpdated')}
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.intro.title')}</h2>
                            <p>
                                {t('privacyPolicy.intro.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.infoCollect.title')}</h2>
                            <p>{t('privacyPolicy.infoCollect.content')}</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>
                                    {t('privacyPolicy.infoCollect.geo')}
                                </li>
                                <li>
                                    {t('privacyPolicy.infoCollect.personal')}
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.useInfo.title')}</h2>
                            <p>{t('privacyPolicy.useInfo.content')}</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                {t('privacyPolicy.useInfo.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.disclosure.title')}</h2>
                            <p>
                                {t('privacyPolicy.disclosure.content')}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>
                                    {t('privacyPolicy.disclosure.law')}
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.security.title')}</h2>
                            <p>
                                {t('privacyPolicy.security.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.contact.title')}</h2>
                            <p>
                                {t('privacyPolicy.contact.content')}
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
