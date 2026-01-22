import React from 'react';
import HotelCard from './HotelCard';
import LoadingSkeleton from './LoadingSkeleton';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useGetHotelsQuery } from '../../../services/hotelsApi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Build condensed pagination: previous page, current page, next page,
  // first page, last page, with dots between distant ranges.
  const buildPageItems = () => {
    const set = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
    const numbers = Array.from(set)
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);

    const items = [];
    for (let i = 0; i < numbers.length; i += 1) {
      const page = numbers[i];
      if (i > 0 && page - numbers[i - 1] > 1) {
        items.push({ type: 'dots', key: `dots-${numbers[i - 1]}-${page}` });
      }
      items.push({ type: 'page', page, key: `page-${page}` });
    }
    return items;
  };

  const pageItems = buildPageItems();

  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-sm">
      {/* Previous */}
      <button
        type="button"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors ${currentPage === 1
          ? 'opacity-40 cursor-default'
          : 'hover:border-gray-900 dark:hover:border-blue-500'
          }`}
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
      >
        <FaAngleLeft />
      </button>
      {pageItems.map((item) => {
        if (item.type === 'dots') {
          return (
            <span
              key={item.key}
              className="inline-flex h-8 items-center px-1 text-xs text-gray-400"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onPageChange(item.page)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors ${item.page === currentPage
              ? 'border-gray-900 bg-gray-900 text-white dark:bg-blue-600 dark:border-blue-600'
              : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-500'
              }`}
          >
            {item.page}
          </button>
        );
      })}
      {/* Next */}
      <button
        type="button"
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors ${currentPage === totalPages
          ? 'opacity-40 cursor-default'
          : 'hover:border-gray-900 dark:hover:border-blue-500'
          }`}
        aria-label="Next page"
        aria-disabled={currentPage === totalPages}
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

const HotelList = ({
  filters,
  currentPage,
  perPage,
  sortBy,
  sortOrder,
  onPageChange,
  onHotelsChange
}) => {
  // Scroll to top when page changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Build API query params from filters
  const queryParams = {
    page: currentPage,
    per_page: perPage,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  // Add filter params
  if (filters.type && filters.type !== 'any') {
    queryParams.type = filters.type;
  }

  if (filters.city) {
    queryParams.city = filters.city;
  }

  if (filters.checkInDate) {
    queryParams.check_in_date = filters.checkInDate;
  }

  if (filters.checkOutDate) {
    queryParams.check_out_date = filters.checkOutDate;
  }

  if (filters.guests) {
    queryParams.guests = filters.guests;
  }

  if (filters.rooms) {
    queryParams.rooms = filters.rooms;
  }

  if (filters.minPrice > 0) {
    queryParams.min_price = filters.minPrice;
  }

  if (filters.maxPrice < 2000) {
    queryParams.max_price = filters.maxPrice;
  }

  // Add amenity-based filters
  if (filters.selectedAmenities.includes('Air Conditioning')) {
    // Map to backend field if needed
  }

  // Fetch hotels from API
  const { data, isLoading, isError, error } = useGetHotelsQuery(queryParams);

  // Update parent component with current hotels
  React.useEffect(() => {
    if (data?.data?.hotels && onHotelsChange) {
      onHotelsChange(data.data.hotels);
    }
  }, [data, onHotelsChange]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 p-6 text-center">
        <div className="text-red-600 dark:text-red-400 font-semibold mb-2">
          Failed to load hotels
        </div>
        <div className="text-sm text-red-500 dark:text-red-400">
          {error?.data?.messages?.[0] || 'Something went wrong. Please try again.'}
        </div>
      </div>
    );
  }

  const hotels = data?.data?.hotels || [];
  const pagination = data?.data?.pagination || {};

  if (hotels.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card p-12 text-center transition-colors duration-300">
        <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🏨</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No hotels found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {pagination.from || 1} - {pagination.to || hotels.length} of{' '}
          {pagination.total || hotels.length} properties
        </span>
      </div>

      {/* Hotels - Using React.memo optimized cards */}
      {hotels.map((hotel) => (
        <HotelCard key={`hotel-${hotel.id}-${hotel.slug}`} hotel={hotel} />
      ))}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <Pagination
          currentPage={pagination.current_page || 1}
          totalPages={pagination.last_page || 1}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default HotelList;
