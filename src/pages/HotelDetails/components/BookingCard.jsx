import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendar, FaUsers } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInDays, addDays } from 'date-fns';
import { toast } from 'react-toastify';

const BookingCard = ({ hotel, selectedRoom = null, onDatesChange }) => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(addDays(new Date(), 1));
  const [checkOut, setCheckOut] = useState(addDays(new Date(), 6));
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);

  // Update parent component when dates change
  useEffect(() => {
    if (onDatesChange) {
      onDatesChange({
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: adults,
      });
    }
  }, [checkIn, checkOut, adults, onDatesChange]);

  const nights = differenceInDays(checkOut, checkIn);
  const pricePerNight = selectedRoom ? Number(selectedRoom.price_per_night) : Number(hotel.price_per_night);
  const subtotal = pricePerNight * nights;
  const serviceFee = subtotal * 0.028;
  const taxes = subtotal * 0.0164;
  const totalPrice = subtotal + serviceFee + taxes;

  const handleShowRooms = () => {
    // Validate dates
    if (nights <= 0) {
      toast.error('Check-out date must be after check-in date.');
      return;
    }

    if (nights > 30) {
      toast.warning('Maximum booking duration is 30 nights.');
      return;
    }

    // Scroll to rooms section
    const roomsSection = document.getElementById('rooms-section');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
      toast.success(`Showing available rooms for ${nights} night${nights > 1 ? 's' : ''}`);
    }
  };

  const handleBookNow = () => {
    if (!selectedRoom) {
      toast.info('Please select a room first.');
      handleShowRooms();
      return;
    }

    // Validate dates
    if (nights <= 0) {
      toast.error('Check-out date must be after check-in date.');
      return;
    }

    // Navigate to booking confirmation with booking data
    navigate('/booking/confirm', {
      state: {
        hotel,
        room: selectedRoom,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: adults,
        rooms,
        pricing: {
          nights,
          pricePerNight,
          subtotal: subtotal.toFixed(2),
          serviceFee: serviceFee.toFixed(2),
          taxes: taxes.toFixed(2),
          total: totalPrice.toFixed(2),
        },
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 transition-colors duration-300">
      {/* Price */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prices:</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          From ${pricePerNight.toFixed(0)} to ${(pricePerNight * 1.5).toFixed(0)}
        </div>
      </div>

      {/* Check-in/out */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center dark:text-gray-400 gap-2 text-xs text-gray-600 mb-1">
              <FaCalendar size={12} />
              Check-in
            </label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              minDate={new Date()}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              dateFormat="MMM dd, yyyy"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex dark:text-gray-400 items-center gap-2 text-xs text-gray-600 mb-1">
              <FaCalendar size={12} />
              Check-out
            </label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              minDate={addDays(checkIn, 1)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              dateFormat="MMM dd, yyyy"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="text-xs dark:text-gray-400 text-gray-600 text-center">
          {nights} {nights === 1 ? 'night' : 'nights'}
        </div>
      </div>

      {/* Rooms and Guests */}
      <div className="mb-6">
        <label className="flex dark:text-gray-400 items-center gap-2 text-xs text-gray-600 mb-2">
          <FaUsers size={12} />
          Number of Guests
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAdults(Math.max(1, adults - 1))}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-xl font-semibold text-gray-700 dark:text-gray-200">−</span>
          </button>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{adults}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {adults === 1 ? 'Guest' : 'Guests'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAdults(adults + 1)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-xl font-semibold text-gray-700 dark:text-gray-200">+</span>
          </button>
        </div>
        {selectedRoom && adults > selectedRoom.max_guests && (
          <p className="text-xs text-red-600 mt-2">
            This room can accommodate maximum {selectedRoom.max_guests} guests
          </p>
        )}
      </div>

      {/* Price Summary */}
      {selectedRoom && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-2 border border-transparent dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">${pricePerNight} × {nights} nights</span>
            <span className="text-gray-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Service fee</span>
            <span className="text-gray-900 dark:text-white font-medium">${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Taxes</span>
            <span className="text-gray-900 dark:text-white font-medium">${taxes.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}


      {/* Show Rooms / Book Now Button */}
      <button
        onClick={selectedRoom ? handleBookNow : handleShowRooms}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
      >
        {selectedRoom ? 'Book Now' : 'Show Rooms'}
      </button>

      {/* Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        You won't be charged yet
      </div>
    </div>
  );
};

export default BookingCard;


