import React from 'react';
import { IoSearch } from 'react-icons/io5';

const SearchForm = ({ 
  location, 
  checkIn, 
  checkOut, 
  rooms, 
  adults, 
  children,
  onLocationChange,
  onCheckInChange,
  onCheckOutChange
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-4 pt-14 sm:pt-16 lg:pt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-2">
        {/* Location */}
        <div className='col-span-1 sm:col-span-2 pb-3 border-b sm:border-b-0 border-gray-200'>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-0 py-1 text-sm text-gray-600 placeholder:text-gray-400 border-0 focus:outline-none focus:ring-0 bg-transparent"
          />
        </div>

        {/* Check In */}
        <div className="pb-3 border-b sm:border-b-0 sm:border-l border-gray-200 sm:pl-4 col-span-1">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Check In
          </label>
          <input
            type="text"
            placeholder="Add Dates"
            value={checkIn}
            onChange={(e) => onCheckInChange(e.target.value)}
            className="w-full px-0 py-1 text-sm text-gray-600 placeholder:text-gray-400 border-0 focus:outline-none focus:ring-0 bg-transparent"
          />
        </div>

        {/* Check Out */}
        <div className="pb-3 border-b sm:border-b-0 sm:border-l border-gray-200 sm:pl-4 col-span-1">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Check Out
          </label>
          <input
            type="text"
            placeholder="Add Dates"
            value={checkOut}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className="w-full px-0 py-1 text-sm text-gray-600 placeholder:text-gray-400 border-0 focus:outline-none focus:ring-0 bg-transparent"
          />
        </div>

        {/* Rooms and Guests */}
        <div className="pb-3 border-b sm:border-b-0 sm:border-l border-gray-200 sm:pl-4 col-span-1 sm:col-span-2">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Rooms and Guests
          </label>
          <input
            type="text"
            readOnly
            value={`${rooms} rooms, ${adults} adults ,${children} children`}
            className="w-full px-0 py-1 text-sm text-gray-600 border-0 focus:outline-none bg-transparent cursor-pointer"
          />
        </div>

        {/* Search Button */}
        <button className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 sm:py-2.5 rounded-lg transition-colors shadow-lg col-span-1">
          <IoSearch className="text-xl" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default SearchForm;

