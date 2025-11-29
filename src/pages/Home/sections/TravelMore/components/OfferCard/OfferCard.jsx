import React from 'react';

const OfferCard = ({ title, description }) => {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 sm:p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default OfferCard;

