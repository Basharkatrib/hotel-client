import React from "react";
import VideoCard from "./components/VideoCard";
import VideoThumbnail from "./components/VideoThumbnail";

const ExploreInMotion = () => {
  const mainVideo = {
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bWFsZGl2ZXN8fHx8fHwxNjg3OTQxOTk5&ixlib=rb-4.0.3&q=80&w=1200",
    title: "Step Into a world",
    subtitle: "of Luxury",
    description:
      "Immerse yourself in captivating visuals from our most iconic and indulgent destinations.",
    buttonText: "Explore All Videos",
  };

  const videoThumbnails = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      location: "Maldives, Asia",
      rating: 4.5,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      location: "Phuket, Thailand",
      rating: 4.5,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      location: "Maui, Hawaii, USA",
      rating: 4.5,
    },
  ];
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-10">
          Explore Vayka in Motion
        </h2>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Card */}
          <div className="lg:col-span-2">
            <VideoCard
              image={mainVideo.image}
              title={mainVideo.title}
              subtitle={mainVideo.subtitle}
              description={mainVideo.description}
              buttonText={mainVideo.buttonText}
            />
          </div>

          {/* Video Thumbnails */}
          <div className="flex flex-col gap-4">
            {videoThumbnails.map((video) => (
              <VideoThumbnail
                key={video.id}
                image={video.image}
                location={video.location}
                rating={video.rating}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreInMotion;
