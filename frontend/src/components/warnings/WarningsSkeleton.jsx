import Skeleton from '../common/Skeleton';

export default function WarningsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Title */}
            <div className="flex justify-center mb-8">
                <Skeleton className="h-10 w-64" />
            </div>

            {/* Filters */}
            <div className="mb-6">
                <div className="flex gap-2 flex-wrap mb-4">
                    <Skeleton className="w-24 h-10 rounded-md" />
                    <Skeleton className="w-24 h-10 rounded-md" />
                    <Skeleton className="w-24 h-10 rounded-md" />
                </div>
            </div>

            {/* Active Alerts Section */}
            <section className="mb-12">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
                            <div className="flex justify-between items-start mb-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4 mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Past Alerts Section */}
            <section>
                <Skeleton className="h-8 w-48 mb-4" />
                
                {/* Desktop Table Skeleton */}
                <div className="hidden md:block">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 grid grid-cols-4 gap-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 grid grid-cols-4 gap-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Cards Skeleton */}
                <div className="md:hidden grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-24 mb-2" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
