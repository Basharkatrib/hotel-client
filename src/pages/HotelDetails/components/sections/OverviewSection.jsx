import React from 'react';

const OverviewSection = ({ hotel }) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-gray-700 leading-relaxed">
            {hotel.description || 'No description available.'}
          </div>
          
          {/* Hotel Info */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-500 mb-1">Hotel size</div>
              <div className="font-semibold text-gray-900">
                {hotel.available_rooms || 0} rooms
              </div>
            </div>
            
            {hotel.room_size && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Room size</div>
                <div className="font-semibold text-gray-900">
                  {hotel.room_size} m²
                </div>
              </div>
            )}
            
            {hotel.distance_from_center && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Distance from centre</div>
                <div className="font-semibold text-gray-900">
                  {hotel.distance_from_center} km
                </div>
              </div>
            )}
            
            {hotel.distance_from_beach && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Distance from beach</div>
                <div className="font-semibold text-gray-900">
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

