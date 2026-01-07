import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MdClose } from 'react-icons/md';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to invalidate map size when modal opens
const MapResizer = () => {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
};

const HotelLocationModal = ({ hotel, isOpen, onClose }) => {
  if (!isOpen || !hotel) return null;

  // Use hotel coordinates or default to Barcelona center
  const lat = Number(hotel.latitude);
  const lng = Number(hotel.longitude);

  // Check if coordinates are valid (not 0 or null)
  const hasValidCoordinates = lat && lng && lat !== 0 && lng !== 0;

  const position = hasValidCoordinates
    ? [lat, lng]
    : [41.3851, 2.1734]; // Barcelona default

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="flex-1 pr-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {hotel.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {hotel.address}, {hotel.city || 'Barcelona'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <MdClose className="text-xl text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Map - Full height */}
        <div className="flex-1 relative">
          {hasValidCoordinates ? (
            <MapContainer
              key={`hotel-${hotel.id}-${lat}-${lng}`}
              center={position}
              zoom={15}
              scrollWheelZoom={true}
              className="h-full w-full"
              style={{ height: '100%', width: '100%' }}
            >
              <MapResizer />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  <div className="text-center p-1 bg-white dark:bg-gray-900">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {hotel.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {hotel.address}
                    </div>
                    {hotel.price_per_night && (
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-2">
                        ${Number(hotel.price_per_night).toFixed(0)}/night
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950/50 transition-colors duration-300">
              <div className="text-center p-8">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No location available
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This hotel doesn't have valid coordinates
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelLocationModal;
