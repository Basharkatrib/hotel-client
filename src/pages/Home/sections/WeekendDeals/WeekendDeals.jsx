import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import DealCard from './components/DealCard';
import '../../../../index.css';

const WeekendDeals = () => {
  const deals = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      title: 'Seaside Serenity Villa',
      location: 'Amalfi Coast, Italy',
      rating: 4.0,
      ratingText: 'Very Good',
      reviews: 101,
      originalPrice: 250,
      discountPrice: 175,
      badge: 'Getaway Deal',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
      title: 'Tropical Bungalow',
      location: 'Phuket, Thailand',
      rating: 3.8,
      ratingText: 'Good',
      reviews: 210,
      originalPrice: 210,
      discountPrice: 160,
      badge: 'Getaway Deal',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
      title: 'Santorini Sunset Suites',
      location: 'Santorini, Greece',
      rating: 4.9,
      ratingText: 'Very Good',
      reviews: 185,
      originalPrice: 300,
      discountPrice: 255,
      badge: 'Getaway Deal',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      title: 'Marbella Resort',
      location: 'Marbella, Spain',
      rating: 4.6,
      ratingText: 'Very Good',
      reviews: 149,
      originalPrice: 280,
      discountPrice: 190,
      badge: 'Getaway Deal',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      title: 'Dubai Luxury Hotel',
      location: 'Dubai, UAE',
      rating: 4.8,
      ratingText: 'Excellent',
      reviews: 320,
      originalPrice: 400,
      discountPrice: 299,
      badge: 'Getaway Deal',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Deals for the Weekend
          </h2>
          
          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="weekend-deals-prev w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="weekend-deals-next w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

