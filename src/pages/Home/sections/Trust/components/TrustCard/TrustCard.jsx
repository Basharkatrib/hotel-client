import React from 'react';

const TrustCard = ({ icon, title, description }) => {
  return (
    <div className="relative w-full max-w-sm mx-auto md:max-w-none md:w-auto">
      <div className="text-center px-4 md:px-2">
        {/* Icon */}
        <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 dark:bg-[color-mix(in_oklab,_theme(colors.gray.900)_95%,_transparent)] rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300">
              <img
                src={icon}
                alt={title}
                className="w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-[300px] sm:max-w-[280px] mx-auto">
          {description}
        </p>
      </div>
    </div>

  );
};

export default TrustCard;

