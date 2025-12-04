import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaUmbrellaBeach } from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { PiTrainRegionalBold } from 'react-icons/pi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { getImageUrls } from '../../../utils/imageHelper';
import HotelLocationModal from './HotelLocationModal';
import 'swiper/css';
import 'swiper/css/pagination';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  // Handle images - API returns array of paths, we need to construct full URLs
  const images = getImageUrls(hotel.images);

  const hasDiscount = hotel.original_price && hotel.original_price > hotel.price_per_night;
  const discountPercent = hasDiscount
    ? `${hotel.discount_percentage}% off`
    : null;

  // Map rating to text
  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.0) return 'Good';
    if (rating >= 2.0) return 'Fair';
    return 'Poor';
  };

  // Build tags from hotel features
  const tags = [];
  if (hotel.has_free_cancellation) tags.push('Free cancellation');
  if (hotel.has_spa_access) tags.push('Spa access');
  if (hotel.has_breakfast_included) tags.push('Breakfast included');
  if (hotel.has_metro_access) tags.push('Metro access');

  // Build meta text
  const metaParts = [];
  if (hotel.type) {
    metaParts.push(hotel.type.charAt(0).toUpperCase() + hotel.type.slice(1).replace('_', ' '));
  }
  if (hotel.room_type) metaParts.push(hotel.room_type);
  if (hotel.bed_type) metaParts.push(hotel.bed_type);
  if (hotel.room_size) metaParts.push(`${hotel.room_size} m²`);
  const meta = metaParts.join(' • ');

  return (
    <article className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image slider */}
        <div className="relative md:w-64 lg:w-72">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            className="hotel-card-swiper h-56 md:min-h-full"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={hotel.name}
                  className="h-56 md:h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80';
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Badges */}
          {hotel.is_featured && (
            <span className="absolute z-10 top-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
              Featured
            </span>
          )}
          {hotel.is_getaway_deal && (
            <span className="absolute z-10 top-3 left-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
              Getaway Deal
            </span>
          )}

          {/* Favorite */}
          <button
            type="button"
            className="absolute z-10 top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md hover:scale-110 transition-transform"
            aria-label="Add to favorites"
          >
            <FaRegHeart className="group-hover:hidden" />
            <FaHeart className="hidden text-red-500 group-hover:block" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
          {/* Top row: title + rating */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <h2 
                onClick={() => navigate(`/hotel/${hotel.slug}`)}
                className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
              >
                {hotel.name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <MdOutlineLocationOn className="text-sm" />
                  <span>{hotel.city || 'Barcelona'}</span>
                </button>
                {hotel.distance_from_center && (
                  <span>• {hotel.distance_from_center} km from centre</span>
                )}
                {hotel.has_metro_access && (
                  <span className="flex items-center gap-1">
                    • <PiTrainRegionalBold className="text-sm" />
                    <span>Metro access</span>
                  </span>
                )}
                {hotel.distance_from_beach && (
                  <span className="flex items-center gap-1">
                    • <FaUmbrellaBeach className="text-xs" />
                    <span>{hotel.distance_from_beach} m from beach</span>
                  </span>
                )}
              </div>
            </div>

            {/* Rating */}
            {hotel.rating > 0 && (
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="flex flex-col items-end">
                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    {getRatingText(hotel.rating)}
                  </button>
                  <span className="text-[11px] text-gray-500">
                    {hotel.reviews_count.toLocaleString()} reviews
                  </span>
                </div>
                <div className="flex items-center justify-center rounded-xl bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white">
                  <FaStar className="mr-1 text-[10px]" />
                  <span>{Number(hotel.rating).toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Meta */}
          {meta && (
            <p className="text-xs sm:text-sm text-gray-700">
              {meta}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[11px] text-gray-700">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom row: notice + price */}
          <div className="flex items-end justify-between gap-3 pt-3 border-t border-gray-100 mt-auto">
            <div className="text-[11px] text-rose-600 font-medium">
              {hotel.available_rooms === 1 && 'Only 1 left at this price'}
              {hotel.available_rooms === 2 && 'Only 2 left at this price'}
            </div>

            <div className="flex items-center gap-3">
              {hasDiscount && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  {discountPercent}
                </span>
              )}
              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through">
                      ${Number(hotel.original_price).toLocaleString()}
                    </span>
                  )}
                  <span className="text-xl font-bold text-gray-900">
                    ${Number(hotel.price_per_night).toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  per night
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      <HotelLocationModal 
        hotel={hotel}
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </article>
  );
};

export default HotelCard;
