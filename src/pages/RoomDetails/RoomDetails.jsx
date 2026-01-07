import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRoomQuery } from '../../services/hotelsApi';
import { useCheckAvailabilityMutation } from '../../services/bookingsApi';
import { useCheckFavoriteQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../services/favoritesApi';
import { useSelector } from 'react-redux';
import { differenceInDays, addDays } from 'date-fns';
import { getImageUrls } from '../../utils/imageHelper';
import { toast } from 'react-toastify';
import RoomDetailsHeader from './components/RoomDetailsHeader';
import RoomImageGallery from './components/RoomImageGallery';
import RoomInfo from './components/RoomInfo';
import RoomDescription from './components/RoomDescription';
import RoomAmenities from './components/RoomAmenities';
import RoomReviews from './components/RoomReviews';
import BookingCard from './components/BookingCard/BookingCard';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [checkIn, setCheckIn] = useState(addDays(new Date(), 1));
  const [checkOut, setCheckOut] = useState(addDays(new Date(), 6));
  const [guests, setGuests] = useState(2);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);

  const { data: roomData, isLoading, error } = useGetRoomQuery(id);
  const [checkAvailability] = useCheckAvailabilityMutation();

  const room = roomData?.data?.room;
  const images = room ? getImageUrls(room.images) : [];

  // Check if room is favorited
  const { data: favoriteData } = useCheckFavoriteQuery(
    { favoritable_type: 'room', favoritable_id: room?.id },
    { skip: !isAuthenticated || !room?.id }
  );

  const [isFavorited, setIsFavorited] = useState(false);
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  useEffect(() => {
    if (favoriteData?.data?.is_favorited) {
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [favoriteData]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add to favorites');
      navigate('/auth/login', { state: { from: `/room/${id}` } });
      return;
    }

    if (!room?.id) return;

    try {
      if (isFavorited) {
        await removeFromFavorites({
          favoritable_type: 'room',
          favoritable_id: room.id,
        }).unwrap();
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites({
          favoritable_type: 'room',
          favoritable_id: room.id,
        }).unwrap();
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.data?.messages?.[0] || 'Failed to update favorites');
    }
  };

  useEffect(() => {
    if (room && checkIn && checkOut) {
      // Reset availability status when dates or guests change
      setAvailabilityStatus(null);
      checkRoomAvailability();
    }
  }, [room, checkIn, checkOut, guests]);

  const checkRoomAvailability = async () => {
    if (!room || !checkIn || !checkOut) return;

    // Validate guests count before checking availability
    if (guests > room.max_guests) {
      setAvailabilityStatus(false);
      toast.error(`This room can accommodate a maximum of ${room.max_guests} guests.`);
      return;
    }

    setIsCheckingAvailability(true);
    try {
      const result = await checkAvailability({
        room_id: room.id,
        check_in_date: checkIn.toISOString().split('T')[0],
        check_out_date: checkOut.toISOString().split('T')[0],
        guests_count: guests,
      }).unwrap();

      setAvailabilityStatus(result.data.available);
    } catch (error) {
      console.error('Availability check failed:', error);
      const errorMessage = error.data?.messages?.[0] || 'Failed to check availability.';
      toast.error(errorMessage);
      setAvailabilityStatus(false);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.info('Please login to continue with your booking.');
      navigate('/auth/login', { state: { from: `/room/${id}` } });
      return;
    }

    if (!availabilityStatus) {
      toast.error('This room is not available for the selected dates.');
      return;
    }

    const nights = differenceInDays(checkOut, checkIn);
    const pricePerNight = Number(room.price_per_night);
    const subtotal = pricePerNight * nights;
    const serviceFee = subtotal * 0.028;
    const taxes = subtotal * 0.0164;
    const totalAmount = subtotal + serviceFee + taxes;

    navigate('/booking/confirm', {
      state: {
        hotel: {
          id: room.hotel?.id || room.hotel_id,
          name: room.hotel?.name || 'Hotel',
          image: images[0],
          location: `${room.hotel?.city || ''}, ${room.hotel?.country || ''}`,
        },
        room: {
          id: room.id,
          name: room.name,
          type: room.type,
          price_per_night: pricePerNight,
          images: room.images,
        },
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: guests,
        rooms: 1,
        pricing: {
          nights,
          pricePerNight,
          subtotal: subtotal.toFixed(2),
          serviceFee: serviceFee.toFixed(2),
          taxes: taxes.toFixed(2),
          total: totalAmount.toFixed(2),
        },
      },
    });
  };

  const handleCheckInChange = (date) => {
    setCheckIn(date);
    if (date >= checkOut) {
      setCheckOut(addDays(date, 1));
    }
  };

  const handleCheckOutChange = (date) => {
    setCheckOut(date);
  };

  const handleGuestsChange = (newGuests) => {
    if (newGuests > room?.max_guests) {
      toast.warning(`This room can accommodate a maximum of ${room.max_guests} guests.`);
      return;
    }
    setGuests(newGuests);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-400">Failed to load rooms. Please try again later.</p>
            <button
              onClick={() => navigate('/rooms')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Rooms
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RoomDetailsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Room Details */}
          <div className="lg:col-span-2 space-y-6">
            <RoomImageGallery images={images} roomName={room.name} />
            <RoomInfo
              room={room}
              isFavorited={isFavorited}
              onFavoriteToggle={handleFavoriteToggle}
            />
            <RoomDescription description={room.description} />
            <RoomAmenities room={room} />
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard
              room={room}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onCheckInChange={handleCheckInChange}
              onCheckOutChange={handleCheckOutChange}
              onGuestsChange={handleGuestsChange}
              isCheckingAvailability={isCheckingAvailability}
              availabilityStatus={availabilityStatus}
              onBookNow={handleBookNow}
            />
          </div>
        </div>

        {/* Reviews Section - Full Width */}
        <div className="mt-8">
          <RoomReviews room={room} />
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

