import React from 'react';

const ActivityCard = ({ image, title }) => {
  return (
    <div className="group relative bg-transparent cursor-pointer">
      {/* Image */}
      <div className="relative w-full aspect-4/3 overflow-hidden rounded-xl mb-3 shadow-sm border border-transparent dark:border-gray-800">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
    </div>
  );
};

export default ActivityCard;

