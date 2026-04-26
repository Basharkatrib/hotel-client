import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import DealCard from '../WeekendDeals/components/DealCard';
import { useGetHotelsQuery } from '../../../../services/hotelsApi';
import { getImageUrl } from '../../../../utils/imageHelper';

const HomesGuestsLove = () => {
  const { data, isLoading, isFetching, error } = useGetHotelsQuery({
    sort_by: 'rating',
    sort_order: 'desc',
    per_page: 8
  });

  const getRatingText = (rating) => {
    if (rating >= 4.8) return 'Exceptional';
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    return 'Good';
  };

  const homes = useMemo(() => {
    return data?.data?.hotels?.map(hotel => ({
      id: hotel.id,
      slug: hotel.slug,
      image: getImageUrl(hotel.images?.[0]),
      title: hotel.name,
      location: `${hotel.city}, ${hotel.country}`,
      rating: parseFloat(hotel.rating),
      ratingText: getRatingText(parseFloat(hotel.rating)),
      reviews: hotel.reviews_count,
      originalPrice: parseFloat(hotel.original_price || hotel.price_per_night),
      discountPrice: parseFloat(hotel.price_per_night),
      badge: 'Guest Favorite',
    })) || [];
  }, [data]);

  if (error) return null; // Silently fail for this section if error

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-card rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-800" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Homes Guests Love
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl">
              Discover the most highly-rated accommodations, hand-picked by our community of travelers.
            </p>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              className="cursor-pointer homes-guests-love-prev w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-500 dark:hover:bg-primary-400 hover:text-white text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm"
              aria-label="Previous homes"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="cursor-pointer homes-guests-love-next w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-500 dark:hover:bg-primary-400 hover:text-white text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm"
              aria-label="Next homes"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? renderSkeletons() : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={isFetching ? 'opacity-70 grayscale-[20%]' : ''}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: '.homes-guests-love-prev',
                nextEl: '.homes-guests-love-next',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="homes-guests-love-swiper pb-12"
            >
              {homes.map((home) => (
                <SwiperSlide key={home.id}>
                  <DealCard {...home} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HomesGuestsLove;

