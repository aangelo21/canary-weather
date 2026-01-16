import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { fetchAlerts, fetchWarnings } from '../services/alertService';
import SEO from '../components/SEO';
import WarningsSkeleton from '../components/warnings/WarningsSkeleton';
import {
    AlertTriangle,
    Wind,
    CloudRain,
    Waves,
    ThermometerSun,
    CloudLightning,
    SunDim,
    Calendar,
    Clock,
    MapPin,
    Filter,
    History,
    Info,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

function Warnings() {
    const { t } = useTranslation();

    const [activeAlerts, setActiveAlerts] = useState([]);
    const [pastAlerts, setPastAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [filters, setFilters] = useState({
        severity: { Extreme: true, Severe: true, Moderate: true },
        islands: {},
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
                    } else {
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

    const getSeverityConfig = (level) => {
        if (!level) return { color: 'gray', label: 'Unknown', bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-700', icon: Info };
        const l = level.toLowerCase();
        
        if (l.includes('red') || l.includes('rojo') || l.includes('extreme')) {
            return {
                color: 'red',
                label: t('severityExtreme') || 'Extreme',
                bg: 'bg-red-50 dark:bg-red-900/20',
                border: 'border-red-200 dark:border-red-800',
                text: 'text-red-700 dark:text-red-400',
                badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                icon: AlertTriangle
            };
        }
        if (l.includes('orange') || l.includes('naranja') || l.includes('severe')) {
            return {
                color: 'orange',
                label: t('severitySevere') || 'Severe',
                bg: 'bg-orange-50 dark:bg-orange-900/20',
                border: 'border-orange-200 dark:border-orange-800',
                text: 'text-orange-700 dark:text-orange-400',
                badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
                icon: AlertTriangle
            };
        }
        if (l.includes('yellow') || l.includes('amarillo') || l.includes('moderate')) {
            return {
                color: 'yellow',
                label: t('severityModerate') || 'Moderate',
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                border: 'border-yellow-200 dark:border-yellow-800',
                text: 'text-yellow-700 dark:text-yellow-400',
                badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                icon: AlertTriangle
            };
        }
        return { color: 'gray', label: level, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: Info };
    };

    const getPhenomenonIcon = (phenomenon) => {
        const p = phenomenon?.toLowerCase() || '';
        if (p.includes('wind') || p.includes('viento')) return Wind;
        if (p.includes('rain') || p.includes('lluvia')) return CloudRain;
        if (p.includes('coast') || p.includes('costero') || p.includes('mar')) return Waves;
        if (p.includes('heat') || p.includes('calor') || p.includes('temp')) return ThermometerSun;
        if (p.includes('storm') || p.includes('tormenta')) return CloudLightning;
        if (p.includes('dust') || p.includes('polvo') || p.includes('calima')) return SunDim;
        return AlertTriangle;
    };

    const translatePhenomenon = (phenomenon) => {
        if (!phenomenon) return phenomenon;
        return t(phenomenon) || phenomenon;
    };

    const applyFilters = (alertsList) => {
        return alertsList.filter((alert) => {
            if (!filters.severity[alert.level]) return false;
            const activeIslands = Object.entries(filters.islands).filter(([_, active]) => active);
            if (activeIslands.length > 0) {
                const alertIsland = getIslandFromArea(alert.area_name);
                if (!alertIsland || !filters.islands[alertIsland]) return false;
            }
            return true;
        });
    };

    const getIslandFromArea = (areaName) => {
        if (!areaName) return null;
        const islandNames = ['Lanzarote', 'Fuerteventura', 'Gran Canaria', 'Tenerife', 'La Gomera', 'La Palma', 'El Hierro'];
        for (const island of islandNames) {
            if (areaName.includes(island)) return island;
        }
        return null;
    };

    const getUniqueIslands = () => {
        const islands = new Set();
        const islandNames = ['Lanzarote', 'Fuerteventura', 'Gran Canaria', 'Tenerife', 'La Gomera', 'La Palma', 'El Hierro'];
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
            [category]: { ...prev[category], [value]: !prev[category][value] },
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const filteredActiveAlerts = applyFilters(activeAlerts);
    const filteredPastAlerts = applyFilters(pastAlerts);

    // Pagination Logic
    const totalPages = Math.ceil(filteredPastAlerts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPastAlerts = filteredPastAlerts.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (loading) return <WarningsSkeleton />;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md mx-4">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('error') || 'Error'}</h2>
                <p className="text-gray-600 dark:text-gray-300">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <SEO
                title="Weather Warnings"
                description="Stay informed with the latest weather warnings and alerts for the Canary Islands."
            />
            
            {/* Header Section */}
            <div className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
                    {t('warningsTitle') || 'Weather Warnings'}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                    {t('warningsSubtitle') || 'Real-time official weather alerts for the Canary Islands.'}
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {fetchError && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-8 rounded-r-lg shadow-sm flex items-start gap-3">
                        <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-yellow-700 dark:text-yellow-200 text-sm">{fetchError}</p>
                    </div>
                )}

                {/* Filters Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-12">
                    <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white font-semibold">
                        <Filter className="w-5 h-5 text-blue-500" />
                        <span>{t('filterBy') || 'Filter Warnings'}</span>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Severity Filters */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">
                                {t('severity') || 'Severity Level'}
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {['Extreme', 'Severe', 'Moderate'].map((level) => {
                                    const config = getSeverityConfig(level);
                                    const isActive = filters.severity[level];
                                    return (
                                        <button
                                            key={level}
                                            onClick={() => toggleFilter('severity', level)}
                                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border
                                                ${isActive 
                                                    ? `${config.bg} ${config.border} ${config.text} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-${config.color}-400` 
                                                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }
                                            `}
                                        >
                                            {isActive && <CheckCircle2 className="w-4 h-4" />}
                                            {config.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Island Filters */}
                        {getUniqueIslands().length > 0 && (
                            <div>
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">
                                    {t('islands') || 'Islands'}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {getUniqueIslands().map((island) => (
                                        <button
                                            key={island}
                                            onClick={() => toggleFilter('islands', island)}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
                                                ${filters.islands[island]
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-blue-400'
                                                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }
                                            `}
                                        >
                                            {island}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Warnings Grid */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${filteredActiveAlerts.length === 0 ? 'bg-green-400' : filteredActiveAlerts.length === 1 ? 'bg-orange-400' : 'bg-red-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${filteredActiveAlerts.length === 0 ? 'bg-green-500' : filteredActiveAlerts.length === 1 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                            </span>
                            {t('activeWarnings') || 'Active Warnings'}
                        </h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                            {filteredActiveAlerts.length} {t('active') || 'Active'}
                        </span>
                    </div>

                    {filteredActiveAlerts.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                            <div className="bg-green-50 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                {activeAlerts.length === 0 ? (t('noActiveWarnings') || 'No active warnings') : (t('noMatchingWarnings') || 'No matching warnings')}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {activeAlerts.length === 0 ? (t('goodWeather') || 'Enjoy the good weather!') : (t('adjustFilters') || 'Try adjusting your filters')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredActiveAlerts.map((alert) => {
                                const config = getSeverityConfig(alert.level);
                                const Icon = getPhenomenonIcon(alert.phenomenon);
                                const now = new Date();
                                const isUpcoming = new Date(alert.start_date) > now;

                                return (
                                    <div
                                        key={alert.id}
                                        className={`
                                            relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 
                                            border-l-4 ${config.border.replace('border', 'border-l')} border-y border-r border-gray-100 dark:border-gray-700
                                            group
                                        `}
                                    >
                                        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                                            <Icon className={`w-24 h-24 ${config.text}`} />
                                        </div>

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
                                                    {config.label}
                                                </span>
                                                {isUpcoming && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {t('upcoming') || 'Upcoming'}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`p-2 rounded-lg ${config.bg}`}>
                                                    <Icon className={`w-6 h-6 ${config.text}`} />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                                    {translatePhenomenon(alert.phenomenon)}
                                                </h3>
                                            </div>

                                            {alert.area_name && (
                                                <div className="flex items-start gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                                                    <span>{alert.area_name}</span>
                                                </div>
                                            )}

                                            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" /> {t('start')}:
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {new Date(alert.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" /> {t('end')}:
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {new Date(alert.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* History Section */}
                <section className="pb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <History className="w-6 h-6 text-gray-400" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('warningsHistory') || 'Past Warnings'}
                        </h2>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {filteredPastAlerts.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                {pastAlerts.length === 0 ? (t('noPastWarnings') || 'No past warnings recorded') : (t('noMatchingWarnings') || 'No matching warnings')}
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700">
                                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('phenomenon') || 'Phenomenon'}
                                                </th>
                                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('level') || 'Level'}
                                                </th>
                                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('area') || 'Area'}
                                                </th>
                                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('duration') || 'Duration'}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {currentPastAlerts.map((alert) => {
                                                const config = getSeverityConfig(alert.level);
                                                return (
                                                    <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="py-4 px-6">
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {translatePhenomenon(alert.phenomenon)}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.badge}`}>
                                                                {config.label}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                                                            {alert.area_name || '-'}
                                                        </td>
                                                        <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                                                            <div className="flex flex-col">
                                                                <span>{new Date(alert.start_date).toLocaleDateString()}</span>
                                                                <span className="text-xs opacity-75">
                                                                    {new Date(alert.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(alert.end_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50 select-none">
                                        <button
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-400"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        
                                        <div className="flex items-center gap-1">
                                            {getPageNumbers().map((page, idx) => (
                                                typeof page === 'number' ? (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`
                                                            w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
                                                            ${currentPage === page
                                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                            }
                                                        `}
                                                    >
                                                        {page}
                                                    </button>
                                                ) : (
                                                    <span key={idx} className="w-8 text-center text-gray-400">...</span>
                                                )
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-400"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Warnings;
