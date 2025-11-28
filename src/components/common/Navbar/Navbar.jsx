import React, { useState, useEffect } from 'react';
import logo from '../../../assets/Home/navbar/Logo.svg';
import headphone from '../../../assets/Home/navbar/headphone.svg';
import profImage from '../../../assets/Home/navbar/profileImage.png';
import USA from '../../../assets/Home/navbar/USA.svg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${isScrolled ? 'bg-white/95' : 'bg-white/10'} backdrop-blur-sm transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="shrink-0">
            <img 
              src={logo} 
              alt="tripto logo" 
              className="h-8 md:h-10 w-auto cursor-pointer"
            />
          </div>

          {/* Right Side Items */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            {/* Flag and Currency */}
            <div className="flex items-center gap-2 sm:gap-3  rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer hover:bg-purple-50 transition-colors">
              <img 
                src={USA} 
                alt="USA flag" 
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span className="text-blue-600 font-medium text-sm sm:text-base">USD</span>
            </div>

            {/* Headphone Icon */}
            <div className="p-2 sm:p-2.5 cursor-pointer hover:bg-gray-100 rounded-full transition-colors">
              <img 
                src={headphone} 
                alt="support" 
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </div>

            {/* Profile Image */}
            <div className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src={profImage} 
                alt="profile" 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

