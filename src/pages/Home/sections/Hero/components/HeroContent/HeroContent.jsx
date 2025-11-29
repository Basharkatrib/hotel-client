import React from 'react';

const HeroContent = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-4 sm:mb-8 px-2">
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 leading-tight sm:leading-normal">
        {title}
      </h1>
      <p className="text-sm sm:text-lg md:text-xl text-white/90 sm:text-white/95 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};

export default HeroContent;

