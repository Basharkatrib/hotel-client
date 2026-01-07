import React from 'react';

const DestinationCard = ({ image, city, country, price, description }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent dark:border-gray-700">
      {/* Image */}
      <div className="relative h-88 overflow-hidden">
        <img
          src={image}
          alt={`${city}, ${country}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-1">
            {city}, {country}
          </h3>
          <p className="text-sm mb-2 flex items-center gap-1">
            <span className="text-yellow-400 font-semibold">From</span>
            <span className="text-yellow-400 font-bold text-lg">${price}</span>
            <span className="text-gray-200">/night</span>
          </p>
          <p className="text-sm text-gray-200">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;

