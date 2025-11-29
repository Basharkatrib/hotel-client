import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const DealCard = ({ 
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
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image} 
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Favorite Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200 z-10"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-700 text-lg" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
            <span>{rating}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{ratingText}</span>
          <span className="text-sm text-gray-500">({reviews} reviews)</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {title}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-600 mb-4">
          {location}
        </p>

        {/* Badge */}
        <div className="mb-4">
          <span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">per night</span>
          <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
          <span className="text-xl font-bold text-gray-900">${discountPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default DealCard;

