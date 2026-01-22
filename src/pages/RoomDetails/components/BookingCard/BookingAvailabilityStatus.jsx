import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const BookingAvailabilityStatus = ({ isChecking, isAvailable }) => {
  if (isChecking) {
    return (
      <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center transition-colors">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 font-medium">Checking availability...</p>
      </div>
    );
  }

  if (isAvailable === null) return null;

  return (
    <div
      className={`mb-6 p-3 rounded-lg flex items-center gap-2 transition-colors ${isAvailable
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}
    >
      {isAvailable ? (
        <>
          <FaCheckCircle className="text-green-600 dark:text-green-400" size={20} />
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">Available for selected dates</p>
        </>
      ) : (
        <>
          <FaTimesCircle className="text-red-600 dark:text-red-400" size={20} />
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">Not available for selected dates</p>
        </>
      )}
    </div>
  );
};

export default BookingAvailabilityStatus;











