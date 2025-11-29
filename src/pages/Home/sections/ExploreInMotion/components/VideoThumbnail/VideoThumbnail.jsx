import React from 'react';
import { FaPlay, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const VideoThumbnail = ({ image, location, rating }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />);
    }

    return stars;
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Image */}
      <div className="relative h-40 sm:h-36 overflow-hidden">
        <img
          src={image} 
          alt={location}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:bg-white group-hover:scale-110 transition-all duration-300">
            <FaPlay className="text-blue-600 text-lg sm:text-xl ml-1" />
          </div>
        </div>

        {/* Location and Rating */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm sm:text-base font-semibold">{location}</p>
            <div className="flex items-center gap-1">
              {renderStars(rating)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnail;

