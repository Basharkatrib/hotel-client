import React from 'react';
import OfferCard from './components/OfferCard';

const TravelMore = () => {
  const offers = [
    {
      id: 1,
      title: '10% discounts on stays',
      description: 'Enjoy discounts at participating properties worldwide',
    },
    {
      id: 2,
      title: 'Travel off season',
      description: 'Avoid peak times and enjoy lower prices and fewer crowds',
    },
    {
      id: 3,
      title: 'Exclusive deals',
      description: 'Enjoy discounts at participating properties worldwide',
    },
    {
      id: 4,
      title: 'Weekend Special',
      description: 'Enjoy 12% off weekend stays',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-[#1e293b] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-10">
          Travel more, spend less
        </h2>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              title={offer.title}
              description={offer.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelMore;

