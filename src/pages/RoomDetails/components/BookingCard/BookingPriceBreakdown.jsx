import React from 'react';

const BookingPriceBreakdown = ({ pricePerNight, nights, subtotal, serviceFee, taxes, total }) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2 transition-colors">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400 font-medium">${pricePerNight.toFixed(0)} × {nights} nights</span>
        <span className="text-gray-900 dark:text-white font-bold">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400 font-medium">Service fee</span>
        <span className="text-gray-900 dark:text-white font-bold">${serviceFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400 font-medium">Taxes</span>
        <span className="text-gray-900 dark:text-white font-bold">${taxes.toFixed(2)}</span>
      </div>
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-lg text-gray-900 dark:text-white transition-colors">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default BookingPriceBreakdown;











