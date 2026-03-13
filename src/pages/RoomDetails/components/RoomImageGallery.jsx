import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaCube } from 'react-icons/fa';

const RoomImageGallery = ({ images, roomName, onView3D }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';

  return (
    <div className="space-y-4">
      {/* Header with 3D Button */}
      {onView3D && (
        <div className="flex justify-end">
          <button
            onClick={onView3D}
            className="group flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold font-['Outfit'] shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <FaCube className="group-hover:rotate-12 transition-transform duration-300" size={20} />
            <span>Virtual 3D Tour</span>
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition-colors duration-300">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="h-[350px]"
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${roomName} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <img
                src={defaultImage}
                alt={roomName}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default RoomImageGallery;











