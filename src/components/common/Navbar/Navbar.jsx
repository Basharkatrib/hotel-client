import React, { useState, useEffect } from 'react';
import { FaGlobe, FaUser } from 'react-icons/fa';
import logo from '../../../assets/Home/navbar/Logo.svg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 shadow-lg backdrop-blur-md' 
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="shrink-0">
            <img 
              src={logo} 
              alt="Tripto" 
              className="h-8 md:h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              loading="eager"
              width="120"
              height="40"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Language/Currency */}
            <button 
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                isScrolled 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
              aria-label="Change language and currency"
            >
              <FaGlobe className="text-base" />
              <span className="hidden sm:inline">USD</span>
            </button>

            {/* Sign In Button */}
            <button 
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                isScrolled 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' 
                  : 'bg-white text-blue-600 hover:bg-white/90 shadow-lg'
              }`}
              aria-label="Sign in"
            >
              <FaUser className="text-sm" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
