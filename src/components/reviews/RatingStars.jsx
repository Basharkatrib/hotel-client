import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const RatingStars = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 16, 
  showNumber = false,
  allowHalf = false,
  interactive = false,
  onRatingChange,
  className = '',
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0 && allowHalf;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const handleStarClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    // يمكن إضافة hover effect لاحقاً
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar
            key={`full-${i}`}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} text-yellow-400`}
            size={size}
            onClick={() => handleStarClick(i + 1)}
            onMouseEnter={() => handleStarHover(i + 1)}
          />
        ))}
        {hasHalfStar && (
          <FaStarHalfAlt
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} text-yellow-400`}
            size={size}
            onClick={() => handleStarClick(fullStars + 0.5)}
            onMouseEnter={() => handleStarHover(fullStars + 0.5)}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar
            key={`empty-${i}`}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} text-gray-300`}
            size={size}
            onClick={() => handleStarClick(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
            onMouseEnter={() => handleStarHover(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
