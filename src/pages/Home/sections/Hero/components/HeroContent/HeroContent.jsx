import React from 'react';

const HeroContent = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3">
        {title}
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-white/95">
        {subtitle}
      </p>
    </div>
  );
};

export default HeroContent;

