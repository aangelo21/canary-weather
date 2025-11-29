import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { fetchAlerts, fetchWarnings } from '../services/alertService';

/**
 * Warnings Page Component.
 *
 * Displays a list of weather warnings and alerts for the Canary Islands.
 *
 * Features:
 * - **Data Fetching**: Retrieves alerts from the backend (which syncs with MeteoAlarm).
 * - **Filtering**: Filters alerts to show only significant levels (Yellow, Orange, Red) and categorizes them into "Active" and "Past".
 * - **Visual Indicators**: Uses color coding (Red/Orange/Yellow) to indicate the severity of each alert.
 * - **Error Handling**: Displays messages if data fetching fails, with a fallback to cached data.
 *
 * @component
 * @returns {JSX.Element} The rendered Warnings page.
 */
function Warnings() {
    const { t } = useTranslation();
    
    /**
     * @type {[Array<Object>, Function]} activeAlerts - State for currently active alerts.
     */
    const [activeAlerts, setActiveAlerts] = useState([]);

    /**
     * @type {[Array<Object>, Function]} pastAlerts - State for historical alerts.
     */
    const [pastAlerts, setPastAlerts] = useState([]);

    /**
     * @type {[boolean, Function]} loading - State to indicate if data is being loaded.
     */
    const [loading, setLoading] = useState(true);

    /**
     * @type {[string|null, Function]} error - State for general errors.
     */
    const [error, setError] = useState(null);

    /**
     * @type {[string|null, Function]} fetchError - State for errors specific to the external data refresh.
     */
    const [fetchError, setFetchError] = useState(null);

    /**
     * Effect hook to fetch and process alert data on mount.
     * It first attempts to trigger a refresh from the external source, then fetches the local database records.
     * Alerts are filtered by severity and categorized by date.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                // Trigger fetch from external source first
                try {
                    await fetchWarnings();
                    setFetchError(null);
                } catch (e) {
                    console.error(
                        'Failed to refresh warnings from external source:',
                        e
                    );
                    setFetchError(
                        t('errorFetchingExternal') ||
                            'Could not update warnings from external source. Showing cached data.'
                    );
                }

                const data = await fetchAlerts();

                const now = new Date();
                const active = [];
                const past = [];

                data.forEach((alert) => {
                    const startDate = new Date(alert.start_date);
                    const endDate = new Date(alert.end_date);
                    const level = alert.level ? alert.level.toLowerCase() : '';

                    // Filter: Only show Yellow, Orange, and Red alerts. Ignore Green/Minor.
                    const isImportant =
                        level.includes('amarillo') ||
                        level.includes('yellow') ||
                        level.includes('naranja') ||
                        level.includes('orange') ||
                        level.includes('rojo') ||
                        level.includes('red') ||
                        level.includes('moderate') ||
                        level.includes('severe') ||
                        level.includes('extreme');

                    if (!isImportant) return;

                    // Active: Started and not ended
                    if (startDate <= now && endDate > now) {
                        active.push(alert);
                    }
                    // Past: Ended
                    else if (endDate <= now) {
                        past.push(alert);
                    }
                    // Future: startDate > now (Ignored as per request)
                });

                // Sort past alerts by date descending
                past.sort(
                    (a, b) => new Date(b.end_date) - new Date(a.end_date)
                );

                setActiveAlerts(active);
                setPastAlerts(past);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    /**
     * Helper function to determine the color code based on the alert severity level.
     *
     * @param {string} level - The severity level string (e.g., "Red", "Orange").
     * @returns {string} The corresponding color name ('red', 'orange', 'yellow', or 'gray').
     */
    const getSeverityColor = (level) => {
        if (!level) return 'gray';
        const l = level.toLowerCase();
        if (
            l.includes('red') ||
            l.includes('rojo') ||
            l.includes('extreme')
        )
            return 'red';
        if (
            l.includes('orange') ||
            l.includes('naranja') ||
            l.includes('severe')
        )
            return 'orange';
        if (
            l.includes('yellow') ||
            l.includes('amarillo') ||
            l.includes('moderate')
        )
            return 'yellow';
        if (
            l.includes('green') ||
            l.includes('verde') ||
            l.includes('minor')
        )
            return 'green';
        return 'gray';
    };

    const getSeverityClasses = (level) => {
        const color = getSeverityColor(level);
        switch (color) {
            case 'red':
                return 'bg-red-50 border-red-500 text-red-700';
            case 'orange':
                return 'bg-orange-50 border-orange-500 text-orange-700';
            case 'yellow':
                return 'bg-yellow-50 border-yellow-500 text-yellow-700';
            case 'green':
                return 'bg-green-50 border-green-500 text-green-700';
            default:
                return 'bg-gray-50 border-gray-500 text-gray-700';
        }
    };

    if (loading) return <div className="text-center">{t('loading')}</div>;
    if (error)
        return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">
                {t('warningsTitle')}
            </h1>

            {fetchError && (
                <div
                    className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
                    role="alert"
                >
                    <p>{fetchError}</p>
                </div>
            )}

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {t('activeWarnings') || 'Active Warnings'}
                </h2>
                {activeAlerts.length === 0 ? (
                    <p className="text-center text-gray-500">
                        {t('noActiveWarnings') || 'No active warnings.'}
                    </p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`border-l-4 p-4 rounded shadow ${getSeverityClasses(alert.level)}`}
                            >
                                <h3 className="text-xl font-semibold">
                                    {alert.phenomenon}
                                </h3>
                                <p className="font-medium">{alert.level}</p>
                                <div className="mt-2 text-sm opacity-90">
                                    <p>
                                        <span className="font-semibold">
                                            {t('start')}:
                                        </span>{' '}
                                        {new Date(
                                            alert.start_date
                                        ).toLocaleString()}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            {t('end')}:
                                        </span>{' '}
                                        {new Date(
                                            alert.end_date
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-700">
                    {t('warningsHistory') || 'Warnings History'}
                </h2>
                {pastAlerts.length === 0 ? (
                    <p className="text-center text-gray-500">
                        {t('noPastWarnings') || 'No past warnings recorded.'}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border-b text-left">
                                        {t('phenomenon') || 'Phenomenon'}
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        {t('level') || 'Level'}
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        {t('start') || 'Start Date'}
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        {t('end') || 'End Date'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastAlerts.map((alert) => (
                                    <tr
                                        key={alert.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="py-2 px-4 border-b">
                                            {alert.phenomenon}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {alert.level}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {new Date(
                                                alert.start_date
                                            ).toLocaleString()}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {new Date(
                                                alert.end_date
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Warnings;
