import React, { useState } from 'react';
import DestinationCard from './components/DestinationCard';
import CategoryFilter from './components/CategoryFilter';

const TrendingDestinations = () => {
  const [activeFilter, setActiveFilter] = useState('Spring Picks');

  const categories = [
    { name: 'Spring Picks', icon: '🌸' },
    { name: 'Summer Hotspot', icon: '☀️' },
    { name: 'Autumn Escape', icon: '🍂' },
    { name: 'Winter Getaway', icon: '❄️' },
  ];

  const destinations = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      city: 'Paris',
      country: 'France',
      price: 128,
      description: 'Romantic escapes, art, and cafés.',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
      city: 'Santorini',
      country: 'Greece',
      price: 225,
      description: 'Sunsets, sea views, and serenity.',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      city: 'Bali',
      country: 'Indonesia',
      price: 26,
      description: 'Beaches, nature, and calm vibes.',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
      city: 'Kyoto',
      country: 'Japan',
      price: 190,
      description: 'Cherry blossoms and temples.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Trending Destinations
          </h2>

          {/* Category Filters */}
          <CategoryFilter
            categories={categories}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              image={destination.image}
              city={destination.city}
              country={destination.country}
              price={destination.price}
              description={destination.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingDestinations;

