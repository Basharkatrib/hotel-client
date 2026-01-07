import React from 'react';

const SightCard = ({ image, location, country, flag, isLarge = false }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full border border-transparent dark:border-gray-700">
      {/* Image */}
      <div className={`relative overflow-hidden ${isLarge ? 'h-64 sm:h-80 lg:h-80' : 'h-64 sm:h-72 lg:h-80'}`}>
        <img
          src={image}
          alt={`${location}, ${country}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

        {/* Flag Badge */}
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-700 rounded-lg px-3 py-1.5 shadow-lg border border-transparent dark:border-gray-600 transition-colors duration-300">
          <span className="text-2xl">{flag}</span>
        </div>

        {/* Location Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className={`font-bold mb-1 ${isLarge ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
            {location}
          </h3>
          <p className="text-sm sm:text-base text-gray-200">
            {country}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SightCard;

