import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMyBookingsQuery,
  useCancelBookingMutation,
} from "../../services/bookingsApi";
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaBed, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageHelper";

const MyBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [bookingToCancel, setBookingToCancel] = useState(null); // holds the booking object, or null

  const {
    data: bookingsData,
    isLoading,
    refetch,
  } = useGetMyBookingsQuery({
    status: activeTab === "all" ? undefined : activeTab,
    page,
    per_page: 10,
  });

  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();

  const bookings = bookingsData?.data?.bookings || [];
  const pagination = bookingsData?.data?.pagination || {};

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
  };

  const closeCancelModal = () => {
    if (isCancelling) return; // don't allow closing mid-request
    setBookingToCancel(null);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      const response = await cancelBooking(bookingToCancel.id).unwrap();
      toast.success(
        response.messages?.[0] || "Booking cancelled successfully.",
      );
      setBookingToCancel(null);
      refetch();
    } catch (error) {
      toast.error(
        error.data?.messages?.[0] ||
          "Failed to cancel booking. Please try again or contact support.",
      );
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-400",
        label: "Pending",
      },
      confirmed: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-400",
        label: "Confirmed",
      },
      cancelled: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-400",
        label: "Cancelled",
      },
      completed: {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-800 dark:text-gray-300",
        label: "Completed",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${config.bg} ${config.text} border border-transparent dark:border-current/10 transition-colors duration-300`}
      >
        {config.label}
      </span>
    );
  };

  const tabs = [
    { id: "all", label: "All Bookings" },
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
    { id: "cancelled", label: "Cancelled" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background pt-20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-background border border-gray-200 dark:border-gray-800 p-4 sm:p-6 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        My Bookings
      </h1>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 transition-colors duration-300">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 dark:bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center transition-colors duration-300">
          <div className="text-6xl mb-4">🏨</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No bookings found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {activeTab === "all"
              ? "You haven't made any bookings yet."
              : `You don't have any ${activeTab} bookings.`}
          </p>
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Explore Hotels
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-card rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-transparent dark:border-gray-700"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Hotel Image */}
                <div className="flex-shrink-0">
                  <img
                    src={getImageUrl(booking.hotel?.images?.[0])}
                    alt={booking.hotel?.name}
                    className="w-full lg:w-48 h-32 object-cover rounded-lg border border-gray-100 dark:border-gray-700"
                  />
                </div>
                {/* Booking Details */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {booking.hotel?.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 font-medium">
                        <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
                        {booking.hotel?.city}, {booking.hotel?.country}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FaBed className="text-gray-400 dark:text-gray-500" />
                      <span>{booking.room?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FaCalendar className="text-gray-400 dark:text-gray-500" />
                      <span>
                        {new Date(booking.check_in_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FaCalendar className="text-gray-400 dark:text-gray-500" />
                      <span>
                        {new Date(booking.check_out_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FaUsers className="text-gray-400 dark:text-gray-500" />
                      <span className="font-bold dark:text-white">
                        {booking.guests_count}{" "}
                        {booking.guests_count === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${booking.total_amount}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4 sm:mt-0">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => navigate(`/payment/${booking.id}`)}
                          className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Complete Payment
                        </button>
                      )}
                      <button
                        onClick={() =>
                          navigate(`/payment/success/${booking.id}`)
                        }
                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        View Details
                      </button>
                      {(booking.status === "pending" ||
                        booking.status === "confirmed") && (
                        <button
                          onClick={() => openCancelModal(booking)}
                          className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="cursor-pointer px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.last_page}
            className="cursor-pointer px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onClick={closeCancelModal}
        >
          <div
            className="bg-white dark:bg-card w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-[scaleIn_0.15s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Cancel this booking?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You're about to cancel your reservation at{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {bookingToCancel.hotel?.name}
                    </span>
                    . This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-5 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <FaCalendar className="text-gray-400 dark:text-gray-500" />
                    Check-in
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {new Date(bookingToCancel.check_in_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <FaCalendar className="text-gray-400 dark:text-gray-500" />
                    Check-out
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {new Date(bookingToCancel.check_out_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${bookingToCancel.total_amount}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={closeCancelModal}
                disabled={isCancelling}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancelBooking}
                disabled={isCancelling}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;