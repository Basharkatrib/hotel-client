import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import DealCard from './components/DealCard';
import '../../../../index.css';

import { useGetHotelsQuery } from '../../../../services/hotelsApi';
import { getImageUrl } from '../../../../utils/imageHelper';

const WeekendDeals = () => {
  const { data, isLoading, error } = useGetHotelsQuery({
    is_getaway_deal: true,
    per_page: 8
  });

  const getRatingText = (rating) => {
    if (rating >= 9) return 'Exceptional'; // If 10-scale
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    return 'Average';
  };

  if (isLoading) return <div className="text-center py-20">Loading deals...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error loading deals</div>;

  const deals = data?.data?.hotels?.map(hotel => ({
    id: hotel.id,
    image: getImageUrl(hotel.images?.[0]),
    title: hotel.name,
    location: `${hotel.city}, ${hotel.country}`,
    rating: parseFloat(hotel.rating),
    ratingText: getRatingText(parseFloat(hotel.rating)),
    reviews: hotel.reviews_count,
    originalPrice: parseFloat(hotel.original_price || hotel.price_per_night * 1.2), // Fallback if no original price
    discountPrice: parseFloat(hotel.price_per_night),
    badge: 'Getaway Deal',
  })) || [];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Deals for the Weekend
          </h2>

          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              className="weekend-deals-prev w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-200"
              aria-label="Previous deals"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="weekend-deals-next w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-200"
              aria-label="Next deals"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            prevEl: '.weekend-deals-prev',
            nextEl: '.weekend-deals-next',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="weekend-deals-swiper pb-12"
        >
          {deals.map((deal) => (
            <SwiperSlide key={deal.id}>
              <DealCard {...deal} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default WeekendDeals;

