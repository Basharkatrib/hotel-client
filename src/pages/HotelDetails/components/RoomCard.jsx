import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import RatingBadge from '../../../components/common/RatingBadge';

const RoomCard = ({ room, hotel, checkIn, checkOut, guests }) => {
  const navigate = useNavigate();
  const images = getImageUrls(room.images);

  const hasDiscount = room.has_discount;
  const discountInfo = room.advertisement_discount;

  const originalPrice = hasDiscount && discountInfo
    ? discountInfo.type === 'percentage'
      ? (room.price_per_night / (1 - discountInfo.value / 100))
      : (room.price_per_night + discountInfo.value)
    : null;

  const isAvailableForDates = room.is_available_for_dates !== undefined
    ? room.is_available_for_dates
    : room.is_available;

  const handleBookNow = () => {
    if (!room.is_available) {
      toast.error('This room is not available at the moment.');
      return;
    }
    if (!checkIn || !checkOut) {
      toast.warning('Please select check-in and check-out dates.');
      return;
    }
    if (!isAvailableForDates) {
      toast.error('This room is already booked for the selected dates.');
      return;
    }
    const guestCount = guests || 2;
    if (guestCount > room.max_guests) {
      toast.error(`Max ${room.max_guests} guests allowed.`);
      return;
    }

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const pricePerNight = Number(room.price_per_night);
    const subtotal = pricePerNight * nights;
    const serviceFee = subtotal * 0.028;
    const taxes = subtotal * 0.0164;
    const total = subtotal + serviceFee + taxes;

    navigate('/booking/confirm', {
      state: {
        hotel, room, checkIn, checkOut,
        guests: guestCount, rooms: 1,
        pricing: {
          nights, pricePerNight,
          subtotal: subtotal.toFixed(2),
          serviceFee: serviceFee.toFixed(2),
          taxes: taxes.toFixed(2),
          total: total.toFixed(2),
        },
      },
    });
  };

  const beds = [];
  if (room.single_beds > 0) beds.push(`${room.single_beds} Single`);
  if (room.double_beds > 0) beds.push(`${room.double_beds} Double`);
  if (room.king_beds > 0) beds.push(`${room.king_beds} King`);
  if (room.queen_beds > 0) beds.push(`${room.queen_beds} Queen`);
  const totalBeds = room.single_beds + room.double_beds + room.king_beds + room.queen_beds;

  const features = [];
  if (room.has_breakfast) features.push({ icon: FaUtensils, label: 'Breakfast', color: 'text-orange-500' });
  if (room.has_wifi) features.push({ icon: FaWifi, label: 'WiFi', color: 'text-blue-500' });
  if (room.has_ac) features.push({ icon: FaSnowflake, label: 'AC', color: 'text-cyan-500' });
  if (room.has_tv) features.push({ icon: FaTv, label: 'TV', color: 'text-purple-500' });
  if (room.has_minibar) features.push({ icon: FaConciergeBell, label: 'Minibar', color: 'text-amber-500' });
  if (room.has_balcony) features.push({ icon: MdBalcony, label: 'Balcony', color: 'text-green-500' });
  if (room.has_bathtub) features.push({ icon: FaBath, label: 'Bathtub', color: 'text-blue-400' });
  if (room.has_shower) features.push({ icon: FaShower, label: 'Shower', color: 'text-sky-400' });
  if (room.no_smoking) features.push({ icon: FaSmokingBan, label: 'No Smoking', color: 'text-red-500' });

  return (
    <div className="group bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
      <div className="flex flex-col lg:flex-row">

        {/* ── Image ── */}
        <div className="lg:w-72 flex-shrink-0 relative self-stretch">
  <div className="h-56 lg:h-full lg:absolute lg:inset-0">
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      className="room-swiper h-full"
    >
              {images.length > 0 ? images.map((image, index) => (
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
              )) : (
                <SwiperSlide>
                  <img
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80"
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              )}
            </Swiper>
          </div>

          {/* Badges على الصورة */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {/* Discount Badge */}
            {hasDiscount && discountInfo && (
              <div className="flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                <span>🏷</span>
                <span>
                  {discountInfo.type === 'percentage'
                    ? `${discountInfo.value}% OFF`
                    : `-$${discountInfo.value}`}
                </span>
              </div>
            )}

            {/* Availability Badge */}
            {!room.is_available ? (
              <div className="bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
                Not Available
              </div>
            ) : !isAvailableForDates && checkIn && checkOut ? (
              <div className="bg-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
                Dates Taken
              </div>
            ) : (
              <div className="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
                Available
              </div>
            )}
          </div>

          {/* Featured Badge */}
          {room.is_featured && (
            <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 flex flex-col p-5">

          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate mb-1">
                {room.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize">
                  {room.type}
                </span>
                {room.view && room.view !== 'none' && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <FaDoorOpen className="text-blue-400" size={11} />
                    {room.view.charAt(0).toUpperCase() + room.view.slice(1)} View
                  </span>
                )}
                {room.size && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {room.size} m²
                  </span>
                )}
              </div>
            </div>
            <RatingBadge rating={room.rating} reviewsCount={room.reviews_count} size="sm" />
          </div>

          {/* Beds & Guests */}
          <div className="flex items-center gap-5 mb-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <FaBed size={14} className="text-gray-400" />
              <span className="font-medium">
                {totalBeds > 0 ? beds.join(', ') : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaUsers size={14} className="text-gray-400" />
              <span className="font-medium">Up to {room.max_guests} guests</span>
            </div>
          </div>

          {/* Description */}
          {room.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
              {room.description}
            </p>
          )}

          {/* Amenities */}
          {features.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Amenities
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {features.slice(0, 8).map((feature, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <feature.icon className={feature.color} size={13} />
                    <span>{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dates Unavailable Notice */}
          {room.is_available && !isAvailableForDates && checkIn && checkOut && (
            <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl text-xs text-orange-700 dark:text-orange-300">
              <p className="font-semibold mb-0.5">⚠ Room unavailable for selected dates</p>
              {room.booked_dates && (
                <p className="text-orange-600 dark:text-orange-400">
                  Booked: {new Date(room.booked_dates.check_in).toLocaleDateString()} → {new Date(room.booked_dates.check_out).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* ── Price & CTA ── */}
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">

            {/* Price */}
            <div>
              {/* السعر الأصلي مشطوب + نسبة الخصم */}
              {hasDiscount && discountInfo && originalPrice && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                    ${Number(originalPrice).toFixed(0)}
                  </span>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs font-bold">
                    {discountInfo.type === 'percentage'
                      ? `Save ${discountInfo.value}%`
                      : `Save $${discountInfo.value}`}
                  </span>
                </div>
              )}

              {/* السعر الحالي */}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  ${Number(room.price_per_night).toFixed(0)}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">/ night</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Taxes & fees not included
              </p>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => navigate(`/room/${room.id}`, { state: { checkIn, checkOut, guests } })}
              className="cursor-pointer px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transform whitespace-nowrap"
            >
              View Room
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomCard;