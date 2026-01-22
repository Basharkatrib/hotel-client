import React, { useState } from 'react';
import DestinationCard from './components/DestinationCard';
import CategoryFilter from './components/CategoryFilter';
import { useGetHotelsQuery } from '../../../../services/hotelsApi';
import { getImageUrl } from '../../../../utils/imageHelper';

const TrendingDestinations = () => {
  const [activeFilter, setActiveFilter] = useState('Spring Picks');

  // Fetch trending hotels (sorted by rating for now)
  const { data, isLoading, error } = useGetHotelsQuery({
    sort_by: 'rating',
    sort_order: 'desc',
    per_page: 4
  });

  const categories = [
    { name: 'Spring Picks', icon: '🌸' },
    { name: 'Summer Hotspot', icon: '☀️' },
    { name: 'Autumn Escape', icon: '🍂' },
    { name: 'Winter Getaway', icon: '❄️' },
  ];

  if (isLoading) return <div className="text-center py-20">Loading trending destinations...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error loading destinations</div>;

  const destinations = data?.data?.hotels?.map(hotel => ({
    id: hotel.id,
    image: getImageUrl(hotel.images?.[0]),
    city: hotel.city,
    country: hotel.country,
    price: hotel.price_per_night,
    description: hotel.name, // Using hotel name as description for now
  })) || [];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-background transition-colors duration-300">
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

