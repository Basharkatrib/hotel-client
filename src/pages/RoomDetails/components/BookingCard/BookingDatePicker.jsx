import React from 'react';
import { FaCalendar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, differenceInDays } from 'date-fns';

const BookingDatePicker = ({ checkIn, checkOut, onCheckInChange, onCheckOutChange }) => {
  // Ensure dates are Date objects
  const checkInDate = checkIn instanceof Date ? checkIn : new Date(checkIn);
  const checkOutDate = checkOut instanceof Date ? checkOut : new Date(checkOut);
  const nights = differenceInDays(checkOutDate, checkInDate);

  return (
    <div className="mb-6 space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
          <FaCalendar size={14} className="text-blue-600 dark:text-blue-400" />
          Check-in
        </label>
        <DatePicker
          selected={checkIn}
          onChange={onCheckInChange}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          dateFormat="MM/dd/yyyy"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
          <FaCalendar size={14} className="text-blue-600 dark:text-blue-400" />
          Check-out
        </label>
        <DatePicker
          selected={checkOut}
          onChange={onCheckOutChange}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={addDays(checkIn, 1)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          dateFormat="MM/dd/yyyy"
        />
      </div>
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">
        {nights} {nights === 1 ? 'night' : 'nights'}
      </div>
    </div>
  );
};

export default BookingDatePicker;

