import React from 'react';

const OverviewSection = ({ hotel }) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {hotel.description || 'No description available.'}
          </div>

          {/* Hotel Info */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hotel size</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {hotel.available_rooms || 0} rooms
              </div>
            </div>

            {hotel.room_size && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Room size</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {hotel.room_size} m²
                </div>
              </div>
            )}

            {hotel.distance_from_center && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Distance from centre</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {hotel.distance_from_center} km
                </div>
              </div>
            )}

            {hotel.distance_from_beach && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Distance from beach</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {hotel.distance_from_beach} m
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default OverviewSection;


