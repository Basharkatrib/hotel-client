import React from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

const RoomsFilters = ({
  filters,
  onFilterChange,
  showFilters,
  setShowFilters,
}) => {
  return (
    <>
      {/* Filters Toggle & Sort Bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            showFilters
              ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800"
              : "bg-white dark:bg-card border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300"
          } hover:bg-gray-50 dark:hover:bg-gray-800`}
        >
          <FaFilter size={16} />
          <span>{showFilters ? "Hide Filters" : "Filters"}</span>
        </button>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
            Sort by:
          </label>
          <select
            value={`${filters.sort_by}_${filters.sort_order}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("_");
              onFilterChange("sort_by", sortBy);
              onFilterChange("sort_order", sortOrder);
            }}
            className="px-3 py-2 bg-white dark:bg-card border border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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

      {/* Mobile Sidebar Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden transition-opacity duration-300"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Filters Panel */}
      <div
        className={`
          fixed lg:relative top-0 left-0 h-full lg:h-auto w-[280px] lg:w-full
          z-[70] lg:z-auto
          bg-white dark:bg-card 
          border-r lg:border border-gray-200 dark:border-gray-800 
          lg:rounded-xl
          transition-all duration-300 ease-in-out
          overflow-y-auto lg:overflow-hidden
          ${
            showFilters
              ? "translate-x-0 opacity-100 visible p-6 mb-6"
              : "-translate-x-full lg:hidden opacity-0 invisible p-0"
          }
        `}
      >
        {/* Header for Mobile Sidebar */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Filters
          </h2>
          <button
            onClick={() => setShowFilters(false)}
            className="cursor-pointer p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Filters Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange("type", e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min Price
            </label>
            <input
              type="number"
              value={filters.min_price}
              onChange={(e) => onFilterChange("min_price", e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Price
            </label>
            <input
              type="number"
              value={filters.max_price}
              onChange={(e) => onFilterChange("max_price", e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* View */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              View
            </label>
            <select
              value={filters.view}
              onChange={(e) => onFilterChange("view", e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Features
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Breakfast", key: "has_breakfast" },
                { label: "WiFi", key: "has_wifi" },
                { label: "AC", key: "has_ac" },
                { label: "Balcony", key: "has_balcony" },
              ].map((feature) => (
                <label
                  key={feature.key}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters[feature.key]}
                    onChange={(e) =>
                      onFilterChange(feature.key, e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 dark:text-blue-500 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                    {feature.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button for Mobile Only */}
        <div className="mt-8 lg:hidden">
          <button
            onClick={() => setShowFilters(false)}
            className="cursor-pointer w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-transform"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
};

export default RoomsFilters;
