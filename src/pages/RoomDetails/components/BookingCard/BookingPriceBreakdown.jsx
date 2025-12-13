import React from 'react';

const BookingPriceBreakdown = ({ pricePerNight, nights, subtotal, serviceFee, taxes, total }) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">${pricePerNight.toFixed(0)} × {nights} nights</span>
        <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Service fee</span>
        <span className="text-gray-900 font-medium">${serviceFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Taxes</span>
        <span className="text-gray-900 font-medium">${taxes.toFixed(2)}</span>
      </div>
      <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default BookingPriceBreakdown;





