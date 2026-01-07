import React from 'react';
import { FaHotel, FaHome, FaBuilding, FaCampground, FaTree, FaDoorOpen } from 'react-icons/fa';

const categories = [
  { name: 'Hotel', icon: FaHotel },
  { name: 'House', icon: FaHome },
  { name: 'Guest House', icon: FaBuilding },
  { name: 'Cabins', icon: FaCampground },
  { name: 'Glamping', icon: FaTree },
  { name: 'Doms', icon: FaDoorOpen },
];

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="hidden absolute top-104 sm:-top-9 left-1/2 -translate-x-1/2 w-[90%] sm:w-11/12 md:w-full lg:w-4/5 z-10">
      <div className="bg-gray-600/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl sm:rounded-full px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 shadow-xl border border-white/10 transition-all duration-300">
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => onCategoryChange(category.name)}
                aria-label={`Filter by ${category.name}`}
                aria-pressed={activeCategory === category.name}
                className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg transition-all text-[9px] sm:text-xs md:text-sm font-medium ${activeCategory === category.name
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
                    : 'text-white hover:bg-white/20'
                  }`}
              >
                <Icon className="text-xs sm:text-base md:text-lg" />
                <span className="whitespace-nowrap">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>

  );
};

export default CategoryTabs;

