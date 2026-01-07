import React from 'react';
import { IoSearch, IoCalendarOutline, IoPeople } from 'react-icons/io5';

const SearchForm = ({
  location,
  checkIn,
  checkOut,
  rooms,
  adults,
  children,
  onLocationChange,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({
        location,
        checkIn,
        checkOut,
        rooms,
        adults,
        children,
      });
    }
  };

  return (
    <form
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 px-4 py-4 sm:px-6 sm:py-4 transition-all duration-300"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-4 lg:gap-5">
        {/* Location */}
        <div className="grid col-span-1">
          <label className="block text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-0 py-1.5 sm:py-1 text-sm text-gray-600 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-0 focus:outline-none focus:ring-0 bg-transparent"
          />
        </div>

        {/* Check In */}
        <div className="col-span-1">
          <label className="block text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">
            Check In
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 bg-white dark:bg-gray-800 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
            <IoCalendarOutline className="text-gray-400 dark:text-gray-500 text-lg" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => onCheckInChange(e.target.value)}
              className="w-full text-sm text-gray-700 dark:text-gray-200 border-0 focus:outline-none focus:ring-0 bg-transparent"
            />
          </div>
        </div>

        {/* Check Out */}
        <div className="col-span-1">
          <label className="block text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">
            Check Out
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 bg-white dark:bg-gray-800 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
            <IoCalendarOutline className="text-gray-400 dark:text-gray-500 text-lg" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => onCheckOutChange(e.target.value)}
              className="w-full text-sm text-gray-700 dark:text-gray-200 border-0 focus:outline-none focus:ring-0 bg-transparent"
            />
          </div>
        </div>

        {/* Guests (number input) */}
        <div className="col-span-1">
          <label className="block text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">
            Guests
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 bg-white dark:bg-gray-800 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
            <IoPeople className="text-gray-400 dark:text-gray-500 text-lg" />
            <input
              type="number"
              min={1}
              value={adults}
              onChange={(e) =>
                onGuestsChange?.(Number.isNaN(Number(e.target.value)) ? 1 : Number(e.target.value))
              }
              placeholder="Number of guests"
              className="w-full text-sm text-gray-700 dark:text-gray-200 border-0 focus:outline-none focus:ring-0 bg-transparent"
            />
          </div>
        </div>


        {/* Search Button */}
        <button
          type="submit"
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-2xl transition-colors shadow-lg sm:self-stretch"
          aria-label="Search for accommodations"
        >
          <IoSearch className="text-lg sm:text-xl" aria-hidden="true" />
          <span className="text-sm sm:text-base">Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchForm;

