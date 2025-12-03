import React, { useState } from 'react';
import MapSection from './components/MapSection';
import FiltersSidebar from './components/FiltersSidebar';
import HotelList from './components/HotelList';

const Explore = () => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Explore 300+ Places in Barcelona
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Compare stays, filter by your needs, and find the perfect place.
            </p>
          </div>

          {/* Mobile filter button */}
          <div className="flex items-center gap-3 self-start sm:self-auto lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-gray-100">
                <span className="block h-2 w-2 rounded-full bg-gray-700" />
              </span>
              Filters
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-full lg:w-80 xl:w-88 shrink-0">
            <FiltersSidebar />
          </aside>

          {/* Results */}
          <section className="flex-1">
            <HotelList />
          </section>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl flex flex-col pt-14">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FiltersSidebar />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Explore;


