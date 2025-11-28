import React, { useState } from 'react';
import bannerImg from '../../../../assets/Home/banner/bg-banner.png';
import CategoryTabs from './components/CategoryTabs';
import SearchForm from './components/SearchForm';
import HeroContent from './components/HeroContent';

const Hero = () => {
  const [activeCategory, setActiveCategory] = useState('Hotel');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  return (
    <section className="relative h-screen w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{backgroundImage: `url(${bannerImg})`}}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center pb-8 sm:pb-12 lg:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Text */}
        <HeroContent 
          title="Your Trip Starts Here"
          subtitle="Find unique stays across hotels, villas, and more."
        />

        {/* Search Card */}
        <div className="max-w-5xl mx-auto w-full sm:absolute sm:-bottom-15 sm:left-0 sm:right-0">
          <SearchForm
            location={location}
            checkIn={checkIn}
            checkOut={checkOut}
            rooms={rooms}
            adults={adults}
            children={children}
            onLocationChange={setLocation}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
          />
          
          <CategoryTabs 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

