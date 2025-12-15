import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';


const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <SEO
                title="Privacy Policy"
                description="Read our Privacy Policy to understand how we collect, use, and protect your data."
            />
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                        {t('privacyPolicyPage.title')}
                    </h1>

                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('privacyPolicyPage.lastUpdated')}
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {t('privacyPolicyPage.intro.title')}
                            </h2>
                            <p>{t('privacyPolicyPage.intro.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {t('privacyPolicyPage.infoCollect.title')}
                            </h2>
                            <p>{t('privacyPolicyPage.infoCollect.content')}</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>
                                    {t('privacyPolicyPage.infoCollect.geo')}
                                </li>
                                <li>
                                    {t(
                                        'privacyPolicyPage.infoCollect.personal',
                                    )}
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {t('privacyPolicyPage.useInfo.title')}
                            </h2>
                            <p>{t('privacyPolicyPage.useInfo.content')}</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                {(Array.isArray(
                                    t('privacyPolicyPage.useInfo.items', {
                                        returnObjects: true,
                                        defaultValue: [],
                                    }),
                                )
                                    ? t('privacyPolicyPage.useInfo.items', {
                                          returnObjects: true,
                                          defaultValue: [],
                                      })
                                    : []
                                ).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {t('privacyPolicyPage.disclosure.title')}
                            </h2>
                            <p>{t('privacyPolicyPage.disclosure.content')}</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>{t('privacyPolicyPage.disclosure.law')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {t('privacyPolicyPage.security.title')}
                            </h2>
                            <p>{t('privacyPolicyPage.security.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {t('privacyPolicyPage.contact.title')}
                            </h2>
                            <p>{t('privacyPolicyPage.contact.content')}</p>
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
