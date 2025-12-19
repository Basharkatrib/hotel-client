import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetHotelQuery, useGetRoomsQuery } from '../../services/hotelsApi';
import { useCheckFavoriteQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../services/favoritesApi';
import { FaStar, FaMapMarkerAlt, FaShare } from 'react-icons/fa';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { toast } from 'react-toastify';
import ImageGallery from './components/ImageGallery';
import BookingCard from './components/BookingCard';
import OverviewSection from './sections/OverviewSection';
import AmenitiesSection from './sections/AmenitiesSection';
import LocationSection from './sections/LocationSection';
import RoomsSection from './sections/RoomsSection';
import ReviewsSection from './sections/ReviewsSection';
import '../../index.css';

const HotelDetails = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMobileBookingOpen, setIsMobileBookingOpen] = useState(false);
  
  // Booking state to share between BookingCard and RoomsSection
  const [bookingDates, setBookingDates] = useState({
    checkIn: new Date(Date.now() + 86400000).toISOString(),
    checkOut: new Date(Date.now() + 86400000 * 6).toISOString(),
    guests: 2,
  });

  // Refs for scrolling
  const overviewRef = useRef(null);
  const amenitiesRef = useRef(null);
  const locationRef = useRef(null);
  const roomsRef = useRef(null);
  const reviewsRef = useRef(null);

  // Fetch hotel details by slug
  const { data: hotelData, isLoading: hotelLoading, isError: hotelError } = useGetHotelQuery(slug);
  
  const hotelId = hotelData?.data?.hotel?.id;
  
  // Check if hotel is favorited
  const { data: favoriteData } = useCheckFavoriteQuery(
    { favoritable_type: 'hotel', favoritable_id: hotelId },
    { skip: !isAuthenticated || !hotelId }
  );
  
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  
  useEffect(() => {
    if (favoriteData?.data?.is_favorited) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [favoriteData]);
  
  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add to favorites');
      return;
    }
    
    if (!hotelId) return;
    
    try {
      if (isFavorite) {
        await removeFromFavorites({
          favoritable_type: 'hotel',
          favoritable_id: hotelId,
        }).unwrap();
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites({
          favoritable_type: 'hotel',
          favoritable_id: hotelId,
        }).unwrap();
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.data?.messages?.[0] || 'Failed to update favorites');
    }
  };

  // Fetch hotel rooms once we know the numeric hotel ID
  const { data: roomsData, isLoading: roomsLoading } = useGetRoomsQuery(
    hotelId
      ? {
          hotel_id: hotelId,
          per_page: 20,
          check_in_date: bookingDates.checkIn ? new Date(bookingDates.checkIn).toISOString().split('T')[0] : undefined,
          check_out_date: bookingDates.checkOut ? new Date(bookingDates.checkOut).toISOString().split('T')[0] : undefined,
          max_guests: bookingDates.guests || undefined,
        }
      : skipToken
  );

  // IntersectionObserver to update active tab based on scroll position
  useEffect(() => {
    // لا نربط الـ observers قبل ما تكون البيانات معروضة فعلياً
    if (hotelLoading) return;

    const observers = [];
    const sections = [
      { ref: overviewRef, id: 'overview' },
      { ref: amenitiesRef, id: 'amenities' },
      { ref: locationRef, id: 'location' },
      { ref: roomsRef, id: 'rooms' },
      { ref: reviewsRef, id: 'reviews' },
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -60% 0px',
      threshold: 0,
    };

    sections.forEach(({ ref, id }) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(id);
          }
        });
      }, observerOptions);

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [hotelLoading]);

  const scrollToSection = (sectionRef, tabId) => {
    setActiveTab(tabId);
    if (sectionRef.current) {
      const yOffset = -100; // offset for fixed header
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (hotelLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-6xl mb-4">🏨</div>
          <div className="text-gray-600">Loading hotel details...</div>
        </div>
      </div>
    );
  }

  if (hotelError || !hotelData?.data?.hotel) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel Not Found</h2>
          <p className="text-gray-600">Sorry, we couldn't find this hotel.</p>
        </div>
      </div>
    );
  }

  const hotel = hotelData.data.hotel;
  const rooms = roomsData?.data?.rooms || [];

  const tabs = [
    { id: 'overview', label: 'Overview', ref: overviewRef },
    { id: 'amenities', label: 'Amenities', ref: amenitiesRef },
    { id: 'location', label: 'Location', ref: locationRef },
    { id: 'rooms', label: 'Rooms', ref: roomsRef },
    { id: 'reviews', label: 'Reviews', ref: reviewsRef },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'}
                      size={16}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaMapMarkerAlt className="text-blue-600" />
                <span>{hotel.city}, {hotel.country}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:self-auto">
              <button
                type="button"
                onClick={handleFavoriteToggle}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                  isFavorite ? 'bg-red-50' : ''
                }`}
              >
                {isFavorite ? (
                  <MdFavorite className="text-red-500" size={20} />
                ) : (
                  <MdFavoriteBorder size={20} />
                )}
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaShare size={16} />
              </button>
            </div>
          </div>
        </div>

          {/* Sticky Tabs */}
          <div className="sticky top-16 md:top-20 z-30 bg-white  mt-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4">
          <nav className="flex gap-6 overflow-x-scroll hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.ref, tab.id)}
                className={`pb-1 px-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Image Gallery */}
        <ImageGallery images={hotel.images} hotelName={hotel.name} />

      

        {/* Content */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* Main Content - All Sections */}
          <div className="flex-1 space-y-12">
            <div ref={overviewRef} id="overview-section">
              <OverviewSection hotel={hotel} />
            </div>

            <div ref={amenitiesRef} id="amenities-section">
              <AmenitiesSection hotel={hotel} />
            </div>

            <div ref={locationRef} id="location-section">
              <LocationSection hotel={hotel} />
            </div>

            <div ref={roomsRef} id="rooms-section">
              <RoomsSection 
                hotelId={hotel.id} 
                rooms={rooms} 
                loading={roomsLoading}
                hotel={hotel}
                checkIn={bookingDates.checkIn}
                checkOut={bookingDates.checkOut}
                guests={bookingDates.guests}
              />
            </div>

            <div ref={reviewsRef} id="reviews-section">
              <ReviewsSection hotel={hotel} />
            </div>
          </div>

          {/* Booking Card - Sidebar (Desktop & Large Screens) */}
          <div className="hidden lg:block lg:w-96">
            <div className="sticky top-32">
              <BookingCard 
                hotel={hotel} 
                onDatesChange={setBookingDates}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Booking Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 shadow-lg lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500">
              Price per night
            </div>
            <div className="text-base font-semibold text-gray-900">
              €{hotel.price_per_night}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileBookingOpen(true)}
            className="flex-1 inline-flex justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            View booking details
          </button>
        </div>
      </div>

      {/* Mobile Booking Drawer */}
      {isMobileBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            onClick={() => setIsMobileBookingOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Sheet */}
          <div className="relative w-full max-h-[80vh] rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <span className="text-base font-semibold text-gray-900">
                Booking details
              </span>
              <button
                type="button"
                onClick={() => setIsMobileBookingOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="px-4 py-4 overflow-y-auto">
              <BookingCard 
                hotel={hotel} 
                onDatesChange={setBookingDates}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
