import Skeleton from '../common/Skeleton';

export default function POICardSkeleton() {
    return (
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
            {/* Image Skeleton */}
            <div className="relative h-48 w-full">
                <Skeleton variant="rectangular" className="w-full h-full" />
            </div>

            <div className="p-5 flex flex-col flex-grow">
                {/* Title and Description */}
                <div className="mb-4">
                    <Skeleton className="w-3/4 h-6 mb-2" />
                    <Skeleton className="w-full h-4 mb-1" />
                    <Skeleton className="w-2/3 h-4" />
                </div>

                {/* Weather Section Skeleton */}
                <div className="mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex flex-col gap-1">
                            <Skeleton className="w-16 h-4" />
                            <Skeleton className="w-12 h-6" />
                        </div>
                        <Skeleton variant="circular" className="w-10 h-10" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center gap-1">
                            <Skeleton className="w-8 h-3" />
                            <Skeleton className="w-10 h-4" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Skeleton className="w-8 h-3" />
                            <Skeleton className="w-10 h-4" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Skeleton className="w-8 h-3" />
                            <Skeleton className="w-10 h-4" />
                        </div>
                    </div>
                </div>

                {/* Coordinates */}
                <div className="flex items-center gap-2 mb-4 mt-auto">
                    <Skeleton variant="circular" className="w-4 h-4" />
                    <Skeleton className="w-32 h-3" />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Skeleton className="flex-1 h-9 rounded-lg" />
                    <Skeleton className="flex-1 h-9 rounded-lg" />
                </div>
            </div>
        </article>
    );
}
