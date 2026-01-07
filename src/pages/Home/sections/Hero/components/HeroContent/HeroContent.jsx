import React from 'react';
import { IoSparkles } from 'react-icons/io5';

const HeroContent = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-4 sm:mb-8 px-2">
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 leading-tight sm:leading-normal">
        {title}
      </h1>
      <p className="text-sm sm:text-lg md:text-xl text-white/90 sm:text-white/95 leading-relaxed">
        {subtitle}
      </p>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-smart-search'))}
          className="group relative flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold transition-all hover:bg-white/20 hover:scale-105 active:scale-95 shadow-xl"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl group-hover:blur-2xl transition-all" />
          <IoSparkles className="text-blue-400 animate-pulse" />
          <span className="relative">Try Smart Search</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-500 text-[10px] uppercase tracking-wider animate-bounce">AI</span>
        </button>
      </div>
    </div>
  );
};

export default HeroContent;

