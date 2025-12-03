import React, { useState } from 'react';
import HotelCard from './HotelCard';
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

const mockHotels = [
  {
    id: 1,
    badge: 'Getaway Deal',
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    ],
    name: 'Hotel Arts Barcelona',
    area: 'Port Olímpic',
    distanceFromCenter: '1.8 km from centre',
    metroAccess: 'Metro access',
    distanceFromBeach: '250 m from beach',
    meta: 'Luxury Hotel | Sea View Room • King Bed • 40 m²',
    rating: 5.0,
    ratingText: 'Excellent',
    reviews: 1260,
    tags: ['Free cancellation', 'Spa access', 'Breakfast included'],
    notice: 'Only 1 left at this price',
    originalPrice: 1800,
    price: 1500,
    priceMeta: '5 nights, 2 adults',
  },
  {
    id: 2,
    badge: 'Best Location',
    image:
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    ],
    name: 'W Barcelona',
    area: 'Barceloneta',
    distanceFromCenter: '2.5 km from centre',
    metroAccess: 'Metro access',
    distanceFromBeach: 'Direct beachfront',
    meta: 'Beach Hotel | Sea View Room • King Bed • 35 m²',
    rating: 5.0,
    ratingText: 'Excellent',
    reviews: 1200,
    tags: ['Breakfast included', 'Spa access'],
    notice: 'Only 1 left at this price',
    originalPrice: 0,
    price: 1395,
    priceMeta: '5 nights, 2 adults',
  },
  {
    id: 3,
    badge: 'Best Value',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    name: 'Melia Barcelona Sky',
    area: 'Poblenou',
    distanceFromCenter: '3.5 km from centre',
    metroAccess: 'Metro access',
    distanceFromBeach: '700 m from beach',
    meta: 'Spa Hotel | Premium Room • King Bed',
    rating: 4.3,
    ratingText: 'Good',
    reviews: 1050,
    tags: ['Free cancellation', 'Spa access', 'Beach view'],
    notice: 'Only 1 left at this price',
    originalPrice: 1200,
    price: 1080,
    priceMeta: '5 nights, 2 adults',
  },
  {
    id: 4,
    badge: 'Guest Favourite',
    image:
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80',
    name: 'Majestic Hotel & Spa',
    area: 'Passeig de Gràcia',
    distanceFromCenter: '500 m from centre',
    metroAccess: 'Metro access',
    distanceFromBeach: '2.2 km from beach',
    meta: 'Historic Hotel | Twin Room • 2 Twin Beds',
    rating: 4.5,
    ratingText: 'Very Good',
    reviews: 980,
    tags: ['Breakfast included', 'Terrace lounge'],
    notice: 'Only 1 left at this price',
    originalPrice: 1325,
    price: 1325,
    priceMeta: '5 nights, 2 adults',
  },
  {
    id: 5,
    badge: 'Getaway Deal',
    image:
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80',
    name: 'Renaissance Hotel',
    area: 'Poblenou',
    distanceFromCenter: '3.2 km from centre',
    metroAccess: 'Metro access',
    distanceFromBeach: '150 m from beach',
    meta: 'Spa Hotel | Ocean View Suite • King Bed • 40 m²',
    rating: 3.9,
    ratingText: 'Good',
    reviews: 850,
    tags: ['Free cancellation', 'Spa access', 'Breakfast included'],
    notice: 'Only 1 left at this price',
    originalPrice: 1100,
    price: 990,
    priceMeta: '5 nights, 2 adults',
  }
];

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Build condensed pagination: previous page, current page, next page,
  // first page, last page, with dots between distant ranges.
  const buildPageItems = () => {
    const set = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
    const numbers = Array.from(set)
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);

    const items = [];
    for (let i = 0; i < numbers.length; i += 1) {
      const page = numbers[i];
      if (i > 0 && page - numbers[i - 1] > 1) {
        items.push({ type: 'dots', key: `dots-${numbers[i - 1]}-${page}` });
      }
      items.push({ type: 'page', page, key: `page-${page}` });
    }
    return items;
  };

  const pageItems = buildPageItems();

  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-sm">
      {/* Previous */}
      <button
        type="button"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors ${
          currentPage === 1
            ? 'opacity-40 cursor-default'
            : 'hover:border-gray-900'
        }`}
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
      >
        <FaAngleLeft />
      </button>
      {pageItems.map((item) => {
        if (item.type === 'dots') {
          return (
            <span
              key={item.key}
              className="inline-flex h-8 items-center px-1 text-xs text-gray-400"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onPageChange(item.page)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors ${
              item.page === currentPage
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
            }`}
          >
            {item.page}
          </button>
        );
      })}
      {/* Next */}
      <button
        type="button"
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors ${
          currentPage === totalPages
            ? 'opacity-40 cursor-default'
            : 'hover:border-gray-900'
        }`}
        aria-label="Next page"
        aria-disabled={currentPage === totalPages}
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

const HotelList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1;

  const totalPages = Math.ceil(mockHotels.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentHotels = mockHotels.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4 sm:space-y-5">
      {currentHotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default HotelList;


