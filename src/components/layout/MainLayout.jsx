import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar/index';
import Footer from '../common/Footer/index';
import PromotionsBar from './PromotionsBar';

const MainLayout = () => {
  return (
    <div className="relative">
      <PromotionsBar />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
