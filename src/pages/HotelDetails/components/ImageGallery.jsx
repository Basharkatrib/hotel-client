import React, { useState } from 'react';
import { getImageUrls } from '../../../utils/imageHelper';
import { MdPhotoLibrary } from 'react-icons/md';

const ImageGallery = ({ images, hotelName }) => {
  const [showAll, setShowAll] = useState(false);
  const imageUrls = getImageUrls(images);
  
  // Ensure we have at least 5 images to display
  const displayImages = imageUrls.slice(0, 5);
  
  // Add debug
  console.log('Total images:', imageUrls.length);
  console.log('Display images:', displayImages.length);

  if (displayImages.length === 0) {
    return (
      <div className="relative mt-6 h-[400px] bg-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <MdPhotoLibrary size={48} className="mx-auto mb-2" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-6">
      {/* Grid with uniform image sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
        {/* Main Image - Takes 2 columns on desktop */}
        <div className="sm:col-span-2 sm:row-span-2 h-[500px]">
          {displayImages[0] && (
            <img
              src={displayImages[0]}
              alt={hotelName}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
              onClick={() => setShowAll(true)}
            />
          )}
        </div>

        {/* Right Side Images - 4 images in 2x2 grid on desktop */}
        {displayImages.slice(1, 5).map((image, index) => (
          <div key={index} className="relative h-[195px] sm:h-auto">
            <img
              src={image}
              alt={`${hotelName} ${index + 2}`}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
              onClick={() => setShowAll(true)}
            />
            {/* Show +more overlay on last image if there are more */}
            {index === 3 && imageUrls.length > 5 && (
              <div
                className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                onClick={() => setShowAll(true)}
              >
                <div className="text-white text-center">
                  <MdPhotoLibrary size={32} className="mx-auto mb-2" />
                  <span className="text-lg font-semibold">
                    +{imageUrls.length - 5} more
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show All Button */}
      <button
        type="button"
        onClick={() => setShowAll(true)}
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <MdPhotoLibrary size={20} />
        <span className="text-sm font-medium">
          Show all {imageUrls.length} photos
        </span>
      </button>

      {/* Full Gallery Modal */}
      {showAll && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Gallery Grid */}
          <div className="max-w-7xl w-full h-full overflow-y-auto p-4 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageUrls.map((image, index) => (
                <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${hotelName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
