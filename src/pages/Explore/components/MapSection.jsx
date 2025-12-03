import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Simple default center for Barcelona
const center = [41.3851, 2.1734];

const MapSection = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm h-64 ">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>Barcelona centre</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapSection;


