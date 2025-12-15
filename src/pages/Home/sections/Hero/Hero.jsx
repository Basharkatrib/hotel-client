import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerImg from '../../../../assets/Home/banner/bg-banner.jpg';
import CategoryTabs from './components/CategoryTabs';
import SearchForm from './components/SearchForm';
import HeroContent from './components/HeroContent';

const Hero = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('Hotel');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms] = useState(1);
  const [guests, setGuests] = useState(1);

  const handleSearch = (formValues) => {
    const {
      location: formLocation = location,
      checkIn: formCheckIn = checkIn,
      checkOut: formCheckOut = checkOut,
      rooms: formRooms = rooms,
      guests: formGuests = guests,
    } = formValues || {};

    const params = new URLSearchParams();

    if (formLocation?.trim()) {
      params.set('city', formLocation.trim());
    }
    if (formCheckIn) {
      params.set('check_in_date', formCheckIn);
    }
    if (formCheckOut) {
      params.set('check_out_date', formCheckOut);
    }

    const totalGuests = Number.parseInt(formGuests || 0, 10) || 0;
    if (totalGuests > 0) {
      params.set('guests', String(totalGuests));
    }

    if (formRooms && Number(formRooms) > 0) {
      params.set('rooms', String(formRooms));
    }

    const query = params.toString();
    navigate(query ? `/explore?${query}` : '/explore');
  };

  return (
    <section
      className="relative w-full h-screen"
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bannerImg}
          alt="Beautiful hotel destination"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center pb-8 sm:pb-12 lg:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6">
        {/* Hero Text */}
        <HeroContent
          title="Your Trip Starts Here"
          subtitle="Find unique stays across hotels, villas, and more."
        />

        {/* Search Card - Mobile (stacked) */}
        <div className="absolute top-188 left-1/2 -translate-x-1/2 w-[90%]  z-10  max-w-md mx-auto lg:hidden">
          <SearchForm
            location={location}
            checkIn={checkIn}
            checkOut={checkOut}
            rooms={rooms}
            adults={guests}
            children={0}
            onLocationChange={setLocation}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onGuestsChange={setGuests}
            onSubmit={handleSearch}
          />

          <div className="mt-4">
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        </div>

        {/* Search Card - Desktop / Tablet (centered at bottom) */}
        <div className="hidden lg:block w-[80%] lg:absolute lg:-bottom-12 lg:left-1/2 lg:-translate-x-1/2">
          <SearchForm
            location={location}
            checkIn={checkIn}
            checkOut={checkOut}
            rooms={rooms}
            adults={guests}
            children={0}
            onLocationChange={setLocation}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onGuestsChange={setGuests}
            onSubmit={handleSearch}
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

