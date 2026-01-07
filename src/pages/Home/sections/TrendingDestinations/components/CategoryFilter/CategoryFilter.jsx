import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const CategoryFilter = ({ categories, activeFilter, onFilterChange }) => {
  return (
    <div className="w-full">
      <Swiper
        modules={[FreeMode]}
        slidesPerView="auto"
        spaceBetween={12}
        freeMode={true}
        className="category-filter-swiper"
        breakpoints={{
          640: {
            spaceBetween: 16,
          },
          1024: {
            spaceBetween: 12,
          },
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.name} style={{ width: 'auto' }}>
            <button
              onClick={() => onFilterChange(category.name)}
              aria-label={`Filter by ${category.name}`}
              aria-pressed={activeFilter === category.name}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeFilter === category.name
                  ? 'bg-gray-900 dark:bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white hover:shadow-md'
                }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryFilter;

