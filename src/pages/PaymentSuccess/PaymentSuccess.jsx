import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGetBookingDetailsQuery } from '../../services/bookingsApi';
import { FaCheckCircle, FaCalendar, FaMapMarkerAlt, FaUsers, FaEnvelope, FaPhone } from 'react-icons/fa';

const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { booking: locationBooking } = location.state || {};

  const { data: bookingData, isLoading } = useGetBookingDetailsQuery(bookingId, {
    skip: !!locationBooking,
  });

  const booking = locationBooking || bookingData?.data?.booking;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">Sorry, we couldn't find this booking.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-transparent dark:border-gray-800 p-8 mb-6 text-center transition-colors duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <FaCheckCircle className="text-green-600 dark:text-green-400 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 font-medium">
            Your booking has been confirmed
          </p>
          <div className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors">
            <p className="text-sm text-gray-600 dark:text-gray-400">Booking ID</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">#{booking.id}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-transparent dark:border-gray-800 p-6 mb-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Booking Details</h2>

          {/* Hotel & Room */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
              {booking.hotel?.name || 'Hotel'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2 font-medium">
              <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
              {booking.hotel?.city}, {booking.hotel?.country}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Room: <span className="font-bold dark:text-white">{booking.room?.name || 'Room'}</span>
            </p>
          </div>

          {/* Dates & Guests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2 font-medium">
                <FaCalendar className="text-blue-600 dark:text-blue-400" />
                <span>Check-in</span>
              </div>
              <p className="text-gray-900 dark:text-white font-bold">
                {new Date(booking.check_in_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2 font-medium">
                <FaCalendar className="text-blue-600 dark:text-blue-400" />
                <span>Check-out</span>
              </div>
              <p className="text-gray-900 dark:text-white font-bold">
                {new Date(booking.check_out_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800 transition-colors font-medium">
            <FaUsers className="text-blue-600 dark:text-blue-400" />
            <span>
              {booking.total_nights} {booking.total_nights === 1 ? 'night' : 'nights'} • {booking.guests_count} {booking.guests_count === 1 ? 'guest' : 'guests'}
            </span>
          </div>

          {/* Guest Information */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Guest Information</h3>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-bold">Name:</span> {booking.guest_name}
              </p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                {booking.guest_email}
              </p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FaPhone className="text-gray-400 dark:text-gray-500" />
                {booking.guest_phone}
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700 dark:text-gray-300 font-medium">
                <span>${booking.price_per_night} × {booking.total_nights} nights</span>
                <span className="font-bold dark:text-white">${booking.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300 font-medium">
                <span>Service fee</span>
                <span className="font-bold dark:text-white">${booking.service_fee}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300 font-medium">
                <span>Taxes</span>
                <span className="font-bold dark:text-white">${booking.taxes}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300">
              <span>Total Paid</span>
              <span className="text-green-600 dark:text-green-400">${booking.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 transition-colors">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>📧 Confirmation email sent!</strong> We've sent a confirmation email to <strong>{booking.guest_email}</strong> with all the booking details.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

