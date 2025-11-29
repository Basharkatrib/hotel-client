import React from 'react';
import { FaPlay } from 'react-icons/fa';

const VideoCard = ({ image, title, subtitle, description, buttonText }) => {
  return (
    <div className="group relative bg-white border-2 border-blue-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
      {/* Image */}
      <div className="relative h-64 sm:h-80 lg:h-116 overflow-hidden">
        <img
          src={image} 
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent pointer-events-none"></div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            {title}
          </h3>
          <h4 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {subtitle}
          </h4>
          <p className="text-sm sm:text-base text-white/90 max-w-md mb-6">
            {description}
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

