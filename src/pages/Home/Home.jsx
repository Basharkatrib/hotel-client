import React from 'react';
import Navbar from '../../components/common/Navbar';
import Hero from './sections/Hero';
import Trust from './sections/Trust';
import TrendingDestinations from './sections/TrendingDestinations';
import WeekendDeals from './sections/WeekendDeals';
import TravelMore from './sections/TravelMore';
import TopSights from './sections/TopSights';
import TopThingsToDo from './sections/TopThingsToDo';
import ExploreInMotion from './sections/ExploreInMotion';
import HomesGuestsLove from './sections/HomesGuestsLove';

const Home = () => {
  return (
    <div>
      <Hero />
      <Trust />
      <TrendingDestinations />
      <WeekendDeals />
      <TravelMore />
      <TopSights />
      <TopThingsToDo />
      <ExploreInMotion />
      <HomesGuestsLove />
    </div>
  );
};

export default Home;

