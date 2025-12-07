import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './components/PaymentForm';
import { useGetBookingDetailsQuery } from '../../services/bookingsApi';
import { FaLock } from 'react-icons/fa';

// Initialize Stripe with your publishable key
// Replace with your actual Stripe publishable key (test mode)
const stripePromise = loadStripe('pk_test_51PSkbzE656ExER5LkaHr7o82A47aFnB3aYivOTmTnaLwzezGM7gqWnATWHtuxRwKIBR3COMHPGHHW1rEzntn6EOo00Chz1gjl7');

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { booking: locationBooking } = location.state || {};

  const { data: bookingData, isLoading, isError } = useGetBookingDetailsQuery(bookingId, {
    skip: !!locationBooking,
  });

  const booking = locationBooking || bookingData?.data?.booking;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">Sorry, we couldn't find this booking.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaLock className="text-green-600" />
            <span>Secure payment powered by Stripe</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
              
              <Elements stripe={stripePromise}>
                <PaymentForm booking={booking} />
              </Elements>

              {/* Test Card Info */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">Test Mode - Use Test Card</h3>
                <div className="text-sm text-yellow-800 space-y-1">
                  <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
                  <p><strong>Expiry:</strong> Any future date (e.g., 12/34)</p>
                  <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
                  <p><strong>ZIP:</strong> Any 5 digits (e.g., 12345)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">{booking.hotel?.name || 'Hotel'}</p>
                  <p className="text-xs text-gray-600">{booking.room?.name || 'Room'}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Check-in: <span className="font-medium text-gray-900">{new Date(booking.check_in_date).toLocaleDateString()}</span></p>
                  <p className="text-gray-600">Check-out: <span className="font-medium text-gray-900">{new Date(booking.check_out_date).toLocaleDateString()}</span></p>
                  <p className="text-gray-600">Nights: <span className="font-medium text-gray-900">{booking.total_nights}</span></p>
                  <p className="text-gray-600">Guests: <span className="font-medium text-gray-900">{booking.guests_count}</span></p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">${booking.price_per_night} × {booking.total_nights} nights</span>
                  <span className="text-gray-900">${booking.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-gray-900">${booking.service_fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">${booking.taxes}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-600">${booking.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

