import React, { useState } from 'react';
import { useGetRoomsQuery } from '../../services/hotelsApi';
import RoomCard from './components/RoomCard';
import RoomsHeader from './components/RoomsHeader';
import RoomsFilters from './components/RoomsFilters';
import RoomsPagination from './components/RoomsPagination';

const Rooms = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    min_price: '',
    max_price: '',
    has_breakfast: false,
    has_wifi: false,
    has_ac: false,
    has_balcony: false,
    view: '',
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: roomsData, isLoading, error } = useGetRoomsQuery({
    page,
    per_page: 12,
    ...filters,
  });

  const rooms = roomsData?.data?.rooms || [];
  const pagination = roomsData?.data?.pagination || {};

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background pt-20 pb-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background pt-20 pb-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-400">Failed to load rooms. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pt-26 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RoomsHeader totalRooms={pagination.total} />

        <RoomsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center transition-colors duration-300">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No rooms found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>

            <RoomsPagination
              pagination={pagination}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Rooms;

