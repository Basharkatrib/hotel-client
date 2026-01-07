import React, { useState } from 'react';
import MapSection from './MapSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion';

const PRICE_MIN = 0;
const PRICE_MAX = 2000;

const FiltersSidebar = ({ filters, onFiltersChange, hotels = [] }) => {
  const [typeOfPlace, setTypeOfPlace] = useState(filters?.type === 'any' ? 'Any type' : filters?.type === 'room' ? 'Room' : filters?.type === 'entire_home' ? 'Entire home' : 'Any type');
  const [minPrice, setMinPrice] = useState(filters?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(filters?.maxPrice || 2000);
  const [selectedAmenities, setSelectedAmenities] = useState(filters?.selectedAmenities || []);

  // Update parent component when filters change (with debounce for price)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const typeValue =
        typeOfPlace === 'Any type'
          ? 'any'
          : typeOfPlace === 'Room'
            ? 'room'
            : typeOfPlace === 'Entire home'
              ? 'entire_home'
              : 'any';

      // Preserve existing filters coming from URL (city, dates, guests, rooms, ...)
      onFiltersChange({
        ...filters,
        type: typeValue,
        minPrice,
        maxPrice,
        selectedAmenities,
      });
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [typeOfPlace, minPrice, maxPrice, selectedAmenities, onFiltersChange, filters]);

  const toggleAmenity = (label) => {
    setSelectedAmenities((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const handleClear = () => {
    setTypeOfPlace('Any type');
    setMinPrice(0);
    setMaxPrice(2000);
    setSelectedAmenities([]);
  };

  return (
    <div className="space-y-4">
      {/* Map above filters */}
      <MapSection hotels={hotels} />

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Filter by:</p>
          <button
            type="button"
            className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>

        <Accordion
          type="multiple"
          defaultValue={['type-of-place', 'price-range', 'amenities']}
          className="divide-y divide-gray-200 dark:divide-gray-800"
        >
          {/* Type of place */}
          <AccordionItem value="type-of-place" className="border-gray-200 dark:border-gray-800">
            <AccordionTrigger className="text-sm font-semibold text-gray-900 dark:text-white">
              Type of Place
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2 flex-wrap">
                {['Any type', 'Room', 'Entire home'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTypeOfPlace(label)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${typeOfPlace === label
                        ? 'border-gray-900 bg-gray-900 text-white dark:bg-blue-600 dark:border-blue-600'
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-500'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price range */}
          <AccordionItem value="price-range" className="border-gray-200 dark:border-gray-800">
            <AccordionTrigger className="text-sm font-semibold text-gray-900 dark:text-white">
              <div className="flex flex-col items-start gap-1 w-full text-left">
                <span>Price Range</span>
                <span className="text-[11px] font-normal text-gray-400 dark:text-gray-500">
                  Nightly prices including fees and taxes
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {/* Range bar + sliders */}
                <div className="h-8 w-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center px-3">
                  <div className="relative flex-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700">
                    <div
                      className="absolute h-1 rounded-full bg-gray-700 dark:bg-blue-500"
                      style={{
                        left: `${(Math.min(minPrice, maxPrice) / PRICE_MAX) * 100}%`,
                        right: `${100 - (Math.max(minPrice, maxPrice) / PRICE_MAX) * 100}%`,
                      }}
                    />
                    {/* Min slider */}
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(
                          Math.min(Number(e.target.value) || 0, maxPrice),
                        )
                      }
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                    {/* Max slider */}
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(
                          Math.max(Number(e.target.value) || 0, minPrice),
                        )
                      }
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-3">
                  <div className="flex flex-col flex-1">
                    <span>Minimum</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full border border-gray-200 dark:border-gray-700 px-2 py-1 text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800">
                        ${minPrice}
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={minPrice}
                        onChange={(e) =>
                          setMinPrice(Number(e.target.value) || 0)
                        }
                        className="w-16 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 items-end">
                    <span>Maximum</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full border border-gray-200 dark:border-gray-700 px-2 py-1 text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800">
                        ${maxPrice}+
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={maxPrice}
                        onChange={(e) =>
                          setMaxPrice(Number(e.target.value) || 0)
                        }
                        className="w-16 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Amenities */}
          <AccordionItem value="amenities" className="border-b-0">
            <AccordionTrigger className="text-sm font-semibold text-gray-900 dark:text-white">
              Amenities
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-xs text-gray-700 dark:text-gray-300">
                <div>
                  <p className="mb-2 font-medium text-gray-900 dark:text-white">Popular</p>
                  <div className="flex flex-wrap gap-2">
                    {['Air Conditioning', 'Wi-Fi', 'BBQ Grill', 'Washing machine', 'TV', 'Kitchen'].map(
                      (label) => {
                        const active = selectedAmenities.includes(label);
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => toggleAmenity(label)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${active
                                ? 'border-gray-900 bg-gray-900 text-white dark:bg-blue-600 dark:border-blue-600'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-500'
                              }`}
                          >
                            {label}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FiltersSidebar;


