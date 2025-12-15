import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { fetchAlerts, fetchWarnings } from '../services/alertService';
import SEO from '../components/SEO';
import WarningsSkeleton from '../components/warnings/WarningsSkeleton';


function Warnings() {
    const { t } = useTranslation();

    
    const [activeAlerts, setActiveAlerts] = useState([]);

    
    const [pastAlerts, setPastAlerts] = useState([]);

    
    const [loading, setLoading] = useState(true);

    
    const [error, setError] = useState(null);

    
    const [fetchError, setFetchError] = useState(null);

    
    const [showFilters, setShowFilters] = useState(false);

    
    const [filters, setFilters] = useState({
        severity: { Extreme: true, Severe: true, Moderate: true },
        islands: {},
    });

    
    useEffect(() => {
        const loadData = async () => {
            try {
                
                try {
                    await fetchWarnings();
                    setFetchError(null);
                } catch (e) {
                    console.error(
                        'Failed to refresh warnings from external source:',
                        e,
                    );
                    setFetchError(
                        t('errorFetchingExternal') ||
                            'Could not update warnings from external source. Showing cached data.',
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

                    
                    if (endDate > now) {
                        active.push(alert);
                    }
                    
                    else if (endDate <= now) {
                        past.push(alert);
                    }
                });

                
                active.sort((a, b) => {
                    const aStarted = new Date(a.start_date) <= now;
                    const bStarted = new Date(b.start_date) <= now;
                    if (aStarted && !bStarted) return -1;
                    if (!aStarted && bStarted) return 1;
                    return new Date(a.start_date) - new Date(b.start_date);
                });

                
                past.sort(
                    (a, b) => new Date(b.end_date) - new Date(a.end_date),
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

    
    const getSeverityColor = (level) => {
        if (!level) return 'gray';
        const l = level.toLowerCase();
        if (l.includes('red') || l.includes('rojo') || l.includes('extreme'))
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
        if (l.includes('green') || l.includes('verde') || l.includes('minor'))
            return 'green';
        return 'gray';
    };

    const getSeverityClasses = (level) => {
        const color = getSeverityColor(level);
        switch (color) {
            case 'red':
                return 'bg-red-50 border-red-500 text-red-700';
            case 'orange':
                return 'bg-[#fff3e0] border-[#ff9800] text-[#e65100]'; 
            case 'yellow':
                return 'bg-yellow-50 border-yellow-500 text-yellow-700';
            case 'green':
                return 'bg-green-50 border-green-500 text-green-700';
            default:
                return 'bg-gray-50 border-gray-500 text-gray-700';
        }
    };

    const translateSeverity = (level) => {
        if (!level) return level;
        if (level === 'Moderate') return t('severityModerate');
        if (level === 'Severe') return t('severitySevere');
        if (level === 'Extreme') return t('severityExtreme');
        return level;
    };

    const translatePhenomenon = (phenomenon) => {
        if (!phenomenon) return phenomenon;
        return t(phenomenon) || phenomenon;
    };

    
    const applyFilters = (alertsList) => {
        return alertsList.filter((alert) => {
            
            if (!filters.severity[alert.level]) return false;

            
            const activeIslands = Object.entries(filters.islands).filter(
                ([_, active]) => active,
            );
            if (activeIslands.length > 0) {
                const alertIsland = getIslandFromArea(alert.area_name);
                if (!alertIsland || !filters.islands[alertIsland]) return false;
            }

            return true;
        });
    };

    
    const getIslandFromArea = (areaName) => {
        if (!areaName) return null;
        const islandNames = [
            'Lanzarote',
            'Fuerteventura',
            'Gran Canaria',
            'Tenerife',
            'La Gomera',
            'La Palma',
            'El Hierro',
        ];
        for (const island of islandNames) {
            if (areaName.includes(island)) {
                return island;
            }
        }
        return null;
    };

    
    const getUniqueIslands = () => {
        const islands = new Set();
        const islandNames = [
            'Lanzarote',
            'Fuerteventura',
            'Gran Canaria',
            'Tenerife',
            'La Gomera',
            'La Palma',
            'El Hierro',
        ];

        [...activeAlerts, ...pastAlerts].forEach((alert) => {
            if (alert.area_name) {
                
                for (const island of islandNames) {
                    if (alert.area_name.includes(island)) {
                        islands.add(island);
                        break;
                    }
                }
            }
        });
        return Array.from(islands).sort();
    };

    
    const toggleFilter = (category, value) => {
        setFilters((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [value]: !prev[category][value],
            },
        }));
    };

    
    const resetFilters = () => {
        setFilters({
            severity: { Extreme: true, Severe: true, Moderate: true },
            islands: {},
        });
    };

    
    const filteredActiveAlerts = applyFilters(activeAlerts);
    const filteredPastAlerts = applyFilters(pastAlerts);

    if (loading) return <WarningsSkeleton />;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO
                title="Weather Warnings"
                description="Stay informed with the latest weather warnings and alerts for the Canary Islands."
            />
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

            {}
            {}
            <div className="mb-6">
                <div className="flex gap-2 flex-wrap mb-4">
                    <button
                        onClick={() => toggleFilter('severity', 'Extreme')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            filters.severity.Extreme
                                ? 'bg-error text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
                        }`}
                    >
                        {(t('severityExtreme') || 'ROJO').toUpperCase()}
                    </button>
                    <button
                        onClick={() => toggleFilter('severity', 'Severe')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            filters.severity.Severe
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
                        }`}
                    >
                        {(t('severitySevere') || 'NARANJA').toUpperCase()}
                    </button>
                    <button
                        onClick={() => toggleFilter('severity', 'Moderate')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            filters.severity.Moderate
                                ? 'bg-warning text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
                        }`}
                    >
                        {(t('severityModerate') || 'AMARILLO').toUpperCase()}
                    </button>
                </div>

                {getUniqueIslands().length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {getUniqueIslands().map((island) => (
                            <button
                                key={island}
                                onClick={() => toggleFilter('islands', island)}
                                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                    filters.islands[island]
                                        ? 'bg-[#0f6fb9] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
                                }`}
                            >
                                {island.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-blue-200">
                    {t('activeWarnings') || 'Active Warnings'}
                </h2>
                {filteredActiveAlerts.length === 0 ? (
                    <p className="text-center text-gray-500">
                        {activeAlerts.length === 0
                            ? t('noActiveWarnings') || 'No active warnings.'
                            : t('noMatchingWarnings') ||
                              'No hay alertas que coincidan con los filtros.'}
                    </p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredActiveAlerts.map((alert) => {
                            const now = new Date();
                            const isUpcoming = new Date(alert.start_date) > now;
                            return (
                                <div
                                    key={alert.id}
                                    className={`border-l-4 p-4 rounded shadow ${getSeverityClasses(alert.level)}`}
                                >
                                    {isUpcoming && (
                                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 mb-2">
                                            {t('upcoming') || 'Upcoming'}
                                        </span>
                                    )}
                                    <h3 className="text-xl font-semibold">
                                        {translatePhenomenon(alert.phenomenon)}
                                    </h3>
                                    <p className="font-medium">
                                        {translateSeverity(alert.level)}
                                    </p>
                                    {alert.area_name && (
                                        <p className="text-sm mt-1 opacity-80">
                                            📍 {alert.area_name}
                                        </p>
                                    )}
                                    <div className="mt-2 text-sm opacity-90">
                                        <p>
                                            <span className="font-semibold">
                                                {t('start')}:
                                            </span>{' '}
                                            {new Date(
                                                alert.start_date,
                                            ).toLocaleString()}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                {t('end')}:
                                            </span>{' '}
                                            {new Date(
                                                alert.end_date,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-700">
                    {t('warningsHistory') || 'Warnings History'}
                </h2>
                {filteredPastAlerts.length === 0 ? (
                    <p className="text-center text-gray-500">
                        {pastAlerts.length === 0
                            ? t('noPastWarnings') ||
                              'No past warnings recorded.'
                            : t('noMatchingWarnings') ||
                              'No hay alertas que coincidan con los filtros.'}
                    </p>
                ) : (
                    <>
                        {}
                        <div className="md:hidden grid gap-4">
                            {filteredPastAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded shadow"
                                >
                                    <div className="font-bold mb-2 text-gray-900 dark:text-white">
                                        {translatePhenomenon(alert.phenomenon)}
                                    </div>
                                    <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                                        {translateSeverity(alert.level)}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                        <div>
                                            <span className="font-semibold">
                                                {t('start')}:
                                            </span>{' '}
                                            {new Date(
                                                alert.start_date,
                                            ).toLocaleString()}
                                        </div>
                                        <div>
                                            <span className="font-semibold">
                                                {t('end')}:
                                            </span>{' '}
                                            {new Date(
                                                alert.end_date,
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700">
                                        <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-900 dark:text-white">
                                            {t('phenomenon') || 'Phenomenon'}
                                        </th>
                                        <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-900 dark:text-white">
                                            {t('level') || 'Level'}
                                        </th>
                                        <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-900 dark:text-white">
                                            {t('start') || 'Start Date'}
                                        </th>
                                        <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-900 dark:text-white">
                                            {t('end') || 'End Date'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPastAlerts.map((alert) => (
                                        <tr
                                            key={alert.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <td className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                                                {translatePhenomenon(
                                                    alert.phenomenon,
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                                                {translateSeverity(alert.level)}
                                            </td>
                                            <td className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                                                {new Date(
                                                    alert.start_date,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                                                {new Date(
                                                    alert.end_date,
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

export default Warnings;
