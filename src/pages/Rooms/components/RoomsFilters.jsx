import React from 'react';
import { FaFilter } from 'react-icons/fa';

const RoomsFilters = ({ filters, onFilterChange, showFilters, setShowFilters }) => {
  return (
    <>
      {/* Filters Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <FaFilter size={16} />
          <span>Filters</span>
        </button>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
          <select
            value={`${filters.sort_by}_${filters.sort_order}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('_');
              onFilterChange('sort_by', sortBy);
              onFilterChange('sort_order', sortOrder);
            }}
            className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="created_at_desc">Newest First</option>
            <option value="created_at_asc">Oldest First</option>
            <option value="price_per_night_asc">Price: Low to High</option>
            <option value="price_per_night_desc">Price: High to Low</option>
            <option value="max_guests_desc">Capacity: High to Low</option>
            <option value="max_guests_asc">Capacity: Low to High</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Room Type</label>
              <select
                value={filters.type}
                onChange={(e) => onFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">All Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Price</label>
              <input
                type="number"
                value={filters.min_price}
                onChange={(e) => onFilterChange('min_price', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Price</label>
              <input
                type="number"
                value={filters.max_price}
                onChange={(e) => onFilterChange('max_price', e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* View */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">View</label>
              <select
                value={filters.view}
                onChange={(e) => onFilterChange('view', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">All Views</option>
                <option value="sea">Sea View</option>
                <option value="city">City View</option>
                <option value="mountain">Mountain View</option>
                <option value="garden">Garden View</option>
                <option value="pool">Pool View</option>
              </select>
            </div>

            {/* Features */}
            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.has_breakfast}
                    onChange={(e) => onFilterChange('has_breakfast', e.target.checked)}
                    className="w-4 h-4 text-blue-600 dark:text-blue-500 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Breakfast</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.has_wifi}
                    onChange={(e) => onFilterChange('has_wifi', e.target.checked)}
                    className="w-4 h-4 text-blue-600 dark:text-blue-500 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">WiFi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.has_ac}
                    onChange={(e) => onFilterChange('has_ac', e.target.checked)}
                    className="w-4 h-4 text-blue-600 dark:text-blue-500 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">AC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.has_balcony}
                    onChange={(e) => onFilterChange('has_balcony', e.target.checked)}
                    className="w-4 h-4 text-blue-600 dark:text-blue-500 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Balcony</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomsFilters;










