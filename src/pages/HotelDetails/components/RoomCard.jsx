import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { getImageUrls } from '../../../utils/imageHelper';
import { 
  FaBed, 
  FaUsers, 
  FaWifi, 
  FaSnowflake,
  FaTv,
  FaConciergeBell,
  FaDoorOpen,
  FaBath,
  FaShower,
  FaSmokingBan,
  FaUtensils
} from 'react-icons/fa';
import { MdBalcony } from 'react-icons/md';
import { toast } from 'react-toastify';
import { differenceInDays } from 'date-fns';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RoomCard = ({ room, hotel, checkIn, checkOut, guests }) => {
  const navigate = useNavigate();
  const images = getImageUrls(room.images);
  
  const hasDiscount = room.original_price && room.original_price > room.price_per_night;
  
  // Check if room is available for selected dates
  const isAvailableForDates = room.is_available_for_dates !== undefined 
    ? room.is_available_for_dates 
    : room.is_available;
  
  const handleBookNow = () => {
    // Check general availability first
    if (!room.is_available) {
      toast.error('This room is not available at the moment.');
      return;
    }
    
    // Validate dates
    if (!checkIn || !checkOut) {
      toast.warning('Please select check-in and check-out dates.');
      return;
    }
    
    // Check if available for selected dates
    if (!isAvailableForDates) {
      toast.error('This room is already booked for the selected dates. Please choose different dates.');
      return;
    }
    
    // Validate guest capacity
    const guestCount = guests || 2;
    if (guestCount > room.max_guests) {
      toast.error(`This room can accommodate a maximum of ${room.max_guests} guests. Please select fewer guests.`);
      return;
    }
    
    // Calculate pricing
    const nights = checkIn && checkOut 
      ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
      : 5;
    const pricePerNight = Number(room.price_per_night);
    const subtotal = pricePerNight * nights;
    const serviceFee = subtotal * 0.028;
    const taxes = subtotal * 0.0164;
    const total = subtotal + serviceFee + taxes;
    
    // Navigate to booking confirmation
    navigate('/booking/confirm', {
      state: {
        hotel,
        room,
        checkIn: checkIn || new Date(Date.now() + 86400000).toISOString(),
        checkOut: checkOut || new Date(Date.now() + 86400000 * 6).toISOString(),
        guests: guestCount,
        rooms: 1,
        pricing: {
          nights,
          pricePerNight,
          subtotal: subtotal.toFixed(2),
          serviceFee: serviceFee.toFixed(2),
          taxes: taxes.toFixed(2),
          total: total.toFixed(2),
        },
      },
    });
  };
  
  // Build bed description
  const beds = [];
  if (room.single_beds > 0) beds.push(`${room.single_beds} Single`);
  if (room.double_beds > 0) beds.push(`${room.double_beds} Double`);
  if (room.king_beds > 0) beds.push(`${room.king_beds} King`);
  if (room.queen_beds > 0) beds.push(`${room.queen_beds} Queen`);
  
  const totalBeds = room.single_beds + room.double_beds + room.king_beds + room.queen_beds;
  
  // Room features icons
  const features = [];
  if (room.has_breakfast) features.push({ icon: FaUtensils, label: 'Breakfast', color: 'text-orange-600' });
  if (room.has_wifi) features.push({ icon: FaWifi, label: 'WiFi', color: 'text-blue-600' });
  if (room.has_ac) features.push({ icon: FaSnowflake, label: 'AC', color: 'text-cyan-600' });
  if (room.has_tv) features.push({ icon: FaTv, label: 'TV', color: 'text-purple-600' });
  if (room.has_minibar) features.push({ icon: FaConciergeBell, label: 'Minibar', color: 'text-amber-600' });
  if (room.has_balcony) features.push({ icon: MdBalcony, label: 'Balcony', color: 'text-green-600' });
  if (room.has_bathtub) features.push({ icon: FaBath, label: 'Bathtub', color: 'text-blue-500' });
  if (room.has_shower) features.push({ icon: FaShower, label: 'Shower', color: 'text-blue-400' });
  if (room.no_smoking) features.push({ icon: FaSmokingBan, label: 'No Smoking', color: 'text-red-600' });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Image Slider */}
        <div className="lg:w-64 relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="room-card-swiper h-48 lg:h-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${room.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Availability Badge */}
          {!room.is_available ? (
            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Not Available
            </div>
          ) : room.is_available && !isAvailableForDates && checkIn && checkOut ? (
            <div className="absolute top-2 left-2 z-10 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Booked for Selected Dates
            </div>
          ) : null}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 z-10 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
              {room.discount_percentage}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-5">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {room.name}
                </h3>
                {room.is_featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    Featured
                  </span>
                )}
              </div>
              
              {/* Type & View */}
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium capitalize">
                  {room.type}
                </span>
                {room.view && room.view !== 'none' && (
                  <span className="flex items-center gap-1">
                    <FaDoorOpen className="text-blue-600" size={12} />
                    {room.view.charAt(0).toUpperCase() + room.view.slice(1)} View
                  </span>
                )}
                {room.size && (
                  <span>{room.size} m²</span>
                )}
              </div>
              
              {/* Beds & Guests */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <FaBed className="text-gray-600" size={14} />
                  <span className="font-medium">
                    {totalBeds > 0 ? beds.join(', ') : 'Bed info not available'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <FaUsers className="text-gray-600" size={14} />
                  <span className="font-medium">Up to {room.max_guests} guests</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            {room.rating > 0 && (
              <div className="text-right ml-3">
                <div className="flex items-center gap-1.5 justify-end mb-0.5">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Excellent</div>
                  </div>
                  <div className="bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
                    {Number(room.rating).toFixed(1)}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {room.reviews_count.toLocaleString()} reviews
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {room.description && (
            <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
              {room.description}
            </p>
          )}

          {/* Features Grid */}
          {features.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {features.slice(0, 10).map((feature, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-xs">
                    <feature.icon className={feature.color} size={14} />
                    <span className="text-gray-700">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unavailability Notice for Selected Dates */}
          {room.is_available && !isAvailableForDates && checkIn && checkOut && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-900">Not Available for Selected Dates</p>
                  <p className="text-xs text-red-700 mt-1">
                    {room.booked_dates ? (
                      <>This room is already booked from {new Date(room.booked_dates.check_in).toLocaleDateString()} to {new Date(room.booked_dates.check_out).toLocaleDateString()}. Please select different dates.</>
                    ) : (
                      <>This room is not available for your selected dates. Please choose different dates.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pt-3 border-t border-gray-200">
            <div>
              {hasDiscount && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-400 line-through">
                    ${Number(room.original_price).toFixed(0)}
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    Save {room.discount_percentage}%
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-1.5 mb-0.5">
                <span className="text-3xl font-bold text-gray-900">
                  ${Number(room.price_per_night).toFixed(0)}
                </span>
                <span className="text-sm text-gray-500 font-medium">/ night</span>
              </div>
              <div className="text-xs text-gray-500">
                Taxes and fees not included
              </div>
            </div>

            <button
              type="button"
              onClick={handleBookNow}
              disabled={!room.is_available || !isAvailableForDates}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !room.is_available || !isAvailableForDates
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {!room.is_available 
                ? 'Not Available' 
                : !isAvailableForDates 
                ? 'Booked for Selected Dates' 
                : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
