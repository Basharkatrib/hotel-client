import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCheckAvailabilityMutation, useCreateBookingMutation } from '../../services/bookingsApi';
import { FaMapMarkerAlt, FaCalendar, FaUsers, FaBed } from 'react-icons/fa';
import { HiOutlineIdentification, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { getImageUrls } from '../../utils/imageHelper';
import { toast } from 'react-toastify';
import BookingStepper from '../../components/Booking/BookingStepper';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, room, checkIn, checkOut, guests, rooms, pricing } = location.state || {};
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize guests array based on guests count
  const [guestsInfo, setGuestsInfo] = useState(() => {
    const count = guests || 1;
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: index === 0 ? (user?.name || '') : '',
      email: index === 0 ? (user?.email || '') : '',
      phone: index === 0 ? '' : '',
    }));
  });

  const handleGuestInfoChange = (index, field, value) => {
    const updatedGuests = [...guestsInfo];
    updatedGuests[index][field] = value;
    setGuestsInfo(updatedGuests);

    // Update main guest info if it's the first guest
    if (index === 0) {
      if (field === 'name') setGuestName(value);
      if (field === 'email') setGuestEmail(value);
      if (field === 'phone') setGuestPhone(value);
    }
  };

  const [checkAvailability] = useCheckAvailabilityMutation();
  const [createBooking] = useCreateBookingMutation();

  useEffect(() => {
    // Redirect if no booking data
    if (!hotel || !room || !checkIn || !checkOut) {
      toast.error('Invalid booking data. Please start again.');
      navigate('/');
      return;
    }

    // Check if user is logged in
    if (!isAuthenticated) {
      toast.info('Please login to continue with your booking.');
      navigate('/auth/login', { state: { from: location } });
      return;
    }

    // Verify availability
    const verifyAvailability = async () => {
      try {
        const result = await checkAvailability({
          room_id: room.id,
          check_in_date: new Date(checkIn).toISOString().split('T')[0],
          check_out_date: new Date(checkOut).toISOString().split('T')[0],
        }).unwrap();

        if (!result.data.available) {
          toast.error('Sorry, this room is no longer available for the selected dates.');
          navigate(-1);
        }
      } catch (error) {
        console.error('Availability check failed:', error);
        toast.error('Failed to verify availability. Please try again.');
      }
    };

    verifyAvailability();
  }, [hotel, room, checkIn, checkOut, isAuthenticated, navigate, location, checkAvailability]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate guests count against room capacity
    if (guests > room.max_guests) {
      toast.error(`This room can accommodate a maximum of ${room.max_guests} guests. Please reduce the number of guests.`);
      setIsLoading(false);
      return;
    }

    // Validate all guests have required info
    const allGuestsValid = guestsInfo.every(guest =>
      guest.name.trim() && guest.email.trim() && guest.phone.trim()
    );

    if (!allGuestsValid) {
      toast.error('Please fill in all guest information');
      setIsLoading(false);
      return;
    }

    try {
      const bookingData = {
        room_id: room.id,
        hotel_id: hotel.id,
        check_in_date: new Date(checkIn).toISOString().split('T')[0],
        check_out_date: new Date(checkOut).toISOString().split('T')[0],
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        guests_count: guests,
        rooms_count: rooms,
        guests_details: guestsInfo,
        special_requests: specialRequests || null,
      };

      const result = await createBooking(bookingData).unwrap();

      toast.success('Booking created successfully!');

      // Navigate to payment page
      navigate(`/payment/${result.data.booking.id}`, {
        state: {
          booking: result.data.booking,
        },
      });
    } catch (error) {
      console.error('Booking creation failed:', error);
      toast.error(error.data?.messages?.[0] || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hotel || !room) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookingStepper currentStep={2} />

        <div className="mb-8 text-center sm:text-left mt-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Confirm Your Booking</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Please review your booking details and provide guest information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Guest Information Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="bg-blue-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <HiOutlineIdentification className="w-6 h-6" />
                    Guest Information
                  </h2>
                </div>

                <div className="p-6 space-y-8">
                  {guestsInfo.map((guest, index) => (
                    <div key={guest.id} className={`${index !== 0 ? 'pt-8 border-t border-gray-100 dark:border-gray-800' : ''}`}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {index === 0 ? 'Primary Guest (Main Contact)' : `Guest ${index + 1}`}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={guest.name}
                            onChange={(e) => handleGuestInfoChange(index, 'name', e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="e.g. John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={guest.email}
                            onChange={(e) => handleGuestInfoChange(index, 'email', e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={guest.phone}
                            onChange={(e) => handleGuestInfoChange(index, 'phone', e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaBed className="text-blue-600 dark:text-blue-400" />
                  Special Requests (Optional)
                </h3>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Tell us about any specific needs or preferences..."
                />
                <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                  <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed">
                    <strong>Note:</strong> Special requests are subject to availability and cannot be guaranteed by the hotel. Some requests may incur additional charges.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group bg-blue-600 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 dark:hover:bg-blue-500 active:scale-[0.98] transition-all disabled:bg-gray-400 dark:disabled:bg-gray-800 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm & Proceed to Payment
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-24 transition-colors duration-300">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Booking Summary</h2>
              </div>

              <div className="p-6">
                {/* Hotel & Room Info */}
                <div className="flex gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 font-bold border border-gray-100 dark:border-gray-800">
                    <img
                      src={getImageUrls(room.images)[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{hotel.name}</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 uppercase tracking-wider">{room.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500" />
                      {hotel.city}, {hotel.country}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 py-6 border-y border-dashed border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium">
                      <FaCalendar className="text-blue-500" />
                      Check-in
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">{new Date(checkIn).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium">
                      <FaCalendar className="text-blue-500" />
                      Check-out
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">{new Date(checkOut).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium">
                      <FaUsers className="text-blue-500" />
                      Guests
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="py-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">${pricing.pricePerNight} × {pricing.nights} nights</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${pricing.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Service fee</span>
                    <span className="font-medium text-gray-900 dark:text-white">${pricing.serviceFee}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Taxes</span>
                    <span className="font-medium text-gray-900 dark:text-white">${pricing.taxes}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                    <span className="font-bold text-blue-900 dark:text-blue-100">Total (USD)</span>
                    <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">${pricing.total}</span>
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

export default BookingConfirmation;

