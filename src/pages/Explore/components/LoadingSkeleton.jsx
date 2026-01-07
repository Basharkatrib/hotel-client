import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 sm:space-y-5">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden animate-pulse transition-colors duration-300"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image skeleton */}
            <div className="bg-gray-200 dark:bg-gray-800 h-56 md:h-64 md:w-64 lg:w-72" />

            {/* Content skeleton */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
              {/* Title */}
              <div className="flex justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
                  <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                </div>
              </div>

              {/* Meta */}
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />

              {/* Tags */}
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-24" />
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20" />
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-28" />
              </div>

              {/* Price */}
              <div className="flex justify-between items-end pt-3 mt-auto">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32" />
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

