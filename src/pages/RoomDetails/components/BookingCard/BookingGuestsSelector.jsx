import React from 'react';

const BookingGuestsSelector = ({ guests, maxGuests, onGuestsChange }) => {
  const isExceedingMax = guests > maxGuests;
  
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Number of Guests
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onGuestsChange(Math.max(1, guests - 1))}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl font-semibold text-gray-700">−</span>
        </button>
        <div className="flex-1 text-center">
          <div className={`text-2xl font-bold ${isExceedingMax ? 'text-red-600' : 'text-gray-900'}`}>
            {guests}
          </div>
          <div className="text-xs text-gray-500">
            {guests === 1 ? 'Guest' : 'Guests'}
            {maxGuests && ` (Max: ${maxGuests})`}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onGuestsChange(Math.min(maxGuests, guests + 1))}
          disabled={guests >= maxGuests}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xl font-semibold text-gray-700">+</span>
        </button>
      </div>
      {isExceedingMax && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700 font-medium">
            ⚠️ Maximum {maxGuests} guests allowed. Please reduce the number of guests.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingGuestsSelector;

