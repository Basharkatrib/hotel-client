import React from 'react';
import { Link } from 'react-router-dom';

const DestinationCard = ({ image, city, country, price, description, slug }) => {
  return (
    <Link 
      to={`/hotel/${slug}`}
      className="group relative block bg-white dark:bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent dark:border-gray-700 h-88"
    >
      {/* Image */}
      <div className="relative h-full overflow-hidden">
        <img
          src={image}
          alt={`${city}, ${country}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-xl sm:text-2xl font-bold mb-1">
              {city}, {country}
            </h3>
            <p className="text-sm mb-2 flex items-center gap-1">
              <span className="text-blue-400 font-semibold">From</span>
              <span className="text-blue-400 font-bold text-lg">${price}</span>
              <span className="text-gray-300">/night</span>
            </p>
            <p className="text-sm text-gray-300 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;

