import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const BookingAvailabilityStatus = ({ isChecking, isAvailable }) => {
  if (isChecking) {
    return (
      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-blue-700 mt-2">Checking availability...</p>
      </div>
    );
  }

  if (isAvailable === null) return null;

  return (
    <div
      className={`mb-6 p-3 rounded-lg flex items-center gap-2 ${
        isAvailable
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      }`}
    >
      {isAvailable ? (
        <>
          <FaCheckCircle className="text-green-600" size={20} />
          <p className="text-sm text-green-700 font-medium">Available for selected dates</p>
        </>
      ) : (
        <>
          <FaTimesCircle className="text-red-600" size={20} />
          <p className="text-sm text-red-700 font-medium">Not available for selected dates</p>
        </>
      )}
    </div>
  );
};

export default BookingAvailabilityStatus;


