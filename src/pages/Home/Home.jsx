import React from 'react';
import Navbar from '../../components/common/Navbar';
import Hero from './sections/Hero';
import Trust from './sections/Trust';
import TrendingDestinations from './sections/TrendingDestinations';
import WeekendDeals from './sections/WeekendDeals';

const Home = () => {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 z-50">
          <Navbar />
      </div>
      <Hero />
      <Trust />
      <TrendingDestinations />
      <WeekendDeals />
    </div>
  );
};

export default Home;

