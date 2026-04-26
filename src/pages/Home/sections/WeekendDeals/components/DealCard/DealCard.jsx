import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DealCard = ({
  id,
  slug,
  image,
  title,
  location,
  rating,
  ratingText,
  reviews,
  originalPrice,
  discountPrice,
  badge
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Link to={`/hotel/${slug}`} className="block h-full">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
        </Link>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="cursor-pointer absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 z-10"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-700 dark:text-gray-300 text-lg" />
          )}
        </button>

        {/* Badge Overlay */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
            {badge}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Link to={`/hotel/${slug}`} className="block group/title">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-blue-600 dark:bg-blue-500 text-white px-2 py-0.5 rounded-md text-sm font-bold">
              <span>{rating}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{ratingText}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({reviews})</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover/title:text-primary-500 transition-colors">
            {title}
          </h3>

          {/* Location */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>

          {/* Price Section */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 line-through">${originalPrice}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900 dark:text-white">${discountPrice}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">/night</span>
              </div>
            </div>
            <div className="text-primary-500 font-bold text-sm group-hover/title:translate-x-1 transition-transform">
              View Deal &rarr;
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DealCard;

