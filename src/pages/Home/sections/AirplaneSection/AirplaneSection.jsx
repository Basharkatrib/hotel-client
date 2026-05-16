import React from 'react';

const AirplaneSection = () => {
  return (
    <section className="pt-48 md:pt-12 bg-white dark:bg-background transition-colors duration-300 overflow-hidden relative">
      <div className="w-full relative h-[450px] sm:h-[650px] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-8xl mb-8">✈️</div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Fly to your <span className="text-blue-600 dark:text-blue-400">dream destination</span> with Vayka
          </h2>
        </div>
      </div>
    </section>
  );
};

export default AirplaneSection;