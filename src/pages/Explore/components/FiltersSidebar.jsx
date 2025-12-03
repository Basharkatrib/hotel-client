import React, { useState } from 'react';
import MapSection from './MapSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion';
import { FaStar } from 'react-icons/fa';

const PRICE_MIN = 0;
const PRICE_MAX = 2000;

const FiltersSidebar = () => {
  const [typeOfPlace, setTypeOfPlace] = useState('Any type');
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [selectedScores, setSelectedScores] = useState([
    '5.0 Excellent',
    '4.0+ Very good',
    '3.0+ Good',
  ]);
  const [selectedStars, setSelectedStars] = useState([5, 4, 3]);
  const [selectedAmenities, setSelectedAmenities] = useState([
    'Air Conditioning',
    'Wi-Fi',
    'BBQ Grill',
  ]);

  const toggleScore = (label) => {
    setSelectedScores((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const toggleStar = (value) => {
    setSelectedStars((prev) =>
      prev.includes(value)
        ? prev.filter((star) => star !== value)
        : [...prev, value],
    );
  };

  const toggleAmenity = (label) => {
    setSelectedAmenities((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const handleClear = () => {
    setTypeOfPlace('Any type');
    setMinPrice(200);
    setMaxPrice(1500);
    setSelectedScores(['5.0 Excellent', '4.0+ Very good', '3.0+ Good']);
    setSelectedStars([5, 4, 3]);
    setSelectedAmenities(['Air Conditioning', 'Wi-Fi', 'BBQ Grill']);
  };

  return (
    <div className="space-y-4">
      {/* Map above filters */}
      <MapSection />

      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900">Filter by:</p>
          <button
            type="button"
            className="text-xs font-medium text-gray-500 hover:text-gray-700"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>

        <Accordion
          type="multiple"
          defaultValue={['type-of-place', 'price-range', 'guest-score']}
          className="divide-y divide-gray-200"
        >
          {/* Type of place */}
          <AccordionItem value="type-of-place">
            <AccordionTrigger className="text-sm font-semibold text-gray-900">
              Type of Place
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2 flex-wrap">
                {['Any type', 'Room', 'Entire home'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTypeOfPlace(label)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      typeOfPlace === label
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price range */}
          <AccordionItem value="price-range">
            <AccordionTrigger className="text-sm font-semibold text-gray-900">
              <div className="flex flex-col items-start gap-1 w-full">
                <span>Price Range</span>
                <span className="text-[11px] font-normal text-gray-400">
                  Nightly prices including fees and taxes
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {/* Range bar + sliders */}
                <div className="h-8 w-full rounded-full bg-gray-100 flex items-center px-3">
                  <div className="relative flex-1 h-1 rounded-full bg-gray-300">
                    <div
                      className="absolute h-1 rounded-full bg-gray-700"
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
                <div className="flex items-center justify-between text-xs text-gray-500 gap-3">
                  <div className="flex flex-col flex-1">
                    <span>Minimum</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full border border-gray-200 px-2 py-1 text-gray-700 text-xs">
                        ${minPrice}
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={minPrice}
                        onChange={(e) =>
                          setMinPrice(Number(e.target.value) || 0)
                        }
                        className="w-16 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 items-end">
                    <span>Maximum</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full border border-gray-200 px-2 py-1 text-gray-700 text-xs">
                        ${maxPrice}+
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={maxPrice}
                        onChange={(e) =>
                          setMaxPrice(Number(e.target.value) || 0)
                        }
                        className="w-16 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Guest review score */}
          <AccordionItem value="guest-score">
            <AccordionTrigger className="text-sm font-semibold text-gray-900">
              Guest Review Score
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-xs text-gray-700">
                {[
                  '5.0 Excellent',
                  '4.0+ Very good',
                  '3.0+ Good',
                  '2.0+ Fair',
                  '< 2.0 Poor',
                ].map((label) => {
                  const checked = selectedScores.includes(label);
                  return (
                    <label
                      key={label}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleScore(label)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Property classification */}
          <AccordionItem value="property-classification">
            <AccordionTrigger className="text-sm font-semibold text-gray-900">
              Property Classification
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-xs text-gray-700">
                {[5, 4, 3, 2, 1, 0].map((stars) => {
                  const label =
                    stars === 0 ? 'No rating' : `${stars}-star`;
                  const checked = selectedStars.includes(stars);
                  return (
                    <label
                      key={label}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleStar(stars)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex items-center gap-1">
                        {stars > 0 ? (
                          Array.from({ length: 5 }).map((_, index) => (
                            <FaStar
                              key={index}
                              className={
                                index < stars
                                  ? 'text-yellow-400 text-sm'
                                  : 'text-gray-300 text-sm'
                              }
                            />
                          ))
                        ) : (
                          <span className="text-gray-300">
                            <FaStar className="text-sm" />
                          </span>
                        )}
                        <span className="ml-2">{label}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Amenities */}
          <AccordionItem value="amenities">
            <AccordionTrigger className="text-sm font-semibold text-gray-900">
              Amenities
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-xs text-gray-700">
                <div>
                  <p className="mb-2 font-medium text-gray-900">Popular</p>
                  <div className="flex flex-wrap gap-2">
                    {['Air Conditioning', 'Wi-Fi', 'BBQ Grill', 'Washing machine', 'TV', 'Kitchen'].map(
                      (label) => {
                        const active = selectedAmenities.includes(label);
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => toggleAmenity(label)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                              active
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
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


