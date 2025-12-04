import React, { useState } from 'react';
import { FaCalendar, FaUsers } from 'react-icons/fa';

const BookingCard = ({ hotel }) => {
  const [checkIn, setCheckIn] = useState('08/14/2025');
  const [checkOut, setCheckOut] = useState('08/19/2025');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);

  const nights = 5; // Calculate from dates
  const pricePerNight = Number(hotel.price_per_night);
  const totalPrice = pricePerNight * nights;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
      {/* Price */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-1">Prices:</div>
        <div className="text-2xl font-bold text-gray-900">
          From ${pricePerNight.toFixed(0)} to ${(pricePerNight * 1.5).toFixed(0)}
        </div>
      </div>

      {/* Check-in/out */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <FaCalendar size={12} />
              Check-in
            </label>
            <input
              type="text"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <FaCalendar size={12} />
              Check-out
            </label>
            <input
              type="text"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Rooms and Guests */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <FaUsers size={12} />
          Rooms and Guests
        </label>
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
          {rooms} room, {adults} adults
        </div>
      </div>

      {/* Show Rooms Button */}
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4">
        Show Rooms
      </button>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center">
        You won't be charged yet
      </div>
    </div>
  );
};

export default BookingCard;


