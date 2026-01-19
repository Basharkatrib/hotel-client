import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import DealCard from '../WeekendDeals/components/DealCard';

const HomesGuestsLove = () => {
  const homes = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      title: 'Azure Horizon Hotel',
      location: 'Nice, France',
      rating: 5.0,
      ratingText: 'Excellent',
      reviews: 350,
      originalPrice: 165,
      discountPrice: 165,
      badge: 'Guest Favorite',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      title: 'Palm Grove House',
      location: 'Algarve, Portugal',
      rating: 5.0,
      ratingText: 'Excellent',
      reviews: 200,
      originalPrice: 175,
      discountPrice: 175,
      badge: 'Guest Favorite',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
      title: 'Casa Tranquila Guesthouse',
      location: 'Tulum, Mexico',
      rating: 4.8,
      ratingText: 'Very Good',
      reviews: 160,
      originalPrice: 145,
      discountPrice: 145,
      badge: 'Guest Favorite',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
      title: 'Villa San Martino Guesthouse',
      location: 'Amalfi Coast, Italy',
      rating: 5.0,
      ratingText: 'Excellent',
      reviews: 160,
      originalPrice: 190,
      discountPrice: 190,
      badge: 'Guest Favorite',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      title: 'Ocean View Resort',
      location: 'Bali, Indonesia',
      rating: 4.9,
      ratingText: 'Excellent',
      reviews: 280,
      originalPrice: 120,
      discountPrice: 120,
      badge: 'Guest Favorite',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-[#2c4860] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Homes Guests Love
          </h2>

          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              className="homes-guests-love-prev w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-gray-900 dark:hover:border-blue-500 hover:bg-gray-900 dark:hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm"
              aria-label="Previous homes"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="homes-guests-love-next w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-gray-900 dark:hover:border-blue-500 hover:bg-gray-900 dark:hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm"
              aria-label="Next homes"
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
            prevEl: '.homes-guests-love-prev',
            nextEl: '.homes-guests-love-next',
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
          className="homes-guests-love-swiper pb-12"
        >
          {homes.map((home) => (
            <SwiperSlide key={home.id}>
              <DealCard {...home} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HomesGuestsLove;

