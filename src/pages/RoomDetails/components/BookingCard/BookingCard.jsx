import React from 'react';
import BookingDatePicker from './BookingDatePicker';
import BookingGuestsSelector from './BookingGuestsSelector';
import BookingAvailabilityStatus from './BookingAvailabilityStatus';
import BookingPriceBreakdown from './BookingPriceBreakdown';

const BookingCard = ({
  room,
  checkIn,
  checkOut,
  guests,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  isCheckingAvailability,
  availabilityStatus,
  onBookNow,
}) => {
  const hasDiscount = room.original_price && room.original_price > room.price_per_night;
  const pricePerNight = Number(room.price_per_night);

  // Calculate pricing
  const checkInDate = checkIn instanceof Date ? checkIn : new Date(checkIn);
  const checkOutDate = checkOut instanceof Date ? checkOut : new Date(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const subtotal = pricePerNight * nights;
  const serviceFee = subtotal * 0.028;
  const taxes = subtotal * 0.0164;
  const totalAmount = subtotal + serviceFee + taxes;

  const isDisabled = !availabilityStatus || guests > room.max_guests || isCheckingAvailability;

  return (
    <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 sticky top-24 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Book This Room</h2>

      {/* Price */}
      <div className="mb-6">
        {hasDiscount && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
              ${Number(room.original_price).toFixed(0)}
            </span>
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs font-bold transition-colors">
              Save {room.discount_percentage}%
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            ${pricePerNight.toFixed(0)}
          </span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">/ night</span>
        </div>
      </div>

      {/* Date Selection */}
      <BookingDatePicker
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckInChange={onCheckInChange}
        onCheckOutChange={onCheckOutChange}
      />

      {/* Guests */}
      <BookingGuestsSelector
        guests={guests}
        maxGuests={room.max_guests}
        onGuestsChange={onGuestsChange}
      />

      {/* Availability Status */}
      <BookingAvailabilityStatus
        isChecking={isCheckingAvailability}
        isAvailable={availabilityStatus}
      />

      {/* Price Breakdown */}
      <BookingPriceBreakdown
        pricePerNight={pricePerNight}
        nights={nights}
        subtotal={subtotal}
        serviceFee={serviceFee}
        taxes={taxes}
        total={totalAmount}
      />

      {/* Book Button */}
      <button
        onClick={onBookNow}
        disabled={isDisabled}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${isDisabled
          ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-600 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
          }`}
      >
        {guests > room.max_guests
          ? `Max ${room.max_guests} Guests`
          : !availabilityStatus
            ? 'Not Available'
            : 'Book Now'}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 font-medium">
        You won't be charged yet
      </p>
    </div>
  );
};

export default BookingCard;

