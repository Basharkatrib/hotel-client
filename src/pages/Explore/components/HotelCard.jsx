import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHeart, FaRegHeart, FaStar, FaUmbrellaBeach } from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { PiTrainRegionalBold } from 'react-icons/pi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { getImageUrls } from '../../../utils/imageHelper';
import { useCheckFavoriteQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../../services/favoritesApi';
import { toast } from 'react-toastify';
import HotelLocationModal from './HotelLocationModal';
import 'swiper/css';
import 'swiper/css/pagination';
import RatingBadge from '../../../components/common/RatingBadge';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Handle images - API returns array of paths, we need to construct full URLs
  const images = getImageUrls(hotel.images);

  // Check if hotel is favorited
  const { data: favoriteData } = useCheckFavoriteQuery(
    { favoritable_type: 'hotel', favoritable_id: hotel.id },
    { skip: !isAuthenticated }
  );

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  useEffect(() => {
    if (favoriteData?.data?.is_favorited) {
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [favoriteData]);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please login to add to favorites');
      navigate('/auth/login');
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavorites({
          favoritable_type: 'hotel',
          favoritable_id: hotel.id,
        }).unwrap();
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites({
          favoritable_type: 'hotel',
          favoritable_id: hotel.id,
        }).unwrap();
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.data?.messages?.[0] || 'Failed to update favorites');
    }
  };

  const hasDiscount = hotel.original_price && hotel.original_price > hotel.price_per_night;
  const discountPercent = hasDiscount
    ? `${hotel.discount_percentage}% off`
    : null;


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
  if (hotel.max_guests_capacity) {
    metaParts.push(`Up to ${hotel.max_guests_capacity} guests`);
  }
  const meta = metaParts.join(' • ');

  return (
    <article className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
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
            onClick={handleFavoriteToggle}
            className={`absolute z-10 top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:scale-110 transition-transform ${isFavorited ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
              }`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
          {/* Top row: title + rating */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <h2
                onClick={() => navigate(`/hotel/${hotel.slug}`)}
                className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
              >
                {hotel.name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
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
            <RatingBadge
              rating={hotel.rating}
              reviewsCount={hotel.reviews_count}
              size="md"
            />
          </div>

          {/* Meta */}
          {meta && (
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {meta}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[11px] text-gray-700 dark:text-gray-300">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom row: notice + price */}
          <div className="flex items-end justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
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
                    <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                      ${Number(hotel.original_price).toLocaleString()}
                    </span>
                  )}
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${Number(hotel.price_per_night).toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
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
