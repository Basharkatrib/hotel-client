import React, { useState } from 'react';
import { getImageUrls } from '../../../utils/imageHelper';
import { MdPhotoLibrary } from 'react-icons/md';

const ImageGallery = ({ images, hotelName }) => {
  const [showAll, setShowAll] = useState(false);
  const imageUrls = getImageUrls(images);
  const displayImages = imageUrls.slice(0, 5);

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

      {/* ===== Desktop Grid (md and above) ===== */}
      {/* Uses a single CSS Grid with row-span/col-span — no nested grids */}
      {/* This guarantees all 5 cells render at their exact fixed height */}
      <div
        className="hidden md:grid gap-2 rounded-2xl overflow-hidden"
        style={{
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: '225px 225px',  /* two equal rows = 450px total */
        }}
      >
        {/* Image 1 — big left, spans both rows */}
        <div style={{ gridRow: '1 / 3', gridColumn: '1 / 2' }}>
          <img
            src={displayImages[0]}
            alt={hotelName}
            className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
            onClick={() => setShowAll(true)}
          />
        </div>

        {/* Image 2 — top center */}
        <div style={{ gridRow: '1 / 2', gridColumn: '2 / 3' }}>
          {displayImages[1] ? (
            <img
              src={displayImages[1]}
              alt={`${hotelName} 2`}
              className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
              onClick={() => setShowAll(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>

        {/* Image 3 — top right */}
        <div style={{ gridRow: '1 / 2', gridColumn: '3 / 4' }}>
          {displayImages[2] ? (
            <img
              src={displayImages[2]}
              alt={`${hotelName} 3`}
              className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
              onClick={() => setShowAll(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>

        {/* Image 4 — bottom center */}
        <div style={{ gridRow: '2 / 3', gridColumn: '2 / 3' }}>
          {displayImages[3] ? (
            <img
              src={displayImages[3]}
              alt={`${hotelName} 4`}
              className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
              onClick={() => setShowAll(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>

        {/* Image 5 — bottom right (with +more overlay if needed) */}
        <div className="relative" style={{ gridRow: '2 / 3', gridColumn: '3 / 4' }}>
          {displayImages[4] ? (
            <img
              src={displayImages[4]}
              alt={`${hotelName} 5`}
              className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
              onClick={() => setShowAll(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
          {imageUrls.length > 5 && (
            <div
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors"
              onClick={() => setShowAll(true)}
            >
              <div className="text-white flex items-center gap-1.5">
                <MdPhotoLibrary size={20} />
                <span className="text-sm font-semibold">+{imageUrls.length - 5}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Mobile Stack ===== */}
      <div className="flex flex-col gap-2 md:hidden rounded-2xl overflow-hidden">
        {displayImages.map((img, i) => (
          <div key={i} className="h-[220px]">
            <img
              src={img}
              alt={`${hotelName} ${i + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowAll(true)}
            />
          </div>
        ))}
      </div>

      {/* Show All Photos Button */}
      <button
        type="button"
        onClick={() => setShowAll(true)}
        className="cursor-pointer absolute bottom-4 right-4 flex items-center gap-2 bg-white px-4 py-1.5 rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <MdPhotoLibrary size={18} className="text-gray-700" />
        <span className="text-xs font-semibold text-gray-800">
          Show all {imageUrls.length} photos
        </span>
      </button>

      {/* Full Gallery Modal */}
      {showAll && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className="cursor-pointer absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

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