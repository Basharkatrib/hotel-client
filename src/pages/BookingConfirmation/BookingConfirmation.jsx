import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCheckAvailabilityMutation, useCreateBookingMutation } from '../../services/bookingsApi';
import { FaMapMarkerAlt, FaCalendar, FaUsers, FaBed } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, room, checkIn, checkOut, guests, rooms, pricing } = location.state || {};
  const { user, token } = useSelector((state) => state.auth);

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
    if (!token) {
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
  }, [hotel, room, checkIn, checkOut, token, navigate, location, checkAvailability]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

<<<<<<< HEAD
    // Validate guests count against room capacity
    if (guests > room.max_guests) {
      toast.error(`This room can accommodate a maximum of ${room.max_guests} guests. Please reduce the number of guests.`);
      setIsLoading(false);
      return;
    }

=======
>>>>>>> origin/j-branch
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirm Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Guest Information Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Guest Information</h2>
              
              <div className="space-y-6">
                {guestsInfo.map((guest, index) => (
                  <div key={guest.id} className="pb-6 border-b border-gray-200 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Guest {index + 1} {index === 0 && '(Primary Contact)'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={guest.name}
                          onChange={(e) => handleGuestInfoChange(index, 'name', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={guest.email}
                          onChange={(e) => handleGuestInfoChange(index, 'email', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={guest.phone}
                          onChange={(e) => handleGuestInfoChange(index, 'phone', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Any special requests or requirements?"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Important:</strong> Guest names must match the valid ID which will be used at check-in.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

              {/* Hotel Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt className="text-blue-600" />
                  {hotel.city}, {hotel.country}
                </p>
              </div>

              {/* Room Info */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaBed />
                  <span>{room.name}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="mb-4 pb-4 border-b border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaCalendar />
                    Check-in
                  </span>
                  <span className="font-medium">{new Date(checkIn).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaCalendar />
                    Check-out
                  </span>
                  <span className="font-medium">{new Date(checkOut).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaUsers />
                    Guests
                  </span>
                  <span className="font-medium">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">${pricing.pricePerNight} × {pricing.nights} nights</span>
                  <span className="text-gray-900">${pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-gray-900">${pricing.serviceFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">${pricing.taxes}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-gray-200 flex justify-between font-semibold text-lg">
                <span>Total (USD)</span>
                <span>${pricing.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

