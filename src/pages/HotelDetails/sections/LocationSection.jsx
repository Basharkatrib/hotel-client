import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationSection = ({ hotel }) => {
  const lat = Number(hotel.latitude);
  const lng = Number(hotel.longitude);
  
  const hasValidCoordinates = lat && lng && lat !== 0 && lng !== 0;
  const position = hasValidCoordinates ? [lat, lng] : [41.3851, 2.1734];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Map */}
        <div className="h-96 relative z-0">
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={true}
            className="h-full w-full"
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <div className="text-center p-1">
                  <div className="font-semibold text-gray-900">{hotel.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{hotel.address}</div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Address Info */}
        <div className="p-6 border-t border-gray-200">
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500 mb-1">Address</div>
              <div className="font-medium text-gray-900">
                {hotel.address}, {hotel.city}, {hotel.country}
              </div>
            </div>
            
            {hasValidCoordinates && (
              <div className="flex gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Latitude</div>
                  <div className="font-mono text-sm text-gray-900">
                    {lat.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Longitude</div>
                  <div className="font-mono text-sm text-gray-900">
                    {lng.toFixed(6)}
                  </div>
                </div>
              </div>
            )}
            
            {/* Distances */}
            <div className="flex gap-6 pt-3 border-t border-gray-100">
              {hotel.distance_from_center && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">From city centre</div>
                  <div className="font-semibold text-gray-900">
                    {hotel.distance_from_center} km
                  </div>
                </div>
              )}
              
              {hotel.distance_from_beach && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">From beach</div>
                  <div className="font-semibold text-gray-900">
                    {hotel.distance_from_beach} m
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;


