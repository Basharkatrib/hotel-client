import React from 'react';
import SightCard from './components/SightCard';

const TopSights = () => {
  const sights = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      location: 'Sassnitz',
      country: 'Finland',
      flag: '🇫🇮',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
      location: 'Binz',
      country: 'Vietnam',
      flag: '🇻🇳',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
      location: 'Sagard',
      country: 'France',
      flag: '🇫🇷',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      location: 'Bergen',
      country: 'United Kingdom',
      flag: '🇬🇧',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      location: 'Freedom',
      country: 'United States',
      flag: '🇺🇸',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-10">
          Top Sights to See
        </h2>

        {/* Sights Grid */}
        <div className="space-y-4 sm:space-y-6">
          {/* Large Cards - Top Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <SightCard
              image={sights[0].image}
              location={sights[0].location}
              country={sights[0].country}
              flag={sights[0].flag}
              isLarge={true}
            />
            <SightCard
              image={sights[1].image}
              location={sights[1].location}
              country={sights[1].country}
              flag={sights[1].flag}
              isLarge={true}
            />
          </div>

          {/* Small Cards - Bottom Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <SightCard
              image={sights[2].image}
              location={sights[2].location}
              country={sights[2].country}
              flag={sights[2].flag}
              isLarge={false}
            />
            <SightCard
              image={sights[3].image}
              location={sights[3].location}
              country={sights[3].country}
              flag={sights[3].flag}
              isLarge={false}
            />
            <SightCard
              image={sights[4].image}
              location={sights[4].location}
              country={sights[4].country}
              flag={sights[4].flag}
              isLarge={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSights;

