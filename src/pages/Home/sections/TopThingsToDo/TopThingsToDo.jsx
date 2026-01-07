import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import CategoryFilter from '../TrendingDestinations/components/CategoryFilter';
import ActivityCard from './components/ActivityCard';

const TopThingsToDo = () => {
  const [activeFilter, setActiveFilter] = useState('Explore');

  const categories = [
    { name: 'Explore', icon: '🏛️' },
    { name: 'Beach', icon: '🏖️' },
    { name: 'Museum', icon: '🏛️' },
    { name: 'Show', icon: '🎭' },
    { name: 'Food', icon: '🍴' },
    { name: 'Night Life', icon: '🌙' },
  ];

  const activities = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80',
      title: 'Sagrada Familia',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      title: 'Park Güell',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      title: 'Casa Milà',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      title: 'Sacred Heart Temple',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      title: 'Arc de Triomf',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      title: 'Casa Batlló',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
          Top Things to Do in Barcelona
        </h2>

        {/* Category Filters */}
        <div className="sm:mb-8">
          <CategoryFilter
            categories={categories}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            prevEl: '.top-things-prev',
            nextEl: '.top-things-next',
          }}
          breakpoints={{
            640: {
              slidesPerView: 3.5,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 24,
            },
          }}
          className="top-things-swiper"
        >
          {activities.map((activity) => (
            <SwiperSlide key={activity.id}>
              <ActivityCard
                image={activity.image}
                title={activity.title}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-3 mt-2">
          <button
            className="top-things-prev w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-200"
            aria-label="Previous activities"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="top-things-next w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-200"
            aria-label="Next activities"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopThingsToDo;

