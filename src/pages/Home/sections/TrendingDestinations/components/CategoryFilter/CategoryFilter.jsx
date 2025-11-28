import React from 'react';

const CategoryFilter = ({ categories, activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onFilterChange(category.name)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
            activeFilter === category.name
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-900 hover:shadow-md'
          }`}
        >
          <span className="text-lg">{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

