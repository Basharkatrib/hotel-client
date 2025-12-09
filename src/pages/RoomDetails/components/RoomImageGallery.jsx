import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RoomImageGallery = ({ images, roomName }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="h-96"
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
  );
};

export default RoomImageGallery;



