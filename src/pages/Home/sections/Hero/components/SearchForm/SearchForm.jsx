import React, { useState, useRef, useEffect } from "react";
import {
  IoSearch,
  IoCalendarOutline,
  IoPeople,
  IoLocationOutline,
  IoChevronDown,
  IoCheckmark,
  IoRemove,
  IoAdd,
} from "react-icons/io5";
import { useGetLocationsQuery } from "@/services/hotelsApi";

const SearchForm = ({
  location,
  checkIn,
  checkOut,
  rooms,
  adults,
  children,
  onLocationChange,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onSubmit,
}) => {
  const { data: locationsData } = useGetLocationsQuery();
  const countries = locationsData?.data?.countries || [];

  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const locationRef = useRef(null);
  const guestsRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target))
        setLocationOpen(false);
      if (guestsRef.current && !guestsRef.current.contains(e.target))
        setGuestsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ location, checkIn, checkOut, rooms, adults, children });
  };

  const filtered = countries.filter((c) =>
    c.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const guestLabel =
    adults > 0 ? `${adults} ${adults !== 1 ? "" : ""}` : "";

  const fieldBase =
    "group flex items-center gap-3 w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:ring-blue-400/10 transition-all duration-200 shadow-sm hover:shadow-md";

  const iconBase = "text-blue-400 dark:text-blue-400 flex-shrink-0 text-[18px]";

  const labelBase =
    "block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5";

  return (
    <form
      className="bg-white/95 dark:bg-card backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 px-5 py-5 sm:px-7 sm:py-6 transition-all duration-300"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-3 lg:items-end">

        {/* ── Location ── */}
        <div className="flex-1 relative" ref={locationRef}>
          <label className={labelBase}>Location</label>
          <button
            type="button"
            onClick={() => setLocationOpen((p) => !p)}
            className={`${fieldBase} justify-between cursor-pointer`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <IoLocationOutline className={iconBase} />
              <span
                className={`text-sm truncate ${
                  location
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {location || "Where are you going?"}
              </span>
            </span>
            <IoChevronDown
              className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                locationOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {locationOpen && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full min-w-[220px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
              <div className="p-2.5 border-b border-gray-100 dark:border-gray-700/60">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search country..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-400"
                />
              </div>
              <ul className="max-h-52 overflow-y-auto py-1">
                {filtered.length > 0 ? (
                  filtered.map((country) => (
                    <li key={country}>
                      <button
                        type="button"
                        onClick={() => {
                          onLocationChange(country);
                          setLocationOpen(false);
                          setLocationSearch("");
                        }}
                        className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {country}
                        {location === country && (
                          <IoCheckmark className="text-blue-500 text-base" />
                        )}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-5 text-sm text-center text-gray-400">
                    No results found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* ── Divider (desktop only) ── */}
        <div className="hidden lg:block w-px h-10 bg-gray-200 dark:bg-gray-700 self-center" />

        {/* ── Check In ── */}
        <div className="flex-1">
          <label className={labelBase}>Check In</label>
          <div className={fieldBase}>
            <IoCalendarOutline className={iconBase} />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => onCheckInChange(e.target.value)}
              className="w-full text-sm text-gray-700 dark:text-gray-200 border-0 focus:outline-none focus:ring-0 bg-transparent cursor-pointer"
            />
          </div>
        </div>

        {/* ── Check Out ── */}
        <div className="flex-1">
          <label className={labelBase}>Check Out</label>
          <div className={fieldBase}>
            <IoCalendarOutline className={iconBase} />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => onCheckOutChange(e.target.value)}
              className="w-full text-sm text-gray-700 dark:text-gray-200 border-0 focus:outline-none focus:ring-0 bg-transparent cursor-pointer"
            />
          </div>
        </div>

        {/* ── Divider (desktop only) ── */}
        <div className="hidden lg:block w-px h-10 bg-gray-200 dark:bg-gray-700 self-center" />

        {/* ── Guests ── */}
        <div className="flex-1 relative" ref={guestsRef}>
          <label className={labelBase}>Guests</label>
          <button
            type="button"
            onClick={() => setGuestsOpen((p) => !p)}
            className={`${fieldBase} justify-between cursor-pointer`}
          >
            <span className="flex items-center gap-3">
              <IoPeople className={iconBase} />
              <span
                className={`text-sm ${
                  adults > 0
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {guestLabel || "Add guests"}
              </span>
            </span>
            <IoChevronDown
              className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                guestsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {guestsOpen && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full min-w-[200px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    Adults
                  </p>
                  <p className="text-xs text-gray-400">Age 13+</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onGuestsChange?.(Math.max(1, (adults || 1) - 1))
                    }
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <IoRemove className="text-base" />
                  </button>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white w-4 text-center">
                    {adults || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => onGuestsChange?.((adults || 0) + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <IoAdd className="text-base" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Search Button ── */}
        <button
          type="submit"
          className="cursor-pointer w-full lg:w-auto shrink-0 flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          aria-label="Search for accommodations"
        >
          <IoSearch className="text-lg" aria-hidden="true" />
          <span className="text-sm font-semibold">Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchForm;