import React from 'react';

const OfferCard = ({ title, description }) => {
  return (
    <div className="bg-white dark:bg-card border-2 border-blue-200 dark:border-blue-900/30 rounded-2xl p-5 sm:p-6 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>

  );
};

export default OfferCard;

