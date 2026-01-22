import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './components/PaymentForm';
import { useGetBookingDetailsQuery } from '../../services/bookingsApi';
import { FaLock } from 'react-icons/fa';
import { HiOutlineCreditCard } from 'react-icons/hi';
import BookingStepper from '../../components/Booking/BookingStepper';

// Initialize Stripe with your publishable key
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
      <div className="min-h-screen bg-gray-50 dark:bg-background pt-20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background pt-20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Sorry, we couldn't find this booking.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all duration-300 font-bold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pt-24 pb-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookingStepper currentStep={3} />

        <div className="mb-8 mt-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Payment</h1>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FaLock className="text-green-600 dark:text-green-500" />
            <span>Secure payment powered by Stripe</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              <div className="bg-emerald-600 dark:bg-emerald-700 px-6 py-4 flex items-center justify-between transition-all">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <HiOutlineCreditCard className="w-6 h-6" />
                  Secure Payment Details
                </h2>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <FaLock className="text-white w-3 h-3" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Encrypted</span>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <FaLock />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Secure Transaction</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                      Your payment information is processed securely through Stripe. We never store your credit card details on our servers.
                    </p>
                  </div>
                </div>

                <Elements stripe={stripePromise}>
                  <PaymentForm booking={booking} />
                </Elements>

                <div className="mt-8 flex items-center justify-center gap-6 opacity-50 grayscale">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_logo%2C_revised_2009.svg" alt="Stripe" className="h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-24 transition-colors duration-300">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Booking Summary</h2>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{booking.hotel?.name || 'Hotel'}</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 uppercase tracking-wider">{booking.room?.name || 'Room'}</p>
                </div>

                <div className="space-y-4 py-6 border-y border-dashed border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Nights</span>
                    <span className="font-bold text-gray-900 dark:text-white">{booking.total_nights} Nights</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Guests</span>
                    <span className="font-bold text-gray-900 dark:text-white">{booking.guests_count} Guests</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Check-in</span>
                    <span className="font-bold text-gray-900 dark:text-white">{new Date(booking.check_in_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Check-out</span>
                    <span className="font-bold text-gray-900 dark:text-white">{new Date(booking.check_out_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>

                <div className="py-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">${booking.price_per_night} × {booking.total_nights} nights</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${booking.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Service fee</span>
                    <span className="font-medium text-gray-900 dark:text-white">${booking.service_fee}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Taxes</span>
                    <span className="font-medium text-gray-900 dark:text-white">${booking.taxes}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                    <span className="font-bold text-blue-900 dark:text-blue-100">Total Charged</span>
                    <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">${booking.total_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

