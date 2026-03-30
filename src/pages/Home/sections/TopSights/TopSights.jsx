import React from "react";
import SightCard from "./components/SightCard";

const TopSights = () => {
  const sights = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", // Eiffel Tower
      location: "Paris",
      country: "France",
      flag: "🇫🇷",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80", // Colosseum
      location: "Rome",
      country: "Italy",
      flag: "🇮🇹",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&q=80", // Barcelona
      location: "Barcelona",
      country: "Spain",
      flag: "SP",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
      location: "Bergen",
      country: "Norway",
      flag: "🇳🇴",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80", // Brooklyn Bridge
      location: "New York",
      country: "United States",
      flag: "🇺🇸",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-10">
          Top Sights to See
        </h2>

        {/* Sights Grid */}
        <div className="space-y-4 sm:space-y-6">
          {/* Large Cards - Top Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <SightCard
              image={sights[0].image}
              location={sights[0].location}
              country={sights[0].country}
              flag={sights[0].flag}
              isLarge={true}
            />
            <SightCard
              image={sights[1].image}
              location={sights[1].location}
              country={sights[1].country}
              flag={sights[1].flag}
              isLarge={true}
            />
          </div>

          {/* Small Cards - Bottom Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <SightCard
              image={sights[2].image}
              location={sights[2].location}
              country={sights[2].country}
              flag={sights[2].flag}
              isLarge={false}
            />
            <SightCard
              image={sights[3].image}
              location={sights[3].location}
              country={sights[3].country}
              flag={sights[3].flag}
              isLarge={false}
            />
            <SightCard
              image={sights[4].image}
              location={sights[4].location}
              country={sights[4].country}
              flag={sights[4].flag}
              isLarge={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSights;
