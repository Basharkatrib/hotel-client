import React from 'react';

const BookingGuestsSelector = ({ guests, maxGuests, onGuestsChange }) => {
  const isExceedingMax = guests > maxGuests;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
        Number of Guests
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onGuestsChange(Math.max(1, guests - 1))}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">−</span>
        </button>
        <div className="flex-1 text-center">
          <div className={`text-2xl font-bold transition-all duration-300 ${isExceedingMax ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            {guests}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
            {guests === 1 ? 'Guest' : 'Guests'}
            {maxGuests && ` (Max: ${maxGuests})`}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onGuestsChange(Math.min(maxGuests, guests + 1))}
          disabled={guests >= maxGuests}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">+</span>
        </button>
      </div>
      {isExceedingMax && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors">
          <p className="text-xs text-red-700 dark:text-red-400 font-medium">
            ⚠️ Maximum {maxGuests} guests allowed. Please reduce the number of guests.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingGuestsSelector;

