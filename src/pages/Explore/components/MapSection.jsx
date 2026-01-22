import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Default center for Barcelona
const barcelonaCenter = [41.3851, 2.1734];

const MapSection = ({ hotels = [] }) => {
  // Calculate map center based on hotels or use Barcelona default
  const mapCenter = useMemo(() => {
    if (!hotels || hotels.length === 0) {
      return barcelonaCenter;
    }

    // Filter hotels with valid coordinates
    const hotelsWithCoords = hotels.filter(
      h => h.latitude && h.longitude &&
        h.latitude !== 0 && h.longitude !== 0
    );

    if (hotelsWithCoords.length === 0) {
      return barcelonaCenter;
    }

    // Calculate average position
    const avgLat = hotelsWithCoords.reduce((sum, h) => sum + Number(h.latitude), 0) / hotelsWithCoords.length;
    const avgLng = hotelsWithCoords.reduce((sum, h) => sum + Number(h.longitude), 0) / hotelsWithCoords.length;

    return [avgLat, avgLng];
  }, [hotels]);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-card shadow-sm h-64 relative z-0">
      <MapContainer
        center={mapCenter}
        zoom={hotels.length > 0 ? 12 : 13}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show markers for all hotels with valid coordinates */}
        {hotels.map((hotel) => {
          // Skip hotels without valid coordinates
          if (!hotel.latitude || !hotel.longitude ||
            hotel.latitude === 0 || hotel.longitude === 0) {
            return null;
          }

          const position = [Number(hotel.latitude), Number(hotel.longitude)];

          return (
            <Marker key={hotel.id} position={position}>
              <Popup>
                <div className="min-w-[200px] bg-white dark:bg-card">
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">
                    {hotel.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {hotel.city || 'Barcelona'}
                  </div>
                  {hotel.price_per_night && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Price:</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        ${Number(hotel.price_per_night).toFixed(0)}/night
                      </span>
                    </div>
                  )}
                  {hotel.rating > 0 && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Rating:</span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        ⭐ {Number(hotel.rating).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapSection;
