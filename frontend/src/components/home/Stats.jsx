import { useTranslation } from 'react-i18next';

/**
 * Stats Component.
 *
 * Displays a horizontal bar of key statistics about the Canary Islands weather and geography.
 * This component is intended to build trust and interest by highlighting favorable conditions.
 *
 * Statistics displayed:
 * - Average Temperature
 * - Annual Sunshine Hours
 * - Number of Islands
 * - Reliability Metric
 *
 * @component
 * @returns {JSX.Element} The rendered Stats component.
 */
export default function Stats() {
    const { t } = useTranslation();

    return (
        <div className="bg-brand-primary/5 dark:bg-white/5 border-y border-brand-primary/10 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-3xl font-bold text-brand-primary dark:text-blue-400">
                            22°C
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
                            {t('avgTemp') || 'Avg. Temp'}
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-brand-primary dark:text-blue-400">
                            3000+
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
                            {t('sunHours') || 'Sunshine Hours'}
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-brand-primary dark:text-blue-400">
                            8
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
                            {t('islands') || 'Islands'}
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-brand-primary dark:text-blue-400">
                            100%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
                            {t('reliable') || 'Reliable'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
