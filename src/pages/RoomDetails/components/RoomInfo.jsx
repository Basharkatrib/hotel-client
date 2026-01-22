import React from 'react';
import { FaMapMarkerAlt, FaBed, FaUsers, FaHeart, FaRegHeart } from 'react-icons/fa';

const RoomInfo = ({ room, isFavorited, onFavoriteToggle }) => {
  // Build bed description
  const beds = [];
  if (room.single_beds > 0) beds.push(`${room.single_beds} Single`);
  if (room.double_beds > 0) beds.push(`${room.double_beds} Double`);
  if (room.king_beds > 0) beds.push(`${room.king_beds} King`);
  if (room.queen_beds > 0) beds.push(`${room.queen_beds} Queen`);

  const hasDiscount = room.original_price && room.original_price > room.price_per_night;

  return (
    <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{room.name}</h1>
          {room.hotel && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" size={14} />
              <span className="font-semibold text-blue-600 dark:text-blue-400">{room.hotel.name}</span>
              <span>•</span>
              <span>{room.hotel.city || room.hotel.address}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onFavoriteToggle && (
            <button
              onClick={onFavoriteToggle}
              className={`p-2 rounded-full transition-colors ${isFavorited ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorited ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </button>
          )}
          {hasDiscount && (
            <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {room.discount_percentage}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Room Type & Size */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium capitalize">
          {room.type}
        </span>
        {room.size && (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
            {room.size} m²
          </span>
        )}
        {room.view && room.view !== 'none' && (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium capitalize">
            {room.view} View
          </span>
        )}
      </div>

      {/* Beds & Guests */}
      <div className="flex items-center gap-6 mb-4 text-gray-600 dark:text-gray-400">
        {beds.length > 0 && (
          <div className="flex items-center gap-2">
            <FaBed className="text-gray-400 dark:text-gray-500" size={16} />
            <span>{beds.join(', ')}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <FaUsers className="text-gray-400 dark:text-gray-500" size={16} />
          <span>Up to {room.max_guests} guests</span>
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;

