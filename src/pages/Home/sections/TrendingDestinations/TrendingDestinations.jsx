import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DestinationCard from './components/DestinationCard';
import CategoryFilter from './components/CategoryFilter';
import { useGetHotelsQuery } from '../../../../services/hotelsApi';
import { getImageUrl } from '../../../../utils/imageHelper';

const TrendingDestinations = () => {
  const [activeFilter, setActiveFilter] = useState('Spring Picks');

  const categories = [
    { name: 'Spring Picks', icon: '🌸', query: { is_featured: 1 } },
    { name: 'Summer Hotspot', icon: '☀️', query: { has_spa_access: 1 } },
    { name: 'Autumn Escape', icon: '🍂', query: { has_free_cancellation: 1 } },
    { name: 'Winter Getaway', icon: '❄️', query: { is_getaway_deal: 1 } },
  ];

  // Find the current query based on active filter
  const currentQuery = useMemo(() => {
    const cat = categories.find(c => c.name === activeFilter);
    return {
      ...cat?.query,
      per_page: 8 // Fetch more to filter for unique cities
    };
  }, [activeFilter]);

  const { data, isLoading, isFetching, error } = useGetHotelsQuery(currentQuery);

  // Filter for unique cities to make it feel like "Destinations"
  const destinations = useMemo(() => {
    if (!data?.data?.hotels) return [];
    
    const uniqueCities = new Set();
    const result = [];
    
    for (const hotel of data.data.hotels) {
      if (!uniqueCities.has(hotel.city) && result.length < 4) {
        uniqueCities.add(hotel.city);
        result.push({
          id: hotel.id,
          image: getImageUrl(hotel.images?.[0]),
          city: hotel.city,
          country: hotel.country,
          price: hotel.price_per_night,
          description: hotel.name,
          slug: hotel.slug
        });
      }
    }
    return result;
  }, [data]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-88 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
          <p className="text-red-500 font-medium">Failed to load destinations. Please try again later.</p>
        </div>
      );
    }

    if (destinations.length === 0) {
      return (
        <div className="text-center py-20 bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No destinations found for this category.</p>
        </div>
      );
    }

    return (
      <motion.div 
        layout
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}
      >
        <AnimatePresence mode="popLayout">
          {destinations.map((destination) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <DestinationCard
                image={destination.image}
                city={destination.city}
                country={destination.country}
                price={destination.price}
                description={destination.description}
                slug={destination.slug}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-background transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8"
          >
            Trending Destinations
          </motion.h2>

          {/* Category Filters */}
          <CategoryFilter
            categories={categories}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </section>
  );
};

export default TrendingDestinations;

