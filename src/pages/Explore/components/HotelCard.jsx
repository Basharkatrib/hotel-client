import React from 'react';
import { FaHeart, FaRegHeart, FaStar, FaUmbrellaBeach } from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { PiTrainRegionalBold } from 'react-icons/pi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const HotelCard = ({ hotel }) => {
  const images = hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.image];

  const hasDiscount =
    hotel.originalPrice && hotel.originalPrice > hotel.price;
  const discountPercent = hasDiscount
    ? `${Math.round((1 - hotel.price / hotel.originalPrice) * 100)}% off`
    : null;

  return (
    <article className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image slider */}
        <div className="relative md:w-64 lg:w-72">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            className="hotel-card-swiper h-56 md:h-full"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={hotel.name}
                  className="h-56 md:h-full w-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Badge */}
          {hotel.badge && (
            <span className="absolute z-10 top-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
              {hotel.badge}
            </span>
          )}

          {/* Favorite */}
          <button
            type="button"
            className="absolute z-10 top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md"
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
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {hotel.name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <MdOutlineLocationOn className="text-sm" />
                  <span>{hotel.area}</span>
                </button>
                <span>• {hotel.distanceFromCenter}</span>
                <span className="flex items-center gap-1">
                  • <PiTrainRegionalBold className="text-sm" />
                  <span>{hotel.metroAccess}</span>
                </span>
                <span className="flex items-center gap-1">
                  • <FaUmbrellaBeach className="text-xs" />
                  <span>{hotel.distanceFromBeach}</span>
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="flex flex-col items-end">
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  {hotel.ratingText}
                </button>
                <span className="text-[11px] text-gray-500">
                  {hotel.reviews.toLocaleString()} reviews
                </span>
              </div>
              <div className="flex items-center justify-center rounded-xl bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white">
                <FaStar className="mr-1 text-[10px]" />
                <span>{hotel.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Meta */}
          <p className="text-xs sm:text-sm text-gray-700">
            {hotel.meta}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-700">
            {hotel.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom row: notice + price */}
          <div className="flex items-end justify-between gap-3 pt-3 border-t border-gray-100 mt-auto">
            <div className="text-[11px] text-rose-600 font-medium">
              {hotel.notice}
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
                      ${hotel.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xl font-bold text-gray-900">
                    ${hotel.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  {hotel.priceMeta}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;


