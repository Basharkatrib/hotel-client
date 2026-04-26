import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './components/PaymentForm';
import { useGetBookingDetailsQuery } from '../../services/bookingsApi';
import { FaLock, FaShieldAlt, FaRegCalendarAlt, FaUserFriends, FaMoon } from 'react-icons/fa';
import { HiOutlineCreditCard, HiOutlineBadgeCheck } from 'react-icons/hi';
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium tracking-wide animate-pulse">Preparing secure checkout...</p>
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl shadow-blue-900/5 max-w-md w-full mx-4">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">We couldn't locate the details for this reservation. It may have expired or been completed.</p>
          <button
            onClick={() => navigate('/')}
            className="cursor-pointer w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all duration-300 font-bold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookingStepper currentStep={3} />

        <div className="mb-10 mt-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Complete Payment</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center sm:justify-start gap-2">
              <FaShieldAlt className="text-emerald-500" />
              256-bit SSL encrypted secure checkout
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Payment Form Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              {/* Modern Header */}
              <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-transparent via-blue-50/30 to-transparent dark:via-blue-900/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <HiOutlineCreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wide">
                  <FaLock className="w-3 h-3" />
                  Secure
                </div>
              </div>

              <div className="p-8">
                {/* Trust Banner */}
                <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100/50 dark:border-blue-800/50 flex items-start gap-4">
                  <div className="mt-1 text-blue-500 dark:text-blue-400">
                    <HiOutlineBadgeCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Trusted & Secure Transaction</h4>
                    <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-1 leading-relaxed">
                      Your payment information is tokenized and processed securely by Stripe. We never see or store your full card details.
                    </p>
                  </div>
                </div>

                <Elements stripe={stripePromise}>
                  <PaymentForm booking={booking} />
                </Elements>

                {/* Supported Methods */}
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wider">Supported Payment Methods</p>
                  <div className="flex items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_logo%2C_revised_2009.svg" alt="Stripe" className="h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-28 transition-colors duration-300">
              {/* Hotel Header / Fake Image */}
              <div className="h-32 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"></div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'%3E%3Ccircle cx=\\'3\\' cy=\\'3\\' r=\\'3\\'/%3E%3Ccircle cx=\\'13\\' cy=\\'13\\' r=\\'3\\'/%3E%3C/g%3E%3C/svg%3E')" }}></div>
                <div className="absolute bottom-0 left-0 p-6 text-white w-full bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="font-bold text-xl leading-tight truncate">{booking.hotel?.name || 'Vayka Hotel'}</h3>
                  <p className="text-sm text-white/90 font-medium truncate mt-0.5">{booking.room?.name || 'Deluxe Room'}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-[11px] uppercase tracking-wider font-bold mb-1">
                      <FaRegCalendarAlt /> Check-in
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                      {new Date(booking.check_in_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-[11px] uppercase tracking-wider font-bold mb-1">
                      <FaRegCalendarAlt /> Check-out
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                      {new Date(booking.check_out_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 mb-6 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FaMoon className="text-blue-500" />
                    <span className="font-semibold">{booking.total_nights} Nights</span>
                  </div>
                  <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FaUserFriends className="text-blue-500" />
                    <span className="font-semibold">{booking.guests_count} Guests</span>
                  </div>
                </div>

                {/* Receipt lines */}
                <div className="space-y-3.5 pt-6 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">${booking.price_per_night} × {booking.total_nights} nights</span>
                    <span className="font-medium text-gray-900 dark:text-white">${booking.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Service fee</span>
                    <span className="font-medium text-gray-900 dark:text-white">${booking.service_fee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Taxes & fees</span>
                    <span className="font-medium text-gray-900 dark:text-white">${booking.taxes}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-end bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent -mx-6 px-6 py-5 border-l-4 border-blue-600">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Total Price</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Includes all taxes</p>
                    </div>
                    <span className="font-black text-3xl text-blue-600 dark:text-blue-400">
                      ${booking.total_amount}
                    </span>
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

